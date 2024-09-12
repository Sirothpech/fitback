const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'fitback',
    password: 'YOUR_PASSWORD_MYSQL'
});

// Tester la connexion
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Erreur de connexion à la base de données: " + err.message);
        return;
    }
    console.log("Connexion réussie à la base de données.");
    connection.release();
});

module.exports = pool.promise();
