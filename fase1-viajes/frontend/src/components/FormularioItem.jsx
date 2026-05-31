import { useState, useEffect } from 'react'
import { CATEGORIAS } from '../utils/categorias'

const estados = ['pendiente', 'visitado', 'en_progreso']

function FormularioItem({ onAgregar, itemEditando, onEditar, inputRef }) {
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState('playa')
  const [estado, setEstado] = useState('pendiente')
  const [puntuacion, setPuntuacion] = useState('')
  const [notas, setNotas] = useState('')
  const [pais, setPais] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [costoEstimado, setCostoEstimado] = useState('')

  useEffect(() => {
    if (itemEditando) {
      setNombre(itemEditando.nombre)
      setCategoriaId(itemEditando.categoriaId)
      setEstado(itemEditando.estado)
      setPuntuacion(itemEditando.puntuacion ?? '')
      setNotas(itemEditando.notas)
      setPais(itemEditando.atributos.pais || '')
      setCiudad(itemEditando.atributos.ciudad || '')
      setCostoEstimado(itemEditando.atributos.costoEstimado || '')
    }
  }, [itemEditando])

  function limpiarFormulario() {
    setNombre('')
    setCategoriaId('playa')
    setEstado('pendiente')
    setPuntuacion('')
    setNotas('')
    setPais('')
    setCiudad('')
    setCostoEstimado('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim()) return alert('El nombre es obligatorio')

    if (itemEditando) {
      onEditar({
        ...itemEditando,
        nombre,
        categoriaId,
        estado,
        puntuacion: puntuacion === '' ? null : Number(puntuacion),
        notas,
        fechaActividad: new Date().toISOString(),
        atributos: { pais, ciudad, costoEstimado }
      })
    } else {
      onAgregar({
        id: crypto.randomUUID(),
        nombre,
        categoriaId,
        estado,
        puntuacion: puntuacion === '' ? null : Number(puntuacion),
        fechaRegistro: new Date().toISOString(),
        fechaActividad: new Date().toISOString(),
        notas,
        atributos: { pais, ciudad, costoEstimado },
        activo: true
      })
    }

    limpiarFormulario()
  }

  const estiloInput = {
    display: 'block',
    width: '100%',
    margin: '8px 0',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid var(--color-text-secondary)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)'
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h2 style={{ color: 'var(--color-text)', marginBottom: '8px' }}>
        {itemEditando ? '✏️ Editar destino' : '➕ Agregar destino'}
      </h2>

      <input
        ref={inputRef}
        placeholder="Nombre del lugar *"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        style={estiloInput}
      />

      <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} style={estiloInput}>
        {CATEGORIAS.map(c => (
          <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
        ))}
      </select>

      <select value={estado} onChange={e => setEstado(e.target.value)} style={estiloInput}>
        {estados.map(e => <option key={e} value={e}>{e}</option>)}
      </select>

      <input
        placeholder="Puntuación (0-10)"
        type="number"
        min="0"
        max="10"
        value={puntuacion}
        onChange={e => setPuntuacion(e.target.value)}
        style={estiloInput}
      />

      <input
        placeholder="País"
        value={pais}
        onChange={e => setPais(e.target.value)}
        style={estiloInput}
      />

      <input
        placeholder="Ciudad"
        value={ciudad}
        onChange={e => setCiudad(e.target.value)}
        style={estiloInput}
      />

      <input
        placeholder="Costo estimado (USD)"
        type="number"
        value={costoEstimado}
        onChange={e => setCostoEstimado(e.target.value)}
        style={estiloInput}
      />

      <textarea
        placeholder="Notas"
        value={notas}
        onChange={e => setNotas(e.target.value)}
        style={{ ...estiloInput, minHeight: '80px' }}
      />

      <button
        type="submit"
        style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        {itemEditando ? 'Guardar cambios' : 'Agregar destino'}
      </button>
    </form>
  )
}

export default FormularioItem