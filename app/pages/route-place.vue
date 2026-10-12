<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { places } from '../data/places-obj'
import { usePlaceSelection } from '../composables/use-place-selection'
import { navigateTo } from '#app'

const paginaActual = useRoute()

const placeId = computed(() => {
  const parametro = paginaActual.query.placeId
  const id = Array.isArray(parametro) ? parametro[0] : parametro

  return Number(id)
})

const place = computed(() =>
  places.find((lugar) => lugar.id === placeId.value)
)

const routes = computed(() => place.value?.routes ?? [])

const {
  selectedRouteIds: seleccionadas,
  total,
} = usePlaceSelection(placeId)

const rutaModal = ref(null)
const botonCerrar = ref(null)

watch(placeId, () => {
  cerrarModal()
})

function formatoPrecio(valor) {
  return Number(valor).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })
}

async function abrirModal(route) {
  rutaModal.value = route

  await nextTick()
  botonCerrar.value?.focus()
}

function cerrarModal() {
  rutaModal.value = null
}
</script>

<template>
  <Header />

  <section v-if="place" class="home route" :style="{ backgroundImage: `url('${place.image}')` }">
    <div class="container">
      <h1>{{ place.title }}</h1>

      <Decoration variante="yellow">
        <ul>
          <li>HISTORIA</li>
          <li>CULTURA</li>
          <li>NATURALEZA</li>
        </ul>
      </Decoration>

      <form class="container-card-route" @submit.prevent>
        <div v-for="(route, index) in routes" :key="route.id" class="card-route"
          :class="index % 2 === 0 ? 'right' : 'left'">
          <div class="row">
            <button type="button" class="circle" :aria-label="`Ver información de ${route.title_card}`"
              @click="abrirModal(route)">
              <i class="fa-regular fa-camera"></i>
              <p class="text-cricle">Ver más</p>
            </button>

            <div class="text">
              <h3>{{ route.title_card }}</h3>
              <p>{{ route.description }}</p>
            </div>
          </div>

          <div class="bottom">
            <strong>
              <i class="fa-solid fa-coins"></i>
              <span>Valor: </span>
              {{ formatoPrecio(route.price) }}
            </strong>

            <label class="route-check">
              <input v-model="seleccionadas" type="checkbox" :value="route.id"
                :aria-label="`Agregar ${route.title_card}`" />

              <span class="route-check__circle" aria-hidden="true"></span>
            </label>
          </div>

          <div v-if="index < routes.length - 1" class="img-line">
            <img :src="index % 2 === 0
              ? '/img/line-right.svg'
              : '/img/line-left.svg'
              " alt="" />
          </div>
        </div>
      </form>

      <p v-if="!routes.length" class="warning">
        Este lugar todavía no tiene rutas disponibles.
      </p>

      <div class="total" aria-live="polite">
        <strong>
          <span>Total: </span>
          {{ formatoPrecio(total) }}
        </strong>

        <p>
          <i class="fa-solid fa-hand-point-up"></i>
          Haz clic en el círculo de la cámara para conocer cada destino.
          Marca las opciones que quieras visitar para ver el total de la
          tarifa. También puedes explorar más opciones.
        </p>
      </div>

      <div class="content-btns three">
        <Button :href="`/restaurant?placeId=${place.id}`" class="small black"
          @click.prevent="navigateTo(`/restaurant?placeId=${place.id}`)">
          Ver restaurante
        </Button>

        <Button href="billing" class="small">
          Continuar
        </Button>

        <Button href="place" class="small wd-100">
          Volver
        </Button>
      </div>
    </div>
  </section>

  <p v-else class="container">
    No se encontró el lugar seleccionado.
  </p>

  <Teleport to="body">
    <div v-if="rutaModal" class="modal-overlay" @click.self="cerrarModal" @keydown.esc.stop.prevent="cerrarModal">
      <div class="modal-route" role="dialog" aria-modal="true" aria-labelledby="modal-route-title">
        <button ref="botonCerrar" type="button" class="modal-close" aria-label="Cerrar modal" @click="cerrarModal">
          ×
        </button>

        <div class="img">
          <img class="modal-route__image" :src="rutaModal.image_card" :alt="rutaModal.title_card" />
        </div>

        <div class="modal-route__content">
          <h2 id="modal-route-title">
            {{ rutaModal.title_card }}
          </h2>

          <p>{{ rutaModal.description }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>