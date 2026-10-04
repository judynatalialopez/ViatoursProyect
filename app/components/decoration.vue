<script setup>
defineProps({
  variante: {
    type: String,
    default: 'green'
  }
})
</script>

<template>
  <div class="decoration" :class="variante">
    <div class="line"></div>
    <slot></slot>
    <div class="line"></div>
  </div>
</template>