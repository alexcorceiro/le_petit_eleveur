const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./utils/db");
require('dotenv').config();
console.log("JWT_SECRET_KEY from .env:", process.env.JWT_SECRET_KEY);
const router = require('./routes/apirRoute');
const path = require('path');
const port = process.env.PORT || 4500; 

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));

app.get('/api/test', (req, res) => {
  res.json({ message: "CORS fonctionne correctement" });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', router);

db.connect((err) => {
    if (err) {
      console.error("Erreur de connexion à la base de données:", err.message);
      process.exit(1); 
    }
    console.log("Connecté à la base de données MySQL");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
