const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🔍 Config DB utilisée :', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Petit test de connexion au démarrage
pool.getConnection()
  .then((conn) => {
    console.log('✅ Connexion MySQL réussie');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MySQL :');
    console.error('  code:', err.code);
    console.error('  message:', err.message);
    console.error('  errno:', err.errno);
  });

module.exports = pool;