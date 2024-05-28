<script setup lang="ts">
import { Form } from "vee-validate"
import { rules } from "~/modules/validationRules"
import { useNotificationsStore } from "~/stores/notifications.store"
import { useSessionStore } from "~/stores/session"
import Logo from "~/assets/Logo.svg?component"
import LcLoader from "~/components/base/LcLoader.vue"
import { track, identify } from "~/modules/tracking"

// validation
rules()

const router = useRouter()
const route = useRoute()
const sessionStore = useSessionStore()
const notificationsStore = useNotificationsStore()
const { t } = useI18n()
const email = ref((route.query.email as string) || "")
const password = ref((route.query.temp as string) || "")
const firstTimeLogin = ref(Boolean(route.query.activate))

const login = async () => {
  const response = await sessionStore.login({
    email: email.value,
    password: password.value,
  })
  if (response && response.data) {
    if (sessionStore.login.challengeName === "NEW_PASSWORD_REQUIRED") {
      await router.push({ name: "auth.setPassword" })
    } else {
      const currUserResponse = await sessionStore.loadCurrentUser()
      identify(currUserResponse.data.id)
      track("Login", {
        customerId: currUserResponse.data.selectedCustomer?.id,
      })
      await router.push({ name: "loading" })
    }
  }
}
</script>

<template>
  <main id="main-login" class="login">
    <div class="login-wrapper">
      <Logo class="lc-logo" />
      <p class="heading">
        {{ firstTimeLogin ? $t("login.activate_account") : $t("login.log_in") }}
      </p>
      <Form class="form" @submit="login">
        <LcFormItem
          v-slot="{ field, meta }"
          name="email"
          :label="$t('common.email')"
          rules="required|email"
          :default-value="route.query.email"
        >
          <LcInput
            v-model="email"
            v-bind="field"
            :meta="meta"
            :placeholder="$t('login.enter_your_email')"
          />
        </LcFormItem>
        <LcFormItem
          v-slot="{ field, meta }"
          name="password"
          :label="
            $t(firstTimeLogin ? 'login.temporary_password' : 'common.password')
          "
          rules="required"
        >
          <LcInput
            v-model="password"
            v-bind="field"
            :meta="meta"
            type="password"
            :placeholder="$t('login.enter_your_password')"
          />
          <a class="link-forgot-password" href="/forgot-password">
            {{ $t("forgot_password.heading") }}
          </a>
        </LcFormItem>
        <LcButton class="button--email" type="submit">
          <LcLoader v-if="sessionStore.isLoginLoading" size="sm" white />
          <template v-if="!sessionStore.isLoginLoading">{{
            $t(firstTimeLogin ? "login.activate_account" : "login.log_in")
          }}</template>
        </LcButton>
      </Form>
      <div class="divider">
        <hr class="line" />
      </div>
      <!--<LcButton variant="secondary-gray" size="full-width">{{
        $t("Continue with SSO")
      }}</LcButton>-->
      <span class="sign-up">
        {{ $t("login.dont_have_account") }}
        <router-link :to="{ name: 'auth.register' }">{{
          $t("login.sign_up")
        }}</router-link>
      </span>
    </div>
  </main>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  width: 100vw;
  justify-content: center;
  height: 100%;
  overflow: auto;
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
  padding: var(--space-24) var(--space-3) 0;

  .lc-logo {
    color: var(--clr-logo-100);
    min-height: 32px;
    margin-bottom: var(--space-5);
  }
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;

  .button--email {
    width: fit-content;
    align-self: center;
  }
}

.link-forgot-password {
  font-size: var(--text-sm-font-size);
  color: var(--clr-primary-600);
  margin-top: var(--space-2);
  display: block;
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
