import { createContext, useContext, useState } from 'react'

const StorageContext = createContext()

const API_URL = 'http://localhost:3000/api/items'

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(
    () => localStorage.getItem('modo') || 'local'
  )

  function setModo(nuevoModo) {
    localStorage.setItem('modo', nuevoModo)
    setModoState(nuevoModo)
  }

  async function obtenerItems() {
    if (modo === 'api') {
      const res = await fetch(API_URL)
      return await res.json()
    } else {
      return JSON.parse(localStorage.getItem('items') || '[]')
        .filter(i => i.activo)
    }
  }

  async function guardarItem(item) {
    if (modo === 'api') {
      // Si tiene id y ya existe, actualiza. Si no, crea.
      const items = await obtenerItems()
      const existe = items.find(i => i.id === item.id)

      if (existe) {
        await fetch(`${API_URL}/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
      }
    } else {
      const items = JSON.parse(localStorage.getItem('items') || '[]')
      const existe = items.find(i => i.id === item.id)

      if (existe) {
        const actualizados = items.map(i => i.id === item.id ? item : i)
        localStorage.setItem('items', JSON.stringify(actualizados))
      } else {
        localStorage.setItem('items', JSON.stringify([...items, item]))
      }
    }
  }

  async function eliminarItem(id) {
    if (modo === 'api') {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    } else {
      const items = JSON.parse(localStorage.getItem('items') || '[]')
      const actualizados = items.map(i =>
        i.id === id ? { ...i, activo: false } : i
      )
      localStorage.setItem('items', JSON.stringify(actualizados))
    }
  }

  return (
    <StorageContext.Provider value={{ modo, setModo, obtenerItems, guardarItem, eliminarItem }}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  return useContext(StorageContext)
}