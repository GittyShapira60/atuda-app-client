<template>
  <v-container class="pa-0 bg-white round-title">
    <v-sheet class="general-title">
      <v-sheet class="icon-sheet">
        <v-icon icon="mdi-chevron-right" class="icon"></v-icon>
        <v-btn class="button-name" :ripple="false" @click="back()">
          חזור
        </v-btn>
      </v-sheet>
      <v-sheet class="title-header">{{ title }}</v-sheet>
      <v-sheet>
        <div class="numbers" v-if="steps > 1">
          <p class="all-steps">{{ steps }}/</p>
          <p class="currnet">{{ currentStep }}</p>
        </div>
      </v-sheet>
    </v-sheet>
    <v-container class="steps d-flex">
      <div class="steps-container">
        <div
          v-for="(step, index) in steps"
          :key="index"
          :class="{ green: step <= currentStep }"
          class="step-item"
        ></div>
      </div>
    </v-container>
  </v-container>
</template>

<script lang="ts" setup>
defineProps<{
  currentStep: number
  steps: number
  title: string
}>()

const emit = defineEmits<{ (back: 'back-button'): void }>()
const back = () => {
  emit('back-button')
}
</script>

<style lang="scss">
.general-title {
  display: flex !important;
  padding: 3.74vw;
  align-items: center;
  justify-content: space-between;
  height: 16.355vw;
}

.round-title {
  border-bottom-left-radius: 5.607vw !important;
  border-bottom-right-radius: 5.607vw !important;
}

.numbers {
  display: flex;
  align-items: center;
}

.button-name {
  font-size: 3.037vw;
  font-weight: 400;
  line-height: 5.14vw;
  letter-spacing: 0.093vw !important;
  min-width: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
  color: rgb(var(--v-theme-Gray-Status));
}

.title-header {
  font-size: 5.14vw !important;
  font-weight: 600;
  line-height: 4.206vw;
}

.all-steps {
  margin-bottom: -1.168vw;
  color: rgb(var(--v-theme-Manatee));
}

.currnet {
  font-size: 6.542vw;
  margin-bottom: 1.2vw;
  color: rgb(var(--v-theme-Professor-Plum));
}

.icon {
  margin-left: -1.168vw;
}

.steps-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.step-item {
  width: 100%;
  height: 2.336vw;
  margin-left: 0.234vw;
  background-color: rgb(var(--v-theme-Gray));
}

.step-item:first-child {
  border-top-right-radius: 1.168vw;
  border-bottom-right-radius: 1.168vw;
}

.step-item:last-child {
  border-top-left-radius: 1.168vw;
  border-bottom-left-radius: 1.168vw;
}

.green {
  background-color: rgb(var(--v-theme-Fruit-Salad));
}

.steps {
  padding-top: 0;
  padding-bottom: 4.673vw;
  padding-left: 3.738vw;
}
.icon-sheet {
  margin-right: -1.869vw;
}
</style>
