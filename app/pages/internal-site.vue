<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'

import { useApi } from '~/composables/useAdminData'
import type { CatalogPlace } from '~/composables/useAdminData'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const route = useRoute()
const { request } = useApi()

const id = computed(() => Number(route.query.id) || 1)

const { data: place } = await useAsyncData(
  () => `place-${id.value}`,
  () => request<CatalogPlace>(`/places/${id.value}`)
)

const sliderImages = computed(() =>
  Array.from(
    new Set(
      [
        place.value?.image,
        ...(place.value?.gallery || [])
      ].filter(Boolean) as string[]
    )
  )
)

const modules = [Navigation, Pagination, Autoplay, Keyboard]

const isGalleryOpen = ref(false)
const activeImage = ref(0)
const modalSwiper = ref<SwiperInstance | null>(null)

const openGallery = async (index: number) => {
  activeImage.value = index
  isGalleryOpen.value = true

  await nextTick()

  modalSwiper.value?.slideTo(index, 0)
}

const closeGallery = () => {
  isGalleryOpen.value = false
}

const onModalSwiper = (swiper: SwiperInstance) => {
  modalSwiper.value = swiper
}

const prevImage = () => {
  modalSwiper.value?.slidePrev()
}

const nextImage = () => {
  modalSwiper.value?.slideNext()
}
</script>

<template>
  <section class="internal destination cover">
    <div class="before-item"></div>

    <div class="container">
      <div class="title-item">
        <a :href="`/catalog?destination=${place?.destinationId || 1}`" class="return">
          <i class="fa-light fa-arrow-left-long"></i>
          VOLVER A {{ place?.destinationName?.toUpperCase() }}
        </a>

        <h3>{{ place?.categoryName }}</h3>

        <h1>{{ place?.name }}</h1>

        <div class="paragraph">
          <p>{{ place?.description }}</p>
          <p>{{ place?.description }}</p>
        </div>

        <div class="content-data">
          <div class="item">
            <i class="fa-light fa-location-dot"></i>

            <div>
              <h4>DIRECCIÓN</h4>
              <p>{{ place?.address || '—' }}</p>
            </div>
          </div>

          <div class="item">
            <i class="fa-solid fa-phone"></i>

            <div>
              <h4>TELÉFONO</h4>
              <p>{{ place?.phone ? `+57 ${place.phone}` : '—' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-bg content-slider">
      <img :src="place?.image" :alt="place?.name">
    </div>
  </section>

  <section v-if="sliderImages.length" class="internal container-slider destination container-places">
    <div class="container">
      <div class="gallery-heading">
        <h3>
          <span>GALERÍA DE IMÁGENES</span>
        </h3>

        <span class="gallery-count">
          {{ sliderImages.length }}
          {{ sliderImages.length === 1 ? 'IMAGEN' : 'IMÁGENES' }}
        </span>
      </div>

      <div v-if="sliderImages.length === 1" class="single-gallery-layout">
        <div class="single-gallery-main" @click="openGallery(0)">
          <img :src="sliderImages[0]" :alt="place?.name">

          <div class="gallery-overlay">
            <i class="fa-light fa-expand"></i>
            <span>AMPLIAR</span>
          </div>
        </div>

        <div class="single-gallery-side">
          <div class="single-gallery-card">
            <div class="single-gallery-card-icon">
              <i class="fa-solid fa-people-group"></i>
            </div>

            <h4>Ideal para compartir</h4>

            <p>
              Un lugar para disfrutar en familia, con amigos o durante tu recorrido.
            </p>
          </div>

          <div class="single-gallery-card">
            <div class="single-gallery-card-icon">
              <i class="fa-solid fa-car-side"></i>
            </div>

            <h4>Acceso cómodo</h4>

            <p>
              Una ubicación práctica y fácil de integrar dentro de tu visita.
            </p>
          </div>
        </div>
      </div>

      <Swiper v-else class="slider-gallery" :modules="modules" :slides-per-view="1.15" :space-between="12"
        :navigation="sliderImages.length > 1" :pagination="{
          clickable: true
        }" :autoplay="sliderImages.length > 3
          ? {
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }
          : false
          " :breakpoints="{
            768: {
              slidesPerView: 2.15,
              spaceBetween: 16
            },
            992: {
              slidesPerView: sliderImages.length === 2 ? 2 : 3,
              spaceBetween: 20
            }
          }">
        <SwiperSlide v-for="(image, index) in sliderImages" :key="image" class="slider-item"
          @click="openGallery(index)">
          <img :src="image" :alt="`Imagen ${index + 1} de ${place?.name || ''}`">

          <div class="gallery-overlay">
            <i class="fa-light fa-expand"></i>
            <span>AMPLIAR</span>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="gallery-modal">
      <div v-if="isGalleryOpen" class="gallery-modal" @click.self="closeGallery">
        <button class="gallery-modal-close" type="button" aria-label="Cerrar galería" @click="closeGallery">
          <i class="fa-light fa-xmark"></i>
        </button>

        <div class="gallery-modal-content">
          <Swiper class="gallery-modal-swiper" :modules="modules" :initial-slide="activeImage" :slides-per-view="1"
            :space-between="20" :keyboard="{
              enabled: true
            }" @swiper="onModalSwiper">
            <SwiperSlide v-for="(image, index) in sliderImages" :key="`modal-${image}`">
              <div class="gallery-modal-image">
                <img :src="image" :alt="`Imagen ${index + 1} de ${place?.name || ''}`">
              </div>
            </SwiperSlide>
          </Swiper>

          <template v-if="sliderImages.length > 1">
            <button class="gallery-modal-arrow gallery-modal-prev" type="button" aria-label="Imagen anterior"
              @click="prevImage">
              <i class="fa-light fa-arrow-left"></i>
            </button>

            <button class="gallery-modal-arrow gallery-modal-next" type="button" aria-label="Imagen siguiente"
              @click="nextImage">
              <i class="fa-light fa-arrow-right"></i>
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>