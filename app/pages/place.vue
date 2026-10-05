<script setup>
import { computed, ref } from 'vue'

const lugares = [
  {
    id: 1,
    titulo: 'Zipaquirá',
    imagen: '/img/places/city/city-01-zipaquira.jpg',
  },
  {
    id: 2,
    titulo: 'Bogotá',
    imagen: '/img/places/city/city-02-bogota.png',
  },
  {
    id: 3,
    titulo: 'Villa de Leyva',
    imagen: '/img/places/city/city-03-villa.jpeg',
  },
  {
    id: 4,
    titulo: 'Boyacá',
    imagen: '/img/places/city/city-04-boyaca.jpeg',
  },
  {
    id: 5,
    titulo: 'Lugar 1',
    imagen: '',
  },
  {
    id: 6,
    titulo: 'Lugar 2',
    imagen: '',
  },
]

const cantidadVisible = ref(4)

const lugaresVisibles = computed(() =>
  lugares.slice(0, cantidadVisible.value)
)

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

      <form action="" class="search">
        <div>
          <input type="search" name="search" id="search" placeholder="Buscar destino...">
          <Button class="large">
            <i class="fa-solid fa-magnifying-glass"></i>
          </Button>
        </div>
        <p class="error">No se encontró el lugar</p>
      </form>

      <div class="container-grid">
        <Card-page v-for="lugar in lugaresVisibles" :key="lugar.id">
          <template #img>
            <img v-if="lugar.imagen" :src="lugar.imagen" :alt="lugar.titulo" />
          </template>

          <template #title>
            {{ lugar.titulo }}
          </template>
        </Card-page>
      </div>

      <div v-if="lugares.length > 4" class="content-see-more">
        <Button class="large" v-if="cantidadVisible < lugares.length" @click="verMas">
          Ver más
        </Button>

        <Button class="large" v-if="cantidadVisible > 4" @click="verMenos">
          Ver menos
        </Button>
      </div>
    </div>
  </section>
</template>