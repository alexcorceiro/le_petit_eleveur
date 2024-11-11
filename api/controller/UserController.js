const db = require('../utils/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { generateJWT } = require('../middleware/authenticate');

exports.register = async (req, res) => {
    const { nom, prenom, email, password, type_eleveur } = req.body;
  
    try {
      const [users] = await db.promise().query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
  
      if (users.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const insertUserQuery = `INSERT INTO utilisateurs (nom, prenom, email, password, type_eleveur) VALUES (?, ?, ?, ?, ?)`;
      await db.promise().query(insertUserQuery, [nom, prenom, email, hashedPassword, type_eleveur]);
  
      res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const [users] = await db.promise().query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
  
      if (users.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const user = users[0];
      console.log('Password hash in DB:', user.password);
  
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
      }
  
      const token = generateJWT(user)
  
      res.json({ message: 'Connexion réussie', token: token });
    } catch (err) {
      console.error("Erreur dans la fonction de connexion:", err);
      res.status(500).json({ message: err.message });
    }
  };
  

  exports.getAllUsers = async (req, res) => {
    try {
      const [users] = await db.promise().query('SELECT * FROM utilisateurs');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [user] = await db.promise().query('SELECT * FROM utilisateurs WHERE id = ?', [id]);
      if (user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user[0]); 
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getProfile = async (req, res) => {
    const { id } = req.user; 

    try {
      const [user] = await db.promise().query('SELECT * FROM utilisateurs WHERE id = ?', [id]);
      if (user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user[0]); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

exports.updateProfile = async (req, res) => {
const {id} = req.user.id
const {nom, prenom, email , telephone, adresse, pays, type_eleveur }= req.body

try{
    await db.query('UPDATE utilisateurs SET nom =?, prenom =?, email =?, telephone =?, adresse =?, pays =?, type_eleveur =? WHERE id =?', [nom, prenom, email, telephone, adresse, pays, type_eleveur, id])
    res.json({message: 'Profile updated successfully'})
}catch(err){
    res.status(404).json({message: err.message})
}
}

exports.updateUserById = async (req, res) => {
const {id } = req.params
const {nom, prenom,email, telephone, adresse, pays, type_eleveur} = req.body

try{
    await db.query('UPDATE utilisateurs SET nom =?, prenom =?, email =?, telephone =?, adresse =?, pays =?, type_eleveur =? WHERE id =?', [nom, prenom, email, telephone, adresse, pays, type_eleveur, id])
    res.json({message: 'User updated successfully'})
}catch(err){
    res.status(404).json({ message: err.message})
}
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      await db.promise().query('DELETE FROM utilisateurs WHERE id = ?', [id]);
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
}

