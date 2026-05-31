import { CATEGORIAS } from '../utils/categorias'

const estados = ['todos', 'pendiente', 'visitado', 'en_progreso']

function Filtros({ filtroCategoria, filtroEstado, busqueda, dispatch }) {

  const estiloInput = {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid var(--color-text-secondary)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '13px'
  }

  return (
    <div style={{
      background: 'var(--color-surface)',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      alignItems: 'center'
    }}>
      <input
        placeholder="🔍 Buscar destino..."
        value={busqueda}
        onChange={e => dispatch({ type: 'FILTRAR', payload: { busqueda: e.target.value } })}
        style={{ ...estiloInput, minWidth: '180px' }}
      />

      <select
        value={filtroCategoria}
        onChange={e => dispatch({ type: 'FILTRAR', payload: { filtroCategoria: e.target.value } })}
        style={estiloInput}
      >
        <option value="todas">🗂️ Todas las categorías</option>
        {CATEGORIAS.map(c => (
          <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
        ))}
      </select>

      <select
        value={filtroEstado}
        onChange={e => dispatch({ type: 'FILTRAR', payload: { filtroEstado: e.target.value } })}
        style={estiloInput}
      >
        {estados.map(e => (
          <option key={e} value={e}>{e === 'todos' ? '📋 Todos los estados' : e}</option>
        ))}
      </select>

      <button
        onClick={() => dispatch({ type: 'LIMPIAR_FILTROS' })}
        style={{
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid var(--color-danger)',
          background: 'none',
          color: 'var(--color-danger)',
          cursor: 'pointer',
          fontSize: '13px'
        }}
      >
        ✕ Limpiar filtros
      </button>
    </div>
  )
}

export default Filtros