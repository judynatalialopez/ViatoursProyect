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

const lugarNoEncontrado = computed(() =>
  busqueda.value.trim().length > 0 &&
  lugaresFiltrados.value.length === 0
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
      </form>

      <!-- Mensaje cuando no hay resultados -->
      <div v-if="lugarNoEncontrado" class="results" role="status">
        <i class="fa-solid fa-location-dot"></i>

        <h3>No se encontró el lugar</h3>

        <p>
          No encontramos destinos que coincidan con
          "{{ busqueda.trim() }}".
          Intenta buscar otro lugar.
        </p>
      </div>

      <!-- Listado de lugares -->
      <div v-else class="container-grid">
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

      <!-- Botones Ver más / Ver menos -->
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
