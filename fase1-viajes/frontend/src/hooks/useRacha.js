import { useMemo } from 'react'

/**
 * Hook de dominio: calcula la racha de días consecutivos
 * en que el usuario registró actividad en sus destinos.
 * @param {Array} items - Lista de items activos
 * @returns {{ racha: number, ultimaActividad: string|null }}
 */
export function useRacha(items) {
  const { racha, ultimaActividad } = useMemo(() => {
    if (!items || items.length === 0) {
      return { racha: 0, ultimaActividad: null }
    }

    // Obtener fechas únicas de actividad
    const fechas = [...new Set(
      items
        .filter(i => i.fechaActividad)
        .map(i => i.fechaActividad.split('T')[0])
    )].sort().reverse()

    if (fechas.length === 0) return { racha: 0, ultimaActividad: null }

    let racha = 1
    for (let i = 0; i < fechas.length - 1; i++) {
      const actual = new Date(fechas[i])
      const anterior = new Date(fechas[i + 1])
      const diff = (actual - anterior) / (1000 * 60 * 60 * 24)
      if (diff === 1) racha++
      else break
    }

    return { racha, ultimaActividad: fechas[0] }
  }, [items])

  return { racha, ultimaActividad }
}