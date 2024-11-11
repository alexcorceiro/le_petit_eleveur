const db = require('../utils/db.js')

exports.createStock = async (req, res) => {
  const { nom, type_nourriture, quantite_par_sac, nombre_de_sacs, date_dernier_achat } = req.body;
  const eleveur_id = req.user.id; 

  try {
      const [result] = await db.promise().query(
          `INSERT INTO stock_nourriture (nom, type_nourriture, quantite_par_sac, nombre_de_sacs, dernier_achat, eleveur_id) VALUES (?, ?, ?, ?, ?,?)`,
          [
              nom,
              type_nourriture,
              quantite_par_sac,
              nombre_de_sacs || 1,
              date_dernier_achat ? new Date(date_dernier_achat) : new Date(),
              eleveur_id
          ]
      );

      res.status(201).json({ message: 'Stock créé avec succès', stockId: result.insertId });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};


exports.getAllStock = async (req, res) => {
  const eleveur_id = req.user.id;

  try {
      const [stocks] = await db.promise().query(
          `SELECT * FROM stock_nourriture WHERE eleveur_id = ?`,
          [eleveur_id]
      );
      res.status(200).json(stocks);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
}

exports.getStockById = async (req, res) => {
    const { id } = req.params;

    try {
      const [stock] = await db.promise().query('SELECT * FROM stock_nourriture WHERE id = ?', [id]);
      if (stock.length === 0) return res.status(404).json({ error: 'Stock de nourriture non trouvé' });
      res.json(stock[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération du stock de nourriture' });
    }
}

exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { nom, type_nourriture,  quantite_par_sac, date_dernier_achat, eleveur_id } = req.body;
  
    try {
      const [result] = await db.promise().query('UPDATE stock_nourriture SET ? WHERE id = ?', [
        { nom, type_nourriture, quantite_par_sac, date_dernier_achat, eleveur_id },
        id,
      ]);
  
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Stock de nourriture non trouvé' });
      res.json({ message: 'Stock de nourriture mis à jour avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du stock de nourriture' });
    }
}

exports.deleteStock = async (req, res) => {
  const { id } = req.params;
  const eleveur_id = req.user.id;

  try {
    const [result] = await db.promise().query('DELETE FROM stock_nourriture WHERE id = ? AND eleveur_id = ?', [id, eleveur_id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Stock de nourriture non trouvé ou vous n\'êtes pas autorisé à le supprimer' });
    res.json({ message: 'Stock de nourriture supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du stock de nourriture' });
  }
};