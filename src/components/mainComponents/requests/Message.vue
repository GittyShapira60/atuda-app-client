<template>
  <v-app class="app-message">
    <v-container class="including pa-0">
      <Title
        :currentStep="sumSteps"
        :steps="sumSteps"
        :title="title"
        @back-button="handleBackButton"
      />
      <v-container class="flex">
        <div v-if="title !== 'שגיאה'" class="icon-message">
          <div class="green-half-circle size-half-circle"></div>
          <div class="white-circle">
            <v-img src="@/assets/success.gif" />
          </div>
          <div class="orange-half-circle size-half-circle"></div>
        </div>
        <v-img class="error-img" src="@/assets/error.png" v-else></v-img>
        <p class="simple-text text-center">
          {{ message }}
        </p>
        <a class="link" v-if="url" :href="url">סקר שביעות רצון</a>
      </v-container>
      <FooterButton text="חזרה לעמוד הראשי" @clicked="clicked" />
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  sumSteps: number
  title: string
  message: string
  url?: any
}>()

const emit = defineEmits<{
  (next: 'clicked'): void
  (back: 'back-button'): void
}>()

const clicked = () => {
  emit('clicked')
}

const handleBackButton = () => {
  router.replace({ path: '/' })
}
</script>

<style lang="scss">
.app-message .v-application__wrap {
  min-height: calc(100vh - 14.953vw) !important;
}

@media screen and (max-height: 668px) {
  .white-circle {
    width: 80px !important;
    height: 80px !important;
    align-content: center;
  }
  .green-circle {
    width: 70px !important;
    height: 70px !important;
  }
  .green-half-circle {
    width: 26px !important;
    height: 13px !important;
    margin-top: 20px !important;
    margin-left: -17px !important;
  }
  .link {
    color: rgb(var(--v-theme-White));
    font-size: 4.673vw;
    font-weight: 400;
    line-height: 7.009vw;
  }
  .orange-half-circle {
    height: 13px !important;
    width: 26px !important;
    margin-top: 55px !important;
    margin-right: -20px !important;
  }
}

.icon-message {
  display: flex;
  margin-bottom: 3vh;
}
.white-circle {
  width: 100px;
  height: 100px;
  background: rgb(var(--v-theme-White));
  border-radius: 50%;
  box-shadow: 0px 20px 35px 0px #0e1f3d38;
}

.size-half-circle {
  width: 32px;
  height: 16px;
}

.green-half-circle {
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  background: rgb(var(--v-theme-Fruit-Salad));
  z-index: 1;
  margin-top: 25px;
  margin-left: -20px;
}

.orange-half-circle {
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  background: rgb(var(--v-theme-Dark-Orange));
  margin-top: 60px;
  margin-right: -25px;
  z-index: 1;
}

.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24vh;
}

.including {
  background: rgb(var(--v-theme-Primary-Navy-Blue)) !important;
  box-shadow: var(--v-box-shadow);
  height: 100%;
}

.simple-text {
  color: rgb(var(--v-theme-White));
  font-size: 4.673vw;
  font-weight: 400;
  line-height: 7.009vw;
}

.error-img {
  height: 28.037vw;
  width: 30.374vw;
  margin-bottom: 10px;
}
</style>
