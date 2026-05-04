<template>
  <v-dialog v-model="dialog" class="details-dialog" persistent>
    <v-card class="dialog-card">
      <v-icon
        icon="mdi-close"
        class="close-icon"
        @click="emit('close-popup', false)"
      ></v-icon>
      <span v-if="title" class="dialog-title text-center font-weight-bold">{{
        title
      }}</span>
      <div class="dialog-lines d-flex flex-column text-center">
        <span v-if="content" v-for="line in content.toString().split('\n')">
          {{ line }}<br />
        </span>
        <template v-if="src">
          <v-img :src="src" class="dialog-image" />
        </template>
      </div>
      <template v-slot:actions>
        <v-btn
          rounded="pill"
          class="dialog-btn mx-auto"
          :text="btnText"
          @click="emit('close-popup', move)"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  content?: string
  src?: string
  btnText: string
  move: boolean
}>()

const emit = defineEmits<{ (close: 'close-popup', move: boolean): void }>()
const dialog = defineModel<boolean>()
</script>

<style lang="scss" scoped>
.v-overlay--active {
  backdrop-filter: blur(0.8px);
}
.details-dialog {
  .dialog-card {
    padding: 3.738vw;
    border-radius: 12.383vw !important;
    background: rgb(var(--v-theme-White-Solid));
    box-shadow: 0 0.47vw 0.47vw 0 rgba(0, 0, 0, 0.25) !important;
  }
  .close-icon {
    width: auto;
    justify-content: left;
  }
  .dialog-title {
    font-size: 6.54vw;
  }
  .dialog-lines {
    overflow: auto;
    font-size: 4.673vw;
    padding: 3.738vw !important;
    gap: 1.87vw;
    .dialog-image {
      width: 100%;
      height: auto;
      :deep(.v-img__img.v-img__img--contain) {
        width: 100%;
      }
    }
  }
  .dialog-btn {
    background-color: rgb(var(--v-theme-Primary-Navy-Blue));
    color: white;
    font-size: 4.21vw;
    margin-top: 1.869vw !important;
    align-items: center;
    height: 7.01vw !important;
  }
}
</style>
