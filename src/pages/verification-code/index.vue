<script setup lang="ts">
import Logo from "~/assets/Logo.svg?component"
import { rules } from "~/modules/validationRules"
import { useSessionStore } from "~/stores/session"
import { useNotificationsStore } from "~/stores/notifications.store"

// validation
rules()
const notificationsStore = useNotificationsStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const sessionStore = useSessionStore()
const email = ref(sessionStore.email)
const code = ref("")

const confirm = async () => {
  if (route.query.forgotPassword) {
    router.push(`/set-password?forgotPassword=${code.value}`)
  } else {
    try {
      const isSucceeded = await sessionStore.confirm(code.value)
      if (isSucceeded) {
        await router.push({ name: "loading" })
      }
    } catch (error: any) {
      notificationsStore.setError(
        error.response?.data?.message ?? t("common.error_occurred"),
      )
    }
  }
}

const resendToken = async () => {
  try {
    await sessionStore.resendToken()
    router.push({ name: "auth.confirm" })
  } catch (error: any) {
    notificationsStore.setError(
      error.response?.data?.message ?? t("common.error_occurred"),
    )
  }
}
</script>

<template>
  <main id="main-form" class="confirm-page">
    <div class="form-wrapper">
      <Logo class="lc-logo" />
      <div class="description">
        <p>
          {{ $t("verification_code.we_sent_temporary_verification_code_to") }}
        </p>
        <p v-if="email" class="description--bold">{{ email }}</p>
        <span v-else>{{ $t("verification_code.your_email") }}</span>
        <br />
        {{ $t("verification_code.paste_your_code") }}
      </div>
      <LcCodeInput v-model="code" @filled="confirm" />
      <div class="resend">
        {{ $t("verification_code.something_went_wrong") }}
        <a href="#" class="link" @click="resendToken">{{
          $t("verification_code.click_to_resent")
        }}</a>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.confirm-page {
  display: flex;
  width: 100vw;
  justify-content: center;
  align-items: center;
}

.lc-logo {
  color: var(--clr-logo-100);
}

.description {
  font-size: var(--text-md-font-size);
  line-height: var(--text-md-line-height);
  font-weight: var(--font-weight-regular);
  padding-top: var(--space-8);
  color: var(--clr-gray-700);
  text-align: center;

  &--bold {
    font-weight: var(--font-weight-bold);
  }
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 530px;
  padding-top: var(--space-24);
}

.resend {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  color: var(--clr-gray-500);
}
.resend a {
  color: var(--clr-primary-700);
  font-weight: var(--font-weight-medium);

  &:hover {
    text-decoration: underline;
  }
}
</style>
