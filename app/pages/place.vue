<script setup>
import { computed, ref } from 'vue'
import { places } from '../data/places-obj'

const cantidadVisible = ref(4)

const lugaresVisibles = computed(() =>
  places.slice(0, cantidadVisible.value)
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
            <img v-if="lugar.image" :src="lugar.image" :alt="lugar.title" />
          </template>

          <template #title>
            {{ lugar.title }}
          </template>
        </Card-page>
      </div>

      <div v-if="places.length > 4" class="content-see-more">
        <Button class="large" v-if="cantidadVisible < places.length" @click="verMas">
          Ver más
        </Button>

        <Button class="large" v-if="cantidadVisible > 4" @click="verMenos">
          Ver menos
        </Button>
      </div>
    </div>
  </section>
</template>