const jwt = require('jsonwebtoken')
require('dotenv').config()


const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide ou expiré" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(403).json({ message: "Autorisation manquante" });
  }
};

  

const generateJWT = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { authenticateJWT, generateJWT };
