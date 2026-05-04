<template>
  <div
    :class="{
      [layout]: true,
      'd-flex align-center padding-flow': true,
      'flex-column h-auto': layout === Layout.LINE,
      'flex-wrap justify-center': layout === Layout.SQUARE,
    }"
  >
    <v-btn
      density="default"
      v-for="(option, index) in options"
      :class="{
        'box-shadow': true,
        'text-right line': layout === Layout.LINE,
        square: layout === Layout.SQUARE,
      }"
      :key="index"
      :value="option"
      @click="saveOption(option)"
      :color="
        selectedButton && option.name === selectedButton.name
          ? 'rgb(var(--v-theme-Primary-Navy-Blue))'
          : 'white'
      "
    >
      <v-row
        :class="{
          'general-square': layout === Layout.SQUARE,
          'general-line': layout === Layout.LINE,
        }"
      >
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
      v-if="!selectedButton && error"
      class="error-message"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ errorMessage }}
    </div>
    <FooterButton text="עוברים לשלב הבא" @click="click" />
  </div>
</template>

<script lang="ts" setup>
import { ErrorSchema } from '@/enums/ErrorSchema'
import { Layout } from '@/enums/Layout'
import { Flow } from '@/interfaces/RequestType'
import { computed, ref } from 'vue'
const props = defineProps<{
  data: Flow
}>()
const options = props.data.options.map((item: any) => {
  if (typeof item.displayName === 'object') {
    return { name: item.name, displayName: item.displayName.name }
  } else {
    return item
  }
})
const error = ref(false)
const errorMessage = computed(() => {
  return ErrorSchema.MissingField
})

let selectedButton: any = ref(null)
let layout = ref(props.data.layout)

const getImagePath = (name: any) => {
  return `/bakashot/assets/icons/${name}.png`
}

const emit = defineEmits<{ (click: 'click-option', value: string): void }>()
const saveOption = (option: any) => {
  selectedButton.value = props.data.options.filter(
    (item: any) => item.name === option.name,
  )[0]
  error.value = false
}
const click = () => {
  selectedButton.value
    ? emit('click-option', selectedButton.value)
    : (error.value = true)
}
</script>

<style lang="scss">
.padding-flow {
  padding: 4.673vw;
}
.general-square {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.general-line {
  align-items: center;
  margin: 0;
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

.lines {
  & .flow-title {
    font-size: 4.673vw !important;
  }
  .line {
    margin: 2.34vw;
    justify-content: right !important;
    height: 9vh !important;
    width: 92% !important;
    border-radius: 2.336vw !important;
    flex-wrap: wrap;
    & .img {
      width: 11vw !important;
      height: 4.15vh;
    }
    & .span {
      padding-right: 4.673vw;
      width: 48vw;
    }
  }
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
