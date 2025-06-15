<script setup lang="ts">
import Header from '../components/Header/Header.vue'
import Hero from '../components/Hero/Hero.vue'
import Services from '@/components/Services/Services.vue'
import Footer from '../components/Footer/Footer.vue'
</script>

<template>
  <Header />
  <main>
    <Hero
      title="Vaš pouzdan partner za razmenu valuta"
      subtitle="Nalazimo se na Novosadskom sajmu. Lako dostupni, uvek tu za vas."
      classFont="i-36-700"
      :link="{ text: 'Kursna lista', url: '/kursna-lista' }"
    />
    <Services />
  </main>
  <Footer />
</template>
