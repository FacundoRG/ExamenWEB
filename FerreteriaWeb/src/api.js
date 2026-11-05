// Cliente para consumir la API REST de la ferretería (documentada en Swagger)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.mensaje || `Error ${res.status}`);
  return data;
}

export const categoriasApi = {
  listar: () => request('/categorias'),
  crear: (c) => request('/categorias', { method: 'POST', body: c }),
  actualizar: (id, c) => request(`/categorias/${id}`, { method: 'PUT', body: c }),
  eliminar: (id) => request(`/categorias/${id}`, { method: 'DELETE' })
};

export const productosApi = {
  listar: (filtros = {}) => {
    const qs = new URLSearchParams(Object.entries(filtros).filter(([, v]) => v)).toString();
    return request(`/productos${qs ? `?${qs}` : ''}`);
  },
  crear: (p) => request('/productos', { method: 'POST', body: p }),
  actualizar: (id, p) => request(`/productos/${id}`, { method: 'PUT', body: p }),
  eliminar: (id) => request(`/productos/${id}`, { method: 'DELETE' })
};
