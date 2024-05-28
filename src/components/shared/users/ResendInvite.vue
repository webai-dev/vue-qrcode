<script setup lang="ts">
import type { IInviteStatuses } from "~/constants/statuses"
import { inviteStatusPalette, getInviteStatusName } from "~/constants/statuses"
import { useCustomerStore } from "~/stores/customer"
import { useSessionStore } from "~/stores/session"
import Dot from "~/assets/icons/icon-dot.svg?component"
import Check from "~/assets/icons/icon-check.svg?component"

interface IProps {
  user: {
    id?: string
    email: string
    inviteStatus: IInviteStatuses
  }
  showResendOption?: boolean
  customerId?: string | null
}

const props = withDefaults(defineProps<IProps>(), {
  showResendOption: true,
  customerId: null,
})

const showSentLabel = ref(false)
const timeoutId = ref<NodeJS.Timeout | null>(null)

const sessionStore = useSessionStore()
const customerStore = useCustomerStore()

const handleShowSentLabel = () => {
  showSentLabel.value = true
  timeoutId.value = setTimeout(() => {
    showSentLabel.value = false
  }, 5000)
}

const handleResendOnClick = () => {
  customerStore.reInvite(
    props.customerId || sessionStore.getSelectedCustomerId!,
    {
      email: props.user.email,
      id: props.user.id,
    },
    handleShowSentLabel,
  )
}

onUnmounted(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
})
</script>

<template>
  <div class="user-invite">
    <LcBadge
      :color="inviteStatusPalette[user.inviteStatus]"
      :icon="Dot"
      :text="getInviteStatusName(user.inviteStatus)"
      class="badge__first-letter"
    />
    <template v-if="user.inviteStatus === 'pending'">
      <div v-if="showResendOption" class="resent__container">
        <template v-if="!showSentLabel">
          <Transition name="fade" appear>
            <LcButton
              :variant="'link'"
              :size="'sm'"
              class="resend__custom-padding"
              @click="handleResendOnClick"
            >
              {{ $t("common.resend") }}
            </LcButton>
          </Transition>
        </template>
        <template v-else>
          <Transition name="fade" appear>
            <div class="resent__container">
              <Check class="resent__icon" />
              <span class="resent__label">{{ $t("common.sent") }}</span>
            </div>
          </Transition>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.centered {
  display: flex;
  align-items: center;
}

.user-invite {
  @extend .centered;

  & .badge {
    &__first-letter {
      text-transform: lowercase;
    }
  }

  & .resent {
    &__container {
      @extend .centered;
      margin-left: 0.5rem;
    }

    &__text {
      color: var(--clr-gray-400);
      font-size: var(--text-sm-font-size);
    }

    &__icon {
      margin-right: 0.2rem;
      color: var(--clr-success-400);
    }
  }

  @media screen and (min-width: 768px) and (max-width: 1199px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  @include mq("mobile") {
    margin-left: 0.75rem;

    & .resend {
      &__custom-padding {
        padding: 0.19rem;
      }
    }
  }
}
</style>
