<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useAdminData } from '~/composables/useAdminData'

import type {
  CatalogPlace,
  Category,
  Destination,
} from '~/composables/useAdminData'

import { adminIconOptions } from '~/data/adminIcons'

const {
  destinations,
  categories,
  places,
  load,
  request,
} = useAdminData()

const activeSection = ref<
  'places' | 'destinations' | 'categories'
>('places')

const search = ref('')

const statusFilter = ref<
  'all' | 'active' | 'inactive'
>('all')

const modalOpen = ref(false)

const adminDark = ref(false)

const editingId = ref<number | null>(null)

const error = ref('')

const deleteTarget = ref<{
  type: 'place' | 'destination' | 'category'
  id: number
  name: string
} | null>(null)

/**
 * ICONOS
 */
const iconOptions = adminIconOptions

const iconSearch = ref('')

const filteredIconOptions = computed(() => {
  const term = iconSearch.value
    .trim()
    .toLowerCase()

  if (!term) {
    return iconOptions
  }

  return iconOptions.filter((icon) => {
    return (
      icon.label.toLowerCase().includes(term) ||
      icon.value.toLowerCase().includes(term)
    )
  })
})

const selectCategoryIcon = (
  icon: string,
) => {
  categoryForm.icon = icon
}

/**
 * FORMULARIOS VACÍOS
 */
const emptyPlace = (): CatalogPlace => ({
  id: 0,
  destinationId:
    destinations.value[0]?.id || 0,
  categoryId: 0,
  name: '',
  category: '',
  categoryName: '',
  description: '',
  phone: '',
  address: '',
  image: '',
  url: '',
  date_create: '',
  active: true,
})

const emptyDestination = (): Destination => ({
  id: 0,
  name: '',
  image: '',
  link: '/catalog',
  active: true,
})

const emptyCategory = (): Category => ({
  id: 0,
  name: '',
  slug: '',
  icon: 'fa-solid fa-tag',
  active: true,
})

const placeForm =
  reactive<CatalogPlace>(
    emptyPlace(),
  )

const destinationForm =
  reactive<Destination>(
    emptyDestination(),
  )

const categoryForm =
  reactive<Category>(
    emptyCategory(),
  )

/**
 * GALERÍA
 */
const addGalleryImage = () => {
  if (!placeForm.gallery) {
    placeForm.gallery = []
  }

  placeForm.gallery.push('')
}

const removeGalleryImage = (
  index: number,
) => {
  placeForm.gallery?.splice(
    index,
    1,
  )
}

/**
 * TEMA ADMIN
 */
const toggleAdminTheme = () => {
  adminDark.value =
    !adminDark.value

  if (import.meta.client) {
    localStorage.setItem(
      'viatours-admin-theme',
      adminDark.value
        ? 'dark'
        : 'light',
    )
  }
}

/**
 * CATEGORÍAS
 */
const availableCategories =
  computed(() => categories.value)

/**
 * FILTRAR LUGARES
 */
const filteredPlaces =
  computed(() => {
    const term =
      search.value
        .trim()
        .toLowerCase()

    return places.value.filter(
      (item) => {
        const matchesSearch =
          !term ||
          item.name
            .toLowerCase()
            .includes(term) ||
          item.categoryName
            .toLowerCase()
            .includes(term) ||
          (item.phone || '')
            .toLowerCase()
            .includes(term)

        const matchesStatus =
          statusFilter.value ===
          'all' ||
          (
            statusFilter.value ===
              'active'
              ? item.active
              : !item.active
          )

        return (
          matchesSearch &&
          matchesStatus
        )
      },
    )
  })

/**
 * AGRUPAR LUGARES POR DESTINO
 */
const groupedPlaces =
  computed(() => {
    return destinations.value
      .map((destination) => ({
        destination,

        places:
          filteredPlaces.value.filter(
            (place) =>
              place.destinationId ===
              destination.id,
          ),
      }))
      .filter(
        (group) =>
          group.places.length > 0,
      )
  })

/**
 * FILTRAR DESTINOS
 */
const filteredDestinations =
  computed(() => {
    const term =
      search.value
        .trim()
        .toLowerCase()

    return destinations.value.filter(
      (item) =>
        (
          !term ||
          item.name
            .toLowerCase()
            .includes(term)
        ) &&
        (
          statusFilter.value ===
          'all' ||
          (
            statusFilter.value ===
              'active'
              ? item.active
              : !item.active
          )
        ),
    )
  })

/**
 * FILTRAR CATEGORÍAS
 */
const filteredCategories =
  computed(() => {
    const term =
      search.value
        .trim()
        .toLowerCase()

    return categories.value.filter(
      (item) =>
        (
          !term ||
          item.name
            .toLowerCase()
            .includes(term)
        ) &&
        (
          statusFilter.value ===
          'all' ||
          (
            statusFilter.value ===
              'active'
              ? item.active
              : !item.active
          )
        ),
    )
  })

/**
 * ESTADÍSTICAS
 */
const stats = computed(() => ({
  destinations:
    destinations.value.length,

  places:
    places.value.length,
}))

const categoryStats =
  computed(() =>
    categories.value.map(
      (category) => ({
        ...category,

        count:
          places.value.filter(
            (item) =>
              item.categoryId ===
              category.id,
          ).length,
      }),
    ),
  )

/**
 * FORMATEAR FECHA
 */
const formatDate = (
  date: string,
) => {
  if (!date) {
    return '—'
  }

  const parsed =
    new Date(date)

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return date
  }

  return new Intl.DateTimeFormat(
    'es-CO',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(parsed)
}

/**
 * AUTENTICACIÓN
 */
const ensureAuth = async () => {
  try {
    await request('/auth/me')

    await load()
  } catch {
    await navigateTo(
      '/admin/login',
    )
  }
}

onMounted(() => {
  adminDark.value =
    localStorage.getItem(
      'viatours-admin-theme',
    ) === 'dark'

  ensureAuth()
})

/**
 * CAMBIAR SECCIÓN
 */
const setSection = (
  section:
    | 'places'
    | 'destinations'
    | 'categories',
) => {
  activeSection.value =
    section

  search.value = ''

  statusFilter.value =
    'all'

  error.value = ''
}

/**
 * CREAR
 */
const openCreate = () => {
  editingId.value = null

  error.value = ''

  iconSearch.value = ''

  if (
    activeSection.value ===
    'places'
  ) {
    Object.assign(
      placeForm,
      emptyPlace(),
    )

    placeForm.categoryId =
      availableCategories
        .value[0]?.id || 0
  } else if (
    activeSection.value ===
    'destinations'
  ) {
    Object.assign(
      destinationForm,
      emptyDestination(),
    )
  } else {
    Object.assign(
      categoryForm,
      emptyCategory(),
    )
  }

  modalOpen.value = true
}

/**
 * EDITAR LUGAR
 */
const openEditPlace = async (
  item: CatalogPlace,
) => {
  editingId.value = item.id

  error.value = ''

  try {
    const detail =
      await request<CatalogPlace>(
        `/places/${item.id}`,
      )

    Object.assign(
      placeForm,
      detail,
      {
        gallery: [
          ...(detail.gallery ||
            []),
        ],
      },
    )
  } catch {
    Object.assign(
      placeForm,
      item,
      {
        gallery: [],
      },
    )
  }

  modalOpen.value = true
}

/**
 * EDITAR DESTINO
 */
const openEditDestination = (
  item: Destination,
) => {
  editingId.value = item.id

  Object.assign(
    destinationForm,
    item,
  )

  modalOpen.value = true
}

/**
 * EDITAR CATEGORÍA
 */
const openEditCategory = (
  item: Category,
) => {
  editingId.value = item.id

  iconSearch.value = ''

  Object.assign(
    categoryForm,
    item,
  )

  modalOpen.value = true
}

/**
 * GUARDAR
 */
const saveItem = async () => {
  error.value = ''

  try {
    /**
     * LUGAR
     */
    if (
      activeSection.value ===
      'places'
    ) {
      const body = {
        destinationId:
          placeForm.destinationId,

        categoryId:
          placeForm.categoryId,

        name:
          placeForm.name,

        description:
          placeForm.description,

        phone:
          placeForm.phone,

        address:
          placeForm.address || '',

        image:
          placeForm.image,

        gallery:
          (
            placeForm.gallery ||
            []
          )
            .map(
              (item) =>
                item.trim(),
            )
            .filter(Boolean),

        active:
          placeForm.active,
      }

      await request(
        `/places${editingId.value
          ? `/${editingId.value}`
          : ''
        }`,
        {
          method:
            editingId.value
              ? 'PUT'
              : 'POST',

          body,
        },
      )
    }

    /**
     * DESTINO
     */
    else if (
      activeSection.value ===
      'destinations'
    ) {
      await request(
        `/destinations${editingId.value
          ? `/${editingId.value}`
          : ''
        }`,
        {
          method:
            editingId.value
              ? 'PUT'
              : 'POST',

          body: {
            name:
              destinationForm.name,

            image:
              destinationForm.image,

            active:
              destinationForm.active,
          },
        },
      )
    }

    /**
     * CATEGORÍA
     */
    else {
      await request(
        `/categories${editingId.value
          ? `/${editingId.value}`
          : ''
        }`,
        {
          method:
            editingId.value
              ? 'PUT'
              : 'POST',

          body: {
            name:
              categoryForm.name,

            icon:
              categoryForm.icon,

            active:
              categoryForm.active,
          },
        },
      )
    }

    await load()

    modalOpen.value = false
  } catch (e: any) {
    error.value =
      e?.data?.message ||
      'No fue posible guardar los cambios.'
  }
}

/**
 * ACTIVAR / DESACTIVAR LUGAR
 */
const togglePlace = async (
  item: CatalogPlace,
) => {
  await request(
    `/places/${item.id}`,
    {
      method: 'PUT',

      body: {
        ...item,

        active:
          !item.active,
      },
    },
  )

  await load()
}

/**
 * ACTIVAR / DESACTIVAR DESTINO
 */
const toggleDestination =
  async (
    item: Destination,
  ) => {
    await request(
      `/destinations/${item.id}`,
      {
        method: 'PUT',

        body: {
          name:
            item.name,

          image:
            item.image,

          active:
            !item.active,
        },
      },
    )

    await load()
  }

/**
 * ACTIVAR / DESACTIVAR CATEGORÍA
 */
const toggleCategory =
  async (
    item: Category,
  ) => {
    await request(
      `/categories/${item.id}`,
      {
        method: 'PUT',

        body: {
          name:
            item.name,

          icon:
            item.icon,

          active:
            !item.active,
        },
      },
    )

    await load()
  }

/**
 * ELIMINAR
 */
const askDelete = (
  type:
    | 'place'
    | 'destination'
    | 'category',

  id: number,

  name: string,
) => {
  deleteTarget.value = {
    type,
    id,
    name,
  }
}

const confirmDelete =
  async () => {
    if (
      !deleteTarget.value
    ) {
      return
    }

    error.value = ''

    try {
      const path =
        deleteTarget.value
          .type === 'place'
          ? 'places'
          : deleteTarget.value
            .type ===
            'destination'
            ? 'destinations'
            : 'categories'

      await request(
        `/${path}/${deleteTarget.value.id}`,
        {
          method:
            'DELETE',
        },
      )

      deleteTarget.value =
        null

      await load()
    } catch (e: any) {
      error.value =
        e?.data?.message ||
        'No fue posible eliminar el registro.'

      deleteTarget.value =
        null
    }
  }

/**
 * LOGOUT
 */
const logout = async () => {
  try {
    await request(
      '/auth/logout',
      {
        method: 'POST',
      },
    )
  } finally {
    await navigateTo(
      '/admin/login',
    )
  }
}

/**
 * SUBIDA DE IMÁGENES
 */
const uploading =
  ref<string>('')

const uploadImage = async (
  event: Event,

  onDone: (
    url: string,
  ) => void,

  key: string,
) => {
  const input =
    event.target as HTMLInputElement

  const file =
    input.files?.[0]

  if (!file) {
    return
  }

  if (
    !file.type.startsWith(
      'image/',
    )
  ) {
    error.value =
      'Selecciona un archivo de imagen.'

    input.value = ''

    return
  }

  uploading.value = key

  error.value = ''

  try {
    const url =
      await useSubirImagen(
        file,
      )

    onDone(url)
  } catch (e: any) {
    error.value =
      e?.message ||
      'No se pudo subir la imagen.'
  } finally {
    uploading.value = ''

    input.value = ''
  }
}
</script>

<template>
  <main class="admin-shell" :class="{
    'admin-dark':
      adminDark,
  }">
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
          active:
            activeSection ===
            'places',
        }" @click="
          setSection(
            'places',
          )
          ">
          <i class="fa-solid fa-map-location-dot"></i>

          Lugares

          <span>
            {{
              stats.places
            }}
          </span>
        </button>

        <button :class="{
          active:
            activeSection ===
            'destinations',
        }" @click="
          setSection(
            'destinations',
          )
          ">
          <i class="fa-solid fa-location-dot"></i>

          Destinos

          <span>
            {{
              stats.destinations
            }}
          </span>
        </button>

        <button :class="{
          active:
            activeSection ===
            'categories',
        }" @click="
          setSection(
            'categories',
          )
          ">
          <i class="fa-solid fa-tags"></i>

          Categorías

          <span>
            {{
              categories.length
            }}
          </span>
        </button>
      </nav>

      <div class="admin-sidebar__footer">
        <a href="/" target="_blank">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>

          Ver sitio
        </a>

        <button @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>

          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- CONTENIDO -->
    <section class="admin-content">
      <!-- TOPBAR -->
      <header class="admin-topbar">
        <div>
          <span>
            Panel de
            administración
          </span>

          <h1>
            {{
              activeSection ===
                'places'
                ? 'Lugares'
                : activeSection ===
                  'destinations'
                  ? 'Destinos'
                  : 'Categorías'
            }}
          </h1>
        </div>

        <button class="btn" @click="openCreate">
          <i class="fa-solid fa-plus"></i>

          {{
            activeSection ===
              'places'
              ? 'NUEVO LUGAR'
              : activeSection ===
                'destinations'
                ? 'NUEVO DESTINO'
                : 'NUEVA CATEGORÍA'
          }}
        </button>
      </header>

      <!-- ESTADÍSTICAS -->
      <div class="admin-stats-scroll">
        <div class="admin-stats">
          <article>
            <i class="fa-solid fa-location-dot"></i>

            <div>
              <strong>
                {{
                  stats.destinations
                }}
              </strong>

              <span>
                Destinos
              </span>
            </div>
          </article>

          <article>
            <i class="fa-solid fa-map-location-dot"></i>

            <div>
              <strong>
                {{
                  stats.places
                }}
              </strong>

              <span>
                Lugares
              </span>
            </div>
          </article>

          <article v-for="category in categoryStats" :key="category.id">
            <i :class="category.icon ||
              'fa-solid fa-tag'
              "></i>

            <div>
              <strong>
                {{
                  category.count
                }}
              </strong>

              <span>
                {{
                  category.name
                }}
              </span>
            </div>
          </article>
        </div>
      </div>

      <!-- CARD -->
      <section class="admin-card">
        <div class="admin-toolbar">
          <div class="admin-search">
            <i class="fa-solid fa-magnifying-glass"></i>

            <input v-model="search" type="text" :placeholder="activeSection ===
              'places'
              ? 'Buscar lugar, categoría o teléfono...'
              : activeSection ===
                'destinations'
                ? 'Buscar destino...'
                : 'Buscar categoría...'
              ">
          </div>

          <select v-model="statusFilter
            ">
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

        <p v-if="error" class="admin-login__error">
          {{ error }}
        </p>

        <div class="admin-table-wrap">
          <!-- LUGARES -->
          <template v-if="
            activeSection ===
            'places'
          ">
            <div v-for="group in groupedPlaces" :key="group
              .destination
              .id
              " class="admin-destination-group">
              <div class="admin-destination-group__header">
                <div>
                  <span>
                    DESTINO
                  </span>

                  <h2>
                    {{
                      group
                        .destination
                        .name
                    }}
                  </h2>
                </div>

                <span class="admin-destination-group__count">
                  {{
                    group
                      .places
                      .length
                  }}

                  {{
                    group
                      .places
                      .length ===
                      1
                      ? 'lugar'
                      : 'lugares'
                  }}
                </span>
              </div>

              <table class="admin-table">
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
                  <tr v-for="item in group.places" :key="item.id
                    ">
                    <td>
                      <div class="admin-record">
                        <img :src="item.image
                          " :alt="item.name
                            ">

                        <div>
                          <strong>
                            {{
                              item.name
                            }}
                          </strong>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span class="admin-category">
                        {{
                          item.categoryName
                        }}
                      </span>
                    </td>

                    <td>
                      {{
                        item.phone ||
                        '—'
                      }}
                    </td>

                    <td>
                      {{
                        formatDate(
                          item.date_create,
                        )
                      }}
                    </td>

                    <td>
                      <button class="admin-status" :class="{
                        inactive:
                          !item.active,
                      }" @click="
                        togglePlace(
                          item,
                        )
                        ">
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
                        <button title="Editar" @click="
                          openEditPlace(
                            item,
                          )
                          ">
                          <i class="fa-solid fa-pen"></i>
                        </button>

                        <button class="danger" title="Eliminar" @click="
                          askDelete(
                            'place',
                            item.id,
                            item.name,
                          )
                          ">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- DESTINOS -->
          <table v-else-if="
            activeSection ===
            'destinations'
          " class="admin-table">
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
                    <img :src="item.image
                      " :alt="item.name
                        ">

                    <div>
                      <strong>
                        {{
                          item.name
                        }}
                      </strong>

                      <span>
                        ID
                        {{
                          item.id
                        }}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  {{
                    item.link
                  }}
                </td>

                <td>
                  <button class="admin-status" :class="{
                    inactive:
                      !item.active,
                  }" @click="
                    toggleDestination(
                      item,
                    )
                    ">
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
                    <button title="Editar" @click="
                      openEditDestination(
                        item,
                      )
                      ">
                      <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="danger" title="Eliminar" @click="
                      askDelete(
                        'destination',
                        item.id,
                        item.name,
                      )
                      ">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- CATEGORÍAS -->
          <table v-else class="admin-table">
            <thead>
              <tr>
                <th>
                  Categoría
                </th>

                <th>
                  Icono
                </th>

                <th>
                  Lugares
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
              <tr v-for="item in filteredCategories" :key="item.id">
                <td>
                  <span class="admin-category">
                    {{
                      item.name.toUpperCase()
                    }}
                  </span>
                </td>

                <td class="admin-table__icon">
                  <span class="admin-category-icon">
                    <i :class="item.icon || 'fa-solid fa-tag'"></i>
                  </span>
                </td>

                <td>
                  {{
                    item.placeCount ||
                    0
                  }}
                </td>

                <td>
                  <button class="admin-status" :class="{
                    inactive:
                      !item.active,
                  }" @click="
                    toggleCategory(
                      item,
                    )
                    ">
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
                    <button title="Editar" @click="
                      openEditCategory(
                        item,
                      )
                      ">
                      <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="danger" title="Eliminar" @click="
                      askDelete(
                        'category',
                        item.id,
                        item.name,
                      )
                      ">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- VACÍO -->
          <div v-if="
            activeSection ===
              'places'
              ? !groupedPlaces.length
              : activeSection ===
                'destinations'
                ? !filteredDestinations.length
                : !filteredCategories.length
          " class="admin-empty">
            <i class="fa-solid fa-magnifying-glass"></i>

            <p>
              No encontramos resultados con esos filtros.
            </p>
          </div>
        </div>
      </section>
    </section>

    <!-- MODAL CREAR / EDITAR -->
    <div v-if="modalOpen" class="admin-modal" @click.self="
      modalOpen = false
      ">
      <div class="admin-modal__dialog">
        <div class="admin-modal__header">
          <div>
            <span>
              {{
                editingId ===
                  null
                  ? 'CREAR'
                  : 'EDITAR'
              }}
            </span>

            <h2>
              {{
                activeSection ===
                  'places'
                  ? 'Lugar'
                  : activeSection ===
                    'destinations'
                    ? 'Destino'
                    : 'Categoría'
              }}
            </h2>
          </div>

          <button type="button" @click="
            modalOpen =
            false
            ">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form class="admin-form" @submit.prevent="
          saveItem
        ">
          <!-- LUGAR -->
          <template v-if="
            activeSection ===
            'places'
          ">
            <label class="admin-form__wide">
              <span>
                Nombre
              </span>

              <input v-model="placeForm.name
                " required type="text">
            </label>

            <label>
              <span>
                Destino
              </span>

              <select v-model.number="placeForm.destinationId
                " required>
                <option v-for="item in destinations" :key="item.id
                  " :value="item.id
                    ">
                  {{
                    item.name
                  }}
                </option>
              </select>
            </label>

            <label>
              <span>
                Categoría
              </span>

              <select v-model.number="placeForm.categoryId
                " required>
                <option v-for="item in availableCategories" :key="item.id
                  " :value="item.id
                    ">
                  {{
                    item.name
                  }}
                </option>
              </select>
            </label>

            <label>
              <span>
                Teléfono
              </span>

              <input v-model="placeForm.phone
                " type="text">
            </label>

            <label>
              <span>
                Dirección del lugar
              </span>

              <input v-model="placeForm.address
                " required type="text" placeholder="Ej. Cra. 7 #26-62">

              <small class="admin-form__hint">
                Escribe la dirección física exacta donde está ubicado el sitio.
              </small>
            </label>

            <label class="admin-form__wide">
              <span>
                Descripción
              </span>

              <textarea v-model="placeForm.description
                " required rows="4"></textarea>
            </label>

            <!-- PORTADA -->
            <label class="admin-form__wide">
              <span>
                Imagen de portada
              </span>

              <div style="
                  display: flex;
                  gap: 8px;
                ">
                <input v-model="placeForm.image
                  " required type="url" readonly placeholder="Sube una imagen..." style="
                    flex: 1;
                  ">

                <label class="admin-btn-secondary" style="
                    cursor: pointer;
                    white-space: nowrap;
                  ">
                  <i class="fa-solid fa-arrow-up-from-bracket"></i>

                  {{
                    uploading ===
                      'cover'
                      ? 'SUBIENDO...'
                      : 'SUBIR'
                  }}

                  <input type="file" accept="image/*" hidden :disabled="!!uploading
                    " @change="
                      uploadImage(
                        $event,
                        (url) =>
                          placeForm.image =
                          url,
                        'cover',
                      )
                      ">
                </label>
              </div>

              <small class="admin-form__hint">
                La portada también se incluirá como primera imagen del slider.
              </small>
            </label>

            <!-- GALERÍA -->
            <div class="
                admin-gallery
                admin-form__wide
              ">
              <div class="admin-gallery__header">
                <div>
                  <span>
                    Imágenes adicionales del slider
                  </span>

                  <small>
                    Añade tantas imágenes como necesites.
                    Total actual:
                    {{
                      1 +
                      (
                        placeForm
                          .gallery
                          ?.length ||
                        0
                      )
                    }}
                    contando la portada.
                  </small>
                </div>

                <button type="button" class="admin-btn-secondary" @click="
                  addGalleryImage
                ">
                  <i class="fa-solid fa-plus"></i>

                  AÑADIR IMAGEN
                </button>
              </div>

              <div v-if="
                placeForm
                  .gallery
                  ?.length
              " class="admin-gallery__list">
                <div v-for="(
_,
  index
                  ) in placeForm.gallery" :key="index
                    " class="admin-gallery__row">
                  <span>
                    {{
                      index + 2
                    }}
                  </span>

                  <input v-model="placeForm.gallery[
                    index
                  ]
                    " type="url" readonly :placeholder="`Sube la imagen ${index + 2}`
                      ">

                  <label class="admin-gallery__action" title="Subir desde el computador">
                    <i :class="uploading ===
                      `gallery-${index}`
                      ? 'fa-solid fa-spinner fa-spin'
                      : 'fa-solid fa-arrow-up-from-bracket'
                      "></i>

                    <input type="file" accept="image/*" hidden :disabled="!!uploading
                      " @change="
                        uploadImage(
                          $event,
                          (url) => {
                            if (
                              placeForm.gallery
                            ) {
                              placeForm.gallery[
                                index
                              ] =
                                url
                            }
                          },
                          `gallery-${index}`,
                        )
                        ">
                  </label>

                  <button type="button" class="
                      admin-gallery__action
                      admin-gallery__action--danger
                    " title="Quitar imagen" @click="
                      removeGalleryImage(
                        index,
                      )
                      ">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

              <p v-else class="admin-gallery__empty">
                Solo se mostrará la portada hasta que añadas más imágenes.
              </p>
            </div>
          </template>

          <!-- DESTINO -->
          <template v-else-if="
            activeSection ===
            'destinations'
          ">
            <label class="admin-form__wide">
              <span>
                Nombre
              </span>

              <input v-model="destinationForm.name
                " required type="text">
            </label>

            <label class="admin-form__wide">
              <span>
                Imagen
              </span>

              <div style="
                  display: flex;
                  gap: 8px;
                ">
                <input v-model="destinationForm.image
                  " required type="url" readonly placeholder="Sube una imagen...">

                <label class="admin-btn-secondary" style="
                    cursor: pointer;
                    white-space: nowrap;
                  ">
                  <i class="fa-solid fa-arrow-up-from-bracket"></i>

                  {{
                    uploading ===
                      'dest'
                      ? 'SUBIENDO...'
                      : 'SUBIR'
                  }}

                  <input type="file" accept="image/*" hidden :disabled="!!uploading
                    " @change="
                      uploadImage(
                        $event,
                        (url) =>
                          destinationForm.image =
                          url,
                        'dest',
                      )
                      ">
                </label>
              </div>
            </label>

            <label class="admin-form__wide">
              <span>
                Enlace
              </span>

              <input v-model="destinationForm.link
                " type="text" readonly>
            </label>
          </template>

          <!-- CATEGORÍA -->
          <template v-else>
            <label class="admin-form__wide">
              <span>
                Nombre
              </span>

              <input v-model="categoryForm.name
                " required type="text">
            </label>

            <div class="
                admin-form__wide
                admin-icon-field
              ">
              <span class="admin-icon-field__label">
                Icono de Font Awesome
              </span>

              <div class="admin-icon-selector">
                <!-- BUSCADOR -->
                <div class="admin-icon-search">
                  <i class="fa-solid fa-magnifying-glass"></i>

                  <input class="icon" v-model="iconSearch
                    " type="text" placeholder="Buscar icono..." autocomplete="off">

                  <button v-if="
                    iconSearch
                  " type="button" class="admin-icon-search__clear" title="Limpiar búsqueda" @click="
                    iconSearch =
                    ''
                    ">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <!-- GRID -->
                <div v-if="
                  filteredIconOptions.length
                " class="admin-icon-grid">
                  <button v-for="icon in filteredIconOptions" :key="icon.value
                    " type="button" class="admin-icon-option" :class="{
                      active:
                        categoryForm.icon ===
                        icon.value,
                    }" :title="icon.label
                      " @click="
                        selectCategoryIcon(
                          icon.value,
                        )
                        ">
                    <i :class="icon.value
                      "></i>

                    <span>
                      {{
                        icon.label
                      }}
                    </span>
                  </button>
                </div>

                <!-- VACÍO -->
                <div v-else class="admin-icon-empty">
                  <i class="fa-solid fa-circle-exclamation"></i>

                  <div>
                    <strong>
                      No encontramos ese icono
                    </strong>

                    <span>
                      Intenta buscar con otra palabra.
                    </span>
                  </div>
                </div>

                <!-- SELECCIONADO -->
                <div class="admin-icon-selected">
                  <span>
                    Icono seleccionado
                  </span>

                  <div>
                    <span class="admin-icon-selected__preview">
                      <i :class="categoryForm.icon ||
                        'fa-solid fa-tag'
                        "></i>
                    </span>

                    <code>
                      {{
                        categoryForm.icon ||
                        'fa-solid fa-tag'
                      }}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ESTADO -->
          <label class="
              admin-form__status
              admin-form__wide
            ">
            <input v-if="
              activeSection ===
              'places'
            " v-model="placeForm.active
              " type="checkbox">

            <input v-else-if="
              activeSection ===
              'destinations'
            " v-model="destinationForm.active
              " type="checkbox">

            <input v-else v-model="categoryForm.active
              " type="checkbox">

            <span>
              Registro activo
            </span>
          </label>

          <p v-if="error" class="
              admin-login__error
              admin-form__wide
            ">
            {{ error }}
          </p>

          <!-- FOOTER -->
          <div class="
              admin-modal__footer
              admin-form__wide
            ">
            <button type="button" class="admin-btn-secondary" @click="
              modalOpen =
              false
              ">
              CANCELAR
            </button>

            <button type="submit" class="btn">
              GUARDAR CAMBIOS
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL ELIMINAR -->
    <div v-if="
      deleteTarget
    " class="
        admin-modal
        admin-modal--confirm
      " @click.self="
        deleteTarget =
        null
        ">
      <div class="admin-confirm">
        <div class="admin-confirm__icon">
          <i class="fa-solid fa-trash"></i>
        </div>

        <h2>
          Eliminar registro
        </h2>

        <p>
          ¿Seguro que quieres eliminar

          <strong>
            {{
              deleteTarget.name
            }}
          </strong>?
        </p>

        <div>
          <button class="admin-btn-secondary" @click="
            deleteTarget =
            null
            ">
            CANCELAR
          </button>

          <button class="admin-btn-danger" @click="
            confirmDelete
          ">
            ELIMINAR
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
