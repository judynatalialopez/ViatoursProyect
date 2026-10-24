<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import type { CatalogPlace, Destination } from '~/composables/useAdminData'

const { destinations, places } = useAdminData()

const activeSection = ref<'places' | 'destinations'>('places')
const search = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const modalOpen = ref(false)
const editingId = ref<number | null>(null)

const deleteTarget = ref<{
  type: 'place' | 'destination'
  id: number
  name: string
} | null>(null)

const emptyPlace = (): CatalogPlace => ({
  id: 0,
  name: '',
  category: 'restaurantes',
  categoryName: 'RESTAURANTE',
  description: '',
  phone: '',
  image: '',
  date_create: '',
  active: true
})

const emptyDestination = (): Destination => ({
  id: 0,
  name: '',
  image: '',
  link: '',
  active: true
})

const placeForm = reactive<CatalogPlace>(emptyPlace())
const destinationForm = reactive<Destination>(emptyDestination())

onMounted(() => {
  if (sessionStorage.getItem('viatours-admin-session') !== 'active') {
    navigateTo('/admin/login')
  }
})

const filteredPlaces = computed(() => {
  const term = search.value.trim().toLowerCase()

  return places.value.filter(item => {
    const matchesSearch =
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.categoryName.toLowerCase().includes(term) ||
      item.phone.includes(term)

    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active'
        ? item.active
        : !item.active)

    return matchesSearch && matchesStatus
  })
})

const filteredDestinations = computed(() => {
  const term = search.value.trim().toLowerCase()

  return destinations.value.filter(item => {
    const matchesSearch =
      !term ||
      item.name.toLowerCase().includes(term)

    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active'
        ? item.active
        : !item.active)

    return matchesSearch && matchesStatus
  })
})

const stats = computed(() => ({
  destinations: destinations.value.length,
  places: places.value.length,

  restaurants: places.value.filter(
    item => item.category === 'restaurantes'
  ).length,

  experiences: places.value.filter(
    item => item.category === 'experiencia'
  ).length,

  jewelry: places.value.filter(
    item => item.category === 'joyeria'
  ).length
}))

const formatDate = (date: string) => {
  if (!date) return '—'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsedDate)
}

const openCreate = () => {
  editingId.value = null

  if (activeSection.value === 'places') {
    Object.assign(placeForm, emptyPlace())
  } else {
    Object.assign(destinationForm, emptyDestination())
  }

  modalOpen.value = true
}

const openEditPlace = (item: CatalogPlace) => {
  editingId.value = item.id

  Object.assign(placeForm, {
    ...item
  })

  modalOpen.value = true
}

const openEditDestination = (item: Destination) => {
  editingId.value = item.id

  Object.assign(destinationForm, {
    ...item
  })

  modalOpen.value = true
}

const updateCategoryName = () => {
  const labels = {
    restaurantes: 'RESTAURANTE',
    joyeria: 'JOYERIA',
    experiencia: 'EXPERIENCIA'
  } as const

  placeForm.categoryName = labels[placeForm.category]
}

const saveItem = () => {
  if (activeSection.value === 'places') {
    updateCategoryName()

    /*
     * CREAR LUGAR
     */
    if (editingId.value === null) {
      const nextId =
        Math.max(
          0,
          ...places.value.map(item => item.id)
        ) + 1

      places.value.push({
        ...placeForm,
        id: nextId,

        // Fecha y hora automáticas.
        date_create: new Date().toISOString()
      })
    }

    /*
     * EDITAR LUGAR
     */
    else {
      const index = places.value.findIndex(
        item => item.id === editingId.value
      )

      if (index !== -1) {
        /*
         * Conservamos la fecha original de creación.
         */
        const originalDate =
          places.value[index]?.date_create || ''

        places.value[index] = {
          ...placeForm,
          id: editingId.value,
          date_create: originalDate
        }
      }
    }
  }

  /*
   * DESTINOS
   */
  else {
    if (editingId.value === null) {
      const nextId =
        Math.max(
          0,
          ...destinations.value.map(item => item.id)
        ) + 1

      destinations.value.push({
        ...destinationForm,
        id: nextId
      })
    } else {
      const index = destinations.value.findIndex(
        item => item.id === editingId.value
      )

      if (index !== -1) {
        destinations.value[index] = {
          ...destinationForm,
          id: editingId.value
        }
      }
    }
  }

  modalOpen.value = false
}

const togglePlace = (item: CatalogPlace) => {
  item.active = !item.active
}

const toggleDestination = (item: Destination) => {
  item.active = !item.active
}

const askDelete = (
  type: 'place' | 'destination',
  id: number,
  name: string
) => {
  deleteTarget.value = {
    type,
    id,
    name
  }
}

const confirmDelete = () => {
  if (!deleteTarget.value) return

  const {
    type,
    id
  } = deleteTarget.value

  if (type === 'place') {
    places.value = places.value.filter(
      item => item.id !== id
    )
  } else {
    destinations.value = destinations.value.filter(
      item => item.id !== id
    )
  }

  deleteTarget.value = null
}

const logout = async () => {
  sessionStorage.removeItem('viatours-admin-session')

  await navigateTo('/admin/login')
}

const setSection = (
  section: 'places' | 'destinations'
) => {
  activeSection.value = section

  search.value = ''
  statusFilter.value = 'all'
}
</script>

<template>
  <main class="admin-shell">

    <!-- SIDEBAR -->
    <aside class="admin-sidebar">

      <a href="/" class="admin-sidebar__brand">
        <img src="/img/icon-mount.png" alt="Viatours">

        <div>
          <strong>
            VIATOURS
          </strong>

          <span>
            ADMINISTRACIÓN
          </span>
        </div>
      </a>

      <nav class="admin-nav">

        <button :class="{
          active: activeSection === 'places'
        }" @click="setSection('places')">
          <i class="fa-light fa-map-location-dot"></i>

          Lugares

          <span>
            {{ stats.places }}
          </span>
        </button>

        <button :class="{
          active: activeSection === 'destinations'
        }" @click="setSection('destinations')">
          <i class="fa-light fa-location-dot"></i>

          Destinos

          <span>
            {{ stats.destinations }}
          </span>
        </button>

      </nav>

      <div class="admin-sidebar__footer">

        <a href="/" target="_blank">
          <i class="fa-light fa-arrow-up-right-from-square"></i>

          Ver sitio
        </a>

        <button @click="logout">
          <i class="fa-light fa-arrow-right-from-bracket"></i>

          Cerrar sesión
        </button>

      </div>

    </aside>

    <!-- CONTENT -->
    <section class="admin-content">

      <!-- TOPBAR -->
      <header class="admin-topbar">

        <div>
          <span>
            Panel de administración
          </span>

          <h1>
            {{
              activeSection === 'places'
                ? 'Lugares'
                : 'Destinos'
            }}
          </h1>
        </div>

        <button class="btn" @click="openCreate">
          <i class="fa-light fa-plus"></i>

          {{
            activeSection === 'places'
              ? 'NUEVO LUGAR'
              : 'NUEVO DESTINO'
          }}
        </button>

      </header>

      <!-- STATS -->
      <div class="admin-stats">

        <article>

          <i class="fa-light fa-location-dot"></i>

          <div>
            <strong>
              {{ stats.destinations }}
            </strong>

            <span>
              Destinos
            </span>
          </div>

        </article>

        <article>

          <i class="fa-light fa-map-location-dot"></i>

          <div>
            <strong>
              {{ stats.places }}
            </strong>

            <span>
              Lugares
            </span>
          </div>

        </article>

        <article>

          <i class="fa-light fa-utensils"></i>

          <div>
            <strong>
              {{ stats.restaurants }}
            </strong>

            <span>
              Restaurantes
            </span>
          </div>

        </article>

        <article>

          <i class="fa-light fa-map"></i>

          <div>
            <strong>
              {{ stats.experiences }}
            </strong>

            <span>
              Experiencias
            </span>
          </div>

        </article>

        <article>

          <i class="fa-light fa-gem"></i>

          <div>
            <strong>
              {{ stats.jewelry }}
            </strong>

            <span>
              Joyerías
            </span>
          </div>

        </article>

      </div>

      <!-- CARD -->
      <section class="admin-card">

        <!-- TOOLBAR -->
        <div class="admin-toolbar">

          <div class="admin-search">

            <i class="fa-light fa-magnifying-glass"></i>

            <input v-model="search" type="text" :placeholder="activeSection === 'places'
              ? 'Buscar lugar, categoría o teléfono...'
              : 'Buscar destino...'
              ">

          </div>

          <select v-model="statusFilter">

            <option value="all">
              Todos los estados
            </option>

            <option value="active">
              Activos
            </option>

            <option value="inactive">
              Inactivos
            </option>

          </select>

        </div>

        <!-- TABLE -->
        <div class="admin-table-wrap">

          <!-- LUGARES -->
          <table v-if="activeSection === 'places'" class="admin-table">

            <thead>

              <tr>
                <th>
                  Lugar
                </th>

                <th>
                  Categoría
                </th>

                <th>
                  Teléfono
                </th>

                <th>
                  Creación
                </th>

                <th>
                  Estado
                </th>

                <th>
                  Acciones
                </th>
              </tr>

            </thead>

            <tbody>

              <tr v-for="item in filteredPlaces" :key="item.id">

                <td>

                  <div class="admin-record">

                    <img :src="item.image" :alt="item.name">

                    <div>
                      <strong>
                        {{ item.name }}
                      </strong>
                    </div>

                  </div>

                </td>

                <td>

                  <span class="admin-category">
                    {{ item.categoryName }}
                  </span>

                </td>

                <td>
                  {{ item.phone || '—' }}
                </td>

                <td>
                  {{ formatDate(item.date_create) }}
                </td>

                <td>

                  <button class="admin-status" :class="{
                    inactive: !item.active
                  }" @click="togglePlace(item)">

                    <span></span>

                    {{
                      item.active
                        ? 'Activo'
                        : 'Inactivo'
                    }}

                  </button>

                </td>

                <td>

                  <div class="admin-actions">

                    <button title="Editar" @click="openEditPlace(item)">
                      <i class="fa-light fa-pen"></i>
                    </button>

                    <button class="danger" title="Eliminar" @click="
                      askDelete(
                        'place',
                        item.id,
                        item.name
                      )
                      ">
                      <i class="fa-light fa-trash"></i>
                    </button>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

          <!-- DESTINOS -->
          <table v-else class="admin-table">

            <thead>

              <tr>

                <th>
                  Destino
                </th>

                <th>
                  Enlace
                </th>

                <th>
                  Estado
                </th>

                <th>
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              <tr v-for="item in filteredDestinations" :key="item.id">

                <td>

                  <div class="admin-record">

                    <img :src="item.image" :alt="item.name">

                    <div>

                      <strong>
                        {{ item.name }}
                      </strong>

                      <span>
                        ID {{ item.id }}
                      </span>

                    </div>

                  </div>

                </td>

                <td>
                  {{ item.link }}
                </td>

                <td>

                  <button class="admin-status" :class="{
                    inactive: !item.active
                  }" @click="toggleDestination(item)">

                    <span></span>

                    {{
                      item.active
                        ? 'Activo'
                        : 'Inactivo'
                    }}

                  </button>

                </td>

                <td>

                  <div class="admin-actions">

                    <button title="Editar" @click="openEditDestination(item)">
                      <i class="fa-light fa-pen"></i>
                    </button>

                    <button class="danger" title="Eliminar" @click="
                      askDelete(
                        'destination',
                        item.id,
                        item.name
                      )
                      ">
                      <i class="fa-light fa-trash"></i>
                    </button>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

          <!-- EMPTY -->
          <div v-if="
            activeSection === 'places'
              ? !filteredPlaces.length
              : !filteredDestinations.length
          " class="admin-empty">

            <i class="fa-light fa-magnifying-glass"></i>

            <p>
              No encontramos resultados con esos filtros.
            </p>

          </div>

        </div>

      </section>

    </section>

    <!-- MODAL CREAR / EDITAR -->
    <div v-if="modalOpen" class="admin-modal" @click.self="modalOpen = false">

      <div class="admin-modal__dialog">

        <!-- HEADER -->
        <div class="admin-modal__header">

          <div>

            <span>
              {{
                editingId === null
                  ? 'CREAR'
                  : 'EDITAR'
              }}
            </span>

            <h2>
              {{
                activeSection === 'places'
                  ? 'Lugar'
                  : 'Destino'
              }}
            </h2>

          </div>

          <button type="button" @click="modalOpen = false">
            <i class="fa-light fa-xmark"></i>
          </button>

        </div>

        <!-- FORM -->
        <form class="admin-form" @submit.prevent="saveItem">

          <!-- LUGAR -->
          <template v-if="activeSection === 'places'">

            <label class="admin-form__wide">

              <span>
                Nombre
              </span>

              <input v-model="placeForm.name" required type="text">

            </label>

            <label>

              <span>
                Categoría
              </span>

              <select v-model="placeForm.category" @change="updateCategoryName">

                <option value="restaurantes">
                  Restaurantes
                </option>

                <option value="joyeria">
                  Joyería
                </option>

                <option value="experiencia">
                  Experiencia
                </option>

              </select>

            </label>

            <label>

              <span>
                Teléfono
              </span>

              <input v-model="placeForm.phone" type="text">

            </label>

            <label class="admin-form__wide">

              <span>
                Descripción
              </span>

              <textarea v-model="placeForm.description" required rows="4"></textarea>

            </label>

            <label class="admin-form__wide">

              <span>
                URL de imagen
              </span>

              <input v-model="placeForm.image" required type="url">

            </label>

          </template>

          <!-- DESTINO -->
          <template v-else>

            <label class="admin-form__wide">

              <span>
                Nombre
              </span>

              <input v-model="destinationForm.name" required type="text">

            </label>

            <label class="admin-form__wide">

              <span>
                URL de imagen
              </span>

              <input v-model="destinationForm.image" required type="url">

            </label>

            <label class="admin-form__wide">

              <span>
                Enlace
              </span>

              <input v-model="destinationForm.link" required type="text">

            </label>

          </template>

          <!-- STATUS -->
          <label class="admin-toggle-row admin-form__wide">

            <div>

              <span>
                Estado
              </span>

              <small>
                Controla si el registro está activo.
              </small>

            </div>

            <input v-if="activeSection === 'places'" v-model="placeForm.active" type="checkbox">

            <input v-else v-model="destinationForm.active" type="checkbox">

          </label>

          <!-- FOOTER -->
          <div class="admin-modal__footer admin-form__wide">

            <button type="button" class="admin-btn-secondary" @click="modalOpen = false">
              CANCELAR
            </button>

            <button type="submit" class="btn">
              GUARDAR CAMBIOS

              <i class="fa-solid fa-arrow-right"></i>
            </button>

          </div>

        </form>

      </div>

    </div>

    <!-- MODAL ELIMINAR -->
    <div v-if="deleteTarget" class="admin-modal admin-modal--confirm" @click.self="deleteTarget = null">

      <div class="admin-confirm">

        <div class="admin-confirm__icon">
          <i class="fa-light fa-trash"></i>
        </div>

        <h2>
          Eliminar registro
        </h2>

        <p>
          ¿Seguro que quieres eliminar
          <strong>
            {{ deleteTarget.name }}
          </strong>?
        </p>

        <div>

          <button class="admin-btn-secondary" @click="deleteTarget = null">
            CANCELAR
          </button>

          <button class="admin-btn-danger" @click="confirmDelete">
            ELIMINAR
          </button>

        </div>

      </div>

    </div>

  </main>
</template>