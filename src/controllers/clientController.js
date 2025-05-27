const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createClient = async (req, res) => {
    try {
        const {
            nom,
            prenom,
            email,
            telephone,
            adresse,
            dateNaissance,
        } = req.body;

        if (!nom || !prenom || !email || !telephone || !adresse || !dateNaissance) {
            return res.status(400).json({message: "Champs obligatoires manquants" });
        }

        const existingClient = await prisma.client.findUnique({
            where: { email }
        });

        if (existingClient) {
            return res.status(400).json({ message: "Client déjà existant" });
        }

        const newClient = await prisma.client.create({
            data: {
                nom,
                prenom,
                email,
                telephone,
                adresse,
                dateNaissance: new Date(dateNaissance),
            }
        });

        res.status(201).json({
            message: 'Client créé avec succès',
            client: newClient,
        });
    } catch (error) {
        console.error("Erreur lors de la création du client:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const getAllClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany();
        res.json(clients);
    } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await prisma.client.findUnique({
            where: {  id: parseInt(id) },
        });

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        res.json(client);
    } catch (error) {
        console.error("Erreur lors de la récupération du client:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

module.exports = {
    createClient,
    getAllClients,
    getClientById,
}