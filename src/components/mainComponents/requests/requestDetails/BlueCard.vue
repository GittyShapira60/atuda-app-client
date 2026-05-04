<template>
  <div class="external">
    <v-card class="text-center style-text" :class="{ 'style-card': !title }">
      <v-card-title v-if="title" class="font-18 pa-0 blue-card-title">{{
        title
      }}</v-card-title>
      <div>
        <FileIcon />
      </div>
      <v-card-text class="blue-card-text text-card">{{ text }} </v-card-text>
      <div class="half-circle-green position-absolute"></div>
      <div class="half-circle-orange position-absolute"></div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  text: string
}>()
</script>

<style lang="scss">
.style-text {
  padding-top: 6.2vw;
  border-radius: 4.673vw !important;
  background: rgb(var(--v-theme-Primary-Navy-Blue)) !important;
  box-shadow: var(--v-box-shadow) !important;
  width: 90.65vw;
  display: flex;
  flex-direction: column;
}
.style-card {
  padding-top: 7.4vw;
}
.external .v-card-title,
.blue-card-text {
  color: white;
}
.login-icon {
  height: 19.65vw;
}

.blue-card-title {
  padding-bottom: 2.7vw !important;
}

.font-18 {
  font-size: 4.206vw !important;
}

.text-card {
  color: white;
  font-size: 3.738vw !important;
  line-height: 5.607vw !important;
  padding: 4.5vw 0 5.6vw;
}

.half-circle-orange {
  top: 17.5vw;
  left: -5vw;
  width: 15.654vw;
  height: 7.944vw;
  background: rgb(var(--v-theme-Light-Yellow));
  border-top-left-radius: 11.682vw;
  border-top-right-radius: 11.682vw;
  transform: rotate(-30deg);
}

.half-circle-green {
  top: 29.2vw;
  right: -5vw;
  width: 15.654vw;
  height: 7.944vw;
  background: rgb(var(--v-theme-Green-Chip));
  border-bottom-left-radius: 11.682vw;
  border-bottom-right-radius: 11.682vw;
  transform: rotate(30deg);
}
</style>
