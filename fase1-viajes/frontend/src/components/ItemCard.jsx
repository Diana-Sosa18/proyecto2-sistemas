import { memo } from 'react'
import { CATEGORIAS } from '../utils/categorias'
import { formatearFecha, formatearPuntuacion } from '../utils/formatters'

function ItemCard({ item, onEliminar, onEditar, onRegistrar }) {
  const categoria = CATEGORIAS.find(c => c.id === item.categoriaId)

  return (
    <div style={{
      background: 'var(--color-surface)',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '8px',
      borderLeft: `4px solid ${categoria?.color || '#0077B6'}`
    }}>
      <h3 style={{ color: 'var(--color-text)' }}>
        {categoria?.emoji} {item.nombre}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        <strong>Categoría:</strong> {categoria?.nombre || item.categoriaId}
      </p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        <strong>Estado:</strong> {item.estado}
      </p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        <strong>Puntuación:</strong> {formatearPuntuacion(item.puntuacion)}
      </p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        <strong>País:</strong> {item.atributos?.pais || '—'}
      </p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        <strong>Ciudad:</strong> {item.atributos?.ciudad || '—'}
      </p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        <strong>Costo estimado:</strong> {item.atributos?.costoEstimado ? `$${item.atributos.costoEstimado}` : '—'}
      </p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        <strong>Notas:</strong> {item.notas || '—'}
      </p>
      {item.atributos?.ultimoRegistro && (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          <strong>Último registro:</strong> {item.atributos.ultimoRegistro}
        </p>
      )}
      <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
        Registrado: {formatearFecha(item.fechaRegistro)}
      </p>

      <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onEditar(item)}
          style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--color-primary)', background: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
        >
          Editar
        </button>
        <button
          onClick={() => onRegistrar(item.id, `Actividad registrada el ${new Date().toLocaleDateString()}`)}
          style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--color-text-secondary)', background: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
        >
          + Registro
        </button>
        <button
          onClick={() => onEliminar(item.id)}
          style={{ padding: '4px 12px', borderRadius: '4px', border: 'none', background: 'var(--color-danger)', color: 'white', cursor: 'pointer' }}
        >
          Archivar
        </button>
      </div>
    </div>
  )
}

export default memo(ItemCard)