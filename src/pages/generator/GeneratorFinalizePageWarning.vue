<script setup lang="ts">
import WarningIcon from "~/assets/icons/icon-warning.svg?component"
import ArrowRight from "~/assets/icons/icon-arrow-right.svg?component"

defineProps<{ link?: boolean }>()
const { t } = useI18n()
const router = useRouter()

const steps = [
  t("generator.finalize_page_warning.step1", {
    settings_page: "<span class='link'>Settings page</span>",
    interpolation: { escapeValue: false },
  }),
  t("generator.finalize_page_warning.step2"),
  t("generator.finalize_page_warning.step3"),
]

const route = "app.settings.urlSettings"

const handleClick = (e: Event) => {
  ;(e?.target as HTMLElement)?.classList?.contains("link") &&
    router.push({ name: route })
}
</script>

<template>
  <section>
    <WarningIcon class="icon warning" />
    <h2 class="title warning">
      {{ $t("generator.finalize_page_warning.title_warning") }}
    </h2>
    <div class="title">
      {{ $t("generator.finalize_page_warning.title") }}
    </div>
    <p class="content">
      {{ $t("generator.finalize_page_warning.content") }}
    </p>
  </section>
  <ul class="steps">
    <li v-for="(step, i) in steps" :key="i">
      <div class="step">{{ i }}</div>
      <div class="step-content" @click="handleClick" v-html="step" />
    </li>
  </ul>
  <LcButton
    v-if="link"
    class="btn"
    :icon="ArrowRight"
    @click="() => router.push({ name: route })"
    >{{ $t("Link Settings") }}</LcButton
  >
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 441px) {
    margin-top: var(--space-10);
  }
}

.title,
.content {
  text-align: center;
}

.title {
  font-size: var(--text-lg-font-size);
  line-height: var(--text-lg-line-height);
  font-weight: var(--font-weight-semibold);
}

.warning {
  color: var(--clr-error-600);
}

.content,
.step-content {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  color: var(--clr-gray-500);
  margin-top: var(--space-4);
}

.icon {
  padding-block-start: var(--space-4);
  padding-block-end: 20px;
}

.steps {
  display: flex;
  justify-content: space-evenly;
  padding: 0;
  margin-bottom: var(--space-8);

  li {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 34%;

    &:not(:last-of-type):after,
    &:not(:first-of-type):before {
      content: " ";
      width: calc(50% - 2rem);
      height: 1px;
      background-color: var(--clr-gray-400);
      position: absolute;
      top: calc(1rem + 1px);
    }

    &:not(:last-of-type):after {
      left: calc(50% + 2rem);
    }

    &:not(:first-of-type):before {
      right: calc(50% + 2rem);
    }

    div {
      text-align: center;
      max-width: 200px;
    }
  }

  .step {
    background-color: var(--clr-gray-600);
    color: var(--clr-white);
    border-radius: 50%;
    width: 2.375rem;
    height: 2.375rem;
    line-height: 2.375rem;
  }
}

.btn {
  @media screen and (min-width: 441px) {
    margin-left: var(--space-8);
  }
}
</style>

<style lang="scss">
.link {
  font-weight: bold;
  cursor: pointer;
}
</style>
