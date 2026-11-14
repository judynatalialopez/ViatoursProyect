<script setup lang="ts">
import { computed } from 'vue'

type DailyView = { day: string; views: number }
const props = defineProps<{
  daily: DailyView[]
  month: string
  monthLabel: string
  days: number
}>()

const pad = (n: number) => String(n).padStart(2, '0')

/* Gráfica */

const dailySeries = computed(() => {

  const map = new Map(props.daily.map(d => [d.day, d.views]))

  return Array.from({ length: props.days }, (_, i) => ({

    day: i + 1,

    views: map.get(`${props.month}-${pad(i + 1)}`) || 0,

  }))

})

const dailyMax = computed(() => Math.max(1, ...dailySeries.value.map(d => d.views)))

const chartBar = (views: number, index: number) => {

  const width = 600 / dailySeries.value.length

  const height = (views / dailyMax.value) * 150

  return {

    x: index * width + 2,

    y: 160 - height,

    width: Math.max(width - 4, 1),

    height,

  }

}
</script>

<template>
  <div class="dash-panel">

    <div class="dash-panel__head">

      <h2>

        <i class="fa-solid fa-chart-column"></i>

        Vistas por día

      </h2>

      <span>

        {{

          monthLabel

        }}

      </span>

    </div>

    <svg class="dash-chart" viewBox="0 0 600 175" preserveAspectRatio="none" role="img" aria-label="Vistas por día">

      <line x1="0" y1="160" x2="600" y2="160" class="dash-chart__axis" />

      <rect v-for="(d, i) in dailySeries" :key="d.day" :x="chartBar(d.views, i).x" :y="chartBar(d.views, i).y"
        :width="chartBar(d.views, i).width" :height="chartBar(d.views, i).height" rx="2" class="dash-chart__bar">

        <title>

          Día {{ d.day }}: {{ d.views }} vistas

        </title>

      </rect>

    </svg>

    <div class="dash-chart__foot">

      <span>

        1

      </span>

      <span>

        Máximo diario:

        {{

          dailyMax

        }}

      </span>

      <span>

        {{

          days

        }}

      </span>

    </div>

  </div>
</template>
