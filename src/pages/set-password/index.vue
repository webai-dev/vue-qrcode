<script setup lang="ts">
import { Form } from "vee-validate"
import Logo from "~/assets/Logo.svg?component"
import { rules } from "~/modules/validationRules"
import { useSessionStore } from "~/stores/session"
import { useNotificationsStore } from "~/stores/notifications.store"
import LcPasswordInput from "~/components/base/LcPasswordInput.vue"
import { track, identify, alias, people } from "~/modules/tracking"

// validation
rules()
const notificationsStore = useNotificationsStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const sessionStore = useSessionStore()
const email = ref("")
const newPassword = ref("")

const confirm = async () => {
  if (route.query.forgotPassword) {
    try {
      await sessionStore.confirmPassword(
        route.query.forgotPassword as string,
        newPassword.value,
      )
      await router.push({ name: "auth.login" })
    } catch (error) {}
  } else {
    const response = await sessionStore.authChallenge(newPassword.value)
    if (response && response.data) {
      const currUser = await sessionStore.loadCurrentUser()
      track("Invite completed", {
        customerId: currUser?.data?.selectedCustomer?.id,
      })
      alias(currUser?.data?.id)
      people.set_once({
        $name: `${currUser?.data?.firstName} ${currUser?.data?.lastName}`,
        $email: currUser?.data?.email,
      })
      identify(currUser?.data?.id)
    }
    await router.push({ name: "loading" })
  }
}

const setPassword = (pw: string) => (newPassword.value = pw)
</script>

<template>
  <main id="main-login" class="login">
    <div class="login-wrapper">
      <Logo class="lc-logo" />
      <p class="heading">{{ $t("set_password.heading") }}</p>
      <Form class="form" @submit="confirm">
        <LcPasswordInput @update:model-value="setPassword" />
        <LcButton size="full-width" class="button--email" full type="submit">{{
          $t("set_password.save_new_password")
        }}</LcButton>
      </Form>
    </div>
  </main>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  width: 100vw;
  justify-content: center;

  .lc-logo {
    color: var(--clr-logo-100);
  }
}
.heading {
  font-size: var(--display-sm-font-size);
  line-height: var(--display-sm-line-height);
  font-weight: var(--font-weight-semibold);
  color: var(--clr-gray-900);
  padding-bottom: var(--space-8);
}

.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22.5rem;
  padding: var(--space-24) var(--space-3);
}

.form {
  width: 100%;
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
