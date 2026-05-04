<template>
  <div
    :class="{
      'squares d-flex align-center padding-flow flex-wrap justify-center': true,
      'position-absolute top': !reasonRequired,
    }"
  >
    <span v-text="name" class="font-weight-bold flow-title" />
    <p v-text="description" class="text-center flow-sub-title" />
    <v-btn
      v-if="reasonRequired"
      density="default"
      v-for="(option, index) in filteredOptions"
      class="box-shadow square"
      :key="index"
      :value="option"
      @click="saveOption(option)"
      :color="
        selectedButton && option.name === selectedButton.name
          ? 'rgb(var(--v-theme-Primary-Navy-Blue))'
          : 'white'
      "
    >
      <v-row class="general-square">
        <v-img
          :class="{
            img: true,
          }"
          :src="
            selectedButton && option.name === selectedButton.name
              ? getImagePath('ch-' + option.name)
              : getImagePath(option.name)
          "
        />
        <span
          v-text="option.displayName"
          :class="{
            'text-wrap span txt': true,
            'selected-text':
              selectedButton && option.name === selectedButton.name,
          }"
        />
      </v-row>
    </v-btn>
    <div
      v-if="reasonRequired && !selectedButton && error"
      class="error-message"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ errorMessage }}
    </div>
    <FooterButton text="עוברים לשלב הבא" @click="click()" />
  </div>
</template>

<script lang="ts" setup>
import { ErrorSchema } from '@/enums/ErrorSchema'
import { RequestReason } from '@/enums/RequestReason'
import { computed, ref } from 'vue'
const props = defineProps<{
  name: string
  description: string
  reasonRequired: boolean
  excludeOptions?: string[]
}>()

let selectedButton: any = ref(null)
const error = ref(false)
const errorMessage = computed(() => {
  return ErrorSchema.MissingField
})
const getImagePath = (name: any) => {
  return `/bakashot/assets/icons/${name}.png`
}

const emit = defineEmits<{ (click: 'click-option', value: any): void }>()
const saveOption = (option: any) => {
  selectedButton.value = {
    name: option.name,
    displayName: { id: option.id, name: option.displayName },
  }
  error.value = false
}

const click = () => {
  !props.reasonRequired || selectedButton.value
    ? emit('click-option', selectedButton.value)
    : (error.value = true)
}

const filteredOptions = computed(() => {
  const options = RequestReason[0].options
  if (!props.excludeOptions || props.excludeOptions.length === 0) return options
  return options.filter((opt) => !props.excludeOptions?.includes(opt.name))
})
</script>

<style lang="scss">
.padding-flow {
  padding: 4.673vw;
}

.box-shadow {
  box-shadow: var(--v-box-shadow) !important;
}
.txt {
  font-size: 3.224vw !important;
  letter-spacing: 0.117vw !important;
  font-weight: bold;
}
.selected-text {
  color: white !important;
  font-weight: normal;
}

.flow-title {
  margin-top: 9.346vw;
  margin-bottom: 1.869vw;
}

.flow-sub-title {
  padding: 0 2.336vw 1.467vw 2.336vw;
}
.top {
  top: 66.07vw;
}
.squares {
  & .flow-title {
    font-size: 4.206vw !important;
  }
  .square {
    margin: 2.57vw;
    height: 35.047vw !important;
    width: 35.047vw !important;
    border-radius: 4.673vw !important;
    & .img {
      width: 14.019vw !important;
      height: 14.019vw !important;
    }

    & .span {
      margin-top: 0.5vw !important;
    }
  }
}
</style>
