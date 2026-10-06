<script setup>
import { computed, ref } from 'vue'
import { routes } from '../data/route'

const seleccionadas = ref([])

const rutasSeleccionadas = computed(() =>
  routes.filter(route => seleccionadas.value.includes(route.id))
)

const total = computed(() =>
  rutasSeleccionadas.value.reduce((suma, route) => suma + route.price, 0)
)

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

  <section v-if="routes.length" class="home route" :style="{ backgroundImage: `url('${routes[0].image}')` }">
    <div class="container">
      <h1>{{ routes[0].title }}</h1>

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
            <div class="circle">
              <i class="fa-regular fa-camera"></i>
            </div>
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
              <input type="checkbox" v-model="seleccionadas" :value="route.id"
                :aria-label="`Agregar ${route.title_card}`" />
              <span class="route-check__circle" aria-hidden="true"></span>
            </label>
          </div>
          <div class="img-line" v-if="index < routes.length - 1">
            <img :src="index % 2 === 0
              ? '/img/line-right.svg'
              : '/img/line-left.svg'" alt="" />
          </div>
        </div>
      </form>

      <div class="total" aria-live="polite">
        <strong><span>Total: </span>{{ formatoPrecio(total) }}</strong>
        <p><i class="fa-solid fa-hand-point-up"></i>Selecciona un destino click en el circulo de cada punto para conocer
          su información y ver el total de la
          tarifa. También puedes explorar más opciones.</p>
      </div>

      <div class="content-btns">
        <Button class="small black">Ver restaurante</Button>
        <Button class="small">Continuar</Button>
      </div>

      <div class="modal-img" v-for="route in routes" :key="route.id">
        <img :src="route.image_card" :alt="route.title" />
      </div>
    </div>
  </section>
</template>