const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Génère un PDF pour une demande de congé.
 * @param {Object} congeData - Données de la demande de congé.
 * @param {string} congeData.employe.nom
 * @param {string} congeData.employe.prenom
 * @param {string} congeData.employe.email
 * @param {string} congeData.employe.departement
 * @param {string} congeData.employe.poste
 * @param {string} congeData.typeConge
 * @param {string} congeData.dateDebut   // ISO string
 * @param {string} congeData.dateFin     // ISO string
 * @param {string} [congeData.motif]
 * @param {string} [congeData.description]
 * @param {string} outputPath - Chemin du fichier de sortie (.pdf)
 * @returns {Promise<string>} - Résout avec outputPath
 */
const generateCongePDF = (congeData, outputPath) => {
  return new Promise((resolve, reject) => {
    // Initialisation
    const doc = new PDFDocument({ margin: 60, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Couleurs
    const colors = {
      primary: '#FF6B35',
      text:    '#2D2D2D',
      light:   '#6B6B6B',
      bg:      '#FFF8F5'
    };
    const pageWidth = doc.page.width - 120;
    let y = 60;

    // Logo + entête entreprise
    const logo = path.join(__dirname, '../assets/osign.png');
    if (fs.existsSync(logo)) {
      doc.image(logo, 60, y, { width: 80 });
    }
    doc
      .fontSize(10)
      .fillColor(colors.light)
      .text('ODS Solutions', 0, y + 10, { align: 'right', width: pageWidth })
      .text('contact@ods.com', { align: 'right', width: pageWidth });
    y += 80;

    // Titre de la demande
    doc
      .fontSize(20)
      .fillColor(colors.primary)
      .font('Helvetica-Bold')
      .text('DEMANDE DE CONGÉ', 60, y, { align: 'center', width: pageWidth });
    y += 40;

    // Ligne de séparation
    doc
      .strokeColor(colors.primary)
      .lineWidth(2)
      .moveTo(60, y)
      .lineTo(60 + pageWidth, y)
      .stroke();
    y += 30;

    // Section Informations Employé
    y = addSectionHeader(doc, 'INFORMATIONS EMPLOYÉ', y, colors, pageWidth);
    doc
      .fontSize(11)
      .fillColor(colors.text)
      .font('Helvetica')
      .text(`Nom : `, 80, y)
      .font('Helvetica-Bold')
      .text(`${congeData.employe.nom}`, 160, y);
    y += 18;
    doc
      .fontSize(11)
      .fillColor(colors.text)
      .font('Helvetica')
      .text(`Prenom : `, 80, y)
      .font('Helvetica-Bold')
      .text(`${congeData.employe.prenom}`, 160, y);
    y += 18;
    doc
      .fontSize(11)
      .fillColor(colors.text)
      .font('Helvetica')
      .text(`Email : `, 80, y)
      .font('Helvetica-Bold')
      .text(`${congeData.employe.email}`, 160, y);
    y += 18;
    doc
      .fontSize(11)
      .fillColor(colors.text)
      .font('Helvetica')
      .text(`Poste : `, 80, y)
      .font('Helvetica-Bold')
      .text(`${congeData.employe.poste}`, 160, y);
    y += 18;
    doc
      .fontSize(11)
      .fillColor(colors.text)
      .font('Helvetica')
      .text(`departement : `, 80, y)
      .font('Helvetica-Bold')
      .text(`${congeData.employe.departement}`, 160, y);
    y += 18;


    // Section Détails du congé
    y = addSectionHeader(doc, 'DÉTAILS DU CONGÉ', y, colors, pageWidth);
    const details = [
      { label: 'Type de congé', value: congeData.typeConge },
      { label: 'Date de début', value: new Date(congeData.dateDebut).toLocaleDateString('fr-FR') },
      { label: 'Date de fin',   value: new Date(congeData.dateFin).toLocaleDateString('fr-FR') },
      { label: 'Motif',         value: congeData.motif || '—' }
    ];
    details.forEach(item => {
      doc
        .font('Helvetica-Bold')
        .fillColor(colors.primary)
        .text(item.label + ' : ', 80, y)
        .font('Helvetica')
        .fillColor(colors.text)
        .text(item.value, 200, y);
      y += 18;
    });
    y += 20;

    // Description libre
    if (congeData.description) {
      y = addSectionHeader(doc, 'DESCRIPTION', y, colors, pageWidth);
      doc
        .fontSize(11)
        .fillColor(colors.text)
        .font('Helvetica')
        .text(congeData.description, 80, y, {
          width: pageWidth - 40,
          align: 'justify',
          lineGap: 3
        });
      y += 60;
    }

    // Signatures
    if (y > doc.page.height - 200) {
      doc.addPage();
      y = 60;
    }
    doc
      .strokeColor(colors.primary)
      .lineWidth(1)
      .moveTo(60, y)
      .lineTo(60 + pageWidth, y)
      .stroke();
    y += 30;

    const boxWidth = (pageWidth - 40) / 2;
    // Employé
    doc
      .rect(60, y, boxWidth, 70).stroke(colors.primary)
      .fontSize(11)
      .fillColor(colors.primary)
      .font('Helvetica-Bold')
      .text('SIGNATURE EMPLOYÉ', 70, y + 10);
    // Responsable
    doc
      .rect(60 + boxWidth + 40, y, boxWidth, 70).stroke(colors.primary)
      .text('SIGNATURE RESPONSABLE', 70 + boxWidth + 40, y + 10);

    // Pied de page
    const footerY = doc.page.height - 50;
    doc
      .fontSize(8)
      .fillColor(colors.light)
      .font('Helvetica')
      .text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`,
            60, footerY, { align: 'center', width: pageWidth });

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', err => reject(err));
  });
};

// Utilitaire pour les en-têtes de section
function addSectionHeader(doc, title, y, colors, width) {
  // nouvelle page si nécessaire
  if (y > doc.page.height - 150) {
    doc.addPage();
    y = 60;
  }
  doc
    .rect(60, y, width, 25)
    .fill(colors.primary);
  doc
    .fontSize(13)
    .fillColor('#FFFFFF')
    .font('Helvetica-Bold')
    .text(title, 70, y + 6);
  return y + 35;
}

module.exports = { generateCongePDF };
