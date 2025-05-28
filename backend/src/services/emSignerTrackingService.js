const axios = require('axios');
require('dotenv').config();
const { authenticateEmsigner } = require('./emSignerService');

const EMSIGNER_WORKFLOW_INFO_URL = 'https://demoapi.emsigner.com/api/GetWorkflowInfo';

const getWorkFlowStatus = async (workflowId) => {
  const token = await authenticateEmsigner();

  try {
    const response = await axios.get(`${EMSIGNER_WORKFLOW_INFO_URL}?WorkFlowId=${workflowId}`, {
      headers: {
        'Authorization': `basic ${token}`,
        'Accept': 'application/json',
      }
    });

    const data = response.data;

    if (!data.IsSuccess || !data.Response || data.Response.length === 0) {
      throw new Error('Impossible de récupérer les informations du workflow');
    }

    const documentInfo = data.Response[0];
    const signatory = documentInfo.Signatories[0];

    return {
      documentName: documentInfo.DocumentName,
      documentId: documentInfo.DocumentId,
      status: signatory.Status,
      signeDate: signatory.SignedDate,
      remarks: signatory.Remarks,
    };

  } catch (error) {
    console.error(`Erreur lors de la récupération du statut du workflow ${workflowId} :`, error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  getWorkFlowStatus
};