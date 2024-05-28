<script setup lang="ts">
import LinkIcon from "~/assets/icons/icon-link.svg?component"
import QrIcon from "~/assets/icons/icon-qr.svg?component"
import ArrowRightIcon from "~/assets/icons/icon-arrow-right.svg?component"
import LcCard from "~/components/base/LcCard.vue"
import LcCardContent from "~/components/base/LcCardContent.vue"
import LcCardActions from "~/components/base/LcCardActions.vue"
import { LabelsRoutesNamespaces } from "~/router/labels.routes"

const router = useRouter()
</script>
<template>
  <div class="page__container">
    <div class="lc-page-title">Add label</div>
    <div class="cards__container">
      <LcCard
        data-cy="generate-ids"
        @click="router.push({ name: LabelsRoutesNamespaces.add.ids })"
      >
        <LcCardContent>Serial Numbers</LcCardContent>
        <LcCardActions><ArrowRightIcon /></LcCardActions>
      </LcCard>
      <LcCard
        data-cy="generate-urls"
        @click.prevent="router.push({ name: LabelsRoutesNamespaces.add.links })"
      >
        <LcCardContent>Serialised Links</LcCardContent>
        <LcCardActions><LinkIcon /></LcCardActions>
      </LcCard>
      <LcCard
        data-cy="generate-qrs"
        @click="router.push({ name: LabelsRoutesNamespaces.add.qr })"
      >
        <LcCardContent>QR Fingerprints</LcCardContent>
        <LcCardActions><QrIcon /></LcCardActions>
      </LcCard>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  &__container {
    & .lc-page-title {
      margin-bottom: 8rem;
    }
  }
}

.cards {
  &__container {
    margin: 0 auto;
    max-width: 438px;
  }
}

.card {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: var(--space-4);
  min-width: 38vw;

  .LcCardActions svg {
    color: var(--clr-primary-600);
  }
}
</style>
