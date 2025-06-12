const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = () => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('document.pdf'));

    doc.fontSize(20).text('Rapport de l’entreprise', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Ce document est généré à partir de données statiques.');
    doc.moveDown();
    doc.text('Nom : Mame Diarra Aidara');
    doc.text('Fonction : Développeur');
    doc.text('Date : 20 mai 2025');

    doc.end();
};

generatePDF();
