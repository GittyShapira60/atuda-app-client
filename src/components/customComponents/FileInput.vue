<template>
  <p class="font-weight-bold title-files" v-if="title" v-text="title" />
  <v-card class="box-shadow round-card-file pb-0 extrenal-card">
    <v-card
      :class="
        [
          'box-shadow round-card-file d-flex justify-space-between flex-wrap',
          isBeforeInput()
            ? 'extrenal-card-before'
            : 'border-blue extrenal-card-file pb-0',
        ].join(' ')
      "
      :color="isBeforeInput() ? '' : 'rgb(var(--v-theme-Powder-Blue))'"
    >
      <v-card-item class="d-flex pl-0 card-file">
        <p v-text="fileName" class="d-inline text-15" />
        <v-tooltip location="top" v-model="show">
          <template #activator="{ props }">
            <v-icon class="icon-info" v-bind="props" @click="show = !show">
              <InfoGreyIcon v-if="isBeforeInput()" />
              <InfoWhiteIcon v-else />
            </v-icon>
          </template>
          <v-icon class="float-left close" @click="show = false">
            <CloseIcon />
          </v-icon>
          <br class="small-br" />
          <p v-text="info" />
          <p v-text="'גודל מקסימלי: ' + mbSize + 'MB'" />
        </v-tooltip>
      </v-card-item>
      <v-card-item class="pr-0 card-item-btn">
        <v-btn
          v-if="isBeforeInput()"
          round
          depressed
          @click="uploadFile()"
          rounded="pill"
          color="rgb(var(--v-theme-Primary-Navy-Blue)"
          variant="text"
          class="btn-upload"
        >
          <UploadIcon class="icon-upload" />
          צרף קובץ
        </v-btn>
        <div v-else class="d-flex align-center">
          <div class="icon-file" v-if="showFileIcon()">
            <v-icon icon="$file" @click="uploadFile()" />
          </div>
          <div class="icon-ok">
            <OkIcon />
          </div>
        </div>
      </v-card-item>
    </v-card>
    <div
      v-for="(file, index) in files()"
      :key="index"
      :class="
        isRequired()
          ? 'required file-view-required'
          : 'pl-0 text-center file-view-nrequired'
      "
    >
      <p
        :class="
          isRequired()
            ? 'file-base required-file'
            : 'file-base not-required-file'
        "
      >
        {{ file.name.replace(/\.[^/.]+$/, '') }}
      </p>
      <div
        :class="
          isRequired() ? 'd-flex justify-end details' : 'd-flex justify-center'
        "
      >
        <p
          class="text-decoration-underline text-14 opacity-80 btn-details"
          @click="viewFile(file)"
          v-text="'צפיה'"
        />
        <p
          class="text-decoration-underline text-14 opacity-80 btn-details"
          @click="deleteFile(index)"
          v-text="'מחיקה'"
        />
      </div>
    </div>
  </v-card>
  <div
    v-if="props.error && !isValid"
    class="error-message error-file"
    aria-live="assertive"
    aria-atomic="true"
  >
    {{ errorMessage }}
  </div>
  <div
    v-if="fileError != ''"
    class="error-message error-file"
    aria-live="assertive"
    aria-atomic="true"
  >
    {{ fileError }}
  </div>
  <div v-if="isEndOfGroup" class="group-separator"></div>
  <p
    v-if="
      titleFooter &&
      statefulLayout._compiledLayout.schema.properties.hasOwnProperty('02')
    "
    @click="dialog = true"
    class="text-decoration-underline example-popup"
  >
    איך נעלה גיליון ציונים נכון?
  </p>
  <p
    class="font-weight-bold title-footer"
    v-if="titleFooter"
    v-text="titleFooter"
  />
  <p class="sub-title-footer" v-if="subTitleFooter" v-text="subTitleFooter" />
  <Popup
    v-if="dialog"
    v-model="dialog"
    :content="dialogContent.content"
    :src="dialogContent.src"
    :btnText="'המשך'"
    :move="true"
    @close-popup="handleClosePopup"
  />
</template>

<script lang="ts" setup>
import { ErrorSchema } from '@/enums/ErrorSchema'
import { fileTypeFromBuffer } from 'file-type'
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: any
  statefulLayout: any
  error?: Boolean
}>()
const show = ref(false)
const mbSize = ref(0)

const {
  layout: { title: fileName },
  props: { info, title, titleFooter, subTitleFooter, maxItems, types, size },
} = props.modelValue
const dialog = ref(false)
const dialogContent = ref({
  content: "לדוגמה קובץ מסוג גליון ציונים במערכת אונ' בר אילן",
  src: new URL('@/assets/upload-exemple.jpg', import.meta.url).href,
})
mbSize.value = Math.round(size / 1024 / 1024)

const handleClosePopup = () => {
  dialog.value = false
}

let files = () => props.statefulLayout._data[props.modelValue.key]
const isBeforeInput = () => {
  return files() == undefined || files().length === 0
}
const isEndOfGroup = computed(() => {
  const groups = props.statefulLayout._compiledLayout.schema.anyOf
  if (!groups?.length) return false
  return (
    groups[0].required.at(-1) === props.modelValue.key ||
    props.statefulLayout._compiledLayout.schema.required.at(-1) ===
      props.modelValue.key
  )
})

const isRequired = () => {
  return (
    props.statefulLayout._compiledLayout.schema.required.includes(
      props.modelValue.key,
    ) ||
    props.statefulLayout._compiledLayout.schema.anyOf?.some((item: any) =>
      item.required.includes(props.modelValue.key),
    )
  )
}
const showFileIcon = () => {
  return (
    !isRequired() && !isBeforeInput() && props.modelValue.data.length < maxItems
  )
}
const isValid = computed(() => {
  return !(
    props.modelValue.data?.length == 0 &&
    props.statefulLayout._compiledLayout.schema.required.includes(
      props.modelValue.key,
    )
  )
})

const errorMessage = ref(ErrorSchema.MissingField)
const fileError = ref('')
const deleteFile = (index: number) => {
  const updatedFiles = [...props.modelValue.data]
  updatedFiles.splice(index, 1)
  props.statefulLayout.input({ ...props.modelValue }, updatedFiles)
}
const uploadFile = async () => {
  fileError.value = ''
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = types
  input.multiple = isRequired() ? false : true
  input.onchange = async (event) => {
    const files = Array.from((event.target as HTMLInputElement).files!)
    const maxSize = size
    const filesOK = []
    for (const file of files) {
      const isValidSize = file.size <= maxSize
      const buffer = await file.arrayBuffer()
      const type = await fileTypeFromBuffer(buffer)
      const isValidType =
        types.split(',').includes(file?.type) && type?.mime === file.type
      if (!isValidSize) {
        errorMessage.value = ErrorSchema.SizeFileLarge
      } else if (!isValidType) {
        fileError.value = ErrorSchema.InvalidFileType
      } else {
        filesOK.push(file)
      }
    }
    !isRequired() && props.statefulLayout._data[props.modelValue.key]
      ? props.statefulLayout.input(
          props.modelValue,
          props.statefulLayout._data[props.modelValue.key].concat(
            filesOK.slice(0, maxItems - props.modelValue.data.length),
          ),
        )
      : props.statefulLayout.input(props.modelValue, filesOK.slice(0, maxItems))
  }
  input.click()
}
const viewFile = (file: File) => {
  const fileURL = URL.createObjectURL(file)
  let width = 600
  let height = 400
  const left = window.innerWidth / 2 - width / 2
  const top = window.innerHeight / 2 - height / 2
  window.open(
    fileURL,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top}`,
  )
}
</script>

<style lang="scss">
.box-shadow {
  box-shadow: var(--v-box-shadow) !important;
}
.border-blue {
  border: 2px solid rgb(var(--v-theme-Light-Cornflower-Blue)) !important;
}
.title-files {
  padding-bottom: 5.607vw;
  padding-top: 1.869vw !important;
}
.extrenal-card {
  margin-bottom: 1.869vw;
}
.extrenal-card-file {
  padding: 0.935vw;
  margin-bottom: 1.869vw;
}
.icon-info {
  margin: 0.935vw 0.935vw 0 0;
}
.icon-upload {
  margin: 0.935vw 0 0 0.935vw;
}
.icon-ok {
  padding-top: 0.935vw;
}
.btn-details {
  margin: 0 1.869vw;
}
.group-separator {
  height: 2.8vw;
}
.required {
  padding-right: 5.607vw;
}
.title-footer {
  padding-top: 5.607vw;
}
.sub-title-footer {
  padding-bottom: 0.935vw;
  font-weight: 300 !important;
  font-size: 2.804vw;
  font-weight: 300;
  line-height: 7.477vw;
}
.extrenal-card-before {
  padding: 1.869vw;
}
.text-15 {
  font-size: 3.738vw;
  font-weight: 700;
}
.text-14 {
  font-size: 3.271vw !important;
}
.round-card-file {
  border-radius: 2.804vw !important;
}
.close {
  padding: 1vw 0 0 1.3vw;
}
.details {
  margin-top: -5.14vw;
  padding-bottom: 0.935vw;
}
.v-col-6 {
  padding: 1.869vw !important;
  width: 55% !important;
}
.v-col-6 .v-card-item .btn-upload {
  margin-right: 3vw !important;
}
.card-file {
  width: 57%;
  padding: 2.336vw 2.336vw 2.336vw 0;
}
.card-item-btn {
  padding: 2.336vw 0 2.336vw 3.738vw;
}
.error-file {
  padding-right: 2.804vw;
}
.btn-upload {
  border: 0.234vw solid rgb(var(--v-theme-Primary-Navy-Blue));
  background-color: rgb(var(--v-theme-Light-Blue));
  letter-spacing: 0.07vw !important;
  padding: 0 2.103vw 0 2.804vw;
  float: left !important;
  font-size: 3.271vw;
  font-weight: 400;
  line-height: 4.673vw;
  height: 8.645vw !important;
}
.v-tooltip > .v-overlay__content {
  background-color: white !important;
  color: black !important;
  width: 73% !important;
  box-shadow: var(--v-box-shadow) !important;
  border-radius: 2.336vw !important;
  line-height: 140% !important;
  text-transform: lowercase !important;
  font-size: 3.037vw !important;
  padding: 0 4.673vw 3.972vw 0;
}
.v-tooltip > .v-overlay__content::after {
  content: '';
  position: absolute;
  bottom: -2.103vw;
  left: 50%;
  transform: translateX(0%);
  width: 0;
  height: 0;
  border-left: 2.336vw solid transparent;
  border-right: 2.336vw solid transparent;
  border-top: 2.336vw solid white;
  box-shadow: var(--v-box-shadow);
}
.file-base {
  font-size: 3.271vw;
  font-weight: bold;
  white-space: nowrap;
  overflow-x: auto !important;
  text-overflow: clip !important;
}
.required-file {
  width: 68%;
}
.file-view-nrequired {
  padding: 0 4.673vw 3.738vw !important;
}
.file-view-required {
  padding: 0 4.673vw 2.336vw !important;
}
.example-popup {
  color: rgb(var(--v-theme-Primary-Navy-Blue));
  font-size: 3.271vw;
  font-weight: bold;
}
</style>
