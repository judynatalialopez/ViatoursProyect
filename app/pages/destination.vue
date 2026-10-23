<script setup>
import { ref, computed } from 'vue'

const search = ref('')

const places = [
  {
    name: 'Bogotá',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS51uAlE5twImZjwY6QBzENZjXl32tGXNqUODtOh9CQDY0iLlY6HFAGe9M2&s=10',
    link: 'catalog'
  },
  {
    name: 'Zipaquirá',
    image: 'https://viajala.com.co/news/wp-content/uploads/2026/01/renovacion-del-centro-historico-de-Zipaquira.jpg',
    link: 'catalog'
  },
  {
    name: 'Villa de Leyva',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRinLkumlrp5gcToxdJImpZ1tTZ3-hpRPBA38k72gc7CGJxYBSDMia4DQc&s=10',
    link: 'catalog'
  },
  {
    name: 'Boyacá',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHdu-61HuAvmIFyEqXSQ1f5vVQmmYfZVpliOHTqjPOvNJ8pQ0QQxZc6uIw&s=10',
    link: 'catalog'
  },
  {
    name: 'Villavicencio',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZzPW32Rk8t4FpNc8Yk5qV0Zxfc3FRXbMkg0fNlBMSqoRCd7Uz0B0NJN-J&s=10',
    link: 'catalog'
  },
  {
    name: 'Eje cafetero',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPq_HDumpedSesXhY-jEOXobxu9o7NLwuSMc069LZipmQOf97W8X7EVMc&s=10',
    link: 'catalog'
  }
]

const filteredPlaces = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) return places

  return places.filter(place =>
    place.name.toLowerCase().includes(term)
  )
})
</script>

<template>
  <section class="destination cover">
    <div class="before-item"></div>

    <div class="container">
      <div class="title-item">
        <a href="/" class="return">
          <i class="fa-light fa-arrow-left-long"></i>
          VOLVER
        </a>

        <h3>DESTINOS</h3>
        <h1>¿A dónde quieres ir hoy?</h1>

        <p>
          Cada destino tiene una historia por descubir. Explora nuestras recomendaciones y encuentra lugares que harán
          especial tu visita.
        </p>
      </div>
    </div>

    <div class="content-bg">
      <img src="https://cdn1.matadornetwork.com/blogs/2/2016/02/Bogota-Colombia-cityscape-1200x853.jpeg" alt="">
    </div>
  </section>

  <section class="destination container-places">
    <div class="container">

      <form class="filters" @submit.prevent>
        <div class="search">
          <input v-model="search" type="text" placeholder="Buscar destino..">
        </div>
      </form>

      <div class="container-grid">
        <a v-for="place in filteredPlaces" :key="place.name" :href="place.link" class="item">
          <img :src="place.image" :alt="place.name">

          <h3>{{ place.name }}</h3>

          <i class="fa-regular fa-angle-right"></i>
        </a>
      </div>

      <p v-if="filteredPlaces.length === 0" class="no-results">
        No encontramos destinos con ese nombre.
      </p>

    </div>
  </section>
</template>