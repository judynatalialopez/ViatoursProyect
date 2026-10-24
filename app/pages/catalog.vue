```vue
<script setup>
import { ref, computed } from 'vue'
const activeTag = ref('todos')
const search = ref('')
const sortBy = ref('')
const places = ref([
  {
    id: 1,
    name: 'El cielo restaurant',
    category: 'restaurantes',
    categoryName: 'RESTAURANTE',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '3143386499',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/fa/ef/01/elcielo-restaurant-bogota.jpg?w=900&h=-1&s=1',
    url: 'internal-site',
    date_create: '2026-10-20'
  },
  {
    id: 2,
    name: 'Sombras',
    category: 'restaurantes',
    categoryName: 'RESTAURANTE',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '3143386499',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/ce/4d/59/sombras-es-la-primera.jpg?w=900&h=500&s=1',
    url: 'internal-site',
    date_create: '2026-10-22'
  },
  {
    id: 3,
    name: 'Monserrate',
    category: 'experiencia',
    categoryName: 'EXPERIENCIA',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '3143386499',
    image: 'https://monserrate.co/uploads/site/home/day-view-2x.jpg',
    url: 'internal-site',
    date_create: '2026-10-18'
  },
  {
    id: 4,
    name: "Piazza Italia By Storia D'Amore Calle 93",
    category: 'restaurantes',
    categoryName: 'RESTAURANTE',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '3143386499',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/a2/be/db/giardino.jpg?w=900&h=500&s=1',
    url: 'internal-site',
    date_create: '2026-10-19'
  },
  {
    id: 5,
    name: 'Jardín botánico',
    category: 'experiencia',
    categoryName: 'EXPERIENCIA',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '3143386499',
    image: 'https://jbb.gov.co/wp-content/uploads/2024/06/00-1318-1024x682.jpg',
    url: 'internal-site',
    date_create: '2026-10-17'
  },
  {
    id: 6,
    name: 'Joyería Esterlina',
    category: 'joyeria',
    categoryName: 'JOYERIA',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '3143386499',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbvMG1tjvkXNI8pCtfjSeZBoKo2ZZzwefcL710-4LY-0nkT0ZprqjZUU8&s=10',
    url: 'internal-site',
    date_create: '2026-10-21'
  },
  {
    id: 7,
    name: "Storia D'Amore - Zona T",
    category: 'restaurantes',
    categoryName: 'RESTAURANTE',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '3143386499',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c2/6b/71/al-parmigiano-reggiano.jpg?w=900&h=500&s=1',
    url: 'internal-site',
    date_create: '2026-10-23'
  },
  {
    id: 8,
    name: 'GOLDEN EMERALD JOYERIA',
    category: 'joyeria',
    categoryName: 'JOYERIA',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Qpy-qr4BILUXJ4Ai98Uv3EVhK49zg-CwglYdlb8RdPd9yfsBNg_mlhFAdWrHZvvGiEzwwcY7mm3skDJGU4aV5ZJ9UnzkVmVhYu9Kwek2pZI3g10zmcTWc1d256dvMeSa1ThtCdBvjdLZY6=s680-w680-h510-rw',
    url: 'internal-site',
    date_create: '2026-10-16'
  },
  {
    id: 9,
    name: 'Planetario',
    category: 'experiencia',
    categoryName: 'EXPERIENCIA',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.',
    phone: '3143386499',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBF4j68R7gddafWKP_pYfKRvBScQ6KiZgNasB_VaFO0W_YrRLlHyPoitw_&s=10',
    url: 'internal-site',
    date_create: '2026-10-15'
  }
])
const categoryCount = (category) => {
  if (category === 'todos') return places.value.length
  return places.value.filter(place => place.category === category).length
}
const filteredPlaces = computed(() => {
  let results = [...places.value]
  if (activeTag.value !== 'todos') {
    results = results.filter(place => place.category === activeTag.value)
  }
  const term = search.value.trim().toLowerCase()
  if (term) {
    results = results.filter(place =>
      place.name.toLowerCase().includes(term) ||
      place.description.toLowerCase().includes(term) ||
      place.categoryName.toLowerCase().includes(term)
    )
  }
  if (sortBy.value === 'nombre') {
    results.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }
  if (sortBy.value === 'recientes') {
    results.sort((a, b) => new Date(b.date_create) - new Date(a.date_create))
  }
  if (sortBy.value === 'antiguos') {
    results.sort((a, b) => new Date(a.date_create) - new Date(b.date_create))
  }
  return results
})
</script>
<template>
  <section class="catalog destination cover">
    <div class="before-item"></div>
    <div class="container">
      <div class="title-item">
        <a href="destination" class="return">
          <i class="fa-light fa-arrow-left-long"></i>VOLVER
        </a>
        <h3>Bogotá</h3>
        <h1>Bogotá</h1>
        <p>Historia, cultura, gastronomia y experiencias únicas. Descubre nuestras recomendaciones y vive lo mejor de
          cada uno de estos sitios.</p>
      </div>
    </div>
    <div class="content-bg">
      <img src="https://cdn1.matadornetwork.com/blogs/2/2016/02/Bogota-Colombia-cityscape-1200x853.jpeg" alt="Bogotá">
    </div>
  </section>
  <section class="catalog destination container-places">
    <div class="container">
      <form class="filters" @submit.prevent>
        <div class="search">
          <input v-model="search" type="text" placeholder="Buscar destino..">
        </div>
        <div class="filters">
          <div class="content-tags">
            <button type="button" class="tag" :class="{ active: activeTag === 'todos' }" @click="activeTag = 'todos'">
              Todos <span>{{ categoryCount('todos') }}</span>
            </button>
            <button type="button" class="tag" :class="{ active: activeTag === 'restaurantes' }"
              @click="activeTag = 'restaurantes'">
              <i class="fa-light fa-utensils"></i>Restaurantes <span>{{ categoryCount('restaurantes') }}</span>
            </button>
            <button type="button" class="tag" :class="{ active: activeTag === 'joyeria' }"
              @click="activeTag = 'joyeria'">
              <i class="fa-light fa-gem"></i>Joyería <span>{{ categoryCount('joyeria') }}</span>
            </button>
            <button type="button" class="tag" :class="{ active: activeTag === 'experiencia' }"
              @click="activeTag = 'experiencia'">
              <i class="fa-light fa-map"></i>Experiencia <span>{{ categoryCount('experiencia') }}</span>
            </button>
          </div>
          <div class="sort-by">
            <p>Ordenar por</p>
            <select v-model="sortBy">
              <option value="">Selecciona una opción</option>
              <option value="nombre">Nombre</option>
              <option value="recientes">Recientes</option>
              <option value="antiguos">Antiguos</option>
            </select>
          </div>
        </div>
      </form>
      <div class="container-grid-catalog">
        <a v-for="place in filteredPlaces" :key="place.id" :href="place.url" class="item">
          <div class="img">
            <img :src="place.image" :alt="place.name">
            <span class="tags-category">{{ place.categoryName }}</span>
          </div>
          <div class="text">
            <div class="top">
              <h3>{{ place.name }}</h3>
              <p>{{ place.description }}</p>
            </div>
            <div class="bottom">
              <p v-if="place.phone">
                <i class="fa-solid fa-phone"></i>{{ place.phone }}
              </p>
              <p v-else>
                <i class="fa-solid fa-phone-slash"></i>
              </p>
              <i class="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </a>
        <div v-if="filteredPlaces.length === 0" class="no-results">
          <p>No encontramos resultados.</p>
        </div>
      </div>
    </div>
  </section>
</template>
```