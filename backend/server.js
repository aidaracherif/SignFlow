require('dotenv').config();
const express = require('express');
const app = express();
const utilisateurRoutes = require('./src/routes/utilisateurRoutes');



app.use(express.json());

app.use('/api', utilisateurRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server lance sur  http://localhost:${PORT}`);
});
