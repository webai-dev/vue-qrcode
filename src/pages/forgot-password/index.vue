<script setup lang="ts">
import { Form } from "vee-validate"
import Logo from "~/assets/Logo.svg?component"
import { rules } from "~/modules/validationRules"
import { useSessionStore } from "~/stores/session"
import { useNotificationsStore } from "~/stores/notifications.store"

// validation
rules()
const notificationsStore = useNotificationsStore()
const { t } = useI18n()
const router = useRouter()
const email = ref("")
const sessionStore = useSessionStore()

const sendEmail = async () => {
  await sessionStore.resendPassword(email.value)
  router.push(`/confirm?forgotPassword=true`)
}
</script>

<template>
  <main class="forgot-password">
    <div class="forgot-password-wrapper">
      <Logo class="lc-logo" />
      <p class="heading">{{ $t("forgot_password.heading") }}</p>
      <Form class="form" @submit="sendEmail">
        <LcFormItem
          v-slot="{ field, meta }"
          name="Email"
          :label="$t('common.email')"
          rules="required"
        >
          <LcInput
            v-model="email"
            v-bind="field"
            :meta="meta"
            :placeholder="$t('forgot_password.enter_your_email_address')"
          />
        </LcFormItem>
        <LcLoader v-if="sessionStore.isForgetPasswordLoading" size="md" />
        <LcButton v-else class="button--email" full type="submit">
          {{ $t("common.continue") }}
        </LcButton>
      </Form>
    </div>
    <div class="forgot-password__footer">
      <span class="forgot-password__footer-text"
        >{{ $t("forgot_password.go_back_to") }}
        <a href="/login">{{ $t("common.login") }}</a>
      </span>
    </div>
  </main>
</template>

<style scoped lang="scss">
.forgot-password {
  display: flex;
  flex-direction: column;
  width: 100vw;
  justify-content: center;
  align-items: center;

  .lc-logo {
    color: var(--clr-logo-100);
  }

  &__footer {
    padding: var(--space-8) 0;

    &-text {
      font-size: var(--text-sm-font-size);

      a {
        color: var(--clr-primary-600);
      }
    }
  }
}
.heading {
  font-size: var(--display-sm-font-size);
  line-height: var(--display-sm-line-height);
  font-weight: var(--font-weight-semibold);
  color: var(--clr-gray-900);
  padding-bottom: var(--space-16);
  margin-top: var(--space-6);
}

.forgot-password-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 22.5rem;
  padding: var(--space-24) 0 var(--space-10);
  border-bottom: 1px solid var(--clr-gray-200);
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .field--wrapper {
    width: 100%;
  }
}

.sign-up {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  color: var(--clr-gray-500);
  margin-top: var(--space-8);
}
.sign-up a {
  color: var(--clr-primary-700);

  &:hover {
    text-decoration: underline;
  }
}
</style>
