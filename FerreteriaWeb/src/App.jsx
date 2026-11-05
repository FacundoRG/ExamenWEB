import { useState } from 'react';
import Productos from './components/Productos.jsx';
import Categorias from './components/Categorias.jsx';

export default function App() {
  const [vista, setVista] = useState('productos');

  return (
    <div className="app">
      <header>
        <h1>🔧 Ferretería</h1>
        <nav>
          <button className={vista === 'productos' ? 'activo' : ''} onClick={() => setVista('productos')}>Productos</button>
          <button className={vista === 'categorias' ? 'activo' : ''} onClick={() => setVista('categorias')}>Categorías</button>
          <a href="http://localhost:3000/swagger" target="_blank" rel="noreferrer">Swagger ↗</a>
        </nav>
      </header>
      <main>{vista === 'productos' ? <Productos /> : <Categorias />}</main>
    </div>
  );
}
