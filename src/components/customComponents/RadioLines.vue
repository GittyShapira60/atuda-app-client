<template>
  <div class="d-flex align-center flex-column">
    <div class="radiolines-title mb-0">{{ title }}</div>
    <v-btn
      v-for="(button, index) in buttons"
      @click="selectButton(button)"
      v-model="props.modelValue.data"
      width="100%"
      rounded="pill"
      size="large"
      class="bold"
      :ripple="false"
      :key="index"
      :value="button"
      :class="{ selected: selectedIndex === button }"
    >
      {{ button }}
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
const emit = defineEmits<{ (change: 'checked'): void }>()
const title = props.modelValue.layout.label

const buttons = ref(
  props.modelValue.props.data.map((item: any) => item.name || item),
)

const errorMessage = computed(() => {
  return ErrorSchema.MissingField
})

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

const selectedIndex = ref(null)
props.modelValue.props.data.every((item: any) => typeof item === 'object')
  ? (selectedIndex.value = props.statefulLayout.data[props.modelValue.key]
      ? props.modelValue.data.name
      : null)
  : (selectedIndex.value = props.modelValue.data || null)

const selectButton = (e: any) => {
  selectedIndex.value = selectedIndex.value === e ? null : e
  if (props.modelValue) {
    props.modelValue.props.data.every((item: any) => typeof item === 'object')
      ? props.statefulLayout.input(
          props.modelValue,
          props.modelValue.props.data.filter(
            (item: any) => item.name === selectedIndex.value,
          )[0],
        )
      : props.statefulLayout.input(props.modelValue, selectedIndex.value)
    emit('checked')
  }
}
</script>

<style lang="scss" scoped>
.selected {
  border: 2px solid rgb(var(--v-theme-Light-Cornflower-Blue));
  background-color: rgb(var(--v-theme-Powder-Blue));
}

.error-text {
  padding-right: 0.625vw;
}

.radiolines-title {
  font-size: 3.738vw;
  font-weight: 600;
  line-height: 5.234vw;
  text-align: right;
  margin-top: 5.607vw;
}

.bold {
  font-size: 3.271vw;
  font-weight: 600;
  line-height: 5.14vw;
  box-shadow: var(--v-box-shadow) !important;
  margin: 1.869vw;
  height: 11.682vw !important;
}
</style>
