import { useEffect, useState } from 'react';
import { categoriasApi } from '../api';

const VACIO = { nombre: '', descripcion: '' };

export default function Categorias() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const cargar = () => categoriasApi.listar().then(setLista).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) await categoriasApi.actualizar(editId, form);
      else await categoriasApi.crear(form);
      setForm(VACIO); setEditId(null); cargar();
    } catch (err) { setError(err.message); }
  };

  const editar = (c) => { setEditId(c.id); setForm({ nombre: c.nombre, descripcion: c.descripcion || '' }); };

  const eliminar = async (c) => {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    setError('');
    try { await categoriasApi.eliminar(c.id); cargar(); } catch (err) { setError(err.message); }
  };

  return (
    <section>
      <h2>Categorías</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={guardar} className="form">
        <input placeholder="Nombre *" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        <input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" className="sec" onClick={() => { setEditId(null); setForm(VACIO); }}>Cancelar</button>}
      </form>

      <table>
        <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Productos</th><th></th></tr></thead>
        <tbody>
          {lista.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.nombre}</td><td>{c.descripcion}</td><td>{c.total_productos}</td>
              <td className="acciones">
                <button className="sec" onClick={() => editar(c)}>Editar</button>
                <button className="peligro" onClick={() => eliminar(c)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {!lista.length && <tr><td colSpan="5" className="vacio">Sin categorías</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
