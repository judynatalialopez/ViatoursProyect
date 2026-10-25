<script setup lang="ts">
import{computed}from'vue'
import{Swiper,SwiperSlide}from'swiper/vue'
import{Navigation,Pagination,Autoplay}from'swiper/modules'
import{useApi}from'~/composables/useAdminData'
import type{CatalogPlace}from'~/composables/useAdminData'
import'swiper/css'
import'swiper/css/navigation'
import'swiper/css/pagination'
const route=useRoute()
const{request}=useApi()
const id=computed(()=>Number(route.query.id)||1)
const{data:place}=await useAsyncData(()=>`place-${id.value}`,()=>request<CatalogPlace>(`/places/${id.value}`))
const sliderImages=computed(()=>Array.from(new Set([place.value?.image,...(place.value?.gallery||[])].filter(Boolean) as string[])))
const modules=[Navigation,Pagination,Autoplay]
</script>
<template>
<section class="internal destination cover"><div class="before-item"></div><div class="container"><div class="title-item"><a :href="`/catalog?destination=${place?.destinationId||1}`" class="return"><i class="fa-light fa-arrow-left-long"></i>VOLVER A {{place?.destinationName?.toUpperCase()}}</a><h3>{{place?.categoryName}}</h3><h1>{{place?.name}}</h1><div class="paragraph"><p>{{place?.description}}</p><p>{{place?.description}}</p></div><div class="content-data"><div class="item"><i class="fa-light fa-location-dot"></i><div><h4>DIRECCIÓN</h4><p>{{place?.address||'—'}}</p></div></div><div class="item"><i class="fa-solid fa-phone"></i><div><h4>TELÉFONO</h4><p>{{place?.phone?`+57 ${place.phone}`:'—'}}</p></div></div></div></div></div><div class="content-bg content-slider"><img :src="place?.image" :alt="place?.name"></div></section><section class="internal container-slider destination container-places"><div class="container"><h3><span>GALERIA DE IMÁGENES</span></h3><Swiper class="slider-gallery" :modules="modules" :slides-per-view="1" :space-between="12" :navigation="sliderImages.length>3" :pagination="sliderImages.length>3?{clickable:true}:false" :autoplay="{delay:6000,disableOnInteraction:false,pauseOnMouseEnter:true}" :breakpoints="{768:{slidesPerView:2,spaceBetween:16},992:{slidesPerView:3,spaceBetween:20}}"><SwiperSlide v-for="(image,index) in sliderImages" :key="index" class="slider-item"><img :src="image" :alt="`Imagen ${index+1}`"></SwiperSlide></Swiper></div></section>
</template>
