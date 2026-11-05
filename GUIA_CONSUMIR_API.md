# Guía: cómo levantar y consumir la API de la Ferretería

## 0. Requisitos
- **Node.js 18+** (`node -v`)
- **MySQL 8** (MySQL Server + MySQL Workbench, o XAMPP)
- **Visual Studio Code**

## 1. Clonar y elegir rama
```bash
git clone https://github.com/FacundoRG/ExamenWEB.git
cd ExamenWEB
git checkout api     # rama con FerreteriaAPI/
git checkout web     # rama con FerreteriaWeb/
```
Abre cada carpeta en VS Code: `code FerreteriaAPI` y `code FerreteriaWeb`.

## 2. Crear la base de datos
En MySQL Workbench: *File → Open SQL Script* → `FerreteriaAPI/database/ferreteria.sql` → ejecutar (⚡).
O por consola:
```bash
mysql -u root -p < FerreteriaAPI/database/ferreteria.sql
```
Se crea `ferreteria_db` con las tablas `categorias` y `productos` (relación 1 a N) y datos de ejemplo.

## 3. Levantar la API (terminal de VS Code: `Ctrl + ñ`)
```bash
cd FerreteriaAPI
npm install
cp .env.example .env     # en Windows: copy .env.example .env
```
Edita `.env` con tu usuario/contraseña de MySQL:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_clave
DB_NAME=ferreteria_db
```
```bash
npm run dev
```
Debe mostrar: `API escuchando en http://localhost:3000` y `Conectado a MySQL OK`.

## 4. Consumir la API desde Swagger
1. Abre **http://localhost:3000/swagger**
2. Verás dos grupos: **Categorías** y **Productos**.
3. Haz clic en un endpoint → **Try it out** → completa los datos → **Execute**.
4. Abajo aparece la *Response* (código HTTP y JSON) y el comando `curl` equivalente.

Ejemplo – crear un producto (`POST /api/productos`), cuerpo:
```json
{
  "nombre": "Llave inglesa 10\"",
  "descripcion": "Acero cromo vanadio",
  "precio": 55.0,
  "stock": 20,
  "categoria_id": 1
}
```
Respuesta `201 Created` con el producto creado (incluye el nombre de la categoría).

La especificación OpenAPI en JSON está en **http://localhost:3000/swagger.json** (sirve para importarla en Postman: *Import → Link*).

## 5. Endpoints

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/categorias` | Lista categorías (con total de productos) | 200 |
| GET | `/api/categorias/{id}` | Obtiene una categoría | 200, 404 |
| POST | `/api/categorias` | Crea `{ nombre, descripcion }` | 201, 400, 409 |
| PUT | `/api/categorias/{id}` | Actualiza | 200, 400, 404 |
| DELETE | `/api/categorias/{id}` | Elimina (si no tiene productos) | 204, 404, 409 |
| GET | `/api/productos?categoria_id=&buscar=` | Lista productos con filtros opcionales | 200 |
| GET | `/api/productos/{id}` | Obtiene un producto | 200, 404 |
| POST | `/api/productos` | Crea `{ nombre, descripcion, precio, stock, categoria_id }` | 201, 400 |
| PUT | `/api/productos/{id}` | Actualiza | 200, 400, 404 |
| DELETE | `/api/productos/{id}` | Elimina | 204, 404 |

Los errores siempre responden JSON: `{ "mensaje": "..." }`.

## 6. Consumir la API desde otras herramientas
**curl:**
```bash
curl http://localhost:3000/api/productos?buscar=martillo
curl -X POST http://localhost:3000/api/categorias -H "Content-Type: application/json" -d "{\"nombre\":\"Jardinería\"}"
```
**JavaScript (así lo hace el frontend, `FerreteriaWeb/src/api.js`):**
```js
const res = await fetch('http://localhost:3000/api/productos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Serrucho', precio: 70, stock: 5, categoria_id: 1 })
});
const producto = await res.json();
```

## 7. Levantar el frontend React (otra terminal, con la API encendida)
```bash
cd FerreteriaWeb
npm install
npm run dev
```
Abre **http://localhost:5173**. Desde ahí se listan, crean, editan y eliminan productos y categorías; el botón **Swagger ↗** abre la documentación.
Si la API corre en otra URL, crea `FerreteriaWeb/.env` con `VITE_API_URL=http://host:puerto/api`.

## 8. Problemas comunes
| Síntoma | Causa / solución |
|---|---|
| `No se pudo conectar a MySQL: ECONNREFUSED` | MySQL no está encendido o el puerto es otro |
| `ER_ACCESS_DENIED_ERROR` | Usuario/contraseña incorrectos en `.env` |
| `ER_BAD_DB_ERROR` | No ejecutaste `ferreteria.sql` |
| La web muestra "Failed to fetch" | La API no está corriendo en el puerto 3000 |
| 409 al borrar categoría | Tiene productos asociados: bórralos o muévelos primero |
