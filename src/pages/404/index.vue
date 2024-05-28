<script lang="ts" setup>
import { Vue3Lottie } from "vue3-lottie"
import Logo from "~/assets/icons/icon-logo-simple.svg?component"
import ArrowRight from "~/assets/icons/icon-arrow-right.svg?component"

import NotFoundAnimation from "~/assets/animations/not-found.json"

import "vue3-lottie/dist/style.css"
</script>

<template>
  <div class="not-found-page">
    <Logo class="logo" />
    <Vue3Lottie
      :animation-data="NotFoundAnimation"
      :height="200"
      :width="200"
    />
    <h1 class="title">Lost in space?</h1>
    <p class="subtitle">The page you requested could not be found.</p>

    <router-link v-slot="{ navigate }" :to="{ name: 'app.generator' }" custom>
      <LcButton :icon="ArrowRight" :trailing-icon="true" @click="navigate"
        >Go to Home</LcButton
      >
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  .logo {
    height: 32px;
  }

  .title {
    font-size: var(--display-xl-font-size);
    line-height: var(--display-lg-line-height);
    font-weight: var(--font-weight-semibold);
    color: var(--clr-gray-900);
  }

  .subtitle {
    font-size: var(--text-lg-font-size);
    line-height: var(--text-lg-line-height);
    color: var(--clr-gray-400);
  }
}
</style>
