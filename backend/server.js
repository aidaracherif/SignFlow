require('dotenv').config(); //  Charge les variables d’environnement

const express = require('express');
const app = express();
const utilisateurRoutes = require('./src/routes/utilisateurRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const clientRoutes = require('./src/routes/clientRoutes');


app.use(express.json());
app.use('/api', utilisateurRoutes);
app.use('/api', documentRoutes);
app.use('/api', clientRoutes);



// Swagger
const setupSwagger = require('./swagger');
setupSwagger(app);


// app.use('/api', archivageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server lance sur  http://localhost:${PORT}`);
     console.log(`Swagger dispo sur http://localhost:${PORT}/api-docs`);    
});