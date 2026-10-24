<script setup>
const dark = useState('dark-mode', () => false)

function toggleDark() {
  dark.value = !dark.value
}
</script>

<template>
  <button type="button" class="light-toggle" :class="{ active: dark }" :aria-pressed="dark"
    aria-label="Cambiar modo de visualización" @click="toggleDark">
    <i class="fa-light fa-lightbulb"></i>
  </button>
</template>
