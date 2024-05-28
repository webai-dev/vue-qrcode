<script setup lang="ts">
import { Form } from "vee-validate"
import Logo from "~/assets/Logo.svg?component"
import { rules } from "~/modules/validationRules"
import { useSessionStore } from "~/stores/session"
import { useNotificationsStore } from "~/stores/notifications.store"
import LcFormItem from "~/components/base/LcFormItem.vue"
import LcCheckbox from "~/components/base/LcCheckbox.vue"
import LcPasswordInput from "~/components/base/LcPasswordInput.vue"
import { track, people, identify } from "~/modules/tracking"

// validation
rules()

const notificationsStore = useNotificationsStore()
const { t } = useI18n()
const router = useRouter()
const sessionStore = useSessionStore()
const email = ref("")
const password = ref("")
const firstname = ref("")
const lastname = ref("")
const acceptedTerms = ref(null)

const register = async () => {
  try {
    const response = await sessionStore.register({
      email: email.value,
      password: password.value,
      firstName: firstname.value,
      lastName: lastname.value,
      acceptedTerms: Boolean(acceptedTerms.value),
    })
    if (response) {
      track("Sign up", {
        date: new Date().toString(),
      })
      people.set_once({
        $name: `${firstname.value} ${lastname.value}`,
        $email: email.value,
      })
      identify(response?.data?.userSub)
      await router.push({ name: "auth.confirm" })
    }
  } catch (error: any) {
    notificationsStore.setError(
      error.response?.data?.message ?? t("Error occurred"),
    )
  }
}

const setPassword = (pw: string) => (password.value = pw)
</script>

<template>
  <main id="main-login" class="login">
    <div class="login-wrapper">
      <Logo class="lc-logo" />
      <p class="heading">{{ $t("login.sign_up") }}</p>
      <Form class="form" @submit="register">
        <LcFormItem
          v-slot="{ field, meta }"
          name="email"
          :label="$t('common.email')"
          rules="required|email"
        >
          <LcInput
            v-model="email"
            v-bind="field"
            :meta="meta"
            :placeholder="$t('login.enter_your_email')"
          />
        </LcFormItem>
        <LcPasswordInput @update:model-value="setPassword" />

        <LcFormItem
          v-slot="{ field, meta }"
          name="firstname"
          :label="$t('common.firstname')"
          rules="required"
        >
          <LcInput
            v-model="firstname"
            v-bind="field"
            :meta="meta"
            :placeholder="$t('signup.enter_your_name')"
          />
        </LcFormItem>

        <LcFormItem
          v-slot="{ field, meta }"
          name="lastname"
          :label="$t('common.lastname')"
          rules="required"
        >
          <LcInput
            v-model="lastname"
            v-bind="field"
            :meta="meta"
            :placeholder="$t('signup.enter_your_lastname')"
          />
        </LcFormItem>
        <LcFormItem
          v-slot="{ field, meta }"
          name="terms"
          :label="$t('signup.accept_terms')"
          type="checkbox"
          rules="required:true"
        >
          <LcCheckbox
            id="terms"
            v-model="acceptedTerms"
            name="terms"
            v-bind="field"
            :meta="meta"
          />
          <label class="terms-label">
            <LcButton variant="link" @click="router.push({ name: 'terms' })">{{
              $t("signup.agree_terms_conditions")
            }}</LcButton>
          </label>
        </LcFormItem>
        <LcButton size="full-width" class="button--email" full type="submit">{{
          $t("signup.create_an_account")
        }}</LcButton>
      </Form>
      <span class="sign-up">
        {{ $t("signup.already_have_account") }}
        <router-link :to="{ name: 'auth.login' }">{{
          $t("common.log_in")
        }}</router-link>
      </span>
    </div>
  </main>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  justify-content: center;
  box-sizing: border-box;
}
.heading {
  font-size: var(--display-sm-font-size);
  line-height: var(--display-sm-line-height);
  font-weight: var(--font-weight-semibold);
  color: var(--clr-gray-900);
}

.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22.5rem;
  margin-top: var(--space-24);
  padding-bottom: var(--space-4);

  .lc-logo {
    color: var(--clr-logo-100);
    min-height: 32px;
    margin-bottom: var(--space-5);
  }
}

.form {
  width: 100%;

  &-password-error {
    margin: var(--space-3) 0;
    padding: 0 0 0 var(--space-4);
  }
}

.terms-label {
  font-size: var(--text-sm-font-size);

  .btn--link {
    padding-left: 0;
  }
}

.divider {
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: relative;
  color: var(--clr-gray-500);
  margin: var(--space-6) 0;
}

.divider .line {
  width: 100%;
  margin: 0;
  position: absolute;
  top: 50%;
  border-top: var(--clr-gray-200);
}

.divider .text {
  z-index: 2;
  background-color: var(--clr-white);
  padding: 0 0.5rem;
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
