<template>
  <v-card class="classic-card append" v-slot:append>
    <div class="close-card" @click="show = !show">
      <v-card-title class="card-title">
        {{ request.requestType }}
      </v-card-title>
      <div class="icons">
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
            <Popup
              v-if="dialog"
              v-model="dialog"
              :title="dialogContent.title"
              :content="dialogContent.content"
              :btnText="'סגירה'"
              :move="false"
              @close-popup="dialog = false"
            />
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
                        v-text="'הורדה'"
                        @click="downloadBase64File(file.value)"
                      />
                    </div>
                  </div>
                </div>
              </v-expand-transition>
            </div>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts" setup>
import { RequestDetail, RequestDetails } from '@/interfaces/RequestDetails'
import mime from 'mime'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  request: RequestDetails
}>()
const req = ref<RequestDetail[]>([])
const show = ref(false)
const showFiles = ref(false)
const dialog = ref(false)
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
  let files = props.request.requestDetails?.filter(
    (item) => item.title === null && item.file,
  )
  req.value =
    files && files?.length > 0
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
    width: 90% !important;
  }
  .close-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
.file {
  box-sizing: border-box;
  color: rgb(var(--v-theme-Proffessor-Plum));
  width: 79.67vw;
  height: 9.81vw;
  left: 7.71vw;
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
</style>
