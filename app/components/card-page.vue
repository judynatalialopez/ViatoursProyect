<script setup>
defineProps({
  recorridosHref: {
    type: String,
    default: '/route-place',
  },
  restaurantesHref: {
    type: String,
    default: '/restaurant',
  },
})
</script>

<template>
  <div class="card">
    <div class="img">
      <slot name="img" />
    </div>

    <div class="information">
      <h3>
        <slot name="title" />
      </h3>

      <div class="txt-none">
        <p>Busca el destino para iniciar el recorrido ahora</p>

        <div class="content-btns">
          <Button :href="restaurantesHref" class="border-green">
            <i class="fa-light fa-utensils"></i>
            Restaurantes
          </Button>

          <Button :href="recorridosHref">
            <i class="fa-light fa-route"></i>
            Recorridos
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>