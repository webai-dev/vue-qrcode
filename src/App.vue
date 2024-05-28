<script setup lang="ts">
import NotificationBoundary from "~/components/shared/NotificationBoundary.vue"
</script>

<template>
  <notification-boundary>
    <router-view />
  </notification-boundary>
</template>
