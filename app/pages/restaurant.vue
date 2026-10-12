<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { places } from '../data/places-obj'

const paginaActual = useRoute()
const seleccionadas = ref([])
const restauranteActivoId = ref(null)

const placeId = computed(() => {
  const parametro = paginaActual.query.placeId
  const id = Array.isArray(parametro) ? parametro[0] : parametro

  return Number(id)
})

const place = computed(() =>
  places.find((lugar) => lugar.id === placeId.value)
)

const restaurants = computed(() => place.value?.restaurants ?? [])

const restaurantesCentro = computed(() =>
  restaurants.value.slice(0, 3)
)

const restauranteActivo = computed(() =>
  restaurants.value.find(
    (restaurante) => restaurante.id === restauranteActivoId.value
  ) ?? restaurants.value[0] ?? null
)

const restaurantesSeleccionados = computed(() =>
  restaurants.value.filter((restaurante) =>
    seleccionadas.value.includes(restaurante.id)
  )
)

const total = computed(() =>
  restaurantesSeleccionados.value.reduce(
    (suma, restaurante) => suma + restaurante.price,
    0
  )
)

watch(
  placeId,
  () => {
    seleccionadas.value = []
    restauranteActivoId.value = restaurants.value[0]?.id ?? null
  },
  { immediate: true }
)

function activarRestaurante(restaurante) {
  restauranteActivoId.value = restaurante.id
}

function formatoPrecio(valor) {
  return valor.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })
}
</script>

<template>
  <Header />

  <section v-if="place" class="home restaurant" :style="{ backgroundImage: `url('${place.image}')` }">
    <div class="container">
      <h1>{{ place.title }}</h1>

      <Decoration variante="yellow">
        <ul>
          <li>GASTRONOMÍA</li>
          <li>SABORES</li>
          <li>TRADICIÓN</li>
        </ul>
      </Decoration>

      <form class="form-restaurant" @submit.prevent>
        <div class="col-left">
          <div v-for="restaurante in restaurants" :key="restaurante.id" class="card-restaurant"
            :class="{ active: restauranteActivo?.id === restaurante.id }" @click="activarRestaurante(restaurante)">
            <div class="img">
              <img :src="restaurante.image_card" :alt="restaurante.title_card" />
            </div>

            <div class="txt">
              <h3>
                <button type="button" class="restaurant-tab" :aria-pressed="restauranteActivo?.id === restaurante.id"
                  aria-controls="restaurant-detail" @click="activarRestaurante(restaurante)">
                  {{ restaurante.title_card }}
                </button>
              </h3>

              <p>{{ restaurante.description }}</p>

              <div class="bottom">
                <strong>
                  <i class="fa-solid fa-coins"></i>
                  <span>Valor: </span>
                  {{ formatoPrecio(restaurante.price) }}
                </strong>

                <label class="route-check" @click.stop>
                  <input v-model="seleccionadas" type="checkbox" :value="restaurante.id"
                    :aria-label="`Agregar ${restaurante.title_card}`" />

                  <span class="route-check__circle" aria-hidden="true"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-center">
          <template v-for="(restaurante, index) in restaurantesCentro" :key="restaurante.id">
            <button type="button" class="circle" :class="{ active: restauranteActivo?.id === restaurante.id }"
              :aria-label="`Ver ${restaurante.title_card}`" :aria-pressed="restauranteActivo?.id === restaurante.id"
              aria-controls="restaurant-detail" @click="activarRestaurante(restaurante)">
              <i class="fa-solid fa-utensils"></i>
            </button>

            <div v-if="index < restaurantesCentro.length - 1" class="line" :class="index % 2 === 0 ? 'left' : 'right'">
              <img src="/img/line-curve.png" alt="" />
            </div>
          </template>
        </div>

        <div id="restaurant-detail" class="col-right" aria-live="polite">
          <div v-if="restauranteActivo" :key="restauranteActivo.id" class="container-txt">
            <div class="img">
              <img :src="restauranteActivo.image_card" :alt="restauranteActivo.title_card" />
            </div>

            <p>{{ restauranteActivo.description }}</p>
          </div>
        </div>
      </form>

      <p v-if="!restaurants.length" class="warning">
        Este lugar todavía no tiene restaurantes disponibles.
      </p>

      <div class="total" aria-live="polite">
        <strong>
          <span>Total: </span>
          {{ formatoPrecio(total) }}
        </strong>

        <p>
          <i class="fa-solid fa-hand-point-up"></i>
          Haz clic en un restaurante para ver su información.
          Marca las opciones que quieras agregar para conocer el total.
        </p>
      </div>

      <div class="content-btns">
        <Button :href="`/route-place?placeId=${place.id}`" class="small black">
          Ver recorridos
        </Button>

        <Button href="" class="small">
          Continuar
        </Button>
      </div>
    </div>
  </section>

  <p v-else class="container">
    No se encontró el lugar seleccionado.
  </p>
</template>