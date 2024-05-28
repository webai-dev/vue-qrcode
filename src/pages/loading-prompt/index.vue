<script lang="ts" setup>
import LoadingPrompt from "~/assets/loader-products-qr.svg"
import LcProgressBar from "~/components/base/LcProgressBar.vue"

const count = ref(0)
const router = useRouter()

// to make loader more authentic let it slow down at some points
const longerWaitAt = (min: number[]) => {
  if (min.some((val) => count.value > val && count.value < val + 5)) {
    return Math.floor(Math.random() * (60 - 40 + 1)) + 40
  }
  return 1
}

// for more authenticity let the loader increase in random steps
const recursiveIncrease = () => {
  if (count.value < 97) {
    const randomCountIncrease = Math.floor(Math.random() * 3) + 1
    let randomDelay = Math.floor(Math.random() * 36)
    if (randomDelay < 12) randomDelay = 12
    count.value = count.value + randomCountIncrease
    const factor = longerWaitAt([50, 77])
    setTimeout(() => recursiveIncrease(), randomDelay * factor)
  } else {
    count.value = 100
    setTimeout(() => {
      router.replace({ name: "app.generator" })
    }, 1500)
  }
}

onMounted(() => {
  recursiveIncrease()
})
</script>
<template>
  <div class="loading-prompt-outer">
    <div class="loading-prompt-inner">
      <LoadingPrompt class="loading-prompt-img" />
      <LcProgressBar :progress="count" />
      <div>Loading labels [{{ count }}%]</div>
    </div>
  </div>
</template>
<style lang="scss">
.loading-prompt {
  &-outer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-top: -3rem;
  }

  &-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;

    .lc-progress-bar {
      margin-bottom: 2.5rem;
      width: 96%;
    }
  }

  &-img {
    width: 100%;
  }
}
</style>
