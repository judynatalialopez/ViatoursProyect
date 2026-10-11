<script setup>
import { routes } from '../data/restaurant-obj'

</script>

<template>
  <Header />

  <section v-if="routes.length" class="home route" :style="{ backgroundImage: `url('${routes[0].image}')` }">
    <div class="container">
      <h1>{{ routes[0].title }}</h1>

      <Decoration variante="yellow">
        <ul>
          <li>HISTORIA</li>
          <li>CULTURA</li>
          <li>NATURALEZA</li>
        </ul>
      </Decoration>

      <form action="">

      </form>
    </div>
  </section>
</template>