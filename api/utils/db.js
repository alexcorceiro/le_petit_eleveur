require('dotenv').config()
const mysql = require("mysql2")


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
})

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the MySQL server.");
});

module.exports = db;