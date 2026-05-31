export const initialState = {
  lista: [],
  filtroCategoria: 'todas',
  filtroEstado: 'todos',
  busqueda: '',
}

export function itemsReducer(state, action) {
  switch (action.type) {

    case 'HIDRATAR':
      return { ...state, lista: action.payload }

    case 'AGREGAR':
      return { ...state, lista: [...state.lista, action.payload] }

    case 'ELIMINAR':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload
            ? { ...item, activo: false }
            : item
        )
      }

    case 'CAMBIAR_ESTADO':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.id
            ? { ...item, estado: action.payload.estado, fechaActividad: action.payload.fechaActividad }
            : item
        )
      }

    case 'FILTRAR':
      return { ...state, ...action.payload }

    case 'LIMPIAR_FILTROS':
      return {
        ...state,
        filtroCategoria: 'todas',
        filtroEstado: 'todos',
        busqueda: ''
      }

    case 'REGISTRAR_ACTIVIDAD':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.itemId
            ? {
                ...item,
                fechaActividad: action.payload.fecha,
                atributos: {
                  ...item.atributos,
                  ultimoRegistro: action.payload.notas
                }
              }
            : item
        )
      }

    default:
      return state
  }
}