<script lang="ts" setup>
const currentYear = new Date().getFullYear()
</script>
<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__logo">
        <router-link to="/">
          <img src="../../../public/logo.png" alt="Menjačnica Genes Logo" />
        </router-link>
        <p class="footer__description i-16-400">
          Vaš pouzdan partner u zameni valuta. Od 2014. posvećeni vašim potrebama.
        </p>
      </div>
      <hr class="footer__divider" />
      <div class="footer__content">
        <ul class="footer__info i-14-400">
          <li>
            <font-awesome-icon :icon="['fas', 'clock']" /><span
              >Radno vreme<br />Pon-pet: 08:30H - 17:00H <br />
              Sub: 08:30H - 14:00H</span
            >
          </li>
          <li>
            <font-awesome-icon :icon="['fas', 'location-dot']" /><span
              >Lokacija<br />Hajduk Veljkova 11</span
            >
          </li>
          <li>
            <font-awesome-icon :icon="['fas', 'phone']" /><span
              >Broj Telefona<br />+381 60 000 000</span
            >
          </li>
          <li>
            <font-awesome-icon :icon="['fas', 'envelope']" /><span
              >Email Adresa<br />menjacnicagenes@gmail.com</span
            >
          </li>
        </ul>
      </div>
      <hr class="footer__divider" />
      <div class="footer__bottom">
        <p class="footer__text i-14-400">
          © {{ currentYear }} Menjačnica Genes. All rights reserved. Design and Development by
          @bosnjakaleksandar
        </p>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" src="./Footer.scss"></style>
