<script lang="ts" setup>
import ArrowSvg from '@/svg/ArrowSvg.vue'
import { RouterLink } from 'vue-router'

defineProps({
  title: String,
  subtitle: String,
  link: Object,
  classFont: String,
})

function isExternal(url: string): boolean {
  return /^https?:\/\//.test(url)
}
</script>
<template>
  <section class="hero">
    <div class="hero__container">
      <div class="hero__background"></div>
      <div class="hero__content">
        <h1 class="hero__title i-64-800">{{ title }}</h1>
        <p class="hero__subtitle" :class="classFont">
          {{ subtitle }}
        </p>
        <template v-if="link">
          <a
            v-if="isExternal(link.url)"
            :href="link.url"
            class="hero__cta i-16-600"
            target="_blank"
          >
            {{ link.text }}
            <ArrowSvg />
          </a>
          <router-link v-else="link" class="hero__cta i-16-600" :to="link.url">
            {{ link.text }}
            <ArrowSvg />
          </router-link>
        </template>
      </div>
    </div>
  </section>
</template>
<style lang="scss" src="./Hero.scss"></style>
