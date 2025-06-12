const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateContratPDF = (contratData, outputPath) => {
    return new Promise((resolve, reject) => {
        // Configuration du document avec marges ajustées
        const doc = new PDFDocument({ 
            margin: 60,
            size: 'A4'
        });
        
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        const colors = {
            primary: '#FF6B35',      
            secondary: '#FF8C42',    
            accent: '#E8530F',       
            text: '#2D2D2D',         
            lightText: '#6B6B6B',    
            background: '#FFF8F5'   
        };

        let currentY = 60;
        const pageWidth = doc.page.width - 120; 

        const logoPath = path.join(__dirname, '../assets/osign.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 60, currentY, { width: 80 });
        }
        
        doc.fontSize(10)
           .fillColor(colors.lightText)
           .text('ODS Solutions', pageWidth - 100, currentY + 10, { align: 'right' })
           .text('www.ods.com', pageWidth - 100, currentY + 25, { align: 'right' })
           .text('contact@ods.com', pageWidth - 100, currentY + 40, { align: 'right' });

        currentY += 100;

        doc.fontSize(24)
           .fillColor(colors.primary)
           .font('Helvetica-Bold')
           .text(contratData.titre || 'CONTRAT DE PRESTATION', 60, currentY, { 
               align: 'center',
               width: pageWidth
           });

        currentY += 50;

        doc.strokeColor(colors.primary)
           .lineWidth(3)
           .moveTo(60, currentY)
           .lineTo(pageWidth + 60, currentY)
           .stroke();

        currentY += 30;

        currentY = addSectionHeader(doc, 'INFORMATIONS CLIENT', currentY, colors, pageWidth);
        
        const clientBoxHeight = 140;
        doc.rect(60, currentY, pageWidth, clientBoxHeight)
           .fillAndStroke(colors.background, colors.secondary)
           .lineWidth(1.5);

        currentY += 15;

        const leftCol = 80;
        const rightCol = 320;

        doc.fontSize(11)
           .fillColor(colors.text)
           .font('Helvetica');

        doc.font('Helvetica-Bold')
           .text('Entreprise:', leftCol, currentY)
           .font('Helvetica')
           .text(contratData.client.nom || "N/A", leftCol + 80, currentY);

        currentY += 15;
        doc.font('Helvetica-Bold')
           .text('Secteur:', leftCol, currentY)
           .font('Helvetica')
           .text(contratData.client.sercteurActivite || "N/A", leftCol + 80, currentY);

        currentY += 15;
        doc.font('Helvetica-Bold')
           .text('N° Fiscal:', leftCol, currentY)
           .font('Helvetica')
           .text(contratData.client.numeroidentification || "N/A", leftCol + 80, currentY);

        currentY -= 30;
        doc.font('Helvetica-Bold')
           .text('Téléphone:', rightCol, currentY)
           .font('Helvetica')
           .text(contratData.client.telephone || "N/A", rightCol + 70, currentY);

        currentY += 15;
        doc.font('Helvetica-Bold')
           .text('Email:', rightCol, currentY)
           .font('Helvetica')
           .text(contratData.client.email || "N/A", rightCol + 70, currentY);

        currentY += 15;
        doc.font('Helvetica-Bold')
           .text('Site web:', rightCol, currentY)
           .font('Helvetica')
           .text(contratData.client.siteWeb || "N/A", rightCol + 70, currentY);

        currentY += 30;

        doc.font('Helvetica-Bold')
           .text('Adresse:', leftCol, currentY)
           .font('Helvetica')
           .text(contratData.client.adresse || "N/A", leftCol + 60, currentY, { width: pageWidth - 140 });

        currentY += 25;

        if (contratData.client.contactNom) {
            doc.font('Helvetica-Bold')
               .fillColor(colors.accent)
               .text('Contact principal:', leftCol, currentY)
               .font('Helvetica')
               .fillColor(colors.text)
               .text(`${contratData.client.contactNom} (${contratData.client.contactFonction || 'N/A'})`, leftCol + 110, currentY);
            
            currentY += 15;
            doc.text(`Email: ${contratData.client.contactEmail || 'N/A'}`, leftCol, currentY);
        }

        currentY += 40;

        currentY = addSectionHeader(doc, 'DÉTAILS DU CONTRAT', currentY, colors, pageWidth);

        const detailsData = [
            { label: 'Objet du contrat', value: contratData.objetContrat || "Non spécifié" },
            { label: 'Durée', value: contratData.duree || "Non précisée" },
            { label: 'Montant', value: contratData.montant ? `${contratData.montant} FCFA` : 'Non précisé' },
            { label: 'Date de création', value: new Date(contratData.dateCreation).toLocaleDateString('fr-FR') }
        ];

        detailsData.forEach((item, index) => {
            const isEven = index % 2 === 0;
            const bgColor = isEven ? colors.background : '#FFFFFF';
            
            doc.rect(60, currentY, pageWidth, 25)
               .fill(bgColor);

            doc.fontSize(11)
               .fillColor(colors.primary)
               .font('Helvetica-Bold')
               .text(item.label, 80, currentY + 8);

            doc.fillColor(colors.text)
               .font('Helvetica')
               .text(item.value, 250, currentY + 8);

            currentY += 25;
        });

        currentY += 20;

        if (contratData.description && contratData.description !== "Aucune description") {
            doc.fontSize(12)
               .fillColor(colors.primary)
               .font('Helvetica-Bold')
               .text('DESCRIPTION DES PRESTATIONS', 60, currentY);

            currentY += 20;

            doc.fontSize(11)
               .fillColor(colors.text)
               .font('Helvetica')
               .text(contratData.description, 60, currentY, {
                   width: pageWidth,
                   align: 'justify',
                   lineGap: 3
               });

            currentY += 60;
        }

        currentY = addSectionHeader(doc, 'CONDITIONS GÉNÉRALES', currentY, colors, pageWidth);

        const conditionsText = contratData.conditionGenerale ||
            `1. L'entreprise s'engage à réaliser les prestations conformément aux modalités prévues dans ce contrat.\n\n` +
            `2. Le client s'engage à fournir toutes les informations nécessaires à la bonne exécution du contrat.\n\n` +
            `3. Toute modification du présent contrat devra faire l'objet d'un avenant signé par les deux parties.\n\n` +
            `4. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire.\n\n` +
            `5. Ce contrat est régi par la législation en vigueur dans le pays d'établissement de l'entreprise.`;

        doc.fontSize(10)
           .fillColor(colors.text)
           .font('Helvetica')
           .text(conditionsText, 60, currentY, {
               width: pageWidth,
               align: 'justify',
               lineGap: 2
           });

        if (currentY > doc.page.height - 200) {
            doc.addPage();
            currentY = 60;
        } else {
            currentY += 120;
        }

        doc.strokeColor(colors.primary)
           .lineWidth(1.5)
           .moveTo(60, currentY)
           .lineTo(pageWidth + 60, currentY)
           .stroke();

        currentY += 30;

        const signatureBoxWidth = (pageWidth - 40) / 2;

        doc.rect(60, currentY, signatureBoxWidth, 80)
           .stroke(colors.primary)
           .lineWidth(1.5);

        doc.fontSize(11)
           .fillColor(colors.primary)
           .font('Helvetica-Bold')
           .text('SIGNATURE CLIENT', 70, currentY + 10);

        doc.fontSize(9)
           .fillColor(colors.lightText)
           .font('Helvetica')
           .text('Date et signature du représentant', 70, currentY + 30)
           .text('de l\'entreprise cliente', 70, currentY + 42);

        doc.rect(60 + signatureBoxWidth + 20, currentY, signatureBoxWidth, 80)
           .stroke(colors.primary)
           .lineWidth(1.5);

        doc.fontSize(11)
           .fillColor(colors.primary)
           .font('Helvetica-Bold')
           .text('SIGNATURE PRESTATAIRE', 70 + signatureBoxWidth + 20, currentY + 10);

        doc.fontSize(9)
           .fillColor(colors.lightText)
           .font('Helvetica')
           .text('Date et signature ODS', 70 + signatureBoxWidth + 20, currentY + 30);

        // === PIED DE PAGE ===
        currentY = doc.page.height - 80;
        
        doc.fontSize(8)
           .fillColor(colors.lightText)
           .font('Helvetica')
           .text('Ce document a été généré automatiquement le ' + new Date().toLocaleDateString('fr-FR'), 
                 60, currentY, { align: 'center', width: pageWidth });

        doc.end();

        stream.on('finish', () => {
            resolve(outputPath);
        });

        stream.on('error', reject);
    });
};

// Fonction utilitaire pour ajouter des en-têtes de section
function addSectionHeader(doc, title, currentY, colors, pageWidth) {
    // Vérifier si on a besoin d'une nouvelle page
    if (currentY > doc.page.height - 150) {
        doc.addPage();
        currentY = 60;
    }

    // Fond coloré pour l'en-tête
    doc.rect(60, currentY, pageWidth, 30)
       .fill(colors.primary);

    // Texte de l'en-tête
    doc.fontSize(13)
       .fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .text(title, 70, currentY + 9);

    return currentY + 45;
}

module.exports = {
    generateContratPDF,
};
