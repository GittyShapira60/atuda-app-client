<template>
  <v-card class="classic-card append" v-slot:append>
    <div class="close-card">
      <div class="title-row">
        <v-card-title class="card-title" @click="show = !show">
          {{ request.requestType }}
        </v-card-title>

        <v-btn
          v-if="show"
          round
          depressed
          rounded="pill"
          color="rgb(var(--v-theme-Primary-Navy-Blue))"
          variant="text"
          class="btn-upload"
          @click.stop="uploadFile"
        >
          <UploadIcon class="icon-upload" />
          צרוף קובץ
        </v-btn>
      </div>

      <div class="icons" @click="show = !show">
        <v-icon>
          {{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </div>
    </div>

    <v-expand-transition>
      <div v-show="show">
        <v-divider class="divider"></v-divider>
        <DetailsIcon class="position-absolute left-0 ml-2 mt-4" />
        <v-card-text class="d-flex flex-column card-details">
          <div
            v-if="request.requestDetails"
            v-for="[key, stage] in Object.entries(req)"
            :key="key"
          >
            <span v-if="!stage.file" class="font-weight-bold" :key="key">
              {{ stage.title }}:&nbsp;</span
            >
            <span
              class="font-value"
              v-if="!stage.file && !stage.textarea"
              :key="key"
            >
              {{ stage.value }}&nbsp;</span
            >
            <span
              class="font-weight-regular text-decoration-underline"
              @click="dialogAction(true, stage as any)"
              v-if="!stage.file && stage.textarea"
              :key="key"
              >צפייה</span
            >
            <div
              class="box-shadow round file-wrap"
              v-if="stage.file"
              :key="key"
            >
              <div class="box-shadow d-flex mx-auto justify-space-between pb-0">
                <div
                  class="file mt-2 mx-auto pa-2 font-weight-bold d-flex justify-space-between align-center"
                >
                  <p v-text="stage.title" class="file-title" />
                  <DownloadingUpdates
                    class="icon-download mt-auto"
                    @click="
                      !stage.nrequired
                        ? downloadBase64File(stage.value)
                        : (showFiles = !showFiles)
                    "
                  />
                </div>
              </div>
              <v-expand-transition>
                <div v-show="stage.nrequired && showFiles">
                  <div
                    v-for="file in stage.value"
                    :key="file"
                    class="req-view-button"
                  >
                    <p class="file-name">
                      {{ file?.value?.name?.replace(/\.[^/.]+$/, '') }}
                    </p>
                    <div class="d-flex justify-end details">
                      <p
                        class="text-decoration-underline view opacity-80"
                        @click="viewBase64File(file.value)"
                      >
                        צפיה
                      </p>
                      <p
                        class="text-decoration-underline view opacity-80"
                        @click="downloadBase64File(file.value)"
                      >
                        הורדה
                      </p>
                    </div>
                  </div>
                </div>
              </v-expand-transition>
            </div>
          </div>

          <!-- קבצים חדשים שצורפו (מהשרת) -->
          <div
            v-if="savedSupplementalFiles.length > 0"
            class="box-shadow round file-wrap"
          >
            <div class="box-shadow d-flex mx-auto justify-space-between pb-0">
              <div
                class="file mt-2 mx-auto pa-2 font-weight-bold d-flex justify-space-between align-center"
              >
                <p class="file-title">קבצים חדשים שצורפו</p>
                <v-icon @click.stop="showSupplementalFiles = !showSupplementalFiles">
                  {{
                    showSupplementalFiles
                      ? 'mdi-chevron-up'
                      : 'mdi-chevron-down'
                  }}
                </v-icon>
              </div>
            </div>
            <v-expand-transition>
              <div v-show="showSupplementalFiles">
                <div
                  v-for="(saved, index) in savedSupplementalFiles"
                  :key="`saved-${saved.detailId}-${index}`"
                  class="req-view-button"
                >
                  <p class="file-name">
                    {{ saved.value?.name?.replace(/\.[^/.]+$/, '') }}
                  </p>
                  <div class="d-flex justify-end details">
                    <p
                      class="text-decoration-underline view opacity-80"
                      @click.stop="downloadBase64File(saved.value)"
                    >
                      הורדה
                    </p>
                    <p
                      class="text-decoration-underline view opacity-80"
                      @click.stop="deleteSavedSupplemental(saved)"
                    >
                      מחיקה
                    </p>
                    <p
                      class="text-decoration-underline view opacity-80"
                      @click.stop="viewBase64File(saved.value)"
                    >
                      צפיה
                    </p>
                  </div>
                </div>
              </div>
            </v-expand-transition>
          </div>

          <!-- קבצים חדשים (לפני שמירה) —  -->
          <div v-if="newFiles.length > 0" class="box-shadow round file-wrap">
            <div class="box-shadow d-flex mx-auto justify-space-between pb-0">
              <div
                class="file mt-2 mx-auto pa-2 font-weight-bold d-flex justify-space-between align-center"
              >
                <p class="file-title">קבצים חדשים לצירוף</p>
                <v-icon @click.stop="showNewFiles = !showNewFiles">
                  {{ showNewFiles ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
              </div>
            </div>
            <v-expand-transition>
              <div v-show="showNewFiles">
                <div
                  v-for="(file, index) in newFiles"
                  :key="`${file.name}-${index}`"
                  class="req-view-button"
                >
                  <p class="file-name">
                    {{ file.name.replace(/\.[^/.]+$/, '') }}
                  </p>
                  <div class="d-flex justify-end details">
                    <p
                      class="text-decoration-underline view opacity-80"
                      @click.stop="viewFile(file)"
                    >
                      צפיה
                    </p>
                    <p
                      class="text-decoration-underline view opacity-80"
                      @click.stop="downloadFile(file)"
                    >
                      הורדה
                    </p>
                    <p
                      class="text-decoration-underline view opacity-80"
                      @click.stop="removeFile(index)"
                    >
                      מחיקה
                    </p>
                  </div>
                </div>
                <div class="pa-4">
                  <v-btn
                    color="success"
                    block
                    rounded="pill"
                    :loading="loading"
                    @click="saveChanges"
                  >
                    שמירת שינויים
                  </v-btn>
                </div>
              </div>
            </v-expand-transition>
          </div>

          <div
            v-if="fileError"
            class="error-message error-file"
            aria-live="assertive"
            aria-atomic="true"
          >
            {{ fileError }}
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
  
  <Popup
    v-if="dialog"
    v-model="dialog"
    :title="dialogContent.title"
    :content="dialogContent.content"
    :btnText="'סגירה'"
    :move="false"
    @close-popup="dialog = false"
  />

  <div v-if="uploadFeedbackDialog" class="upload-popup">
    <Popup
      v-model="uploadFeedbackDialog"
      content-class="upload-popup"
      title=""
      :content="uploadFeedbackContent"
      :src="uploadFeedbackIcon"
      :btnText="'סגירה'"
      :move="false"
      @close-popup="uploadFeedbackDialog = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { RequestReason } from '@/enums/RequestReason'
import { RequestDetail, RequestDetails } from '@/interfaces/RequestDetails'
import mime from 'mime'
import { fileTypeFromBuffer } from 'file-type'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const SUPPLEMENTAL_FILES_FIELD = 'supplementalFiles'
const SUPPLEMENTAL_FILES_TITLE = 'קבצים חדשים שצורפו'

const store = useStore()
const loading = ref(false)
const MAX_FILES = 15
const FILE_TYPES = 'application/pdf,image/jpeg,image/png'
const MAX_FILE_SIZE = 10485760

const props = defineProps<{
  request: RequestDetails
}>()

type SavedSupplementalFile = {
  detailId?: number
  value: { content: string; name: string; type: string }
}

const req = ref<RequestDetail[]>([])
const show = ref(false)
const showFiles = ref(false)
const showSupplementalFiles = ref(false)
const showNewFiles = ref(false)
const dialog = ref(false)
const newFiles = ref<File[]>([])
const savedSupplementalFiles = ref<SavedSupplementalFile[]>([])
const fileError = ref('')
const uploadFeedbackDialog = ref(false)
const uploadFeedbackContent = ref('')
const uploadFeedbackIcon = ref('')

const uploadSuccessIcon = new URL('@/assets/ok-icon.svg', import.meta.url).href
const uploadFailIcon = new URL('@/assets/error.png', import.meta.url).href

const showFeedback = (message: string, success: boolean) => {
  dialog.value = false
  uploadFeedbackContent.value = message
  const icon = success ? uploadSuccessIcon : uploadFailIcon
  uploadFeedbackIcon.value = icon

  const img = new Image()
  img.onload = img.onerror = () => {
    uploadFeedbackDialog.value = true
  }
  img.src = icon
}

const dialogContent = ref({
  title: '',
  content: '',
})

const isSupplementalDetail = (item: RequestDetail) =>
  item.file &&
  (item.title === SUPPLEMENTAL_FILES_TITLE ||
    (item as RequestDetail & { fieldName?: string }).fieldName ===
      SUPPLEMENTAL_FILES_FIELD)

const dialogAction = (
  bool: boolean,
  stage: { title: string; value: string } | undefined,
) => {
  dialog.value = bool
  if (stage) {
    dialogContent.value = {
      title: stage.title,
      content: stage.value,
    }
  }
}

const removeFile = (index: number) => {
  newFiles.value.splice(index, 1)
  if (newFiles.value.length === 0) {
    showNewFiles.value = false
  }
}

const viewFile = (file: File) => {
  const fileURL = URL.createObjectURL(file)
  const width = 600
  const height = 400
  const left = window.innerWidth / 2 - width / 2
  const top = window.innerHeight / 2 - height / 2
  window.open(
    fileURL,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top}`,
  )
}

const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 200)
}

const viewBase64File = (val: any) => {
  const { content, name, type } = val
  const mimeType = mime.getType(`${name}.${type}`)
  const byteCharacters = atob(content)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], {
    type: mimeType || undefined,
  })
  const fileURL = URL.createObjectURL(blob)
  const width = 600
  const height = 400
  const left = window.innerWidth / 2 - width / 2
  const top = window.innerHeight / 2 - height / 2
  window.open(
    fileURL,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top}`,
  )
}

const downloadBase64File = (val: any) => {
  const { content, name, type } = val
  const mimeType = mime.getType(`${name}.${type}`)
  const link = document.createElement('a')
  link.href = `data:${mimeType};base64,${content}`
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const uploadFile = async () => {
  fileError.value = ''

  const existingFiles =
    props.request.requestDetails?.filter((item: any) => item.file) || []

  const existingCount = existingFiles.length
  const currentNewFilesCount = newFiles.value.length
  const totalFiles = existingCount + currentNewFilesCount

  if (totalFiles >= MAX_FILES) {
    fileError.value = 'לא ניתן לצרף קבצים נוספים '
    return
  }

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = FILE_TYPES
  input.multiple = true

  input.onchange = async (event) => {
    const selectedFiles = Array.from(
      (event.target as HTMLInputElement).files || [],
    )
    const remainingSlots = MAX_FILES - totalFiles
    const filesToValidate = selectedFiles.slice(0, remainingSlots)
    const validFiles: File[] = []

    for (const file of filesToValidate) {
      const isValidSize = file.size <= MAX_FILE_SIZE
      const buffer = await file.arrayBuffer()
      const type = await fileTypeFromBuffer(buffer)
      const isValidType =
        FILE_TYPES.split(',').includes(file.type) && type?.mime === file.type

      if (!isValidSize) {
        fileError.value = 'גודל הקובץ חורג מהמותר'
        continue
      }

      if (!isValidType) {
        fileError.value = 'סוג הקובץ אינו תקין'
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      newFiles.value.push(...validFiles)
      showNewFiles.value = true
    }
  }

  input.click()
}

const syncSupplementalFromDetails = (details: RequestDetail[]) => {
  savedSupplementalFiles.value = details
    .filter(isSupplementalDetail)
    .map((item) => ({
      detailId: (item as RequestDetail & { detailId?: number }).detailId,
      value: item.value,
    }))

  if (savedSupplementalFiles.value.length > 0) {
    showSupplementalFiles.value = true
  }
}

const initReqFromDetails = async (details: RequestDetail[]) => {
  const files = details?.filter((item) => item.title === null && item.file)

  req.value =
    files && files.length > 0
      ? [
          ...(details?.filter(
            (item) =>
              item.title !== null && !isSupplementalDetail(item),
          ) || []),
          {
            title: 'קבצי רשות',
            value: files,
            file: true,
            textarea: false,
            nrequired: true,
          },
        ]
      : details?.filter((item) => !isSupplementalDetail(item)) || []

  await req.value.sort((a: any, b: any) =>
    a.file === b.file ? 0 : a.file ? 1 : -1,
  )
}

const filteredRequestReason = (stage: any) => {
  return RequestReason[0].options.find((item) => item.id === stage.value)
    ?.displayName
}

const refreshDetails = async () => {
  await store.dispatch('requestDetails/get', {
    requestId: props.request.id,
  })

  if (store.state.requestDetails.error) {
    fileError.value = 'טעינת פרטי הבקשה נכשלה'
    return false
  }

  const refreshed = (store.state.requestDetails.response || []).map(
    (item: any) => {
      const isReason = item.title === 'requestReason'
      if (isReason) {
        item.title = RequestReason[0].key
        item.value = filteredRequestReason(item)
      }
      return item
    },
  )
  props.request.requestDetails = refreshed
  syncSupplementalFromDetails(refreshed)
  await initReqFromDetails(refreshed)
  return true
}

const convertFileToBase64 = async (files: File[]) => {
  const promises = files.map((file) => {
    const lastDotIndex = file.name.lastIndexOf('.')
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve({
          name:
            lastDotIndex === -1
              ? file.name
              : file.name.substring(0, lastDotIndex),
          suffix:
            lastDotIndex === -1 ? '' : file.name.substring(lastDotIndex + 1),
          type: file.type,
          content: reader.result?.toString().split(',')[1],
        })
      }
      reader.onerror = () => {
        reject('Error reading file')
      }
    })
  })
  return Promise.all(promises)
}

const saveChanges = async () => {
  if (!newFiles.value.length || loading.value) return

  try {
    loading.value = true
    fileError.value = ''

    const convertedFiles = await convertFileToBase64(newFiles.value)

    await store.dispatch('requests/addFiles', {
      requestId: props.request.id,
      requestDetails: {
        [SUPPLEMENTAL_FILES_FIELD]: {
          key: SUPPLEMENTAL_FILES_FIELD,
          value: convertedFiles,
        },
      },
    })

    if (store.state.requests.error) {
      showFeedback('העלאה נכשלה', false)
      return
    }

    const ok = await refreshDetails()
    if (!ok) {
      showFeedback('העלאה נכשלה', false)
      return
    }

    newFiles.value = []
    showNewFiles.value = false
    showFeedback('הקבצים נוספו בהצלחה', true)
  } catch (error) {
    console.error(error)
    showFeedback('העלאה נכשלה', false)
  } finally {
    loading.value = false
  }
}

const deleteSavedSupplemental = async (saved: SavedSupplementalFile) => {
  if (!saved.detailId) return

  try {
    loading.value = true
    fileError.value = ''

    await store.dispatch('requestDetails/deleteFile', {
      requestId: props.request.id,
      detailId: saved.detailId,
    })

    if (store.state.requests.error) {
      showFeedback('מחיקת הקובץ נכשלה', false)
      return
    }

    await refreshDetails()
    showFeedback('הקובץ נמחק בהצלחה', true)
  } catch (error) {
    console.error(error)
    showFeedback('מחיקת הקובץ נכשלה', false)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const details = props.request.requestDetails || []
  syncSupplementalFromDetails(details)
  await initReqFromDetails(details)
})
</script>

<style lang="scss">
.append {
  display: flex;
  flex-direction: column !important;

  .close-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icons {
      display: flex;
    }
  }

  .v-card-item__append {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-inline-start: 0;
  }

  .v-card-item {
    width: 100%;
    display: flex;
  }

  .v-card-text {
    padding: 0;
    padding-top: 4.673vw;
    gap: 6px;
  }

  .mdi-chevron-up,
  .mdi-chevron-down {
    color: black !important;
    margin-right: 0.935vw;
  }
}

.title-row {
  display: flex;
  align-items: center;
  gap: 2vw;
}

.file {
  box-sizing: border-box;
  color: rgb(var(--v-theme-Proffessor-Plum));
  width: 79.67vw;
  min-height: 9.81vw;
  background: rgb(var(--v-theme-Powder-Blue));
  border: 2px solid #5c9de9;
  box-shadow: 0px 4px 15px rgba(132, 132, 168, 0.15) !important;
  border-radius: 2.8vw;
}

.divider {
  margin-top: 2.34vw;
}

.card-details {
  width: 92%;
}

.req-view-button {
  padding: 2.34vw 4.673vw 2.336vw !important;
  border: 1px solid white;
  border-radius: 2.8vw;
}

.req-details {
  margin-top: -5.14vw !important;
  padding-bottom: 0.935vw;
}

.file-wrap {
  width: 108%;
}

.btn-upload {
  border: 0.234vw solid rgb(var(--v-theme-Primary-Navy-Blue));
  background-color: rgb(var(--v-theme-Light-Blue));
  letter-spacing: 0.07vw !important;
  padding: 0 2.103vw 0 2.804vw;
  font-size: 3.271vw;
  font-weight: 400;
  line-height: 4.673vw;
  height: 8.645vw !important;
  margin-right: 5vw;
}

.icon-upload {
  margin-left: 1vw;
}

.error-file {
  padding-right: 2.804vw;
}

.details-dialog .dialog-image {
  width: 40px !important;
  height: 40px !important;
  flex: 0 0 auto !important;
  order: -1 !important;
  align-self: center !important;
  margin-bottom: 10px !important;
}
.details-dialog .dialog-image .v-img__img {
  object-fit: contain !important;
}

</style>
