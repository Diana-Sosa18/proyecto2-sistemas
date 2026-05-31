export function formatearFecha(isoString) {
  return new Date(isoString).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatearPuntuacion(puntuacion) {
  if (puntuacion === null) return 'Sin puntuación'
  return `${puntuacion}/10`
}