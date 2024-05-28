<script setup lang="ts">
import Logo from "@/assets/icons/icon-logo.svg?component"
import { useUtilityStore } from "~/stores/utility"

const utilityStore = useUtilityStore()
const isOpen = ref(false)
const toggleNav = () => (isOpen.value = !isOpen.value)
</script>

<template>
  <LcSidebar
    :class="['sidebar__mobile', { 'sidebar-open': isOpen }]"
    :menu-callback="toggleNav"
    is-mobile
  />
  <div
    v-if="!utilityStore.isWholePageLayout"
    class="header"
    :class="{ 'nav-open': isOpen }"
  >
    <router-link :to="{ name: 'app.generator' }" class="logo header-logo">
      <Logo />
    </router-link>
    <div class="hamburger-wrapper" @click.prevent="toggleNav">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-logo {
  display: block;
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--clr-primary-900);
  box-sizing: border-box;
  padding: 1rem;
  height: 4rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;

  .hamburger-wrapper {
    z-index: 1;
    .hamburger-line {
      display: block;
      width: 1.25rem;
      height: 2px;
      background-color: var(--clr-gray-300);
      margin-bottom: 0.25rem;
      transition: all 0.2s ease-in-out;

      &:nth-child(even) {
        width: 0.625rem;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &.nav-open {
    .hamburger-line {
      &:nth-child(even) {
        display: none;
      }

      &:first-child {
        transform: rotate(-45deg);
        margin: 0;
      }
      &:last-child {
        transform: translate(0, -2px) rotate(45deg);
      }
    }
  }
}

.sidebar__mobile {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  transform: translate3d(100%, 0, 0);
  transition: transform 0.3s ease-in-out;
  padding-top: 5rem;
}

.sidebar-open {
  transform: translateX(0);
  z-index: 1;
}
</style>
