const { PrismaClient, TypeDoc } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateContratPDF } = require('../services/pdfService');
const path = require('path');
const fs = require('fs');


const createDocument = async (req, res) => {
    try {
        const {
            typeDocument,
            titre,
            description,
            status,
            idClient,
            idAgent,
            idEmploye,
            objetContrat,
            duree,
            montant,
            conditionGenerale,
            dateDebut,
            dateFin,
            typeConge,
            motif
        } = req.body;

        if (!typeDocument || !titre  || !status) {
            return res.status(400).json({ message: "Champs obligatoires manqunats"});
        }

        const data = {
            typeDocument,
            titre,
            description,
            status,
            idClient,
            idAgent,
            idEmploye,
            objetContrat,
            duree: duree || undefined,
            montant,
            conditionGenerale,
            dateDebut: dateDebut ? new Date(dateDebut) : undefined,
            dateFin: dateFin ? new Date(dateFin) : undefined,
            typeConge,
            motif
        };
        if (typeDocument === TypeDoc.CONTRAT) {
            if (!objetContrat || !duree || !montant) {
                return res.status(400).json({ message: "Champs obligatoires manquants pour le type de document contrat" });
            }
            data.objetContrat = objetContrat;
            data.duree = duree;
            data.montant = montant;
            // data.conditionGenerale = conditionGenerale;
        } 
        else if (typeDocument === TypeDoc.CONGE) {
            if (!dateDebut || !dateFin || !typeConge || !motif) {
                return res.status(400).json({message: "Champs obligatoires manquants pour le type de document congé" });
            }
            data.dateDebut = new Date(dateDebut);
            data.dateFin = new Date(dateFin);
            data.typeConge = typeConge;
            data.motif = motif;
        } else {
            return res.status(400).json({ message: "Type de document non valide" });
        }
            

        const document = await prisma.document.create({ data });

        res.status(201).json({
            message: "Document créé avec succès",
            document
        });
    } catch (error) {
        console.error("Erreur lors de la création du document:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const getDocuments = async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            include: {
                client: true,
                agent: true,
                employe: true
            }
        });
        res.json(documents);
    } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
const archiveDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const document = await prisma.document.findUnique({
            where: { id: parseInt(id) }
        });

        if (!document) {
            return res.status(404).json({ message: 'Document non trouvé.' });
        }

        if (document.archived) {
            return res.status(400).json({ message: 'Le document est déjà archivé.' });
        }

        await prisma.serviceArchivage.create({
            data: {
                idDocument: parseInt(id),
                dateArchivage: new Date()
            }
        });

        const updatedDocument = await prisma.document.update({
            where: { id: parseInt(id) },
            data: {
                archived: true
            }
        });

        res.json({
            message: "Document archivé avec succès",
            document: updatedDocument
        });
    } catch (error) {
        console.error("Erreur lors de l'archivage du document:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

const getArchiveDocuments = async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            where: {
                archived: true
            },
            include: {
                client: true,
                agent: true,
                employe: true
            }
        });
        res.json(documents);
    } catch (error) {
        console.error("Erreur lors de la récupération des documents archivés:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const getActiveDocuments = async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            where: {
                archived: false
            },
            include: {
                client: true,
                agent: true,
                employe: true
            }
        });
        res.json(documents);
    } catch (error) {
        console.error("Erreur lors de la récupération des documents actifs:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const generateContrat = async (req, res) => {
    const documentId = parseInt(req.params.id);

    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                client: true,
                agent: true,
                employe: true
            }
        });

        if (!document) {
            return res.status(404).json({ message: 'Document introuvable.' });
        }

        const contratData = {
            titre: document.titre,
            description: document.description,
            objetContrat: document.objetContrat,
            duree: document.duree,
            montant: document.montant,
            conditionGenerale: document.conditionGenerale,
            dateCreation: document.dateCreation,
            client: {
                nom: document.client?.nom || "Nom manquant",
                sercteurActivite: document.client?.sercteurActivite || "Secteur non précisé",
                numeroidentification: document.client?.numeroidentification || "Non fourni",
                adresse: document.client?.adresse || "Adresse manquante",
                telephone: document.client?.telephone || "Téléphone manquant",
                email: document.client?.email || "Email manquant",
                siteWeb: document.client?.siteWeb || "Non renseigné",
                contactNom: document.client?.contactNom || "Non renseigné",
                contactFonction: document.client?.contactFonction || "Non précisée",
                contactEmail: document.client?.contactEmail || "Non renseigné"
            }
        };

        const pdfDir = path.join(__dirname, '../pdfs');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir);
        }

        const fileName = `contrat_${document.id}_${Date.now()}.pdf`;
        const outputPath = path.join(pdfDir, fileName);

        await generateContratPDF(contratData, outputPath);

        return res.download(outputPath, fileName); 
    } catch (error) {
        console.error("Erreur lors de la génération du contrat :", error);
        return res.status(500).json({ message: "Erreur lors de la génération du contrat." });
    }
};

const formatDuree = (dateObj) => {
    if (!dateObj) return 'Duree non precisee';
    return new Date(dateObj).toLocaleDateString('fr-FR')
};

module.exports = {
    createDocument,
    getDocuments,
    getArchiveDocuments,
    getActiveDocuments,
    archiveDocument,
    generateContrat
};