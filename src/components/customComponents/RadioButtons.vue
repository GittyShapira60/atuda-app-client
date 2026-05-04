<template>
  <div class="center-all">
    <v-btn
      v-for="(button, index) in buttons"
      v-model="modelValue.data"
      @click="selectReason(index, button)"
      :key="index"
      width="75.701vw"
      height="19.393vw"
      :ripple="false"
      :class="index == selected ? 'white btn' : 'btn'"
      :color="
        index == selected
          ? 'rgb(var(--v-theme-Primary-Navy-Blue)'
          : 'rgb(var(--v-theme-White))'
      "
    >
      <img :src="getSrcImg(button.image, index)" class="image" />
      {{ button.text.name || button.text }}
    </v-btn>
    <div
      v-if="props.error && !isValid"
      class="error-message error-text"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ErrorSchema } from '@/enums/ErrorSchema'
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: any
  statefulLayout: any
  error?: boolean
}>()

const errorMessage = computed(() => {
  return ErrorSchema.MissingField
})

const buttons = ref(props.modelValue.props.data)

const selected = ref(
  props.modelValue.data ||
    (typeof props.modelValue.data === 'object' &&
      Object.entries(props.modelValue.data).length)
    ? buttons.value.findIndex(
        (item: any) =>
          item.text === props.modelValue.data ||
          (item.text.name && item.text.name === props.modelValue.data.name),
      )
    : -1,
)

const isEmpty = ref(false)

const isValid = computed(() => {
  return !(
    ((typeof props.modelValue.data === 'object' &&
      Object.entries(props.modelValue.data).length === 0) ||
      props.modelValue.data?.length === 0 ||
      props.modelValue.data === undefined) &&
    props.statefulLayout._compiledLayout.schema.required.includes(
      props.modelValue.key,
    )
  )
})

const selectReason = (index: number, button: any) => {
  isEmpty.value = selected.value === index
  selected.value = selected.value === index ? null : index
  props.statefulLayout.input(
    props.modelValue,
    selected.value === index ? button.text : null,
  )
}

const getSrcImg = (image: any, index: number) => {
  return selected.value == index
    ? `/bakashot/assets/icons/ch-${image}.png`
    : `/bakashot/assets/icons/${image}.png`
}
</script>

<style lang="scss" scoped>
.white {
  color: rgb(var(--v-theme-White));
}

.image {
  margin-left: 4.673vw;
  margin-right: 1vw;
  height: 10.047vw;
}

.error-text {
  padding-right: 0.625vw;
}

.center-all {
  margin: 0 auto;
  width: 75.701vw;
  padding-top: 6vw;
}

.color-error {
  color: rgb(var(--v-theme-Comment-text)) !important;
}

.btn {
  border-radius: 2.804vw !important;
  font-size: 3.271vw;
  font-weight: 600;
  line-height: 3.925vw;
  text-align: right;
  letter-spacing: 0.07vw !important;
  margin-bottom: 5.607vw;
  box-shadow: var(--v-box-shadow) !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 19.393vw !important;
}
</style>
