<template>
  <v-container class="d-flex align-end flex-column">
    <v-row class="d-flex align-center flex-column w-100 ma-0">
      <v-col class="sign-col">
        <p class="font-weight-bold font-size-1">הצהרה וחתימה</p>
      </v-col>
      <v-col class="sign-col pt-0">
        <p>{{ declarationText }}</p>
      </v-col>
      <v-col class="sign-col instruction">
        <p class="font-weight-bold font-size-2">כאן חותמים</p>
      </v-col>
      <v-col class="sign-col pt-0">
        <v-card class="sign-card" height="42.056vw" rounded="lg">
          <VueSignaturePad class="signature-pad" ref="signaturePad" />
          <v-divider></v-divider>
          <v-card-item class="text-end pl-0 sign-card-item">
            <v-icon
              color="rgb(var(--v-theme-Primary-Navy-Blue))"
              icon="mdi-refresh-circle"
              class="mdi-rotate-270 mdi-18px"
            />
            <v-label
              @click="undo"
              class="sign-label text-decoration-underline opacity-80"
            >
              איפוס וחתימה מחדש
            </v-label>
          </v-card-item>
        </v-card>
        <p v-if="isEmpty" class="sign opacity-80 color-error">
          עליך לחתום לפני שנמשיך
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import VueSignaturePad from 'vue3-signature-pad'

defineProps<{
  declarationText: string
  signatureData: any
}>()

const isEmpty = ref(false)
const signaturePad = ref<any>(null)

const emit = defineEmits<{
  'signature-saved': [payload: any]
}>()

const undo = () => {
  signaturePad.value?.undoSignature()
}

const save = () => {
  const { isEmpty: padIsEmpty, data } =
    signaturePad.value?.saveSignature() ?? {}
  isEmpty.value = padIsEmpty
  emit('signature-saved', data)
}

const isEmptyData = () => {
  return signaturePad.value?.saveSignature().data == undefined
}

defineExpose({
  save,
  undo,
  isEmptyData,
})
</script>

<style lang="scss">
.sign-card {
  padding: 3.738vw;
  box-shadow: var(--v-box-shadow) !important;
}

.color-error {
  color: rgb(var(--v-theme-Comment-text)) !important;
}

.font-size-1 {
  font-size: 4.206vw;
}

.font-size-2 {
  font-size: 3.738vw;
}

.v-card-item > .v-label {
  font-size: 3.738vw !important;
}

.sign-col {
  padding: 2.804vw 0;

  &.instruction {
    padding-bottom: 1.402vw;
  }
}

.sign-label {
  font-size: 3.738vw !important;
}

.sign-card-item {
  padding: 2.336vw 3.738vw;
}

.sign {
  margin-top: 0.4vh;
}

.signature-pad {
  width: 85.28vw !important;
  height: 27.57vw !important;
}
</style>
