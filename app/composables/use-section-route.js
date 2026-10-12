import { computed, reactive } from 'vue'
import { places } from '../data/places-obj'

const selecciones = reactive({})

export function useSeleccionLugar(placeId) {
  function obtenerSeleccion() {
    const clave = String(placeId.value)

    if (!selecciones[clave]) {
      selecciones[clave] = {
        rutas: [],
        restaurantes: [],
      }
    }

    return selecciones[clave]
  }

  const rutasSeleccionadasIds = computed({
    get: () => obtenerSeleccion().rutas,
    set: (valor) => {
      obtenerSeleccion().rutas = valor
    },
  })

  const restaurantesSeleccionadosIds = computed({
    get: () => obtenerSeleccion().restaurantes,
    set: (valor) => {
      obtenerSeleccion().restaurantes = valor
    },
  })

  const lugar = computed(() =>
    places.find((item) => item.id === placeId.value)
  )

  const rutasSeleccionadas = computed(() =>
    (lugar.value?.routes ?? []).filter((ruta) =>
      rutasSeleccionadasIds.value.includes(ruta.id)
    )
  )

  const restaurantesSeleccionados = computed(() =>
    (lugar.value?.restaurants ?? []).filter((restaurante) =>
      restaurantesSeleccionadosIds.value.includes(restaurante.id)
    )
  )

  const totalRutas = computed(() =>
    rutasSeleccionadas.value.reduce(
      (suma, ruta) => suma + (Number(ruta.price) || 0),
      0
    )
  )

  const totalRestaurantes = computed(() =>
    restaurantesSeleccionados.value.reduce(
      (suma, restaurante) =>
        suma + (Number(restaurante.price) || 0),
      0
    )
  )

  const total = computed(() =>
    totalRutas.value + totalRestaurantes.value
  )

  return {
    rutasSeleccionadasIds,
    restaurantesSeleccionadosIds,
    rutasSeleccionadas,
    restaurantesSeleccionados,
    totalRutas,
    totalRestaurantes,
    total,
  }
}