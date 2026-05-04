<template>
  <div class="description-autocomplete">{{ description }}</div>
  <v-container class="container-auto">
    <v-card :style="{ height: cardHeight + 'vw' }" class="card-auto">
      <v-autocomplete
        v-model="selected"
        :items="dataItems"
        clearable
        variant="outlined"
        rounded="pill"
        bg-color="rgb(var(--v-theme-Light-Purple))"
        clear-icon="mdi-close"
        menu-icon="none"
        class="select"
        density="comfortable"
        :flat="true"
        :list-props="{
          density: 'comfortable',
          class: 'elevation-0',
          maxHeight: '40vw',
        }"
        :menu-props="{ attach: 'body', contentClass: 'autocomplete-menu' }"
        @update:model-value="save"
        @update:menu="handleMenuUpdate"
      >
        <template v-slot:item="{ props, index }">
          <v-list-item v-bind="props" class="list"></v-list-item>
          <v-divider
            color="rgb(var(--v-theme-Light-Purple))"
            class="divider-auto opacity-100"
            v-if="index !== dataItems.length - 1"
          ></v-divider>
        </template>
      </v-autocomplete>
    </v-card>
    <div
      v-if="props.error && !isValid"
      class="error-message error-autoComplete"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ errorMessage }}
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ErrorSchema } from '@/enums/ErrorSchema'
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: any
  statefulLayout: any
  error?: Boolean
}>()

const selected = ref(
  typeof props.modelValue.data === 'object'
    ? props.modelValue.data?.name
    : props.modelValue.data,
)
const dataItems = ref(
  props.modelValue.props.data.map((item: any) => item.name || item),
)

const description = ref(props.modelValue.props.description)
const cardHeight = ref(18)

const save = (event: any) => {
  if (props.modelValue) {
    if (
      props.modelValue.props.data.every((item: any) => typeof item === 'object')
    ) {
      selected.value = props.modelValue.data?.name === event ? null : event
      props.statefulLayout.input(
        props.modelValue,
        selected.value
          ? props.modelValue.props.data.filter(
              (item: any) => item.name === event,
            )[0]
          : null,
      )
    } else {
      selected.value = props.modelValue.data === event ? null : event
      props.statefulLayout.input(props.modelValue, selected.value)
    }
  }
}

const isValid = computed(() => {
  return !(
    (props.modelValue.data === undefined ||
      (typeof props.modelValue.data === 'object' &&
        Object.keys(props.modelValue.data).length === 0)) &&
    props.statefulLayout._compiledLayout.schema.required.includes(
      props.modelValue.key,
    )
  )
})

const errorMessage = computed(() => {
  return ErrorSchema.MissingField
})
const handleMenuUpdate = (height: boolean) => {
  cardHeight.value = height ? 58.645 : 18
}
</script>

<style lang="scss">
.container-auto {
  padding: 1.5vh 0vh;
}

.error-autoComplete {
  margin-top: 0.8vh;
  padding-right: 0.625vw;
}

.v-field__append-inner {
  width: 0.467vw;
}

.v-messages__message {
  color: rgb(var(--v-theme-Comment-text)) !important;
}

.v-icon--clickable {
  color: rgb(var(--v-theme-Professor-Plum)) !important;
  opacity: 1 !important;
}

.description-autocomplete {
  font-size: 3.738vw;
  font-weight: 400;
  line-height: 5.234vw;
  text-align: right;
  margin-top: 1.667vh;
}

.list {
  padding-top: 2vh;
  padding-bottom: 0.8vh;
}

.select {
  margin-top: 2.804vw !important;
  font-size: 3.271vw !important;
  padding: 0 2.804vw;
}

.autocomplete-menu .v-list-item-title {
  font-size: 3.738vw !important;
}

.autocomplete-menu .v-list-item {
  height: 9.346vw !important;
  margin: 1.5vw 0 0.5vw 0;
  color: rgb(var(--v-theme-Professor-Plum)) !important;
}
.autocomplete-menu {
  z-index: 9999 !important;
}
.divider-auto {
  margin: 0 1.869vw !important;
  z-index: 9999 !important;
}

.error-auto {
  padding-right: 2.804vw;
  margin-top: 1.869vw;
}

.card-auto {
  box-shadow: var(--v-box-shadow) !important;
  border-radius: 2.336vw !important;
}

.v-field.v-field--variant-outlined .v-field__outline__start,
.v-field.v-field--variant-outlined .v-field__outline__notch::before,
.v-field.v-field--variant-outlined .v-field__outline__notch::after,
.v-field.v-field--variant-outlined .v-field__outline__end {
  border: none;
}
</style>
