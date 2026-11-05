const pool = require('../config/db');

// GET /api/categorias
exports.listar = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(p.id) AS total_productos
         FROM categorias c LEFT JOIN productos p ON p.categoria_id = c.id
        GROUP BY c.id ORDER BY c.nombre`
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// GET /api/categorias/:id
exports.obtener = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// POST /api/categorias
exports.crear = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre || !String(nombre).trim()) return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    const [r] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [String(nombre).trim(), descripcion || null]
    );
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

// PUT /api/categorias/:id
exports.actualizar = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre || !String(nombre).trim()) return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    const [r] = await pool.query(
      'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
      [String(nombre).trim(), descripcion || null, req.params.id]
    );
    if (!r.affectedRows) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// DELETE /api/categorias/:id
exports.eliminar = async (req, res, next) => {
  try {
    const [r] = await pool.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.status(204).end();
  } catch (err) { next(err); }
};
