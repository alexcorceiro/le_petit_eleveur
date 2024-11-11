CREATE DATABASE IF NOT EXISTS le_petit_eleveur;
USE le_petit_eleveur;

CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  adresse TEXT,
  pays VARCHAR(100),
  role ENUM('ELEVEUR', 'ADMIN') DEFAULT 'ELEVEUR',
  type_eleveur VARCHAR(255) NOT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE animaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  espece VARCHAR(255) NOT NULL,
  race VARCHAR(100),
  bague VARCHAR(255) NOT NULL,
  date_naissance DATE,
  image VARCHAR(525),
  sexe ENUM('MALE', 'FEMELLE') NOT NULL,
  fichier_sexage VARCHAR(255),
  eleveur_id INT,
  couple_id INT,
  FOREIGN KEY (eleveur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE couples (
  id INT AUTO_INCREMENT PRIMARY KEY,
  male_id INT,
  femelle_id INT,
  date_couplage DATE
);

ALTER TABLE animaux
ADD CONSTRAINT fk_animaux_couples
FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE SET NULL;

ALTER TABLE couples
ADD CONSTRAINT fk_couples_male
FOREIGN KEY (male_id) REFERENCES animaux(id) ON DELETE CASCADE;

ALTER TABLE couples
ADD CONSTRAINT fk_couples_femelle
FOREIGN KEY (femelle_id) REFERENCES animaux(id) ON DELETE CASCADE;


CREATE TABLE stock_nourriture (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
 type_nourriture ENUM(
    'GRAINES', 'PATEE_OEUF', 'CROQUETTES',       
    'FOIN', 'ENSILAGE',                           
    'GRANULES', 'VIANDES',                        
    'LEGUMES', 'FRUITS', 'INSECTES',              
    'AUTRE'                                       
  ) NOT NULL,  quantite_par_sac DECIMAL(5,2) NOT NULL,        
  nombre_de_sacs INT DEFAULT 1,                 
  dernier_achat DATE,                            
  eleveur_id INT,
  FOREIGN KEY (eleveur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);


CREATE TABLE evenements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    adresse VARCHAR(255) NULL,
    pays VARCHAR(100) NOT NULL,
    code_postal VARCHAR(20) NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NULL,
    description TEXT NULL,
    type_evenement ENUM('BOURSE', 'CONCOURS', 'EXPOSITION', 'AUTRE') NOT NULL,
    prix DECIMAL(10, 2) NULL,
    image_url VARCHAR(255) NULL,
    organisateur VARCHAR(255) NULL,
    lien_reservation VARCHAR(255) NULL,
    nombre_places INT NULL,
    langue VARCHAR(50) NULL,
    statut ENUM('Prévu', 'En cours', 'Terminé', 'Annulé') DEFAULT 'Prévu',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);



CREATE TABLE inscriptions_evenements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT,
  evenement_id INT,
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE
);

ALTER TABLE inscriptions_evenements
ADD CONSTRAINT inscriptions_evenements_ibfk_2
FOREIGN KEY (evenement_id) REFERENCES evenements(id)
ON DELETE CASCADE;


CREATE TABLE discussions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contenu TEXT NOT NULL,
  date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  utilisateur_id INT,
  discussion_id INT,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE
);
