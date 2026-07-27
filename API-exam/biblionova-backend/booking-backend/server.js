const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const chapitreRoutes = require('./routes/chapitreRoutes');
const empruntRoutes = require('./routes/empruntRoutes');
const achatRoutes = require('./routes/achatRoutes');
const favoriRoutes = require('./routes/favoriRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Petite route de test pour vérifier que le serveur tourne
app.get('/', (req, res) => {
  res.json({ message: 'API BooKinG opérationnelle 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chapitres', chapitreRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/achats', achatRoutes);
app.use('/api/favoris', favoriRoutes);

// Gestion des routes inconnues
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
