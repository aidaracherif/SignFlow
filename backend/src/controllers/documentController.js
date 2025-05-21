const { PrismaClient, TypeConge, TypeDoc } = require('@prisma/client');
const prisma = new PrismaClient();

const createDocument = async (req, res) => {
    try {
        const {
            typeDocument,
            titre,
            description,
            pathDocument,
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

        if (!typeDocument || !titre || !pathDocument || !status) {
            return res.status(400).json({ message: "Champs obligatoires manqunats"});
        }

        const data = {
            typeDocument,
            titre,
            description,
            pathDocument,
            status,
            idClient,
            idAgent,
            idEmploye,
            objetContrat,
            duree: duree ? new Date(duree) : undefined,
            montant,
            conditionGenerale,
            dateDebut: dateDebut ? new Date(dateDebut) : undefined,
            dateFin: dateFin ? new Date(dateFin) : undefined,
            typeConge,
            motif
        };
        if (typeDocument === TypeDoc.CONTRAT) {
            if (!objetContrat || !duree || !montant || !conditionGenerale) {
                return res.status(400).json({ message: "Champs obligatoires manquants pour le type de document contrat" });
            }
            data.objetContrat = objetContrat;
            data.duree = new Date(duree);
            data.montant = montant;
            data.conditionGenerale = conditionGenerale;
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

module.exports = {
    createDocument,
    getDocuments,
    getArchiveDocuments,
    getActiveDocuments,
    archiveDocument
};