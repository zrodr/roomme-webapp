const mysql = require('mysql2');

const connection = mysql.createPool({
    host: process.env.SERVER_IP,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
});

const promisePool = connection.promise();

module.exports = promisePool;