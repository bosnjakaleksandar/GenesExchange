<script setup lang="ts">
import Header from '../components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import Hero from '@/components/Hero/Hero.vue'
</script>

<template>
  <Header />
  <main>
    <Hero
      title="O nama"
      subtitle="Naša menjačnica posluje od 2014. godine i ovlašćeni je menjač Narodne banke Srbije. Posvećeni smo pružanju pouzdanih, brzih i profesionalnih usluga, u skladu sa važećim propisima i standardima NBS. Zahvaljujući višegodišnjem iskustvu i stručnosti, težimo da našim klijentima obezbedimo najpovoljniji kurs i sigurnost pri svakoj transakciji."
      classFont="i-24-600"
      :link="{ text: 'Kako da nas nađete', url: 'https://maps.app.goo.gl/wa9WanGFJDzDQk9H6' }"
    />
  </main>
  <Footer />
</template>
