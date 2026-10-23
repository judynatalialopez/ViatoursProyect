<script setup>
import ButtonChange from '~/components/button-change.vue'
import ButtonLink from '~/components/button-link.vue'

const dark = useState('dark-mode', () => false)
</script>

<template>
  <div :class="{ dark: dark }">
    <ButtonChange @change="dark = $event" />

    <ButtonLink />

    <NuxtPage />
  </div>
</template>
