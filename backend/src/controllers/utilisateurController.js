const { PrismaClient} = require('@prisma/client');
const { Role } = require('@prisma/client');
const { hashPassword } = require('../utils/hash');

const prisma = new PrismaClient();

const createUtilisateur = async (req, res) => {
    try {
        const {nom, prenom, email, motDePasse, role, telephone, departement, poste, service} = req.body;

        if (!nom || !prenom || !email || !motDePasse || !role )
        {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }

        //verifeir si l'email existe deja
        const userExist = await prisma.utilisateur.findUnique({ where: { email }});
        if (userExist) return res.status(400).json({ message: 'L\'email existe déjà' });

        //hasher le mot de passe
        const hashedPassword = await hashPassword(motDePasse);

        let data = {
            nom,
            prenom,
            email,
            motDePasse: hashedPassword,
            role
        };

        switch (role) {
            case Role.ADMIN:
                if (!telephone) return res.status(400).json({ message: 'Le champ telephone est requis pour un admin' });
                data.telephone = telephone;
                break;
            
            case Role.AGENT:
                if(!service) return res.status(400).json({message: "Le champ service est requi pour un agent"});
                data.service = service;
                break;

            case Role.RESPONSABLE_RH:
                break;

            case Role.EMPLOYE:
                if (!departement || !poste) {
                    return res.status(400).json({ message: "Les champs departemen et poste sont requis pour un employe"});
                }
                data.departement = departement;
                data.poste = poste;
                break;
            default:
                return res.status(400).json({ message: 'Role non valide' });
        }

        // Créer l'utilisateur
        const newUser = await prisma.utilisateur.create({data});

        res.status(201).json({
            message: 'Utilisateur créé avec succès', utilisateur: newUser
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }

};

module.exports = {
    createUtilisateur
};
