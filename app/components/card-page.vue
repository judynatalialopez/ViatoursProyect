<script setup>
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
          <Button href="/restaurant" class="border-green"><i class="fa-light fa-utensils"></i>Restaurantes</Button>
          <Button href="/route-place"><i class="fa-light fa-route"></i>Recorridos</Button>
        </div>
      </div>
    </div>
  </div>
</template>