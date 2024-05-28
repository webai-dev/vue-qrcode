<script setup lang="ts">
import ConnectIcon from "~/assets/icons/icon-connect.svg?component"
import TrackIcon from "~/assets/icons/icon-track.svg?component"
import ProtectIcon from "~/assets/icons/icon-protect.svg?component"

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="welcome-page-container">
    <div class="welcome-card">
      <h1 class="welcome-card__title">{{ $t("welcome.title") }}</h1>
      <div class="welcome-card-list">
        <div class="list-item">
          <div class="list-item__icon">
            <ConnectIcon />
          </div>
          <div class="list-item__content">
            <p class="title">{{ $t("common.connect") }}</p>
            <p>{{ $t("welcome.connect_description") }}</p>
          </div>
        </div>
        <div class="list-item">
          <div class="list-item__icon">
            <TrackIcon />
          </div>
          <div class="list-item__content">
            <p class="title">{{ $t("common.track") }}</p>
            <p>{{ $t("welcome.track_description") }}</p>
          </div>
        </div>
        <div class="list-item">
          <div class="list-item__icon">
            <ProtectIcon />
          </div>
          <div class="list-item__content">
            <p class="title">{{ $t("common.protect") }}</p>
            <p>{{ $t("welcome.protect_description") }}</p>
          </div>
        </div>
      </div>
      <LcButton size="lg" @click="router.push(`/app/generator`)">
        {{ $t("common.continue") }}
      </LcButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-page-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .welcome-card {
    max-width: 620px;
    padding: 3rem 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 30px 10px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    box-sizing: border-box;

    &__title {
      margin: 0;
      font-size: 30px;
      font-weight: 600;
    }

    &-list {
      margin-bottom: 3rem;
      padding-left: 2.5rem;
      display: flex;
      flex-direction: column;

      .list-item {
        margin-top: 3rem;
        display: flex;

        &__icon {
          width: 5.5rem;
          min-width: 5.5rem;
          padding-top: 10px;
          display: flex;
          justify-content: center;
        }

        &__content {
          margin-left: 2rem;
          display: flex;
          flex-direction: column;

          p {
            padding-bottom: 0;
            font-size: 18px;
            line-height: 28px;

            &.title {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 7px;
            }
          }
        }
      }
    }
  }
}
</style>
