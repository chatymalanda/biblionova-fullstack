# 📚 Documentation API - BiblioNova

## Présentation

Cette documentation présente les différents endpoints de l'API Backend de **BiblioNova**.

L'API permet la communication entre le frontend et le backend pour gérer les utilisateurs, les livres et les réservations.

---

# 🔗 URL du Backend

```text
https://votre-backend.onrender.com
```

---

# 🔐 Authentification

## 1. Inscription utilisateur

### Méthode

```http
POST /api/auth/register
```

### Description

Permet de créer un nouveau compte utilisateur.

### Body

```json
{
  "name": "Malanda Chaty",
  "email": "chaty@gmail.com",
  "password": "123456"
}
```

### Réponse

```json
{
  "message": "Utilisateur créé avec succès"
}
```

---

## 2. Connexion utilisateur

### Méthode

```http
POST /api/auth/login
```

### Description

Permet à un utilisateur de se connecter.

### Body

```json
{
  "email": "chaty@gmail.com",
  "password": "123456"
}
```

### Réponse

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Malanda Chaty"
  }
}
```

---

# 📚 Gestion des livres

## 3. Afficher tous les livres

### Méthode

```http
GET /api/books
```

### Description

Retourne la liste des livres disponibles.

### Réponse

```json
[
 {
  "id":1,
  "title":"Le Petit Prince",
  "author":"Antoine de Saint-Exupéry"
 }
]
```

---

## 4. Ajouter un livre

### Méthode

```http
POST /api/books
```

### Description

Ajoute un nouveau livre dans la bibliothèque.

### Body

```json
{
 "title":"Livre exemple",
 "author":"Auteur exemple",
 "category":"Roman"
}
```

---

## 5. Modifier un livre

### Méthode

```http
PUT /api/books/:id
```

### Description

Met à jour les informations d'un livre.

---

## 6. Supprimer un livre

### Méthode

```http
DELETE /api/books/:id
```

### Description

Supprime un livre.

---

# 📅 Gestion des réservations

## 7. Créer une réservation

### Méthode

```http
POST /api/reservations
```

### Description

Permet à un utilisateur de réserver un livre.

### Body

```json
{
 "userId":1,
 "bookId":5
}
```

---

## 8. Voir les réservations

### Méthode

```http
GET /api/reservations
```

### Description

Retourne toutes les réservations.

---

# ⚠️ Codes de réponse HTTP

| Code | Signification              |
| ---- | -------------------------- |
| 200  | Requête réussie            |
| 201  | Création réussie           |
| 400  | Erreur de données envoyées |
| 401  | Non authentifié            |
| 404  | Ressource introuvable      |
| 500  | Erreur serveur             |

---

# 🛠 Technologies API

* Node.js
* Express.js
* Base de données
* JWT Authentication
* REST API

---

# 👥 Équipe

* Malanda Chaty
* Amadou Ndiaye
* Badinga Ruchmond
