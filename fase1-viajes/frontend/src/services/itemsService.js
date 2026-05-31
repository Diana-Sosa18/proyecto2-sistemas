const KEY = 'items'

export function obtenerItems() {
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

export function guardarItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}