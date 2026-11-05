import { useEffect, useState } from 'react';
import { productosApi, categoriasApi } from '../api';

const VACIO = { nombre: '', descripcion: '', precio: '', stock: '', categoria_id: '' };

export default function Productos() {
  const [lista, setLista] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [filtros, setFiltros] = useState({ buscar: '', categoria_id: '' });
  const [error, setError] = useState('');

  const cargar = () => productosApi.listar(filtros).then(setLista).catch((e) => setError(e.message));

  useEffect(() => { categoriasApi.listar().then(setCategorias).catch((e) => setError(e.message)); }, []);
  useEffect(() => { cargar(); }, [filtros]);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    const datos = {
      ...form,
      precio: Number(form.precio),
      stock: form.stock === '' ? 0 : Number(form.stock),
      categoria_id: Number(form.categoria_id)
    };
    try {
      if (editId) await productosApi.actualizar(editId, datos);
      else await productosApi.crear(datos);
      setForm(VACIO); setEditId(null); cargar();
    } catch (err) { setError(err.message); }
  };

  const editar = (p) => {
    setEditId(p.id);
    setForm({ nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio, stock: p.stock, categoria_id: p.categoria_id });
  };

  const eliminar = async (p) => {
    if (!confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
    setError('');
    try { await productosApi.eliminar(p.id); cargar(); } catch (err) { setError(err.message); }
  };

  return (
    <section>
      <h2>Productos</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={guardar} className="form">
        <input placeholder="Nombre *" value={form.nombre} onChange={cambiar('nombre')} required />
        <input placeholder="Descripción" value={form.descripcion} onChange={cambiar('descripcion')} />
        <input type="number" step="0.01" min="0" placeholder="Precio *" value={form.precio} onChange={cambiar('precio')} required />
        <input type="number" min="0" placeholder="Stock" value={form.stock} onChange={cambiar('stock')} />
        <select value={form.categoria_id} onChange={cambiar('categoria_id')} required>
          <option value="">-- Categoría * --</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" className="sec" onClick={() => { setEditId(null); setForm(VACIO); }}>Cancelar</button>}
      </form>

      <div className="filtros">
        <input placeholder="🔍 Buscar por nombre..." value={filtros.buscar} onChange={(e) => setFiltros({ ...filtros, buscar: e.target.value })} />
        <select value={filtros.categoria_id} onChange={(e) => setFiltros({ ...filtros, categoria_id: e.target.value })}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      <table>
        <thead><tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio (Bs)</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {lista.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><strong>{p.nombre}</strong><br /><small>{p.descripcion}</small></td>
              <td>{p.categoria}</td>
              <td className="num">{Number(p.precio).toFixed(2)}</td>
              <td className={`num ${p.stock < 5 ? 'bajo' : ''}`}>{p.stock}</td>
              <td className="acciones">
                <button className="sec" onClick={() => editar(p)}>Editar</button>
                <button className="peligro" onClick={() => eliminar(p)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {!lista.length && <tr><td colSpan="6" className="vacio">Sin productos</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
