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
          צרף קובץ
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
        <v-divider class="divider" />

        <DetailsIcon class="position-absolute left-0 ml-2 mt-4" />

        <v-card-text class="d-flex flex-column card-details">
          <div
            v-if="request.requestDetails"
            v-for="[key, stage] in Object.entries(req)"
            :key="key"
          >
            <span v-if="!stage.file" class="font-weight-bold">
              {{ stage.title }}:
            </span>

            <span class="font-value" v-if="!stage.file && !stage.textarea">
              {{ stage.value }}
            </span>

            <span
              class="font-weight-regular text-decoration-underline"
              v-if="!stage.file && stage.textarea"
              @click="dialogAction(true, stage as any)"
            >
              צפייה
            </span>

            <Popup
              v-if="dialog"
              v-model="dialog"
              :title="dialogContent.title"
              :content="dialogContent.content"
              :btnText="'סגירה'"
              :move="false"
              @close-popup="dialog = false"
            />

            <div v-if="stage.file" class="box-shadow round file-wrap">
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
                        v-text="'הורדה'"
                        @click="downloadBase64File(file.value)"
                      />
                    </div>
                  </div>
                </div>
              </v-expand-transition>
            </div>
          </div>

          <!-- קבצים חדשים -->
          <div v-if="newFiles.length > 0" class="box-shadow round file-wrap">
            <div class="box-shadow d-flex mx-auto justify-space-between pb-0">
              <div
                class="file mt-2 mx-auto pa-2 font-weight-bold d-flex justify-space-between align-center"
              >
                <p class="file-title">קבצים חדשים שצורפו</p>

                <v-icon @click="showNewFiles = !showNewFiles">
                  {{ showNewFiles ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
              </div>
            </div>

            <v-expand-transition>
              <div v-show="showNewFiles">
                <div
                  v-for="(file, index) in newFiles"
                  :key="file.name"
                  class="req-view-button"
                >
                  <p class="file-name">
                    {{ file.name.replace(/\.[^/.]+$/, '') }}
                  </p>

                  <div class="d-flex justify-end details">
                    <p
                      class="text-decoration-underline view opacity-80"
                      @click="removeFile(index)"
                    >
                      מחיקה
                    </p>
                  </div>
                </div>

                <div class="pa-4">
                  <v-btn color="success" block rounded="pill">
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
</template>

<script lang="ts" setup>
import { RequestDetail, RequestDetails } from '@/interfaces/RequestDetails'

import mime from 'mime'

import { fileTypeFromBuffer } from 'file-type'

import { onMounted, ref } from 'vue'

const MAX_FILES = 5

const FILE_TYPES = 'application/pdf,image/jpeg,image/png'

const MAX_FILE_SIZE = 10485760

const props = defineProps<{
  request: RequestDetails
}>()

const req = ref<RequestDetail[]>([])

const show = ref(false)

const showFiles = ref(false)

const dialog = ref(false)

const newFiles = ref<File[]>([])

const showNewFiles = ref(false)

const fileError = ref('')

const dialogContent = ref({
  title: '',
  content: '',
})

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

const downloadBase64File = (val: any) => {
  const { content, name, type } = val

  const link = document.createElement('a')

  const mimeType = mime.getType(`${name}.${type}`)

  link.href = `data:${mimeType};base64,${content}`

  link.download = name

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)
}

onMounted(async () => {
  const files = props.request.requestDetails?.filter(
    (item) => item.title === null && item.file,
  )

  req.value =
    files && files.length > 0
      ? [
          ...(props.request.requestDetails?.filter(
            (item) => item.title !== null,
          ) || []),

          {
            title: 'קבצי רשות',
            value: files,
            file: true,
            textarea: false,
            nrequired: true,
          },
        ]
      : props.request.requestDetails || []

  await req.value.sort((a: any, b: any) =>
    a.file === b.file ? 0 : a.file ? 1 : -1,
  )
})
</script>

<style lang="scss">
.append {
  display: flex;
  flex-direction: column !important;

  .card-title {
    width: auto !important;
    cursor: pointer;
  }

  .close-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icons {
      display: flex;
      cursor: pointer;
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
}

.icon-upload {
  margin-left: 1vw;
}

.error-file {
  padding-right: 2.804vw;
}
</style>
