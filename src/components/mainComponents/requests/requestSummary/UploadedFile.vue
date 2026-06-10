<template>
  <div>
    <v-card class="box-shadow round pb-0 extrenal-card">
      <v-card
        class="box-shadow round d-flex justify-space-between flex-wrap border-blue pb-0"
        color="rgb(var(--v-theme-Powder-Blue))"
      >
        <v-card-item :style="{ width: '51.402vw' }" class="pl-0 card-file">
          <p v-text="item.title" class="d-inline file-title" />
          <v-tooltip location="top" v-model="show">
            <template #activator="{ props }">
              <v-icon class="icon" v-bind="props" @click="show = !show">
                <InfoWhiteIcon />
              </v-icon>
            </template>
            <v-icon class="float-left close mt-0 pl-0" @click="show = false"
              ><CloseIcon
            /></v-icon>
            <br class="small-br" />
            <p v-text="item.info" />
          </v-tooltip>
        </v-card-item>
        <v-card-item class="item-ok-icon">
          <div class="ok-icon">
            <OkIcon />
          </div>
        </v-card-item>
      </v-card>
      <div v-for="(file, index) in item.data" :key="index" class="view-button">
        <p class="file-name">
          {{ file.name?.replace(/\.[^/.]+$/, '') }}
        </p>
        <div class="d-flex justify-end details">
          <p
            class="text-decoration-underline view opacity-80"
            @click="viewFile(file)"
            v-text="'צפייה'"
          />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  file: any
}>()

const show = ref(false)
const item = ref(props.file)

const viewFile = (file: File) => {
  const fileURL = URL.createObjectURL(file)
  let width = 600
  let height = 400
  const left = window.innerWidth / 2 - width / 2
  const top = window.innerHeight / 2 - height / 2
  window.open(
    fileURL,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top}`,
  )
}
</script>

<style lang="scss">
.box-shadow {
  box-shadow: var(--v-box-shadow) !important;
}
.border-blue {
  border: 0.467vw solid rgb(var(--v-theme-Light-Cornflower-Blue)) !important;
  padding: 0.935vw;
  margin-bottom: 1.869vw;
  height: 14.953vw !important;
}
.small-br {
  line-height: 0.117vw;
  font-size: 1.87vw;
}
.extrenal-card {
  margin-bottom: 3.9vw !important;
}
.list-files {
  padding: 0 0.467vw 1.869vw 0;
}
.icon {
  margin-right: 0.935vw;
}
.ok-icon {
  padding-top: 0.935vw;
}
.item-ok-icon {
  padding: 2.336vw 3.738vw 2.336vw 3.738vw !important;
}
.file-title {
  font-size: 3.738vw !important;
  font-weight: 700 !important;
  line-height: 4.673vw !important;
}
.file-name {
  font-size: 3.271vw !important;
  font-weight: 600 !important;
  line-height: 5.607vw !important;
  width: 88%;
  white-space: nowrap !important;
  overflow-x: auto !important;
  text-overflow: clip !important;
}
.view {
  font-size: 3.271vw;
  font-weight: 400;
  line-height: 5.607vw;
  margin-right: 1.869vw;
}
.round {
  border-radius: 2.804vw !important;
}
.close {
  padding: 1.5vw 0 0 5.3vw;
}
.details {
  margin-top: -5.14vw !important;
  padding-bottom: 0.935vw;
}
.v-tooltip > .v-overlay__content {
  background-color: white !important;
  color: black !important;
  width: 73% !important;
  box-shadow: var(--v-box-shadow) !important;
  border-radius: 2.336vw !important;
  line-height: 140% !important;
  text-transform: lowercase !important;
  font-size: 3.037vw !important;
  padding-bottom: 3.972vw !important;
  padding-right: 4.673vw !important;
}
.v-tooltip > .v-overlay__content::after {
  content: '';
  position: absolute;
  bottom: -2.103vw;
  left: 50%;
  transform: translateX(0%);
  width: 0;
  height: 0;
  border-left: 2.336vw solid transparent;
  border-right: 2.336vw solid transparent;
  border-top: 2.336vw solid white;
  box-shadow: var(--v-box-shadow);
}
.view-button {
  padding: 0 4.673vw 2.336vw !important;
}
</style>
