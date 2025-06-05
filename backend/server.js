require('dotenv').config(); //  Charge les variables d’environnement

const express = require('express');
const app = express();
const utilisateurRoutes = require('./src/routes/utilisateurRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
// const emsignerRoutes = require('./src/routes/emsignerRoutes');


app.use(express.json());
app.use('/api', utilisateurRoutes);
app.use('/api', documentRoutes);
app.use('/api', clientRoutes);
// app.use('/api', emsignerRout es);



const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

var options = {
  explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
// app.use('/api', archivageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server lance sur  http://localhost:${PORT}`);
     console.log(`Swagger dispo sur http://localhost:${PORT}/api-docs`);    
});

