const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { file } = require('pdfkit');
const { signerDocumentCloudSign } = require('./cloudSignService');
const prisma = new PrismaClient();


const EMSIGNER_SEND_URL = 'https://demoapi.emsigner.com/api/initiateEmbeddedSigning';

const EMSIGNER_CREDENTIALS = {
  Username: process.env.EMSIGNER_USER,
  Password: process.env.EMSIGNER_PASSWORD,
//   GrantType: 'password'
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
      return response.data.Response.AuthToken; // ✅ Seul le token
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

    await signerDocumentCloudSign(documentId); 
    const token = await authenticateEmsigner(); 

    const document = await prisma.document.findUnique({
      where: { id: parseInt(documentId) },
      include: { client: true }
    });

    if (!document || !document.client) {
      throw new Error('Document ou client non trouvé');
    }

    const fileName = `contrat_${document.id}.pdf`;
    const pdfPath = path.join(__dirname, '../pdfs', fileName);

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Fichier PDF non trouvé à : ${pdfPath}`);
    }

    const fileBase64 = fs.readFileSync(pdfPath).toString('base64');
   
    const payload = {
      
        "Name": "Contrat_" + document.id,
        "EmailId": EMSIGNER_CREDENTIALS.Username,
        "RedirectURL": "",
        "SignatoryEmailIds": [
            document.client.email
        ],
        "SignatureSettings": [
            {
                    "Name": "adhocuser",
                    "ModeOfSignature": "3"
                }
        ],
        "lstDocumentDetails": [
            {
            "DocumentName": "Contrat_" + document.id + ".pdf",
            "FileData": fileBase64,
            "ControlDetails": [
                {
                "PageNo": 3,
                "ControlID": 4,
                "AssignedTo": 1,
                "Left": 64,
                "Top": 738,
                "Height": 678,
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

    console.log("✅ Document envoyé à EmSigner avec succès");
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
