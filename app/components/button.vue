<script setup>
defineProps({
  href: String,
})
</script>

<template>
  <component :is="href ? 'a' : 'button'" class="btn" :href="href" :type="href ? undefined : 'button'">
    <slot />
  </component>
</template>