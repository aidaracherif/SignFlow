const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { signerDocumentCloudSign } = require('./cloudsignService');
const prisma = new PrismaClient();

const EMSIGNER_SEND_URL = 'https://demoapi.emsigner.com/api/initiateEmbeddedSigning';

const EMSIGNER_CREDENTIALS = {
  Username: process.env.EMSIGNER_USER,
  Password: process.env.EMSIGNER_PASSWORD,
};

const authenticateEmsigner = async () => {
  try {
    const response = await axios.post('https://demoapi.emsigner.com/api/ValidateLogin', {
      "UserName": process.env.EMSIGNER_USER,
      "Password": process.env.EMSIGNER_PASSWORD,
    }, {
      headers: {
        'AppName': process.env.EMSIGNER_APP_NAME,
        'SecretKey': process.env.EMSIGNER_SECRET_KEY,
        'Content-Type': 'application/json',
      }
    });

    console.log("Token récupéré avec succès :", response.data);
    if (response.data.IsSuccess) {
      return response.data.Response.AuthToken;
    } else {
      throw new Error(response.data.Messages?.[0] || "Échec de l'authentification");
    }
  } catch (error) {
    console.error("Échec de l'authentification :", error.response?.data || error.message);
    throw error;
  }
};

const envoyerDocumentPourSignature = async (documentId) => {
  try {
    await signerDocumentCloudSign(documentId); // Appel facultatif selon ton besoin

    const token = await authenticateEmsigner();

    const document = await prisma.document.findUnique({
      where: { id: parseInt(documentId) },
      include: { employe: true }
    });

    if (!document || !document.employe) {
      throw new Error('Document ou client non trouvé');
    }

    // Chemin fixe pour "conge.pdf"
    const fileName = `demande_conge_${document.id}.pdf` ;
    const pdfPath = path.join(__dirname, '../pdfs', fileName);

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Fichier PDF non trouvé à : ${pdfPath}`);
    }

    const fileBase64 = fs.readFileSync(pdfPath).toString('base64');

    const payload = {
      "Name": "Document_conge",
      "EmailId": EMSIGNER_CREDENTIALS.Username,
      "RedirectURL": "",
      "SignatoryEmailIds": [
        document.employe.email
      ],
      "SignatureSettings": [
        {
          "Name": "adhocuser",
          "ModeOfSignature": "3"
        }
      ],
      "lstDocumentDetails": [
        {
          "DocumentName": "conge.pdf",
          "FileData": fileBase64,
          "ControlDetails": [
            {
              "PageNo": 1,
              "ControlID": 4,
              "AssignedTo": 1,
              "Left": 65,
              "Top": 331,
              "Height": 272,
              "Width": 184
            }
          ]
        }
      ]
    };

    const response = await axios.post(EMSIGNER_SEND_URL, payload, {
      headers: {
        Authorization: `basic ${token}`,
        'Content-Type': 'application/json'
      }
    });

 const workflowId = response.data?.Response?.WorkflowId;

    if (workflowId) {
      await prisma.document.update({
        where: { id: document.id },
        data: { workflowId: workflowId}
      });

      console.log(`Document envoye avec succes. Workflow : ${workflowId}`)
    } else {
      console.warn("WorkflowId non trouve dans la reponse.")
    }

    return response.data;

  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du document :", error.message);
    throw error;
  }
};

module.exports = {
  envoyerDocumentPourSignature,
  authenticateEmsigner
};
