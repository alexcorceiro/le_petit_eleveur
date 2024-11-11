const db = require('../utils/db')

exports.createCouple = async (req, res) => {
    const { male_id, female_id, date_couplage } = req.body;

    try {
        const [male] = await db.promise().query('SELECT * FROM animaux WHERE id = ?', [male_id]);
        const [female] = await db.promise().query('SELECT * FROM animaux WHERE id = ?', [female_id]);

        if (male.length === 0 || female.length === 0) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        if (male[0].sexe !== 'MALE' || female[0].sexe !== 'FEMELLE') {
            return res.status(400).json({ message: 'The couple must consist of one male and one female' });
        }

        const coupleDate = date_couplage ? new Date(date_couplage) : new Date();

        const [result] = await db.promise().query('INSERT INTO couples SET ?', {
            male_id,
            femelle_id: female_id,
            date_couplage: coupleDate
        });

        const coupleId = result.insertId;

        await db.promise().query('UPDATE animaux SET couple_id = ? WHERE id = ?', [coupleId, male_id]);
        await db.promise().query('UPDATE animaux SET couple_id = ? WHERE id = ?', [coupleId, female_id]);

        res.status(201).json({ message: 'Couple created successfully', id: coupleId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getAllCouple = async (req, res) => {
    try {
        const [couples] = await db.promise().query(`
            SELECT 
                c.id AS couple_id, c.date_couplage,
                male.id AS male_id, male.nom AS male_nom, male.espece AS male_espece, 
                male.race AS male_race, male.bague AS male_bague, male.date_naissance AS male_date_naissance, 
                male.sexe AS male_sexe, male.image AS male_image, male.fichier_sexage AS male_fichier_sexage,
                femelle.id AS female_id, femelle.nom AS female_nom, femelle.espece AS female_espece, 
                femelle.race AS female_race, femelle.bague AS female_bague, femelle.date_naissance AS female_date_naissance, 
                femelle.sexe AS female_sexe, femelle.image AS female_image, femelle.fichier_sexage AS female_fichier_sexage
            FROM couples c
            JOIN animaux male ON c.male_id = male.id
            JOIN animaux femelle ON c.femelle_id = femelle.id
        `);

        res.status(200).json(couples);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




exports.getCoupleById = async (req, res) => {
    try {
        const { id } = req.params;
        const [couple] = await db.promise().query(`
            SELECT 
                c.id AS couple_id, c.date_couplage,
                male.id AS male_id, male.nom AS male_nom, male.espece AS male_espece, 
                male.race AS male_race, male.bague AS male_bague, male.date_naissance AS male_date_naissance, 
                male.sexe AS male_sexe, male.image AS male_image, male.fichier_sexage AS male_fichier_sexage,
                femelle.id AS female_id, femelle.nom AS female_nom, femelle.espece AS female_espece, 
                femelle.race AS female_race, femelle.bague AS female_bague, femelle.date_naissance AS female_date_naissance, 
                femelle.sexe AS female_sexe, femelle.image AS female_image, femelle.fichier_sexage AS female_fichier_sexage
            FROM couples c
            JOIN animaux male ON c.male_id = male.id
            JOIN animaux femelle ON c.femelle_id = femelle.id
            WHERE c.id = ?
        `, [id]);

        if (couple.length === 0) {
            return res.status(404).json({ message: 'Couple not found' });
        }

        res.status(200).json(couple[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

   

exports.updateCouple = async (req, res) => {
    const { id } = req.params;
    const { male_id, femelle_id, date_couplage, statut } = req.body;
  
    try {
      const [male] = await db.promise().query('SELECT * FROM animaux WHERE id = ?', [male_id]);
      const [femelle] = await db.promise().query('SELECT * FROM animaux WHERE id = ?', [femelle_id]);
      
      if (male.length === 0 || femelle.length === 0) {
        return res.status(404).json({ error: 'L\'animal mâle ou femelle n\'existe pas' });
      }
  
      const [result] = await db.promise().query('UPDATE couples SET ? WHERE id = ?', [
        { male_id, femelle_id, date_couplage: Date.now() },
        id,
      ]);
  
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Couple non trouvé' });


    await db.promise().query('UPDATE animaux SET couple_id = ? WHERE id = ?', [id, male_id]);
    await db.promise().query('UPDATE animaux SET couple_id = ? WHERE id = ?', [id, femelle_id]);

      res.json({ message: 'Couple mis à jour avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du couple' });
    }
}

exports.deleteCouple = async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await db.promise().query('DELETE FROM couples WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Couple non trouvé' });
      res.json({ message: 'Couple supprimé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression du couple' });
    }
}