import { computed } from 'vue'
import { useState } from '#app'
import { places } from '../data/places-obj'

export function usePlaceSelection(placeId) {
  const selections = useState('place-selections', () => ({}))

  function getSelection() {
    const key = String(placeId.value)

    if (!selections.value[key]) {
      selections.value[key] = {
        routes: [],
        restaurants: [],
      }
    }

    return selections.value[key]
  }

  const selectedRouteIds = computed({
    get: () => getSelection().routes,
    set: (value) => {
      getSelection().routes = value
    },
  })

  const selectedRestaurantIds = computed({
    get: () => getSelection().restaurants,
    set: (value) => {
      getSelection().restaurants = value
    },
  })

  const place = computed(() =>
    places.find((item) => item.id === Number(placeId.value))
  )

  const selectedRoutes = computed(() =>
    (place.value?.routes ?? []).filter((route) =>
      selectedRouteIds.value.includes(route.id)
    )
  )

  const selectedRestaurants = computed(() =>
    (place.value?.restaurants ?? []).filter((restaurant) =>
      selectedRestaurantIds.value.includes(restaurant.id)
    )
  )

  const routesTotal = computed(() =>
    selectedRoutes.value.reduce(
      (sum, route) => sum + (Number(route.price) || 0),
      0
    )
  )

  const restaurantsTotal = computed(() =>
    selectedRestaurants.value.reduce(
      (sum, restaurant) => sum + (Number(restaurant.price) || 0),
      0
    )
  )

  const total = computed(() =>
    routesTotal.value + restaurantsTotal.value
  )

  return {
    selectedRouteIds,
    selectedRestaurantIds,
    selectedRoutes,
    selectedRestaurants,
    routesTotal,
    restaurantsTotal,
    total,
  }
}