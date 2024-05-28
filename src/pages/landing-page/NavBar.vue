<template>
  <div class="wrapper">
    <div class="nav">
      <div>{{ $t("navbar.labelcloud") }}</div>
      <div>{{ $t("navbar.home") }}</div>
      <div>{{ $t("navbar.products") }}</div>
      <div>{{ $t("navbar.resources") }}</div>
      <div>{{ $t("navbar.pricing") }}</div>
    </div>
    <div class="nav">
      <router-link :to="{ name: 'auth.login' }">
        <div>{{ $t("navbar.login") }}</div>
      </router-link>
      <div>{{ $t("navbar.get_demo") }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  padding: var(--space-6) var(--space-20) 0 var(--space-20);
}

.nav {
  display: flex;
  gap: var(--space-8);
  color: var(--clr-gray-500);
  font-size: var(--text-md-font-size);
  line-height: var(--text-md-line-height);
  padding: 0 var(--space-8);
}
</style>
