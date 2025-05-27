const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',        
    host: 'localhost',
    database: 'signflow',    
    password: 'mamamina1943', 
    port: 5432,
});

// Test de connexion
const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL connecté avec succès');
        client.release();
    } catch (err) {
        console.error('Erreur de connexion à PostgreSQL:', err);
        process.exit(1);
    }
};

module.exports = {
    pool,
    connectDB
};