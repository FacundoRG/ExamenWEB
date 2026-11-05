-- =========================================================
--  Base de datos: ferreteria_db
--  Ejecutar en MySQL Workbench o: mysql -u root -p < ferreteria.sql
-- =========================================================
DROP DATABASE IF EXISTS ferreteria_db;
CREATE DATABASE ferreteria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ferreteria_db;

CREATE TABLE categorias (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(100) NOT NULL UNIQUE,
  descripcion  VARCHAR(255),
  creado_en    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(150) NOT NULL,
  descripcion   VARCHAR(255),
  precio        DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock         INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria_id  INT NOT NULL,
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO categorias (nombre, descripcion) VALUES
 ('Herramientas manuales', 'Martillos, destornilladores, llaves'),
 ('Herramientas eléctricas', 'Taladros, sierras, amoladoras'),
 ('Tornillería', 'Tornillos, clavos, tuercas y arandelas'),
 ('Pinturas', 'Pinturas, brochas y rodillos'),
 ('Electricidad', 'Cables, enchufes, focos');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES
 ('Martillo de uña 16oz', 'Mango de fibra de vidrio', 45.50, 30, 1),
 ('Destornillador Phillips #2', 'Punta imantada', 15.00, 80, 1),
 ('Taladro percutor 600W', 'Incluye maletín', 380.00, 10, 2),
 ('Caja de tornillos 1" x100', 'Tornillo para madera', 12.00, 150, 3),
 ('Pintura látex blanca 1 gal', 'Uso interior', 95.00, 25, 4),
 ('Cable eléctrico #12 (metro)', 'Cobre, 600V', 6.50, 500, 5);
