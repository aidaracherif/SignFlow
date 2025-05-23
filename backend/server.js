require('dotenv').config();
const express = require('express');
const app = express();
const utilisateurRoutes = require('./src/routes/utilisateurRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const clientRoutes = require('./src/routes/clientRoutes');





app.use(express.json());
app.use('/api', utilisateurRoutes);
app.use('/api', documentRoutes);
app.use('/api', clientRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server lance sur  http://localhost:${PORT}`);
});
