const db = require('../config/db');

const BookModel = {
  async findAll({ search, categorie_id } = {}) {
    let sql = `
      SELECT b.*, c.nom AS categorie_nom
      FROM books b
      LEFT JOIN categories c ON b.categorie_id = c.id
      WHERE 1 = 1
    `;
    const params = [];

    if (search) {
      sql += ' AND (b.titre LIKE ? OR b.auteur LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (categorie_id) {
      sql += ' AND b.categorie_id = ?';
      params.push(categorie_id);
    }

    sql += ' ORDER BY b.created_at DESC';
    const [rows] = await db.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT b.*, c.nom AS categorie_nom
       FROM books b
       LEFT JOIN categories c ON b.categorie_id = c.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  },

  async create({ titre, auteur, annee, description, nb_pages, image_url, categorie_id }) {
    const [result] = await db.query(
      `INSERT INTO books (titre, auteur, annee, description, nb_pages, image_url, categorie_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titre, auteur, annee, description, nb_pages, image_url, categorie_id]
    );
    return result.insertId;
  },

  async update(id, { titre, auteur, annee, description, nb_pages, image_url, categorie_id }) {
    await db.query(
      `UPDATE books SET titre=?, auteur=?, annee=?, description=?, nb_pages=?, image_url=?, categorie_id=?
       WHERE id = ?`,
      [titre, auteur, annee, description, nb_pages, image_url, categorie_id, id]
    );
  },

  async remove(id) {
    await db.query('DELETE FROM books WHERE id = ?', [id]);
  },

  async findAllCategories() {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY nom');
    return rows;
  }
};

module.exports = BookModel;
