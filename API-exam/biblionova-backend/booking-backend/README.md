# BooKinG - Backend

Backend d'une plateforme de lecture en ligne : catalogue de livres, emprunts,
lecture de chapitres (2 premiers gratuits, suite payante), favoris, et
paiement **simulé** (à remplacer plus tard par Wave si besoin).

## 1. Installation

```bash
cd booking-backend
npm install
cp .env.example .env
```

Puis remplis `.env` avec tes infos MySQL (Railway ou locale) et un `JWT_SECRET`.

## 2. Base de données

Exécute `sql/schema.sql` dans ta base MySQL (MySQL Workbench, phpMyAdmin, ou
CLI Railway). Il crée les tables et insère 3 livres de test avec des chapitres.

## 3. Lancer le serveur

```bash
npm run dev
```

Le serveur tourne sur `http://localhost:3000`.

## 4. Tester avec Thunder Client

### Auth
- `POST /api/auth/register` → body: `{ "nom", "prenom", "email", "password" }`
- `POST /api/auth/login` → body: `{ "email", "password" }` → renvoie un `token`

Pour toutes les routes suivantes, ajoute le header :
`Authorization: Bearer <ton_token>`

### Catalogue (public)
- `GET /api/books` — liste des livres (query params: `?search=` et `?categorie_id=`)
- `GET /api/books/:id` — détail d'un livre
- `GET /api/books/categories` — liste des catégories
- `GET /api/books/:bookId/chapitres` — liste des chapitres (sans contenu)

### Emprunts
- `POST /api/emprunts` → body: `{ "book_id": 1 }`
- `GET /api/emprunts` — mes emprunts en cours
- `GET /api/emprunts/historique` — historique
- `PUT /api/emprunts/:id/terminer`

### Lecture d'un chapitre (le cœur du système)
- `GET /api/chapitres/:id/lire`
  - Si chapitre 1 ou 2 → contenu renvoyé directement (si le livre est emprunté)
  - Si chapitre 3+ et pas d'achat → réponse `402 Paiement requis`
  - Si chapitre 3+ et achat payé → contenu renvoyé

### Paiement (simulé)
- `POST /api/achats/simuler` → body: `{ "book_id": 1, "montant": 500 }`
  → passe le statut à "paye", débloque tous les chapitres du livre
- `GET /api/achats` — mes achats

### Favoris
- `GET /api/favoris`
- `POST /api/favoris` → body: `{ "book_id": 1 }`
- `DELETE /api/favoris/:bookId`

### Profil
- `GET /api/users/me`
- `PUT /api/users/me` → body: `{ "nom", "prenom", "avatar" }`

## 5. Scénario de test complet (ordre logique)

1. `POST /api/auth/register` → récupère le token
2. `GET /api/books` → note l'id d'un livre (ex: 1, "Les Misérables")
3. `POST /api/emprunts` avec `book_id: 1`
4. `GET /api/books/1/chapitres` → note l'id du chapitre 3
5. `GET /api/chapitres/1/lire` (chapitre 1) → devrait marcher direct
6. `GET /api/chapitres/3/lire` (chapitre 3) → devrait renvoyer 402
7. `POST /api/achats/simuler` avec `book_id: 1, montant: 500`
8. Refaire `GET /api/chapitres/3/lire` → devrait marcher maintenant

## Notes

- Le paiement est **simulé** : aucune vraie transaction Wave n'est faite.
  L'architecture (route `/api/achats/simuler`) est volontairement isolée pour
  pouvoir être remplacée facilement plus tard par un vrai appel à
  `https://api.wave.com/v1/checkout/sessions` + webhook, sans toucher au reste
  du code (emprunts, chapitres, etc.).
