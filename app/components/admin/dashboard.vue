<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { CatalogPlace, Destination } from '~/composables/useAdminData'
import { useAdminData } from '~/composables/useAdminData'
import { generatePlaceReport } from '~/utils/pdf/place-report'
import { generateSiteReport } from '~/utils/pdf/site-report'

const props = defineProps<{
  places: CatalogPlace[]
  destinations: Destination[]
  request: ReturnType<typeof useAdminData>['request']
}>()

/**

 * DASHBOARD

 */
type RankingRow = {

  id: number

  name: string

  category: string

  views: number

  clicks: number

  uniques: number

}

type StatsResponse = {

  ranking: RankingRow[]

  daily: { day: string; views: number }[]

  devices: { device: string; total: number }[]

}

const pad = (n: number) => String(n).padStart(2, '0')

const isAgreement = (place: { categoryName?: string }) =>

  place.categoryName?.trim().toLowerCase() === 'convenio'

const now = new Date()

const month = ref(`${now.getFullYear()}-${pad(now.getMonth() + 1)}`)



const range = computed(() => {

  const [y, m] = month.value

    .split('-')

    .map(Number) as [number, number]

  const days = new Date(y, m, 0).getDate()

  return {

    from: `${y}-${pad(m)}-01`,

    to: `${y}-${pad(m)}-${pad(days)}`,

    days,

  }

})

const monthLabel = computed(() => {

  const [y, m] = month.value

    .split('-')

    .map(Number) as [number, number]

  return new Intl.DateTimeFormat('es-CO', {

    month: 'long',

    year: 'numeric',

  }).format(new Date(y, m - 1, 1))

})

const error = ref('')

const statsData = ref<StatsResponse>({ ranking: [], daily: [], devices: [] })

const statsLoading = ref(false)


const loadStats = async () => {

  statsLoading.value = true

  try {

    statsData.value = await props.request<StatsResponse>(

      `/analytics/stats?from=${range.value.from}&to=${range.value.to}`,

    )

  } catch {

    error.value = 'No fue posible cargar las estadísticas.'

  } finally {

    statsLoading.value = false

  }

}

watch(month, loadStats)

onMounted(loadStats)

/* Tarjetas */

const totalPlaces = computed(() => props.places.length)

const agreementCount = computed(() => props.places.filter(isAgreement).length)

const totalViews = computed(() =>

  statsData.value.ranking.reduce((sum, r) => sum + r.views, 0),

)

/* Tabla */

const dashSearch = ref('')

const dashPageSize = ref(5)

const dashPage = ref(1)

const dashSort = ref<{ key: 'name' | 'category' | 'views'; dir: 'asc' | 'desc' }>({

  key: 'views',

  dir: 'desc',

})

const toggleDashSort = (key: 'name' | 'category' | 'views') => {

  dashSort.value =

    dashSort.value.key === key

      ? { key, dir: dashSort.value.dir === 'asc' ? 'desc' : 'asc' }

      : { key, dir: key === 'views' ? 'desc' : 'asc' }

}

const dashboardRows = computed(() => {

  const byId = new Map(statsData.value.ranking.map(r => [r.id, r]))

  const term = dashSearch.value.trim().toLowerCase()

  const rows = props.places

    .filter(isAgreement) // solo lugares con convenio

    .map(place => ({

      id: place.id,

      name: place.name,

      image: place.image,

      category: place.categoryName,

      views: byId.get(place.id)?.views || 0,

    }))

    .filter(r =>

      !term ||

      r.name.toLowerCase().includes(term) ||

      (r.category || '').toLowerCase().includes(term),

    )

  const { key, dir } = dashSort.value

  const factor = dir === 'asc' ? 1 : -1

  return rows.sort((a, b) =>

    key === 'views'

      ? (a.views - b.views) * factor

      : String(a[key] || '').localeCompare(String(b[key] || ''), 'es') * factor,

  )

})

const dashTotalPages = computed(() =>

  Math.max(1, Math.ceil(dashboardRows.value.length / dashPageSize.value)),

)

const pagedRows = computed(() => {

  const start = (dashPage.value - 1) * dashPageSize.value

  return dashboardRows.value.slice(start, start + dashPageSize.value)

})

/* Paginación con "…" */

const pageButtons = computed<(number | '…')[]>(() => {

  const total = dashTotalPages.value

  const current = dashPage.value

  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 3) return [1, 2, 3, '…', total]

  if (current >= total - 2) return [1, '…', total - 2, total - 1, total]

  return [1, '…', current, '…', total]

})

watch([dashSearch, dashPageSize, month], () => {

  dashPage.value = 1

})

/* Top 5 */

const topPlaces = computed(() =>

  [...statsData.value.ranking]

    .filter(r => r.views > 0)

    .sort((a, b) => b.views - a.views)

    .slice(0, 5),

)

const topMax = computed(() => Math.max(1, ...topPlaces.value.map(p => p.views)))

/* PDF */

const pdfBusy = ref<number | 'all' | null>(null)

const downloadPlacePdf = async (row: { id: number; name: string }) => {

  pdfBusy.value = row.id

  error.value = ''

  try {

    await generatePlaceReport({

      row,

      places: props.places,

      destinations: props.destinations,

      ranking: statsData.value.ranking,

      month: month.value,

      request: props.request,

    })

  } catch (e) {

    console.error(e)

    error.value = 'Could not generate the place report.'

  } finally {

    pdfBusy.value = null

  }

}

const downloadSitePdf = async () => {

  pdfBusy.value = 'all'

  error.value = ''

  try {

    await generateSiteReport({

      month: month.value,

      monthLabel: monthLabel.value,

      agreementCount: agreementCount.value,

      totalPlaces: totalPlaces.value,

      totalViews: totalViews.value,

      ranking: statsData.value.ranking,

    })

  } catch (e) {

    console.error(e)

    error.value = 'Could not generate the site report.'

  } finally {

    pdfBusy.value = null

  }

}
</script>

<template>
  <section class="dash">

    <!-- Toolbar -->

    <div class="dash-toolbar">

      <div class="admin-search">

        <i class="fa-solid fa-magnifying-glass"></i>

        <input v-model="dashSearch" type="text" placeholder="Buscar lugar...">

      </div>

      <div class="dash-toolbar__right">

        <label class="dash-month">

          <span>

            Mes del reporte

          </span>

          <input v-model="month" type="month">

        </label>

        <button class="btn" :disabled="pdfBusy !== null || statsLoading" @click="downloadSitePdf">

          <i class="fa-solid fa-file-pdf"></i>

          {{

            pdfBusy === 'all'

              ? 'GENERANDO...'

              : 'REPORTE DEL SITIO'

          }}

        </button>

      </div>

    </div>

    <p v-if="error" class="admin-login__error">

      {{

        error

      }}

    </p>

    <!-- Tarjetas -->

    <div class="dash-cards">

      <article class="dash-card dash-card--blue">

        <i class="fa-solid fa-location-dot"></i>

        <div>

          <span>

            Total lugares

          </span>

          <strong>

            {{

              totalPlaces

            }}

          </strong>

        </div>

      </article>

      <article class="dash-card dash-card--green">

        <i class="fa-solid fa-handshake"></i>

        <div>

          <span>

            Con convenio

          </span>

          <strong>

            {{

              agreementCount

            }}

          </strong>

        </div>

      </article>

      <article class="dash-card dash-card--violet">

        <i class="fa-solid fa-eye"></i>

        <div>

          <span>

            Vistas en

            {{

              monthLabel

            }}

          </span>

          <strong>

            {{

              totalViews

            }}

          </strong>

        </div>

      </article>

    </div>

    <div class="dash-grid">

      <!-- Columna izquierda -->

      <div class="dash-main">

        <!-- Gráfica -->
        <AdminDashboardChart :daily="statsData.daily" :month="month" :month-label="monthLabel" :days="range.days" />
        <!-- Listado -->

        <div class="dash-panel">

          <div class="dash-panel__head">

            <h2>

              Listado de lugares

            </h2>

            <span>

              Mostrando

              {{

                pagedRows.length

              }}

              de

              {{

                dashboardRows.length

              }}

              lugares

            </span>

          </div>

          <div class="dash-table-wrap">

            <table class="dash-table">

              <thead>

                <tr>

                  <th>

                    <button type="button" @click="toggleDashSort('name')">

                      Lugar

                      <i class="fa-solid fa-sort"></i>

                    </button>

                  </th>

                  <th>

                    <button type="button" @click="toggleDashSort('category')">

                      Categoría

                      <i class="fa-solid fa-sort"></i>

                    </button>

                  </th>

                  <th>

                    <button type="button" @click="toggleDashSort('views')">

                      Búsquedas

                      <i class="fa-solid fa-sort"></i>

                    </button>

                  </th>

                  <th>

                    Acciones

                  </th>

                </tr>

              </thead>

              <tbody>

                <tr v-for="row in pagedRows" :key="row.id">

                  <td>

                    <div class="admin-record">

                      <img :src="row.image" :alt="row.name">

                      <div>

                        <strong>

                          {{

                            row.name

                          }}

                        </strong>

                      </div>

                    </div>

                  </td>

                  <td>

                    <span class="admin-category">

                      {{

                        row.category

                      }}

                    </span>

                  </td>

                  <td>

                    {{

                      row.views.toLocaleString('es-CO')

                    }}

                    búsquedas

                  </td>

                  <td>

                    <button type="button" class="dash-pdf" :disabled="pdfBusy !== null" @click="

                      downloadPlacePdf(

                        row,

                      )

                      ">

                      <i :class="pdfBusy === row.id

                        ? 'fa-solid fa-spinner fa-spin'

                        : 'fa-solid fa-download'"></i>

                      Descargar PDF

                    </button>

                  </td>

                </tr>

                <tr v-if="!pagedRows.length">

                  <td colspan="4" class="dash-empty">

                    No encontramos resultados.

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          <div class="dash-pager">

            <label class="dash-pager__size">

              Mostrar

              <select v-model.number="dashPageSize">

                <option :value="5">

                  5

                </option>

                <option :value="10">

                  10

                </option>

                <option :value="20">

                  20

                </option>

              </select>

              por página

            </label>

            <div class="dash-pager__pages">

              <button type="button" :disabled="dashPage === 1" @click="dashPage--">

                Anterior

              </button>

              <template v-for="(p, i) in pageButtons" :key="i">

                <span v-if="p === '…'" class="dash-pager__dots">

                  …

                </span>

                <button v-else type="button" :class="{ active: p === dashPage }" @click="dashPage = p">

                  {{

                    p

                  }}

                </button>

              </template>

              <button type="button" :disabled="dashPage === dashTotalPages" @click="dashPage++">

                Siguiente

              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- Columna derecha -->

      <aside class="dash-panel dash-top">

        <div class="dash-panel__head">

          <h2>

            <i class="fa-solid fa-chart-simple"></i>

            Lugares más buscados

          </h2>

        </div>

        <ol v-if="topPlaces.length">

          <li v-for="(p, i) in topPlaces" :key="p.id">

            <span class="dash-top__rank">

              {{

                i + 1

              }}

            </span>

            <div class="dash-top__body">

              <div class="dash-top__row">

                <strong>

                  {{

                    p.name

                  }}

                </strong>

                <span>

                  {{

                    p.views.toLocaleString('es-CO')

                  }}

                </span>

              </div>

              <div class="dash-top__bar">

                <span :style="{ width: `${(p.views / topMax) * 100}%` }"></span>

              </div>

            </div>

          </li>

        </ol>

        <p v-else class="dash-empty">

          Aún no hay vistas en este mes.

        </p>

      </aside>

    </div>

  </section>
</template>
