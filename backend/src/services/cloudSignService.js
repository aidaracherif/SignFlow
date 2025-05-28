const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

const CLOUD_SIGN_API_URL = "https://rasign.gainde2000.sn:8443/app_signatureV1.1/signer/v1.1/sign_document/";
const CERTIFICAT_PATH = path.join(__dirname, '../certificats/ODSGateWay.p12');

const signerDocumentCloudSign = async (documentId) => {
  try {
    const fileName = `contrat_${documentId}.pdf`;
    const filePath = path.join(__dirname, '../pdfs', fileName);

   
    await fs.promises.access(filePath, fs.constants.F_OK);

    const form = new FormData();
    form.append('codePin', process.env.CLOUD_SIGN_CODE_PIN);
    form.append('workerId', process.env.CLOUD_SIGN_WORKER_ID);
    form.append('id_signer', process.env.ID_SIGNER);
    form.append('filereceivefile', fs.createReadStream(filePath));

    const httpsAgent = new https.Agent({
      pfx: fs.readFileSync(CERTIFICAT_PATH),
      passphrase: process.env.CERTIFICATE_PASSWORD,
      rejectUnauthorized: false, 
    });

    const url = `${CLOUD_SIGN_API_URL}/${process.env.ID_SIGNER}`;
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
      },
      httpsAgent,
    });

    console.log(`✅ Document ${documentId} signé avec succès :`, response.data);
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error(`❌ Erreur CloudSign ${documentId} :`, error.response.data);
    } else {
      console.error(`❌ Erreur CloudSign ${documentId} :`, error.message);
    }
    throw error;
  }
};

module.exports = {
  signerDocumentCloudSign
};
