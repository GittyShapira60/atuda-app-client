<template>
  <div class="d-flex align-center flex-column">
    <div class="toggle-title">{{ title }}</div>
    <v-container
      class="d-flex align-center flex-row bg-white wrap-toggle"
      style="width: 100%; border-radius: 5.607vw"
    >
      <v-btn
        v-for="button in data"
        @click="selectButton(button)"
        :key="button"
        :value="button"
        :class="{ selected: selectedIndex === button }"
        :style="{
          letterSpacing: selectedIndex === button ? '0.117vw' : '-0.023vw',
        }"
        class="toggle elevation-0"
        width="50%"
        rounded="pill"
        :ripple="false"
      >
        {{ button }}
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = defineProps<{
  modelValue: any
  statefulLayout: any
}>()
const emit = defineEmits<{ (change: 'checked'): void }>()
const data = [
  props.modelValue.layout.props.firstLabel?.name ||
    props.modelValue.layout.props.firstLabel,
  props.modelValue.layout.props.secondLabel?.name ||
    props.modelValue.layout.props.secondLabel,
]

const title = props.modelValue.layout.title

let selectedIndex = ref(null)

typeof props.modelValue.layout.props.firstLabel === 'object'
  ? (selectedIndex.value =
      props.modelValue.data?.name ||
      props.modelValue.layout.props.firstLabel?.name)
  : (selectedIndex.value =
      props.modelValue.data || props.modelValue.layout.props.firstLabel)

if (
  props.statefulLayout._compiledLayout.schema.required.includes(
    props.modelValue.key,
  )
) {
  props.statefulLayout.input(
    props.modelValue,
    props.modelValue.layout.props.firstLabel,
  )
}

const selectButton = (value: any) => {
  selectedIndex.value = value
  if (props.modelValue) {
    props.statefulLayout.input(
      props.modelValue,
      Object.values(props.modelValue.layout.props).find(
        (item: any) => item.name === value,
      ),
    )
  }
  emit('checked')
}
</script>

<style lang="scss" scoped>
.wrap-toggle {
  box-shadow: var(--v-box-shadow) !important;
  padding: 0.935vw;
  height: 11.215vw !important;
}

.selected {
  color: white !important;
  background-color: rgb(var(--v-theme-Primary-Navy-Blue)) !important;
  font-weight: 600;
  line-height: 5.607vw;
}

.toggle-title {
  font-size: 3.738vw;
  font-weight: 600;
  line-height: 5.607vw;
  text-align: right;
  margin: 1.869vw;
  margin-top: 3.738vw;
}

.toggle {
  padding: 0 3.738vw;
  font-size: 3.505vw;
  height: 9.346vw !important;
}
</style>
