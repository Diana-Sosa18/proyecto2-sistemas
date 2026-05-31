import { useReducer, useEffect, useRef, useMemo, useCallback } from 'react'
import { useStorage } from './context/StorageProvider'
import { useTema } from './context/ThemeProvider'
import { itemsReducer, initialState } from './reducers/itemsReducer'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAtajoTeclado } from './hooks/useAtajoTeclado'
import { useRacha } from './hooks/useRacha'
import FormularioItem from './components/FormularioItem'
import ListaItems from './components/ListaItems'
import Dashboard from './components/Dashboard'
import Filtros from './components/Filtros'

function App() {
  const { modo, setModo, obtenerItems, guardarItem, eliminarItem } = useStorage()
  const { tema, toggleTema } = useTema()
  const [state, dispatch] = useReducer(itemsReducer, initialState)
  const { lista, filtroCategoria, filtroEstado, busqueda } = state

  const inputRef = useRef(null)
  const intervalRef = useRef(null)

  // Custom hooks
  const [hora, setHora] = useLocalStorage('hora', new Date().toLocaleTimeString())
  const { racha, ultimaActividad } = useRacha(lista.filter(i => i.activo))

  // Atajos de teclado con custom hook
  useAtajoTeclado('t', toggleTema, { ignorarInputs: true })
  useAtajoTeclado('n', () => inputRef.current?.focus(), { ctrl: true, ignorarInputs: false })

  useEffect(() => {
    cargarItems()
  }, [modo])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setHora(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  async function cargarItems() {
    const data = await obtenerItems()
    dispatch({ type: 'HIDRATAR', payload: data })
  }

  const handleAgregar = useCallback(async (nuevoItem) => {
    await guardarItem(nuevoItem)
    dispatch({ type: 'AGREGAR', payload: nuevoItem })
    inputRef.current?.focus()
  }, [guardarItem])

  const handleEditar = useCallback(async (itemModificado) => {
    await guardarItem(itemModificado)
    dispatch({ type: 'CAMBIAR_ESTADO', payload: {
      id: itemModificado.id,
      estado: itemModificado.estado,
      fechaActividad: new Date().toISOString()
    }})
    await cargarItems()
  }, [guardarItem])

  const handleEliminar = useCallback(async (id) => {
    await eliminarItem(id)
    dispatch({ type: 'ELIMINAR', payload: id })
  }, [eliminarItem])

  const handleRegistrarActividad = useCallback((itemId, notas) => {
    dispatch({
      type: 'REGISTRAR_ACTIVIDAD',
      payload: { itemId, notas, fecha: new Date().toISOString() }
    })
  }, [])

  const listaFiltrada = useMemo(() => {
    return lista
      .filter(i => i.activo)
      .filter(i => filtroCategoria === 'todas' || i.categoriaId === filtroCategoria)
      .filter(i => filtroEstado === 'todos' || i.estado === filtroEstado)
      .filter(i => i.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  }, [lista, filtroCategoria, filtroEstado, busqueda])

  const estadisticas = useMemo(() => {
    const activos = lista.filter(i => i.activo)
    return {
      total: activos.length,
      visitados: activos.filter(i => i.estado === 'visitado').length,
      pendientes: activos.filter(i => i.estado === 'pendiente').length,
      promedio: activos.filter(i => i.puntuacion !== null).length > 0
        ? (activos.reduce((sum, i) => sum + (i.puntuacion || 0), 0) / activos.filter(i => i.puntuacion !== null).length).toFixed(1)
        : '—'
    }
  }, [lista])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-text)' }}>🌍 Mis Viajes</h1>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            🔥 Racha: {racha} día{racha !== 1 ? 's' : ''} consecutivo{racha !== 1 ? 's' : ''}
            {ultimaActividad && ` · Última actividad: ${new Date(ultimaActividad).toLocaleDateString('es-GT')}`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{hora}</span>
          <button
            onClick={toggleTema}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--color-primary)', background: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
          >
            {tema === 'claro' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>
          <select
            value={modo}
            onChange={e => setModo(e.target.value)}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--color-primary)', background: 'var(--color-surface)', color: 'var(--color-text)', cursor: 'pointer' }}
          >
            <option value="local">💾 Local</option>
            <option value="api">🌐 API</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '1rem' }}>
        {[
          { label: 'Total', value: estadisticas.total },
          { label: 'Visitados', value: estadisticas.visitados },
          { label: 'Pendientes', value: estadisticas.pendientes },
          { label: 'Puntuación', value: estadisticas.promedio }
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--color-surface)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '500', color: 'var(--color-primary)' }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
        Presiona <kbd>T</kbd> para cambiar tema · <kbd>Ctrl+N</kbd> para nuevo destino
      </p>

      <FormularioItem
        onAgregar={handleAgregar}
        onEditar={handleEditar}
        inputRef={inputRef}
      />

      <Filtros
        filtroCategoria={filtroCategoria}
        filtroEstado={filtroEstado}
        busqueda={busqueda}
        dispatch={dispatch}
      />

      <h2 style={{ margin: '1rem 0', color: 'var(--color-text)' }}>
        Destinos ({listaFiltrada.length})
      </h2>

      <ListaItems
        items={listaFiltrada}
        onEliminar={handleEliminar}
        onEditar={handleEditar}
        onRegistrar={handleRegistrarActividad}
      />

      <h2 style={{ margin: '1.5rem 0 1rem', color: 'var(--color-text)' }}>📊 Dashboard</h2>
      <Dashboard items={listaFiltrada} />

    </div>
  )
}

export default App