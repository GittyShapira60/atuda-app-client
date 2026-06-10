<template>
  <v-container class="overflow-summery">
    <v-row class="position-relative row-title">
      <v-col cols="auto" class="pa-0">
        <v-img
          width="15vw"
          cover
          src="@/assets/summary.png"
          class="elevation-0"
        ></v-img>
      </v-col>
      <v-col cols="auto" class="col-title">
        <div class="position-absolute font-weight-bold summary-title">
          סיכום הבקשה
        </div>
      </v-col>
    </v-row>
    <div class="summary-sub-title">זמן טיפול משוער: {{ duration }} ימים</div>
    <v-card
      class="d-flex justify-center align-center summary-card"
      height="14.019vw"
      v-for="[key, stage] in Object.entries(textsObject)"
      :key="key"
    >
      <v-card-text class="font-size summary-card-text">
        <span class="font-weight-bold"> {{ stage.title }}:&nbsp;</span>
        <span v-if="!stage.view">{{ stage.data }}</span>
        <span class="display-dialog" @click="openStage = key" v-if="stage.view"
          >צפייה</span
        >
        <Popup
          v-if="stage.view && openStage === key"
          v-model="openStage"
          :title="stage.title"
          :content="stage.data"
          :btnText="'סגירה'"
          :move="false"
          @close-popup="openStage = null"
        />
      </v-card-text>
    </v-card>
    <div class="list-files">
      <div v-for="(file, index) in filesObject" :key="index">
        <UploadedFile :file="file" />
      </div>
    </div>
  </v-container>
  <FooterButton :text="'עוברים לשלב הבא'" @clicked="click" />
</template>

<script lang="ts" setup>
import { RequestSummary } from '@/interfaces/RequestSummary'
import { ref } from 'vue'

const props = defineProps<{
  data: any[]
  duration: number
}>()

const emit = defineEmits<{
  (e: 'clicked'): void
}>()

const click = () => {
  emit('clicked')
}

const openStage = ref<string | null>(null) // ישמור את ה-id או ה-title

const dataObject: any = {}
const filesObject: any = {}
const textsObject: RequestSummary[] = []

props.data.forEach((obj) => {
  Object.keys(obj).forEach((key) => {
    dataObject[key] = obj[key]
  })
})
Object.keys(dataObject).forEach((key: string) => {
  if (Array.isArray(dataObject[key].data)) {
    filesObject[key] = dataObject[key]
  } else {
    textsObject.push(dataObject[key])
  }
})
</script>

<style scoped>
.overflow-summery {
  height: 71vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5.841vw !important;
}
.summary-title {
  padding: 1.869vw !important;
  font-size: 4.206vw;
}
.summary-card {
  margin-bottom: 2.804vw;
  padding: 3.738vw !important;
  border-radius: 2.804vw !important;
  box-shadow: var(--v-box-shadow) !important;
}

.summary-card-text {
  padding: 3.738vw 2vw !important;
  overflow-x: auto;
  white-space: nowrap;
  display: flex !important;
  flex-direction: row;
  align-items: center;

  .display-dialog {
    text-decoration: underline;
    cursor: pointer;
  }
}

.list-files {
  margin-top: 7.477vw;
}
.col-title {
  margin-right: -3.505vw;
  padding: 0.935vw 0 0.935vw 0;
}
.row-title {
  margin: 0.935vw 0 0 0 !important;
}

.summary-sub-title {
  font-size: 3.271vw;
  line-height: 4.439vw;
  text-align: right;
  color: rgb(var(--v-theme-Primary-Navy-Blue));
  margin: 0.234vw 0 2.336vw;
}
.font-size {
  font-size: 3.738vw;
}
@media screen and (max-height: 668px) {
  .overflow-summery {
    height: 66vh;
  }
}
</style>
