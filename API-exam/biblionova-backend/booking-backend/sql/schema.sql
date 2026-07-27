
-- Booking - Schéma de base de données MySQL

CREATE DATABASE IF NOT EXISTS booking_db;
USE booking_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE
);

-- Table: books
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  auteur VARCHAR(150) NOT NULL,
  annee INT DEFAULT NULL,
  description TEXT,
  nb_pages INT DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  categorie_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table: chapitres
-- Chaque livre est découpé en chapitres.
-- Les chapitres 1 et 2 sont lisibles gratuitement
-- après emprunt ; à partir du 3e, il faut un achat validé.
CREATE TABLE IF NOT EXISTS chapitres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  numero INT NOT NULL,
  titre VARCHAR(200),
  contenu_url VARCHAR(255) NOT NULL, -- lien vers le PDF du chapitre
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_chapitre (book_id, numero)
);

-- Table: emprunts
CREATE TABLE IF NOT EXISTS emprunts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  date_emprunt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  statut ENUM('en_cours', 'termine') DEFAULT 'en_cours',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Table: achats (paiement simulé)
CREATE TABLE IF NOT EXISTS achats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  statut ENUM('en_attente', 'paye') DEFAULT 'en_attente',
  date_achat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_achat (user_id, book_id)
);

-- Table: favoris
CREATE TABLE IF NOT EXISTS favoris (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favori (user_id, book_id)
);

-- Données de test
INSERT INTO categories (nom) VALUES
('Roman classique'), ('Conte philosophique'), ('Roman réaliste'), ('Roman naturaliste');

INSERT INTO books (titre, auteur, annee, description, nb_pages, image_url, categorie_id) VALUES
('Les Misérables', 'Victor Hugo', 1862, 'Une fresque sociale et humaniste de la France du XIXe siècle.', 1900, NULL, 1),
('Le Petit Prince', 'Antoine de Saint-Exupéry', 1943, 'Un conte poétique et philosophique sous l''apparence d''un conte pour enfants.', 96, NULL, 2),
('Madame Bovary', 'Gustave Flaubert', 1857, 'L''histoire d''Emma Bovary, épouse d''un médecin de campagne.', 464, NULL, 3);

INSERT INTO chapitres (book_id, numero, titre, contenu_url) VALUES
(1, 1, 'Chapitre 1', 'https://example.com/pdfs/miserables-ch1.pdf'),
(1, 2, 'Chapitre 2', 'https://example.com/pdfs/miserables-ch2.pdf'),
(1, 3, 'Chapitre 3', 'https://example.com/pdfs/miserables-ch3.pdf');
