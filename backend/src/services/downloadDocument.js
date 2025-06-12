const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { authenticateEmsigner } = require('./emsignerService'); // Assurez-vous que cette fonction est exportée depuis emSignerService.js

const EMSIGNER_DOWNLOAD_URL = 'https://demoapi.emsigner.com/api/DownloadWorkflowDocuments';

const downloadSignedDocument = async (workflowId) => {
  const token = await authenticateEmsigner();

  try {
    const response = await axios.post(
      EMSIGNER_DOWNLOAD_URL,
      { WorkFlowId: workflowId }, // envoyer la valeur brute comme string
      {
        headers: {
          'Authorization': `basic ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
        }
      }
    );

    const base64Data = response.data?.Response?.FileList?.[0]?.Base64FileData;
    if (!base64Data) {
      throw new Error('Aucune donnée Base64 reçue');
    }

    const pdfBuffer = Buffer.from(base64Data, 'base64');

    const outputPath = path.join(__dirname, '../pdfs/signed', `signed_${workflowId}.pdf`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`✅ Document téléchargé et sauvegardé sous ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error(`❌ Erreur lors du téléchargement du document signé :`, error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  downloadSignedDocument
};
