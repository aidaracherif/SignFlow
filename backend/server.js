require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const utilisateurRoutes = require('./src/routes/utilisateurRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const clientRoutes = require('./src/routes/clientRoutes');




app.use(cors());
app.use(express.json());
app.use('/api', utilisateurRoutes);
app.use('/api', documentRoutes);
app.use('/api', clientRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

var options = {
  explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server lance sur  http://localhost:${PORT}`);
});
