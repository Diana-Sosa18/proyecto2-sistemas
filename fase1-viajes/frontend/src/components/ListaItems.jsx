import { useRef } from 'react'
import ItemCard from './ItemCard'

function ListaItems({ items, onEliminar, onEditar, onRegistrar }) {
  const lastItemRef = useRef(null)

  if (items.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-secondary)' }}>
        No hay destinos que coincidan con los filtros.
      </p>
    )
  }

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={index === items.length - 1 ? lastItemRef : null}
        >
          <ItemCard
            item={item}
            onEliminar={onEliminar}
            onEditar={onEditar}
            onRegistrar={onRegistrar}
          />
        </div>
      ))}
    </div>
  )
}

export default ListaItems