<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const sliderImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
]

const modules = [
  Navigation,
  Pagination
]
</script>

<template>

  <section class="internal destination cover">

    <div class="before-item"></div>

    <div class="container">
      <div class="title-item">

        <a href="catalog" class="return">
          <i class="fa-light fa-arrow-left-long"></i>
          VOLVER A BOGOTÁ
        </a>

        <h3>RESTAURANTE</h3>

        <h1>El cielo restaurant</h1>

        <div class="paragraph">

          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Nemo qui odit, ut consequuntur quidem nam, nisi eligendi
            culpa quo voluptatibus doloremque atque cumque facere
            assumenda et quibusdam, ipsum earum voluptate?
          </p>

          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Nemo qui odit, ut consequuntur quidem nam, nisi eligendi
            culpa quo voluptatibus doloremque atque cumque facere
            assumenda et quibusdam, ipsum earum voluptate?
          </p>

        </div>

        <div class="content-data">

          <div class="item">

            <i class="fa-light fa-location-dot"></i>

            <div>
              <h4>DIRECCIÓN</h4>
              <p>Carrera 11A 93A-10 Zona R, Bogotá</p>
            </div>

          </div>

          <div class="item">

            <i class="fa-solid fa-phone"></i>

            <div>
              <h4>TELÉFONO</h4>
              <p>+57 3143386499</p>
            </div>

          </div>

        </div>

      </div>
    </div>


    <div class="content-bg content-slider">

      <img
        src="https://www.semana.com/resizer/v2/7IUULDF3L5HG5JSXQFT7BGQQJU.jpg?auth=c88f2ae30496249a5bde502311f070f456813de9c17c4596cde3111a254f632b&smart=true&quality=75&width=1920"
        alt="">

    </div>

  </section>


  <section class="internal container-slider destination container-places">
    <div class="container">
      <h3><span>GALERIA DE IMÁGENES</span></h3>
      <Swiper class="slider-gallery" :modules="modules" :slides-per-view="1" :space-between="12"
        :navigation="sliderImages.length > 3" :pagination="sliderImages.length > 3
          ? { clickable: true }
          : false
          " :breakpoints="{
            768: {
              slidesPerView: 2,
              spaceBetween: 16
            },

            992: {
              slidesPerView: 3,
              spaceBetween: 20
            }
          }">

        <SwiperSlide v-for="(image, index) in sliderImages" :key="index" class="slider-item">
          <img :src="image" :alt="`Imagen ${index + 1}`">
        </SwiperSlide>
      </Swiper>
    </div>
  </section>

</template>