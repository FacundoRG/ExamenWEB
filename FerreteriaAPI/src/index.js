require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());            // Permite que el frontend React (otro puerto) consuma la API
app.use(express.json());    // Lee cuerpos JSON

// Documentación Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => res.json(swaggerSpec));

// Rutas
app.get('/', (req, res) => res.json({ api: 'Ferretería API', docs: '/swagger' }));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/productos', require('./routes/productos.routes'));

// 404
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));

// Manejo de errores (incluye errores de MySQL)
app.use((err, req, res, next) => {
  console.error(err.code || err);
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe un registro con ese nombre' });
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ mensaje: 'La categoría indicada no existe' });
  if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ mensaje: 'No se puede eliminar: la categoría tiene productos' });
  if (['ECONNREFUSED', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR'].includes(err.code))
    return res.status(503).json({ mensaje: 'No hay conexión con la base de datos', detalle: err.code });
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(PORT, async () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
  console.log(`Swagger en      http://localhost:${PORT}/swagger`);
  try { await pool.query('SELECT 1'); console.log('Conectado a MySQL OK'); }
  catch (e) { console.error('No se pudo conectar a MySQL:', e.code, '- revisa el archivo .env'); }
});
