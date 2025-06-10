<script lang="ts" setup>
import ArrowSvg from '@/svg/ArrowSvg.vue'
import { RouterLink } from 'vue-router'
</script>
<template>
  <section class="hero">
    <div class="hero__container">
      <div class="hero__background"></div>
      <div class="hero__content">
        <h1 class="hero__title i-64-800">Vaš pouzdan partner za razmenu valuta</h1>
        <p class="hero__subtitle i-36-700">
          Nalazimo se na Novosadskom sajmu - lako dostupni, uvek tu za vas
        </p>
        <router-link class="hero__cta i-16-700" to="/kursna-lista">
          Kursna Lista
          <ArrowSvg />
        </router-link>
      </div>
    </div>
  </section>
</template>
<style lang="scss" src="./Hero.scss"></style>
