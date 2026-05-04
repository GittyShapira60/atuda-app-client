<template>
  <div class="description-textarea">{{ description }}</div>
  <div class="position-relative d-flex wrap-textarea">
    <v-textarea
      class="textarea"
      v-model.lazy="modelValue.data"
      :label="modelValue.layout.label"
      variant="solo"
      :value="modelValue.data"
      @input="saveText"
      @keydown="preventCharacter"
      counter
      :counter-value="() => modelValue?.data?.length"
      :maxlength="modelValue.layout.props.maxLength"
      rounded="lg"
      :rows="modelValue.layout.props.rows"
    >
      <template v-slot:counter>
        <span>
          {{ modelValue?.data?.length ? modelValue?.data?.length : 0 }}/{{
            modelValue.layout.props.maxLength
          }}
        </span>
        <div class="d-flex justify-center align-center">
          <v-tooltip location="top" :open-on-hover="false" open-on-click>
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props">
                <InfoGreyIcon />
              </v-icon>
            </template>
            <span>
              התויים המורשים הם
              {{
                pattern.slice(pattern.indexOf('[') + 1, pattern.indexOf(']'))
              }}</span
            >
          </v-tooltip>
        </div>
      </template>
    </v-textarea>

    <div
      v-if="props.error && !isValid"
      class="error-message error-textarea position-absolute bottom-0 right-0"
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
const modelValue = ref(props.modelValue)
const description = ref(props.modelValue.props.description)
const pattern =
  props.statefulLayout._compiledLayout.schema.properties[props.modelValue?.key]
    ?.pattern

const isValid = computed(() => {
  return !(
    (props.modelValue.data?.length === 0 ||
      props.modelValue.data === undefined) &&
    props.statefulLayout._compiledLayout.schema.required.includes(
      props.modelValue.key,
    )
  )
})

const errorMessage = computed(() => {
  return ErrorSchema.MissingField
})

const preventCharacter = (event: KeyboardEvent) => {
  let block = modelValue?.value.layout.props.block
  if (block && block.includes(event.key)) {
    event.preventDefault()
  }
}
const saveText = (event: any) => {
  if (modelValue) {
    props.statefulLayout.input(props.modelValue, event.target.value)
  }
  emit('checked')
}
</script>

<style lang="scss">
.v-counter {
  display: flex !important;
  direction: ltr;
  position: absolute;
  bottom: 9.5vw;
  left: 4vw;
  font-size: 3.271vw;
  font-weight: 400;
  line-height: 4.673vw;
  color: rgb(var(--v-theme-Manatee)) !important;
  letter-spacing: 0.0001vw !important;
}

.textarea {
  .v-field__input {
    margin-bottom: 10vw;
  }
}

.textarea {
  & .v-label {
    font-size: 3.505vw !important;
    font-weight: 400;
    line-height: 4.766vw;
    color: rgb(var(--v-theme-Cracked-Slate)) !important;
    opacity: 1;
  }
}

.v-field--variant-solo {
  box-shadow: var(--v-box-shadow) !important;
  direction: rtl;
}

.error-textarea {
  padding-right: 0.625vw;
}

.description-textarea {
  font-size: 3.738vw;
  font-weight: 600;
  line-height: 5.234vw;
  text-align: right;
  margin-top: 1.667vw;
}

.wrap-textarea {
  margin-top: 5.607vw;
}
</style>
