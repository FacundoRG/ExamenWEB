const pool = require('../config/db');

const SELECT_BASE = `
  SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id,
         c.nombre AS categoria, p.creado_en
    FROM productos p
    INNER JOIN categorias c ON c.id = p.categoria_id`;

function validar(body) {
  const { nombre, precio, stock, categoria_id } = body;
  if (!nombre || !String(nombre).trim()) return 'El nombre es obligatorio';
  if (precio === undefined || precio === '' || isNaN(precio) || Number(precio) < 0) return 'El precio debe ser un número >= 0';
  if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) return 'El stock debe ser un entero >= 0';
  if (!categoria_id) return 'La categoría es obligatoria';
  return null;
}

// GET /api/productos?categoria_id=1&buscar=martillo
exports.listar = async (req, res, next) => {
  try {
    const filtros = [];
    const params = [];
    if (req.query.categoria_id) { filtros.push('p.categoria_id = ?'); params.push(req.query.categoria_id); }
    if (req.query.buscar) { filtros.push('p.nombre LIKE ?'); params.push(`%${req.query.buscar}%`); }
    const where = filtros.length ? ' WHERE ' + filtros.join(' AND ') : '';
    const [rows] = await pool.query(SELECT_BASE + where + ' ORDER BY p.nombre', params);
    res.json(rows);
  } catch (err) { next(err); }
};

// GET /api/productos/:id
exports.obtener = async (req, res, next) => {
  try {
    const [rows] = await pool.query(SELECT_BASE + ' WHERE p.id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// POST /api/productos
exports.crear = async (req, res, next) => {
  try {
    const error = validar(req.body);
    if (error) return res.status(400).json({ mensaje: error });
    const { nombre, descripcion, precio, stock = 0, categoria_id } = req.body;
    const [r] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES (?, ?, ?, ?, ?)',
      [String(nombre).trim(), descripcion || null, precio, stock, categoria_id]
    );
    const [rows] = await pool.query(SELECT_BASE + ' WHERE p.id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

// PUT /api/productos/:id
exports.actualizar = async (req, res, next) => {
  try {
    const error = validar(req.body);
    if (error) return res.status(400).json({ mensaje: error });
    const { nombre, descripcion, precio, stock = 0, categoria_id } = req.body;
    const [r] = await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?',
      [String(nombre).trim(), descripcion || null, precio, stock, categoria_id, req.params.id]
    );
    if (!r.affectedRows) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    const [rows] = await pool.query(SELECT_BASE + ' WHERE p.id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// DELETE /api/productos/:id
exports.eliminar = async (req, res, next) => {
  try {
    const [r] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.status(204).end();
  } catch (err) { next(err); }
};
