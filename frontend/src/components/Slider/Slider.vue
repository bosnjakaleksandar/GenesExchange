<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const slides = [
  {
    id: 1,
    title: 'Marko Petrović',
    description: 'Brza i efikasna usluga, ljubazno osoblje. Definitivno se vraćam opet!',
  },
  {
    id: 2,
    title: 'Ana Ristić',
    description:
      'Sve je prošlo bez problema. Menjačnica je transparentna i odmah sam dobila tačan iznos bez skrivenih troškova.',
  },
  {
    id: 3,
    title: 'Nemanja Ilić',
    description: 'Profesionalna usluga i odlična lokacija. Preporuka!',
  },
  {
    id: 4,
    title: 'Jelena Nikolić',
    description:
      'Kurs je bio tačno onakav kakav piše na sajtu, bez iznenađenja. Menjačnica izgleda uredno i moderno.',
  },
]

const modules = [Navigation, Pagination, Autoplay]
</script>
<template>
  <section class="slider">
    <div class="slider__container">
      <div class="slider__top">
        <h2 class="slider__title i-48-700">Šta klijenti kažu o nama</h2>
      </div>
      <div class="slider__bottom">
        <Swiper
          :modules="modules"
          :slides-per-view="3"
          :space-between="30"
          :loop="true"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
          }"
          :pagination="{
            clickable: true,
          }"
          :breakpoints="{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }"
          class="slider__swiper"
        >
          <SwiperSlide v-for="slide in slides" :key="slide.id" class="slider__slide">
            <div class="slider__card">
              <div class="slider__card-content">
                <div class="slider__card-quote">
                  <font-awesome-icon :icon="['fas', 'quote-left']" />
                </div>
                <p class="slider__card-description i-24-600">{{ slide.description }}</p>
              </div>
              <div class="slider__card-bottom">
                <div class="slider__card-stars">
                  <font-awesome-icon v-for="star in 5" :key="star" :icon="['fas', 'star']" />
                </div>
                <h3 class="slider__card-title i-36-700">{{ slide.title }}</h3>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>
<style lang="scss" src="./Slider.scss"></style>
