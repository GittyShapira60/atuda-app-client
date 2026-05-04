<template>
  <div class="checkbox-title" v-show="show">{{ title }}</div>
  <div class="d-flex flex-column pa-0">
    <v-checkbox
      v-for="(name, index) in names"
      v-model="selectedOptions"
      class="font-weight-bold checkbox"
      color="rgb(var(--v-theme-Primary-Navy-Blue))"
      :key="index"
      :label="name"
      :value="name"
    ></v-checkbox>
  </div>
  <div
    v-if="props.error && !isValid"
    class="error-message error-checkbox"
    aria-live="assertive"
    aria-atomic="true"
  >
    {{ errorMessage }}
  </div>
</template>

<script lang="ts" setup>
import { ErrorSchema } from '@/enums/ErrorSchema'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: any
  statefulLayout: any
  error?: Boolean
  property?: String
}>()

const modelValue = props.modelValue
const selectedOptions = ref(modelValue.data?.name || modelValue.data || '')
const title = props.modelValue.props.description
let show = title !== 'none' && title !== 'null'
const names = props.modelValue.props.data.map((item: any) => item.name || item)

const emit = defineEmits<{ (change: 'checked'): void }>()
const isValid = computed(() => {
  return !(
    !props.modelValue.data &&
    (props.statefulLayout._compiledLayout.schema.required.includes(
      props.modelValue.key,
    ) ||
      props.property == props.modelValue.key)
  )
})

const errorMessage = computed(() => {
  return ErrorSchema.MissingField
})

const saveSelection = () => {
  modelValue.data =
    selectedOptions.value === false ? undefined : selectedOptions.value

  props.modelValue.props.data.every((item: any) => typeof item === 'object')
    ? props.statefulLayout.input(
        props.modelValue,
        props.modelValue.props.data.filter(
          (item: any) => item.name === modelValue.data,
        )[0],
      )
    : props.statefulLayout.input(props.modelValue, modelValue.data)
  emit('checked')
}

watch(selectedOptions, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    saveSelection()
  }
})
</script>

<style lang="scss">
.checkbox > .v-selection-control,
.checkbox .v-label {
  font-size: 3.738vw;
  font-weight: 600 !important;
  opacity: 100;
  color: rgb(var(--v-theme-Professor-Plum)) !important;
}

.checkbox > .v-input__details {
  display: none !important;
}

.checkbox-title {
  font-size: 3.738vw !important;
  font-weight: 400;
  line-height: 5.234vw;
  text-align: right;
  padding-bottom: 2.804vw;
}

.error-checkbox {
  padding-right: 0.625vw;
}
</style>
