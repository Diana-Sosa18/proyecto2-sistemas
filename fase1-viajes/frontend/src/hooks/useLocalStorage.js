import { useState, useEffect } from 'react'

/**
 * Hook para sincronizar estado con LocalStorage.
 * @param {string} key - Clave en LocalStorage
 * @param {*} valorInicial - Valor inicial si no existe en LS
 * @returns {[*, Function]} - [valor, setValor]
 */
export function useLocalStorage(key, valorInicial) {
  const [valor, setValor] = useState(
    () => {
      const guardado = localStorage.getItem(key)
      return guardado ? JSON.parse(guardado) : valorInicial
    }
  )

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(valor))
  }, [key, valor])

  return [valor, setValor]
}