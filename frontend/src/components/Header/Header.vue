<script lang="ts" setup></script>
<template>
  <div class="header">
    <div class="header__container">
      <nav class="header__nav">
        <div class="header__logo">
          <img src="../../../public/logo.png" alt="Logo" />
        </div>
        <ul class="header__menu">
          <li class="header__menu-item i-16-400">
            <router-link to="/">
              <font-awesome-icon :icon="['fas', 'house']" />
              Početna
            </router-link>
          </li>
          <li class="header__menu-item i-16-400">
            <router-link to="/kursna-lista">
              <font-awesome-icon :icon="['fas', 'list-ul']" />
              Kursna Lista
            </router-link>
          </li>
          <li class="header__menu-item i-16-400">
            <router-link to="/o-nama">
              <font-awesome-icon :icon="['fas', 'circle-info']" />
              O nama
            </router-link>
          </li>
          <li class="header__menu-item i-16-400">
            <router-link to="/kalkulator">
              <font-awesome-icon :icon="['fas', 'money-bill-transfer']" />
              Kalkulator
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<style lang="scss" scoped src="./Header.scss"></style>
