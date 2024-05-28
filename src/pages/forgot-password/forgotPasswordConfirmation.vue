<script setup lang="ts">
import Logo from "~/assets/Logo.svg?component"
import { useSessionStore } from "~/stores/session"

const sessionStore = useSessionStore()
</script>

<template>
  <main class="forgot-password-confirm">
    <Logo />
    <p class="forgot-password-confirm__text">
      {{ $t("forgot_password.confirm_text") }}:
    </p>
    <p class="forgot-password-confirm__mail">
      {{ sessionStore.email }}
    </p>
  </main>
</template>

<style lang="scss" scoped>
.forgot-password-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-24);

  &__text {
    font-size: var(--text-md-font-size);
    margin-top: var(--space-6);
    padding-bottom: var(--space-2);
  }

  &__mail {
    font-weight: var(--font-weight-semibold);
  }
}
</style>
