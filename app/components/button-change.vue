<script setup>
const dark = ref(false)

const emit = defineEmits(['change'])

function toggleDark() {
  dark.value = !dark.value
  emit('change', dark.value)
}
</script>

<template>
  <button type="button" class="light-toggle" :class="{ active: dark }" :aria-pressed="dark"
    aria-label="Cambiar modo de visualización" @click="toggleDark">
    <i class="fa-light fa-lightbulb"></i>
  </button>
</template>
