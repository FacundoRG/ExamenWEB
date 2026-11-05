// Especificación OpenAPI 3 (Swagger) de la API de la Ferretería
const idParam = {
  name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del registro'
};
const error = (desc) => ({
  description: desc,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
});

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Ferretería API',
    version: '1.0.0',
    description: 'API RESTful para la gestión de productos y categorías de una ferretería (Node.js + Express + MySQL).'
  },
  servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
  tags: [
    { name: 'Categorías', description: 'CRUD de categorías' },
    { name: 'Productos', description: 'CRUD de productos' }
  ],
  components: {
    schemas: {
      Categoria: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Herramientas manuales' },
          descripcion: { type: 'string', example: 'Martillos, destornilladores, llaves' },
          total_productos: { type: 'integer', example: 2 },
          creado_en: { type: 'string', format: 'date-time' }
        }
      },
      CategoriaInput: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', example: 'Jardinería' },
          descripcion: { type: 'string', example: 'Palas, mangueras, tijeras de podar' }
        }
      },
      Producto: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Martillo de uña 16oz' },
          descripcion: { type: 'string', example: 'Mango de fibra de vidrio' },
          precio: { type: 'number', example: 45.5 },
          stock: { type: 'integer', example: 30 },
          categoria_id: { type: 'integer', example: 1 },
          categoria: { type: 'string', example: 'Herramientas manuales' },
          creado_en: { type: 'string', format: 'date-time' }
        }
      },
      ProductoInput: {
        type: 'object',
        required: ['nombre', 'precio', 'categoria_id'],
        properties: {
          nombre: { type: 'string', example: 'Llave inglesa 10"' },
          descripcion: { type: 'string', example: 'Acero cromo vanadio' },
          precio: { type: 'number', example: 55.0 },
          stock: { type: 'integer', example: 20 },
          categoria_id: { type: 'integer', example: 1 }
        }
      },
      Error: {
        type: 'object',
        properties: { mensaje: { type: 'string', example: 'Mensaje de error' } }
      }
    }
  },
  paths: {
    '/api/categorias': {
      get: {
        tags: ['Categorías'], summary: 'Listar todas las categorías',
        responses: {
          200: { description: 'Lista de categorías', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } } } } }
        }
      },
      post: {
        tags: ['Categorías'], summary: 'Crear una categoría',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriaInput' } } } },
        responses: {
          201: { description: 'Categoría creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
          400: error('Datos inválidos'),
          409: error('Nombre duplicado')
        }
      }
    },
    '/api/categorias/{id}': {
      get: {
        tags: ['Categorías'], summary: 'Obtener una categoría por ID', parameters: [idParam],
        responses: {
          200: { description: 'Categoría encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
          404: error('No encontrada')
        }
      },
      put: {
        tags: ['Categorías'], summary: 'Actualizar una categoría', parameters: [idParam],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriaInput' } } } },
        responses: {
          200: { description: 'Categoría actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
          400: error('Datos inválidos'),
          404: error('No encontrada')
        }
      },
      delete: {
        tags: ['Categorías'], summary: 'Eliminar una categoría', parameters: [idParam],
        responses: {
          204: { description: 'Eliminada' },
          404: error('No encontrada'),
          409: error('La categoría tiene productos asociados')
        }
      }
    },
    '/api/productos': {
      get: {
        tags: ['Productos'], summary: 'Listar productos (con filtros opcionales)',
        parameters: [
          { name: 'categoria_id', in: 'query', schema: { type: 'integer' }, description: 'Filtrar por categoría' },
          { name: 'buscar', in: 'query', schema: { type: 'string' }, description: 'Buscar por nombre' }
        ],
        responses: {
          200: { description: 'Lista de productos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Producto' } } } } }
        }
      },
      post: {
        tags: ['Productos'], summary: 'Crear un producto',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductoInput' } } } },
        responses: {
          201: { description: 'Producto creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Producto' } } } },
          400: error('Datos inválidos o categoría inexistente')
        }
      }
    },
    '/api/productos/{id}': {
      get: {
        tags: ['Productos'], summary: 'Obtener un producto por ID', parameters: [idParam],
        responses: {
          200: { description: 'Producto encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Producto' } } } },
          404: error('No encontrado')
        }
      },
      put: {
        tags: ['Productos'], summary: 'Actualizar un producto', parameters: [idParam],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductoInput' } } } },
        responses: {
          200: { description: 'Producto actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Producto' } } } },
          400: error('Datos inválidos'),
          404: error('No encontrado')
        }
      },
      delete: {
        tags: ['Productos'], summary: 'Eliminar un producto', parameters: [idParam],
        responses: { 204: { description: 'Eliminado' }, 404: error('No encontrado') }
      }
    }
  }
};
