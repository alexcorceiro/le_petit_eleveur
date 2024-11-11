const db = require('../utils/db')

exports.createEventement = async (req,res) => {
  const { nom, ville, adresse, pays, code_postal, date_debut, date_fin, description, type_evenement, prix, image_url, organisateur, lien_reservation, nombre_places, langue, statut } = req.body;

try{
  const [result] = await db.promise().query(`
    INSERT INTO evenements (nom, ville, adresse, pays, code_postal, date_debut, date_fin, description, type_evenement, prix, image_url, organisateur, lien_reservation, nombre_places, langue, statut) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`, [nom, ville, adresse, pays, code_postal, date_debut, date_fin, description, type_evenement, prix, image_url, organisateur, lien_reservation, nombre_places, langue, statut || 'Prévu']);

res.status(201).json({ message: 'Événement créé avec succès', eventId: result.insertId });
}catch(err){
    res.status(500).json({ message: err.message })
}
}

exports.getEvents = async (req, res) => {
    try {
        const [events] = await db.promise().query('SELECT * FROM evenements');
        res.json(events);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
      }
}

exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
      const [event] = await db.promise().query('SELECT * FROM evenements WHERE id = ?', [id]);
      if (event.length === 0) return res.status(404).json({ error: 'Événement non trouvé' });
      res.json(event[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement' });
    }
}

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { nom, ville, adresse, pays, code_postal, date_debut, date_fin, description, type_evenement, prix, image_url, organisateur, lien_reservation, nombre_places, langue, statut } = req.body;
  
    try {
      const [result] = await db.promise().query(`
        UPDATE evenements 
        SET nom = ?, ville = ?, adresse = ?, pays = ?, code_postal = ?, date_debut = ?, date_fin = ?, description = ?, type_evenement = ?, prix = ?, image_url = ?, organisateur = ?, lien_reservation = ?, nombre_places = ?, langue = ?, statut = ? 
        WHERE id = ?
    `, [nom, ville, adresse, pays, code_postal, date_debut, date_fin, description, type_evenement, prix, image_url, organisateur, lien_reservation, nombre_places, langue, statut, id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Événement non trouvé' });
    }

    res.status(200).json({ message: 'Événement mis à jour avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
    }
}

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await db.promise().query('DELETE FROM evenements WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Événement non trouvé' });
      res.json({ message: 'Événement supprimé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
    }
}

