
const { PrismaClient, TypeConge, TypeDoc } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateCongePDF } = require('../services/pdfService');
const path = require('path');
const fs = require('fs')
const pdfPath = path.join(__dirname, '../pdfs/conge.pdf');

if (!fs.existsSync(pdfPath)) {
  throw new Error(`Fichier PDF non trouvé à : ${pdfPath}`);
}

const fileBase64 = fs.readFileSync(pdfPath).toString('base64');
const { envoyerDocumentPourSignature } = require('../services/emsignerService');




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
            duree: duree ? new Date(duree) : undefined,
            duree: duree || undefined,
            montant,
            conditionGenerale,
            dateDebut: dateDebut ? new Date(dateDebut) : undefined,
            dateFin: dateFin ? new Date(dateFin) : undefined,
            typeConge,
            motif
        };
        if (typeDocument === TypeDoc.CONTRAT) {
            if (objetContrat === null || duree === null || montant === null || conditionGenerale === null) {
                return res.status(400).json({ message: "Champs  obligatoires manquants pour le type de document contrat" });
            }
            data.objetContrat = objetContrat;
            data.duree = new Date(duree);
            data.montant = montant;
            data.status =  "En attente";
            data.conditionGenerale = conditionGenerale;
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
        employe: true // Ici, on garde "employe", qui est bien défini dans le schéma
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

        // Créer un enregistrement dans la table ServiceArchivage
        await prisma.serviceArchivage.create({
            data: {
                idDocument: parseInt(id),
                dateArchivage: new Date()
            }
        });

        // Mettre à jour le champ archived dans Document
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


const generateConge = async (req, res) => {
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


        const congeData = {
            titre: document.titre || "Demande de congé",
            dateDebut: document.dateDebut || new Date(),
            dateFin: document.dateFin || new Date(),
            typeConge: document.typeConge || "Non spécifié",
            motif: document.motif || "Motif non fourni",
            dateCreation: document.dateCreation,
            employe: {
                nom: document.employe?.nom || "Nom employé inconnu",
                prenom: document.employe?.prenom || "prenom employé inconnu",
                email: document.employe?.email || "email employé inconnu",
                poste: document.employe?.poste || "poste employé inconnu",
                departement: document.employe?.departement || "departement employé inconnu"
            }
        }


    const pdfDir = path.join(__dirname, '../pdfs');
    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir);
    }

        const fileName = `demande_conge_${document.id}.pdf`;
        const outputPath = path.join(pdfDir, fileName);

        await generateCongePDF(congeData, outputPath);

        return res.download(outputPath, fileName);
    } catch (error) {
        console.error("Erreur lors de la génération de la demande de congé :", error);
        return res.status(500).json({ message: "Erreur lors de la génération de la demande de congé." });
    }

};

const formatDuree = (dateObj) => {
    if (!dateObj) return 'Duree non precisee';
    return new Date(dateObj).toLocaleDateString('fr-FR')
};

const envoyerPourSignature = async (req, res) => {
    const { id } = req.params;
    try {
        const resultat = await envoyerDocumentPourSignature(id);
        res.status(200).json({
            message: "Document envoye pour signature via Emsigner",
            resultat
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};


module.exports = {
    createDocument,
    getDocuments,
    getArchiveDocuments,
    getActiveDocuments,
    archiveDocument,
    generateConge,
    envoyerPourSignature

};