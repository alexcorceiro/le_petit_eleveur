const db = require('../utils/db')
const path = require('path')
const fs = require('fs')

exports.createAnimaux = async (req, res) => {
    const { nom, espece, race, bague, date_naissance, sexe } = req.body;
    const eleveur_id = req.user.id; 
    const imagePath = req.filePath;    
    const fichier_sexage = req.filePath

    try {
        const [result] = await db.promise().query(
            `INSERT INTO animaux SET ?`, 
            {
                nom,
                espece,
                race,
                bague,
                date_naissance,
                sexe,
                eleveur_id,
                image: imagePath,
                fichier_sexage
            }
        );

        res.status(201).json({ message: 'Animal créé avec succès', animalId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllAnimaux = async (req, res) => {
    const { id } = req.user; 

    try {
        const [result] = await db.promise().query('SELECT * FROM animaux WHERE eleveur_id = ?', [id]);

        res.json({
            message: 'Tous les animaux de l\'éleveur',
            animaux: result
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAnimauxById = async (req, res) => {
const {id} = req.params
try{
    const [result] = await db.query('SELECT * FROM animaux WHERE id =?', [id])
    if(!result.length) return res.status(404).json({ message: 'Animal non trouvé' })
    res.json({ message: 'Animal', result: result[0] })
}catch(err){
    res.status(500).json({ message: err.message })
}
}


exports.updateAnimaux = async (req, res) => {
    const { id } = req.params;
    const { nom, espece, race, bague, date_naissance, sexe, couple_id } = req.body;
    const eleveur_id = req.user.id; 

    let image = req.filePath || null;    
    let fichier_sexage = req.filePath || null;

    try {
        const [existingAnimal] = await db.promise().query('SELECT * FROM animaux WHERE id = ? AND eleveur_id = ?', [id, eleveur_id]);
        if (existingAnimal.length === 0) return res.status(404).json({ error: 'Animal non trouvé ou vous n\'êtes pas autorisé à le modifier.' });

        const currentAnimal = existingAnimal[0];

        let formattedDateNaissance = currentAnimal.date_naissance; 
        if (date_naissance) {
            const parsedDate = new Date(date_naissance);
            if (!isNaN(parsedDate)) { 
                formattedDateNaissance = parsedDate.toISOString().split('T')[0];
            } else {
                return res.status(400).json({ error: "La date de naissance fournie est invalide." });
            }
        }

        const updatedAnimal = {
            nom: nom || currentAnimal.nom,
            espece: espece || currentAnimal.espece,
            race: race || currentAnimal.race,
            bague: bague || currentAnimal.bague,
            date_naissance: formattedDateNaissance,
            sexe: sexe || currentAnimal.sexe,
            couple_id: couple_id || currentAnimal.couple_id,
            eleveur_id,
            image: image || currentAnimal.image,
            fichier_sexage: fichier_sexage || currentAnimal.fichier_sexage,
        };

        if (image && currentAnimal.image) fs.unlinkSync(currentAnimal.image);
        if (fichier_sexage && currentAnimal.fichier_sexage) fs.unlinkSync(currentAnimal.fichier_sexage);

        const [result] = await db.promise().query('UPDATE animaux SET ? WHERE id = ? AND eleveur_id = ?', [updatedAnimal, id, eleveur_id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Mise à jour non effectuée.' });
        res.json({ message: 'Animal mis à jour avec succès', updatedAnimal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'animal' });
    }
};
  exports.deleteAnimaux = async (req, res) => {
    const { id } = req.params;

    try {
        const [animalData] = await db.promise().query('SELECT image, fichier_sexage, couple_id FROM animaux WHERE id = ?', [id]);

        if (animalData.length === 0) {
            return res.status(404).json({ message: 'Animal non trouvé' });
        }

        const { image, fichier_sexage, couple_id } = animalData[0];

        if (couple_id) {
            await db.promise().query('DELETE FROM couples WHERE id = ?', [couple_id]);
        }

        if (image) {
            const imagePath = path.join(__dirname, '..', image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        if (fichier_sexage) {
            const sexagePath = path.join(__dirname, '..', fichier_sexage);
            if (fs.existsSync(sexagePath)) {
                fs.unlinkSync(sexagePath);
            }
        }

        const [result] = await db.promise().query('DELETE FROM animaux WHERE id = ?', [id]);
        if (!result.affectedRows) {
            return res.status(404).json({ message: 'Animal non trouvé' });
        }

        res.json({ message: 'Animal et données associées supprimés avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

