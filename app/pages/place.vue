<script setup>
import { computed, ref, watch } from 'vue'
import { places } from '../data/places-obj'

const cantidadVisible = ref(4)
const busqueda = ref('')

function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const lugaresFiltrados = computed(() => {
  const texto = normalizar(busqueda.value)

  return places.filter((lugar) =>
    normalizar(lugar.title).includes(texto)
  )
})

const lugaresVisibles = computed(() =>
  lugaresFiltrados.value.slice(0, cantidadVisible.value)
)

watch(busqueda, () => {
  cantidadVisible.value = 4
})

function verMas() {
  cantidadVisible.value += 4
}

function verMenos() {
  cantidadVisible.value = 4
}
</script>

<template>
  <Header />

  <section class="home places" style="background-image: url('/img/bg-login.png');">
    <div class="container">
      <h1>LUGARES <span>A</span> conocer</h1>

      <Decoration variante="yellow">
        <h3>Escoge tu destino el día de hoy</h3>
      </Decoration>

      <form class="search" @submit.prevent>
        <div>
          <input id="search" v-model="busqueda" type="search" name="search" placeholder="Buscar destino..." />
          <Button class="large" aria-label="Buscar destino">
            <i class="fa-solid fa-magnifying-glass"></i>
          </Button>
        </div>

        <p v-if="!lugaresFiltrados.length" class="error">
          No se encontró el lugar
        </p>
      </form>

      <div class="container-grid">
        <Card-page v-for="lugar in lugaresVisibles" :key="lugar.id"
          :recorridos-href="`/route-place?placeId=${lugar.id}`" :restaurantes-href="`/restaurant?placeId=${lugar.id}`">
          <template #img>
            <img v-if="lugar.image" :src="lugar.image" :alt="lugar.title" />
          </template>

          <template #title>
            {{ lugar.title }}
          </template>
        </Card-page>
      </div>

      <div v-if="lugaresFiltrados.length > 4" class="content-see-more">
        <Button v-if="cantidadVisible < lugaresFiltrados.length" class="large" @click="verMas">
          Ver más
        </Button>

        <Button v-if="cantidadVisible > 4" class="large" @click="verMenos">
          Ver menos
        </Button>
      </div>
    </div>
  </section>
</template>