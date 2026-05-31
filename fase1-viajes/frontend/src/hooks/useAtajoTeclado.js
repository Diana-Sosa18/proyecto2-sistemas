import { useEffect } from 'react'

/**
 * Hook para registrar atajos de teclado con cleanup automático.
 * @param {string} tecla - Tecla a escuchar (ej: 't', 'n')
 * @param {Function} callback - Función a ejecutar
 * @param {{ ctrl?: boolean, ignorarInputs?: boolean }} opciones
 */
export function useAtajoTeclado(tecla, callback, opciones = {}) {
  const { ctrl = false, ignorarInputs = true } = opciones

  useEffect(() => {
    function handler(e) {
      if (ignorarInputs) {
        const tag = e.target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
      }
      if (ctrl && !e.ctrlKey) return
      if (e.key.toLowerCase() === tecla.toLowerCase()) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [tecla, callback, ctrl, ignorarInputs])
}