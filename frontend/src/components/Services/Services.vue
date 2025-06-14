<script lang="ts" setup>
import ArrowSvg from '@/svg/ArrowSvg.vue'
</script>
<template>
  <section class="services">
    <div class="services__container">
      <div class="services__header">
        <h2 class="services__title i-48-700">Naše usluge</h2>
      </div>
      <ul class="services__cards">
        <li class="services__card">
          <font-awesome-icon :icon="['fas', 'hand-holding-dollar']" class="services__card-icon" />
          <h3 class="services__card-title i-24-600">Menjački poslovi</h3>
          <p class="services__card-description i-18-400">
            Nudimo otkup, prodaju i konverziju efektivnog stranog novca, uz mogućnost ugovaranja
            stimulativnog kursa za veće transakcije.
          </p>
        </li>
        <li class="services__card">
          <img class="services__card-icon2" src="../../../public/payspot.png" alt="Payspot Icon" />
          <h3 class="services__card-title i-24-600">Platni promet</h3>
          <p class="services__card-description i-18-400">
            Usluge platnog prometa (Uplata računa, komunalija, osiguranja, pazara...) vršimo u
            saradnji sa Payspot-om. A za precizne informacije o naknadama posetite
            <a class="services__card-link" href="https://www.payspot.rs" target="_blank">Payspot</a>
            web stranicu.
          </p>
          <a
            class="services__card-button i-16-600"
            href="https://www.payspot.rs/kalkulator/"
            target="_blank"
          >
            Payspot kalkulator
            <ArrowSvg />
          </a>
        </li>
        <li class="services__card">
          <img class="services__card-icon" src="../../../public/lutrija.png" alt="Lutrija Icon" />
          <h3 class="services__card-title i-24-600">Lutrija</h3>
          <p class="services__card-description i-18-400">
            Uplatite svoj listić za Loto ili Bingo, ogrebite srećku ili učestvujte u nekoj od igara
            Državne lutrije Srbije. Možda ste baš vi sledeći dobitnik! Samo za lica starija od 18
            godina.
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
<style lang="scss" src="./Services.scss"></style>
