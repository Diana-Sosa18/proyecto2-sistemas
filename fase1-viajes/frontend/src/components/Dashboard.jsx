import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts'
import { CATEGORIAS } from '../utils/categorias'

function Dashboard({ items }) {

  const datosUltimos7Dias = useMemo(() => {
    const hoy = new Date()
    const dias = []
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy)
      fecha.setDate(hoy.getDate() - i)
      const fechaStr = fecha.toISOString().split('T')[0]
      const label = fecha.toLocaleDateString('es-GT', { weekday: 'short', day: 'numeric' })
      const cantidad = items.filter(item => item.fechaActividad?.split('T')[0] === fechaStr).length
      dias.push({ dia: label, destinos: cantidad })
    }
    return dias
  }, [items])

  const datosPorCategoria = useMemo(() => {
    return CATEGORIAS.map(cat => ({
      name: `${cat.emoji} ${cat.nombre}`,
      value: items.filter(i => i.categoriaId === cat.id).length,
      color: cat.color
    })).filter(c => c.value > 0)
  }, [items])

  const datosPuntuacion = useMemo(() => {
    return CATEGORIAS.map(cat => {
      const itemsCat = items.filter(i => i.categoriaId === cat.id && i.puntuacion !== null)
      const promedio = itemsCat.length > 0
        ? (itemsCat.reduce((sum, i) => sum + i.puntuacion, 0) / itemsCat.length).toFixed(1)
        : 0
      return { categoria: `${cat.emoji} ${cat.nombre}`, promedio: Number(promedio) }
    }).filter(c => c.promedio > 0)
  }, [items])

  const estiloCard = {
    background: 'var(--color-surface)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  }

  const estiloTitulo = {
    color: 'var(--color-text)',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '12px'
  }

  if (items.length === 0) {
    return (
      <div style={estiloCard}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Agrega destinos para ver las gráficas.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={estiloCard}>
        <p style={estiloTitulo}>📅 Actividad últimos 7 días</p>
        <div style={{ width: '100%', height: 220 }}>
          <BarChart width={620} height={200} data={datosUltimos7Dias}>
            <XAxis dataKey="dia" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="destinos" fill="#0077B6" name="Destinos" />
          </BarChart>
        </div>
      </div>

      <div style={estiloCard}>
        <p style={estiloTitulo}>🗂️ Distribución por categoría</p>
        {datosPorCategoria.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Sin datos.</p>
        ) : (
          <div style={{ width: '100%', height: 220 }}>
            <PieChart width={620} height={200}>
              <Pie data={datosPorCategoria} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {datosPorCategoria.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>

      <div style={estiloCard}>
        <p style={estiloTitulo}>⭐ Puntuación promedio por categoría</p>
        {datosPuntuacion.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Agrega puntuaciones para ver esta gráfica.</p>
        ) : (
          <div style={{ width: '100%', height: 220 }}>
            <LineChart width={620} height={200} data={datosPuntuacion}>
              <XAxis dataKey="categoria" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <YAxis domain={[0, 10]} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="promedio" stroke="#0077B6" name="Promedio" strokeWidth={2} dot={{ fill: '#0077B6' }} />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard