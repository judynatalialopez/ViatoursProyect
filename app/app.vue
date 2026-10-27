<script setup>
import ButtonChange from '~/components/button-change.vue'
import ButtonLink from '~/components/button-link.vue'
import CustomCursor from '~/components/custom-cursor.vue'

const dark = useState('dark-mode', () => false)
</script>

<template>
  <div :class="{ dark: dark }">
    <ButtonChange @change="dark = $event" />
    <CustomCursor />
    <ButtonLink />

    <NuxtPage />
  </div>
</template>
