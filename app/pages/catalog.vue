<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi } from '~/composables/useAdminData'
import type { CatalogPlace, Category, Destination } from '~/composables/useAdminData'

const route = useRoute()
const { request } = useApi()
const destinationId = computed(() => Number(route.query.destination) || 1)
const activeTag = ref<number | null>(null)
const search = ref('')
const sortBy = ref('')

const { data: destination, refresh: refreshDestination } = await useAsyncData(
  () => `destination-${destinationId.value}`,
  () => request<Destination>(`/destinations/${destinationId.value}`),
)
const { data: categories, refresh: refreshCategories } = await useAsyncData(
  'public-categories',
  () => request<Category[]>('/categories'),
  { default: () => [] },
)
const { data: places, refresh: refreshPlaces } = await useAsyncData(
  () => `places-${destinationId.value}`,
  () => request<CatalogPlace[]>(`/places?destinationId=${destinationId.value}`),
  { default: () => [] },
)

useCatalogLive(() => {
  refreshDestination()
  refreshCategories()
  refreshPlaces()
})


const categoryCount = (categoryId: number | null) =>
  categoryId === null
    ? places.value.length
    : places.value.filter(place => place.categoryId === categoryId).length

const visibleCategories = computed(() =>
  categories.value.filter(
    category =>
      categoryCount(category.id) > 0 &&
      category.name.trim().toLowerCase() !== 'convenio'
  )
)

const iconFor = (category: Category) =>
  category.icon || 'fa-light fa-tag'

const filteredPlaces = computed(() => {
  let results = [...places.value]

  if (activeTag.value !== null) {
    results = results.filter(place => place.categoryId === activeTag.value)
  }

  const term = search.value.trim().toLowerCase()

  if (term) {
    results = results.filter(
      place =>
        place.name.toLowerCase().includes(term) ||
        place.description.toLowerCase().includes(term) ||
        place.categoryName.toLowerCase().includes(term)
    )
  }

  if (sortBy.value === 'nombre') {
    results.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }

  if (sortBy.value === 'recientes') {
    results.sort(
      (a, b) =>
        new Date(b.date_create).getTime() -
        new Date(a.date_create).getTime()
    )
  }

  if (sortBy.value === 'antiguos') {
    results.sort(
      (a, b) =>
        new Date(a.date_create).getTime() -
        new Date(b.date_create).getTime()
    )
  }

  return results
})

const agreementPlaces = computed(() =>
  filteredPlaces.value.filter(
    place => place.categoryName?.trim().toLowerCase() === 'convenio'
  )
)

const regularPlaces = computed(() =>
  filteredPlaces.value.filter(
    place => place.categoryName?.trim().toLowerCase() !== 'convenio'
  )
)
</script>

<template>
  <section class="catalog destination cover">
    <div class="before-item"></div>

    <div class="container">
      <div class="title-item">
        <a href="/destination" class="return">
          <i class="fa-light fa-arrow-left-long"></i>
          VOLVER
        </a>

        <h3>{{ destination?.name }}</h3>
        <h1>{{ destination?.name }}</h1>

        <p>
          Historia, cultura, gastronomia y experiencias únicas. Descubre nuestras
          recomendaciones y vive lo mejor de cada uno de estos sitios.
        </p>
      </div>
    </div>

    <div class="content-bg">
      <img :src="destination?.image" :alt="destination?.name">
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
            <button type="button" class="tag" :class="{ active: activeTag === null }" @click="activeTag = null">
              Todos
              <span>{{ categoryCount(null) }}</span>
            </button>

            <button v-for="category in visibleCategories" :key="category.id" type="button" class="tag"
              :class="{ active: activeTag === category.id }" @click="activeTag = category.id">
              <i :class="iconFor(category)"></i>

              {{ category.name }}

              <span>{{ categoryCount(category.id) }}</span>
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

      <div class="col-grid">
        <div class="noteworthy">
          <h2>Destacado</h2>
          <div v-if="agreementPlaces.length" class="container-grid-catalog agreement">
            <a v-for="place in agreementPlaces" :key="place.id" :href="place.url" class="item">
              <div class="img">
                <img :src="place.image" :alt="place.name">
              </div>

              <div class="text">
                <div class="top">
                  <h3>{{ place.name }}</h3>
                  <p>{{ place.description }}</p>
                </div>

                <div class="bottom">
                  <p v-if="place.phone">
                    <i class="fa-solid fa-phone"></i>
                    {{ place.phone }}
                  </p>

                  <p v-else>
                    <i class="fa-solid fa-phone-slash"></i>
                  </p>

                  <i class="fa-solid fa-chevron-right"></i>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div class="container-grid-catalog">
          <a v-for="place in regularPlaces" :key="place.id" :href="place.url" class="item">
            <div class="img">
              <img :src="place.image" :alt="place.name">

              <span class="tags-category">
                {{ place.categoryName }}
              </span>
            </div>

            <div class="text">
              <div class="top">
                <h3>{{ place.name }}</h3>
                <p>{{ place.description }}</p>
              </div>

              <div class="bottom">
                <p v-if="place.phone">
                  <i class="fa-solid fa-phone"></i>
                  {{ place.phone }}
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
    </div>
  </section>
</template>