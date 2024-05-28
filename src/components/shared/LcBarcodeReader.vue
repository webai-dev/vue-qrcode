<script lang="ts" setup>
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser"
import { useNotificationsStore } from "~/stores/notifications.store"
import SuccessAnimation from "~/pages/window-shop/SuccessAnimation.vue"
import Check from "~/assets/icons/icon-check.svg?component"
import Close from "~/assets/icons/icon-x.svg?component"
import Delete from "~/assets/icons/icon-delete.svg?component"
import Barcode from "~/assets/icons/icon-barcode-help.svg?component"

const notificationsStore = useNotificationsStore()

const { t } = useI18n()

const emit = defineEmits<{
  (e: "decode", value: any): void
  (e: "loaded"): void
  (e: "delete", value: any): void
}>()

const props = defineProps<{
  scanMessage?: string
}>()
const codeReader = ref(new BrowserMultiFormatReader())
const isMediaStreamAPISupported = computed(() => {
  return (
    navigator &&
    navigator.mediaDevices &&
    "enumerateDevices" in navigator.mediaDevices
  )
})
const scanner = ref<HTMLVideoElement>()
const code = ref()
const showAnimation = ref(false)
const toggleShowAnimation = () => {
  showAnimation.value = !showAnimation.value
}

const showNotification = ref(false)
const toggleShowNotification = () => {
  showNotification.value = !showNotification.value
}

const showOverlay = ref(false)
const toggleOverlay = () => {
  showOverlay.value = !showOverlay.value
}

const onAnimationDone = () => {
  toggleShowAnimation()
  toggleShowNotification()
  if (props.scanMessage === "success") {
    setTimeout(async () => {
      start()
      toggleShowNotification()
      // await scanner.value?.play()
      toggleOverlay()
    }, 2000)
  }
}
onMounted(() => {
  if (!isMediaStreamAPISupported.value) {
    notificationsStore.setError(t("window_shop.failed_to_start_the_camera"))
  }
  start()
})

onUnmounted(async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  })
  const mediaStreamTracks = mediaStream.getVideoTracks()
  mediaStreamTracks.forEach((track) => track.stop())
})

const decoderCallback = (result: any): void => {
  if (result) {
    scanner.value?.pause()
    code.value = result.getText()
    emit("decode", code.value)
    toggleOverlay()
    toggleShowAnimation()
  }
}

const keepArticle = () => {
  toggleShowNotification()
  toggleOverlay()
  start()
}

const deleteArticle = () => {
  emit("delete", code.value)
  toggleShowNotification()
  toggleOverlay()
  start()
}

function start() {
  codeReader.value
    .decodeOnceFromVideoDevice(undefined, "video")
    .then((result) => {
      decoderCallback(result)
    })
}
</script>

<template>
  <div class="scanner">
    <video id="video" ref="scanner" class="video"></video>
    <Transition>
      <div v-if="showOverlay" class="scanner--overlay"></div>
    </Transition>
    <Transition>
      <SuccessAnimation
        v-if="showAnimation"
        class="animation"
        @completed="onAnimationDone"
      />
    </Transition>
    <Transition>
      <Barcode v-if="!showAnimation" class="icon-barcode" />
    </Transition>
    <Transition>
      <div
        v-if="showNotification && scanMessage === 'success'"
        class="notification__wrapper"
      >
        <div class="notification__box">
          <Check />
          <div>{{ code }} {{ t("added") }}!</div>
          <Close class="notification__close" @click="toggleShowNotification" />
        </div>
      </div>
    </Transition>
    <Transition>
      <div
        v-if="showNotification && scanMessage === 'error'"
        class="notification__wrapper"
      >
        <LcButton
          destructive
          size="full-width"
          class="delete-button"
          @click="deleteArticle"
        >
          <Delete /> {{ t("window_shop.delete_article") }}</LcButton
        >
        <LcButton variant="secondary" size="full-width" @click="keepArticle">{{
          t("window_shop.keep_article_in_the_list")
        }}</LcButton>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.scanner {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  &--overlay {
    min-height: 100vh;
    /* mobile viewport bug fix */
    min-height: -webkit-fill-available;
    width: 100%;
    background-color: var(--clr-black);
    z-index: 2;
    position: absolute;
    top: 0;
    opacity: 0.6;
  }
}

.icon-barcode {
  position: absolute;
  width: 55vw;
}

.animation {
  z-index: 3;
  margin-top: -40px;
  position: absolute;
}
.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5);
  transition: all 0.3s ease;
}

.notification {
  &__wrapper {
    position: absolute;
    z-index: 3;
    box-sizing: border-box;
    padding-inline: var(--space-4);
    margin-bottom: var(--space-40);
    bottom: 0;
    width: 100%;
    display: grid;
    gap: var(--space-6);
  }
  &__box {
    color: var(--clr-success-800);
    background-color: var(--clr-success-50);
    padding: 10px;
    display: grid;
    grid-template-columns: max-content auto max-content;
    gap: 12px;
    align-items: center;
    font-size: var(--text-sm-font-size);
    border-radius: 5px;
  }
  &__close {
    justify-self: end;
  }
}

.delete-button {
  padding: var(--space-12);
  display: grid;
  justify-items: center;

  .button__text {
    display: flex;
    align-items: end;

    svg {
      margin-right: var(--space-1);
    }
  }
}
</style>
