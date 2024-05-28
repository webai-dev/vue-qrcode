<script setup lang="ts">
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"

const { t } = useI18n()

const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const columns = [
  { key: "type", title: t("common.type"), wrapMobile: true },
  { key: "value", title: t("common.value"), wrapMobile: true },
]

onBeforeMount(() => {
  if (!generatorStore.isDomainNamesFetched) {
    generatorStore.getDomainNames({
      customerId: sessionStore.getSelectedCustomerId as string,
    })
  }
})
</script>

<template>
  <div class="lc-page-subtitle">{{ $t("common.domains") }}</div>
  <p>
    {{ $t("url_settings.description1") }}
  </p>
  <p>
    {{ $t("url_settings.description2") }}
  </p>
  <p>
    <strong>{{ $t(`common.step1`) }}:</strong
    >{{ $t("url_settings.description3") }}
  </p>
  <p>
    <strong>{{ $t(`common.step2`) }}:</strong
    >{{ $t("url_settings.description4") }}
  </p>
  <p>
    <strong>{{ $t(`common.step3`) }}:</strong
    >{{ $t("url_settings.description5") }}
  </p>
  <p>
    {{ $t("url_settings.description6") }}
  </p>

  <LcTableCard
    v-for="domain in generatorStore.getAllDomainNames"
    :key="domain.domainName"
    :title="domain.domainName"
  >
    <template #table>
      <LcTable
        :columns="columns"
        :data="domain.nameservers"
        identifier="id"
        :is-loading="!generatorStore.isDomainNamesFetched"
        ><template #type> ns </template>
        <template #value="{ item }">
          <span class="nameserver">{{ item }}</span>
        </template>
      </LcTable>
    </template>
  </LcTableCard>
</template>

<style scoped lang="scss">
strong {
  display: block;
  margin-bottom: var(--space-2);
}

.nameserver {
  font-weight: var(--font-weight-medium);
}
</style>
