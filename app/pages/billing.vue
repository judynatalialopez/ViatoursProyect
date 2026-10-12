<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'
import { places } from '../data/places-obj'
import { usePlaceSelection } from '../composables/use-place-selection'

const paginaActual = useRoute()

const placeId = computed(() => {
  const parametro = paginaActual.query.placeId
  const id = Array.isArray(parametro) ? parametro[0] : parametro

  return Number(id)
})

const place = computed(() =>
  places.find((lugar) => lugar.id === placeId.value)
)

const {
  selectedRoutes,
  selectedRestaurants,
  routesTotal,
  restaurantsTotal,
  total,
} = usePlaceSelection(placeId)

// Las claves incluyen el tipo para evitar que un recorrido
// y un restaurante con el mismo ID se confundan.
const selectedStops = computed(() => [
  ...selectedRoutes.value.map((route) => ({
    id: `route-${route.id}`,
    image: route.image_card,
    title: route.title_card,
    icon: 'fa-solid fa-place-of-worship',
    category: 'Recorrido',
    price: Number(route.price) || 0,
    stateClass: route.stateClass,
    stateLabel: route.stateLabel,
  })),

  ...selectedRestaurants.value.map((restaurant) => ({
    id: `restaurant-${restaurant.id}`,
    image: restaurant.image_card,
    title: restaurant.title_card,
    icon: 'fa-solid fa-utensils',
    category: 'Restaurante',
    price: Number(restaurant.price) || 0,
    stateClass: restaurant.stateClass,
    stateLabel: restaurant.stateLabel,
  })),
])

const stopOrder = ref([])
const draggedId = ref(null)

watch(
  () => ({
    placeId: placeId.value,
    ids: selectedStops.value.map((stop) => stop.id),
  }),
  (current, previous) => {
    if (!previous || current.placeId !== previous.placeId) {
      stopOrder.value = [...current.ids]
      draggedId.value = null
      return
    }

    const validIds = new Set(current.ids)

    const existingOrder = stopOrder.value.filter(
      (id) => validIds.has(id),
    )

    const existingIds = new Set(existingOrder)

    const newIds = current.ids.filter(
      (id) => !existingIds.has(id),
    )

    stopOrder.value = [...existingOrder, ...newIds]
  },
  { immediate: true },
)

const stops = computed(() => {
  const stopsById = new Map(
    selectedStops.value.map((stop) => [stop.id, stop]),
  )

  return stopOrder.value
    .map((id) => stopsById.get(id))
    .filter(Boolean)
})

function startDrag(event, id) {
  draggedId.value = id

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', id)
}

function dropCard(targetId) {
  const sourceIndex = stopOrder.value.indexOf(draggedId.value)
  const targetIndex = stopOrder.value.indexOf(targetId)

  if (
    sourceIndex === -1 ||
    targetIndex === -1 ||
    sourceIndex === targetIndex
  ) {
    draggedId.value = null
    return
  }

  const nextOrder = [...stopOrder.value]
  const [movedId] = nextOrder.splice(sourceIndex, 1)

  nextOrder.splice(targetIndex, 0, movedId)

  stopOrder.value = nextOrder
  draggedId.value = null
}

function endDrag() {
  draggedId.value = null
}

const baseHours = 4
const hourlyPrice = 20000

const additionalHours = ref(0)

const extraHours = computed({
  get() {
    return additionalHours.value
  },
  set(value) {
    const hours = Number(value)

    additionalHours.value = Number.isFinite(hours)
      ? Math.max(0, Math.floor(hours))
      : 0
  },
})

const extraPrice = computed(
  () => extraHours.value * hourlyPrice,
)

const totalPrice = computed(
  () => total.value + extraPrice.value,
)

function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

const remainingSeconds = ref(baseHours * 3600)

let deadline = null
let timer = null
let mounted = false

function updateCountdown() {
  if (deadline === null) return

  remainingSeconds.value = Math.max(
    0,
    Math.ceil((deadline - Date.now()) / 1000),
  )
}

function resetCountdown() {
  remainingSeconds.value =
    (baseHours + extraHours.value) * 3600

  deadline = mounted && place.value
    ? Date.now() + remainingSeconds.value * 1000
    : null
}

watch(
  extraHours,
  (hours, previousHours) => {
    const difference = (hours - previousHours) * 3600

    if (deadline === null) {
      remainingSeconds.value = Math.max(
        0,
        remainingSeconds.value + difference,
      )
      return
    }

    const remainingMilliseconds = Math.max(
      0,
      deadline - Date.now(),
    )

    deadline =
      Date.now() +
      Math.max(
        0,
        remainingMilliseconds + difference * 1000,
      )

    updateCountdown()
  },
  { flush: 'sync' },
)

watch(placeId, () => {
  extraHours.value = 0
  resetCountdown()
})

const countdown = computed(() => {
  const hours = Math.floor(remainingSeconds.value / 3600)

  const minutes = Math.floor(
    (remainingSeconds.value % 3600) / 60,
  )

  const seconds = remainingSeconds.value % 60

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':')
})

onMounted(() => {
  mounted = true
  resetCountdown()
  updateCountdown()

  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  mounted = false

  if (timer !== null) {
    clearInterval(timer)
  }
})
</script>

<template>
  <Header />

  <section v-if="place" class="home bill" style="background-image: url('/img/bg-login.png');">
    <div class="container">
      <h1>Resument de tu <span>viaje</span></h1>

      <Decoration variante="yellow">
        <h3>organiza tus paradas y revisa el total</h3>
      </Decoration>

      <div class="container-billing">
        <div class="col-left">
          <div class="box">
            <div class="title">
              <h4>Tu itinerario</h4>

              <p class="small">
                <i class="fa-solid fa-grip-dots-vertical"></i>
                Arrastra para reordenar tus paradas si deseas
              </p>
            </div>

            <div class="content-itinerary">
              <div v-for="(stop, index) in stops" :key="stop.id" class="card-itinerary"
                :class="{ active: draggedId === stop.id }" draggable="true" @dragstart="startDrag($event, stop.id)"
                @dragover.prevent @drop.prevent="dropCard(stop.id)" @dragend="endDrag">
                <i class="fa-solid fa-grip-dots-vertical"></i>

                <div class="data">
                  <div class="content">
                    <div class="circle">
                      {{ index + 1 }}
                    </div>

                    <div class="img">
                      <img :src="stop.image" :alt="stop.title" draggable="false">
                    </div>

                    <div class="txt">
                      <h5>{{ stop.title }}</h5>

                      <p>
                        <i :class="stop.icon"></i>
                        {{ stop.category }}
                      </p>

                      <span class="state" :class="stop.stateClass ??
                        (index === 0 ? 'start' : 'earring')
                        ">
                        {{
                          stop.stateLabel ??
                          (index === 0 ? 'Inicio' : 'Pendiente')
                        }}
                      </span>
                    </div>
                  </div>

                  <p class="price">
                    $ {{ formatPrice(stop.price) }}
                    <span>COP</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="box time">
            <div class="title col border-bt">
              <h4>Tiempo del recorrido</h4>
              <p>
                Consulta la duración y añade tiempo si lo necesitas.
              </p>
            </div>

            <div class="time-options">
              <div class="time-item">
                <i class="fa-regular fa-clock" aria-hidden="true"></i>

                <div class="time-description">
                  <h5>Tiempo total del recorrido</h5>
                  <p>Duración estimada para todas tus paradas.</p>
                </div>

                <span class="time-value">
                  {{ countdown }}
                </span>
              </div>

              <div class="time-item">
                <i class="fa-regular fa-clock" aria-hidden="true"></i>

                <div class="time-description">
                  <label for="extra-time">Tiempo adicional</label>

                  <p>
                    Añade más tiempo para todo el recorrido
                    (1hr = 20.000).
                  </p>
                </div>

                <div class="time-input">
                  <input id="extra-time" v-model.number="extraHours" type="number" name="extra_time" min="0" step="1"
                    aria-label="Horas adicionales para todo el recorrido">
                  <span>h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-right">
          <div class="box">
            <div class="title col border-bt">
              <h4>Resumen del viaje</h4>

              <p>
                <i class="fa-solid fa-location-dot"></i>
                {{ place.title }}
              </p>
            </div>

            <div class="txt">
              <div class="trip-items">
                <div class="row">
                  <p>
                    <i class="fa-solid fa-place-of-worship"></i>
                    Recorridos
                    <span>({{ selectedRoutes.length }})</span>
                  </p>

                  <strong>
                    ${{ formatPrice(routesTotal) }}
                  </strong>
                </div>

                <div class="row">
                  <p>
                    <i class="fa-solid fa-utensils"></i>
                    Restaurante
                    <span>({{ selectedRestaurants.length }})</span>
                  </p>

                  <strong>
                    ${{ formatPrice(restaurantsTotal) }}
                  </strong>
                </div>

                <div class="row">
                  <p>
                    <i class="fa-regular fa-clock"></i>
                    Hora adicional

                    <span v-if="extraHours > 0">
                      ({{ extraHours }} h)
                    </span>
                  </p>

                  <strong>
                    {{
                      extraHours > 0
                        ? `$${formatPrice(extraPrice)}`
                        : 'No aplica'
                    }}
                  </strong>
                </div>
              </div>

              <div class="trip-total">
                <div class="total-description">
                  <h5>Total estimado</h5>

                  <p>
                    {{
                      extraHours > 0
                        ? 'Incluye recorridos, restaurante y tiempo adicional.'
                        : 'Incluye recorridos y restaurante.'
                    }}
                  </p>
                </div>

                <div class="total-price">
                  <strong>
                    ${{ formatPrice(totalPrice) }}
                  </strong>
                  <span>COP</span>
                </div>
              </div>

              <div class="payment-method">
                <h5>Método de pago</h5>

                <div class="payment-cash">
                  <i class="fa-solid fa-money-bill"></i>
                  <span>Efectivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <p v-else class="container">
    No se encontró el lugar seleccionado.
  </p>
</template>