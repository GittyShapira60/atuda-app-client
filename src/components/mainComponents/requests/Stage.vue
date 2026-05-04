<template>
  <div v-if="errorAJV" class="error-message error-min-prop">
    {{ errorAJV }}
  </div>
  <div v-if="props.stage">
    <v-form v-on:submit.prevent="handleNextStep">
      <div class="mx-auto overflow">
        <span class="font-weight-bold d-flex justify-center stage-title">{{
          props.stage.title
        }}</span>
        <p class="stage-description text-center">
          {{ props.stage.description }}
        </p>
        <Vjsf
          v-model="props.stage.data"
          :schema="props.stage.schema"
          :options="{
            ...options,
            nodeComponents: { markdown: VjsfNodeMarkdown },
          }"
          dir="rtl"
        >
          <template
            v-for="(name, index) in componentName"
            :key="index"
            v-slot:[name]="{ node, statefulLayout }"
          >
            <component
              :key="index"
              :is="getComponent(node.layout.slots.component.name)"
              :modelValue="node"
              :statefulLayout="statefulLayout"
              :error="error"
              :property="property"
              @checked="handleChecked"
              @error="onError"
            />
            <Popup
              v-if="dialog"
              v-model="dialog"
              :title="dialogContent.title"
              :content="dialogContent.content"
              :btnText="'המשך'"
              :move="true"
              @close-popup="handleClosePopup"
            />
          </template>
        </Vjsf>
      </div>
      <footer-button type="submit" text="עוברים לשלב הבא" />
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { Components } from '@/enums/Components'
import { ErrorSchema, ErrorSchemaMessage } from '@/enums/ErrorSchema'
import Vjsf from '@koumoul/vjsf'
import VjsfNodeMarkdown from '@koumoul/vjsf-markdown'
import Ajv from 'ajv'
import { computed, ref, watch, watchEffect } from 'vue'

const ajv = new Ajv({
  strict: false,
})

const props = defineProps<{
  index: number
  stagesNumber: number
  stage: any
}>()

const options = ref({})
const error = ref(false)
const property = ref(false)
const errorAJV = ref('')
const dialog = ref(false)
const hasError = ref(false)

const emit = defineEmits<{
  (update: 'update-request', payload: any): void
  (remove: 'delete-year'): void
}>()

const dialogContent = ref({
  title: 'שימו לב!',
  content:
    'במידה וצריך להזין בבקשה קובץ מסוג גליון ציונים,יש  לצרף גיליון מעודכן (לא מאזן) חתום דיגיטלית מה-30 ימים האחרונים',
})

const handleClosePopup = () => {
  dialog.value = false
}
watchEffect(() => {
  errorAJV.value = ''
  props.stage.schema.properties = props.stage.schema.properties
})

const onError = (val: any) => {
  hasError.value = val.valid
}

const handleError = (data: any) => {
  if (ajv.errors && ajv.errors[0]?.message == ErrorSchema.MinProperties) {
    errorAJV.value = ErrorSchemaMessage.get(ErrorSchema.MinProperties) || ''
  } else if (
    ajv.errors &&
    ajv.errors.some((item) => !item.schemaPath.includes('anyOf'))
  ) {
    errorAJV.value = ''
  }
  if (ajv.errors && ajv.errors[2]?.message == ErrorSchema.MissingProperty) {
    errorAJV.value = ErrorSchemaMessage.get(ErrorSchema.MissingProperty) || ''
  }
  if (ajv.errors && ajv.errors[0]?.message?.startsWith(ErrorSchema.Pattern)) {
    const propertyName = ajv.errors[0].instancePath.replace(/^\//, '')
    const value = data[propertyName]
    const pattern = props.stage.schema.properties[propertyName].pattern
    const regex = new RegExp(pattern)
    const invalidChars = value
      ?.split('')
      .filter((ch: string) => !regex.test(ch))
    errorAJV.value =
      `${ErrorSchemaMessage.get(ErrorSchema.Pattern)}: ` +
        [...new Set(invalidChars)].join(' ') || ''
  }
  if (ajv.errors && Object.keys(data).includes(ajv.errors[0].params.property)) {
    property.value = ajv.errors[0].params.missingProperty
    errorAJV.value = ''
  }
  if (
    ajv.errors &&
    Object.keys(data).includes(ajv.errors[0].params.missingProperty)
  ) {
    property.value = ajv.errors[0].params.missingProperty
    errorAJV.value = ''
  }
  error.value = true
}

const isValid = () => {
  props.stage.data = Object.fromEntries(
    Object.entries(props.stage.data).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
      } else if (value && typeof value === 'object') {
        return Object.keys(value).length > 0
      }
      return true
    }),
  )

  const valid = ajv.validate(props.stage.schema, props.stage.data)
  return { data: props.stage.data, valid }
}

const handleNextStep = () => {
  const { data, valid } = isValid()
  if (!valid || hasError.value) {
    handleError(data)
  } else {
    emit('update-request', data)
    error.value = false
    errorAJV.value = ''
  }
}

const handleChecked = (value: any) => {
  error.value = false
  errorAJV.value = ''
}

const getComponent = (componentName: any) => {
  return Components.get(componentName)
}

const componentName = computed(() => {
  const node = props.stage
  let componentNames: Array<string> = []
  Object.keys(node?.schema.properties).forEach((key) => {
    componentNames.push(node.schema.properties[key].layout.slots.component)
  })
  return componentNames
})
watch(
  () => props.stage,
  (newValue, oldValue) => {
    if (
      newValue.key.includes('File') &&
      newValue.schema.properties.hasOwnProperty('02')
    ) {
      dialog.value = true
    }
    if (
      newValue.schema.properties.endYear &&
      oldValue.schema.properties.startYear
    ) {
      emit('delete-year')
    }
  },
)
</script>

<style>
.stage-title {
  font-size: 4.206vw !important;
  margin-bottom: 1.869vw !important;
  margin-top: 7.477vw !important;
}

.stage-description {
  margin-bottom: 4.673vw !important;
}

.overflow {
  width: 93%;
  padding: 2.2vw;
  height: 71vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.v-alert {
  display: none;
}

.overflow .mb-6.mt-6 {
  margin: 0 !important;
}

.overflow .vjsf-node {
  padding-top: 0 !important;
  padding-bottom: 0.444vh !important;
}

.error-min-prop {
  position: absolute;
  padding-right: 6.542vw !important;
  padding-top: 1.869vw !important;
}

@media screen and (max-height: 668px) {
  .overflow {
    height: 66vh;
  }
}
</style>
