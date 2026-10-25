<script setup lang="ts">
import{computed,ref}from'vue'
import{useApi}from'~/composables/useAdminData'
import type{Destination}from'~/composables/useAdminData'
const search=ref('')
const{request}=useApi()
const{data:places}=await useAsyncData('public-destinations',()=>request<Destination[]>('/destinations'),{default:()=>[]})
const filteredPlaces=computed(()=>{const term=search.value.trim().toLowerCase();if(!term)return places.value;return places.value.filter(place=>place.name.toLowerCase().includes(term))})
</script>
<template>
<section class="destination cover"><div class="before-item"></div><div class="container"><div class="title-item"><a href="/" class="return"><i class="fa-light fa-arrow-left-long"></i>VOLVER</a><h3>DESTINOS</h3><h1>¿A dónde quieres ir hoy?</h1><p>Cada destino tiene una historia por descubir. Explora nuestras recomendaciones y encuentra lugares que harán especial tu visita.</p></div></div><div class="content-bg"><img src="https://cdn1.matadornetwork.com/blogs/2/2016/02/Bogota-Colombia-cityscape-1200x853.jpeg" alt=""></div></section><section class="destination container-places"><div class="container"><form class="filters" @submit.prevent><div class="search"><input v-model="search" type="text" placeholder="Buscar destino.."></div></form><div class="container-grid"><a v-for="place in filteredPlaces" :key="place.id" :href="place.link" class="item"><img :src="place.image" :alt="place.name"><h3>{{place.name}}</h3><i class="fa-regular fa-angle-right"></i></a></div><p v-if="filteredPlaces.length===0" class="no-results">No encontramos destinos con ese nombre.</p></div></section>
</template>
