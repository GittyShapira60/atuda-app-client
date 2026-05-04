<template>
  <Loading :loading="loading" />
  <div class="pa-0" v-if="response">
    <template v-if="index >= 1">
      <Title
        :currentStep="index"
        :steps="steps"
        :title="menuTitle"
        @back-button="handleBackButton"
        v-if="index != steps || index === 1"
      />
      <Menu
        :name="response.name"
        :description="response.description"
        :reasonRequired="reasonRequired"
        :excludeOptions="excludeOptions"
        @click-option="getStages"
        v-if="!showOptions && index === 1 && !displayFlow"
      />
      <FlowOptions
        :data="response.stagesFlow"
        @click-option="getStages"
        v-if="index === 1 && displayFlow"
      />
      <Stage
        :index="index"
        :stage="stage[index - 2]"
        :stagesNumber="stage.length + 4"
        @update-request="click"
        @delete-year="removeYear"
        v-if="stage && showOptions && index <= stage.length + 1"
      />
      <Message
        :sumSteps="steps"
        title="הבקשה שלך הועברה"
        message='הבקשה שלך הועברה. על מנת לראות את סטטוס הבקשות שלך, עלייך להיכנס ל"סטטוס בקשות" בצ360.'
        url="https://go.idf.il/PA_Survey"
        v-if="stage && index == stage.length + 4"
        @back-button="handleBackButton"
      />
      <RequestSummary
        :data="summary"
        :duration="duration"
        v-if="stage && index == stage.length + 2"
        @clicked="click"
      />
      <Signature
        ref="signatureComponent"
        :declarationText="response.declarationText"
        :signatureData="signatureData"
        @signature-saved="handleSignatureSaved"
        v-if="stage && index == stage.length + 3"
      />
      <FooterButton
        text="הגשת הבקשה"
        @clicked="click"
        :disabled="disabled"
        v-if="stage && index === stage.length + 3"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { RequestReason } from '@/enums/RequestReason'
import { toHebrewJewishDate, toJewishDate } from 'jewish-date'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const props = defineProps<{
  id: string
}>()

const store = useStore()
const response: any = ref(null)
const duration: any = ref(null)
const stage: any = ref([])
const index = ref(1)
const steps = ref(1)
const menuTitle = ref('')
const title = ref('')
const showOptions = ref(false)
const summary: any = ref([])
const generalReason: any = ref([])
const requestReason: any = ref([])
const signatureData = ref('')
const signatureComponent: any = ref(null)
const loading = ref(true)
const disabled = ref(false)
const isDepend = ref(false)
const reasonRequired = ref(true)
const excludeOptions = ref(true)
const displayFlow = ref(false)
const number = ref<number>(0)
const years = ref<string[]>([])
defineEmits<{
  (click: 'update-request'): void
  (next: 'clicked'): void
  (back: 'back-button'): void
  (signatureSaved: 'signature-saved'): void
}>()

const fetchData = async (route: any, data: any) => {
  try {
    await store.dispatch(route, data)
  } catch (error) {
    throw error
  }
}

onMounted(async () => {
  await displayMenu()
})

const displayMenu = async () => {
  await fetchData('requestsStages/getFlowOptions', { id: props.id })
  const flowOptions = store.state.requestsStages.flowOptions
  response.value = flowOptions
  duration.value = flowOptions.duration
  isDepend.value = response.value['stagesFlow'].isDepend
  reasonRequired.value = flowOptions.reasonRequired
  excludeOptions.value = flowOptions.excludeReasons
  steps.value = isDepend.value
    ? 1
    : response.value['stagesFlow'].options.length + 4
  menuTitle.value = title.value = reasonRequired.value
    ? 'סיבת הבקשה'
    : 'הסבר הבקשה'
  loading.value = store.state.requestsStages.loading
}

const getStages = async (option: any) => {
  if (!isDepend.value) {
    await loadStages(option)
  } else {
    isDepend.value = false
    displayFlow.value = true
    menuTitle.value =
      store.state.requestsStages.flowOptions.stagesFlow.menuTitle
    requestReason.value = option
  }
}

const loadStages = async (option: any) => {
  loading.value = true
  console.log(option, props.id)

  await fetchData('requestsStages/getStages', {
    id: props.id,
    stage: option?.name,
  })
  checkSameStage()
  showOptions.value = true
  index.value += 1
  steps.value = stage.value.length + 4
  menuTitle.value = stage.value[index.value - 2]?.header
  displayFlow.value
    ? (generalReason.value = option)
    : (requestReason.value = reasonRequired.value
        ? option
        : {
            name: RequestReason[0].options[0].name,
            displayName: {
              id: RequestReason[0].options[0].id,
              name: RequestReason[0].options[0].displayName,
            },
          })
  loading.value = store.state.requestsStages.loading
}

const checkSameStage = () => {
  if (stage.value.length > 0) {
    const oldStagesKeys = stage.value.map((obj: any) => obj.key)
    const newStagesKeys = store.state.requestsStages.stages.map(
      (obj: any) => obj.key,
    )
    if (!(JSON.stringify(oldStagesKeys) === JSON.stringify(newStagesKeys))) {
      stage.value = []
    }
  }
  if (stage.value.length == 0) {
    stage.value = store.state.requestsStages.stages.map((obj: any) => ({
      ...obj,
      data: {},
    }))
  }
}

const click = async (data: any) => {
  if (index.value <= stage.value.length) {
    stage.value[index.value - 2].data = data
  }
  if (index.value === stage.value.length + 1) {
    await editDataToSummary(data)
  }
  if (index.value === stage.value.length + 3) {
    disabled.value = false
    save()
    return
  }
  index.value++
  defineMenuTitle()
}

const editDataToSummary = async (data: any) => {
  stage.value[index.value - 2].data = data
  summary.value = await convertValues()

  let reason: any = []
  if (displayFlow.value) {
    reason = [
      {
        generalReason: {
          title: 'סיבת הבקשה',
          data:
            generalReason.value.displayName?.name ||
            generalReason.value.displayName,
        },
      },
    ]
    summary.value.unshift(...reason)
  }

  reason = reasonRequired.value
    ? [
        {
          requestReason: {
            title: 'סיבה כללית',
            data: requestReason.value?.displayName.name,
          },
        },
      ]
    : null
  if (reason) summary.value.unshift(...reason)
}

const save = async () => {
  if (saveSignature()) {
    await saveDataInDB()
    loading.value = store.state.requests.loading
    if (!store.state.requests.error) index.value++
    else
      router.replace({
        name: 'message',
        params: {
          title: 'שגיאה',
          message: 'אופס מצטערים! בקשתך לא נקלטה במערכת עקב בעיה באחד הנתונים.',
          sumSteps: steps.value,
        },
      })
  }
}

const handleSignatureSaved = (data: any) => {
  signatureData.value = data
}

const saveSignature = () => {
  if (signatureComponent.value) {
    const isEmpty = signatureComponent.value.isEmptyData()
    loading.value = !isEmpty
    signatureComponent.value.save()
    if (!isEmpty) disabled.value = true
  }
  return signatureData.value
}

const saveDataInDB = async () => {
  let dataRequest: any = {}
  if (displayFlow.value) {
    dataRequest['generalReason'] =
      generalReason.value.displayName?.id || generalReason.value.displayName
  }
  dataRequest['requestReason'] = requestReason?.value?.displayName.id
  for (let obj of stage.value) {
    let preparedData = await prepareRequestData(obj)
    dataRequest = { ...dataRequest, ...preparedData }
  }

  dataRequest['signature'] = signatureData.value

  await fetchData('requests/create', {
    requestTypeId: props.id,
    requestDetails: Object.assign({}, dataRequest),
    reason: generalReason.value.name,
  })
  loading.value = store.state.soldier.loading
}

const prepareRequestData = async (obj: any) => {
  let requestData: any = {}
  let dataKeys = Object.keys(obj.data)

  for (let key of dataKeys) {
    if (obj.data[key] instanceof Object && !(obj.data[key] instanceof Array)) {
      obj.data[key] = obj.data[key]['id']
    }
    requestData[key] = obj.data[key]
    if (obj.schema.properties[key]?.layout.slots.component === 'file-input') {
      requestData[key] = await convertFileToBase64(obj.data[key])
      if (obj.schema.properties[key]?.key) {
        requestData[key] = {
          key: obj.schema.properties[key].key,
          value: requestData[key],
        }
      }
    }
  }

  return requestData
}

const convertFileToBase64 = async (files: any) => {
  const promises = files.map((file: any) => {
    const lastDotIndex = file.name.lastIndexOf('.')
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve({
          name: file.name.substring(0, lastDotIndex),
          suffix: file.name.substring(lastDotIndex + 1),
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
const handleBackButton = () => {
  if (index.value > 1) {
    index.value--
    showOptions.value = index.value === 1 ? false : true
    defineMenuTitle()
  } else if (displayFlow.value) {
    displayFlow.value = false
    isDepend.value = true
    menuTitle.value = 'סיבת הבקשה'
  } else {
    index.value = 0
    router.push({ path: '/requests' })
  }
  if (displayFlow.value) {
    menuTitle.value =
      index.value === 1
        ? store.state.requestsStages.flowOptions.stagesFlow.menuTitle
        : menuTitle.value
    steps.value = index.value <= 1 ? 1 : steps.value
  }
}

const defineMenuTitle = () => {
  switch (index.value) {
    case 1:
      menuTitle.value = title.value
      break
    case stage.value.length + 2:
      menuTitle.value = 'סיכום הבקשה'
      break
    case stage.value.length + 3:
      menuTitle.value = 'הצהרה וחתימה'
      break
    default:
      menuTitle.value = stage.value[index.value - 2]?.header
      break
  }
}

const convertValues = async () => {
  const existingKeys: string[] = []

  return stage.value.map((obj: any) => {
    let transformedData: any = {}
    for (const key in obj.data) {
      if (obj.data.hasOwnProperty(key) && !existingKeys.includes(key)) {
        if (
          obj.schema.properties[key]?.layout.slots.component === 'file-input'
        ) {
          transformedData[key] = dataFiles(obj, key)
        } else {
          transformedData[key] = dataRegular(obj, key)
        }
        if (obj.schema.properties[key]?.layout.slots.component === 'textarea') {
          transformedData[key] = viewText(obj, key)
        }
        existingKeys.push(key)
      }
    }
    return transformedData
  })
}

const dataFiles = (obj: any, key: any) => {
  return {
    title: obj.schema.properties[key].title,
    data: obj.data[key],
    info: obj.schema.properties[key]?.layout.props.info,
  }
}

const dataRegular = (obj: any, key: any) => {
  return {
    title: obj.schema.properties[key]?.title,
    data: Array.isArray(obj.data[key])
      ? obj.data[key].join(', ')
      : obj.data[key] instanceof Object && !(obj.data[key] instanceof Array)
        ? obj.data[key]['name']
        : obj.data[key],
  }
}
const viewText = (obj: any, key: any) => {
  return {
    title: obj.schema.properties[key].title,
    data: obj.data[key],
    view: true,
  }
}
const equalsYearsArrays = () => {
  const endYearData: string[] =
    stage.value[index.value - 2].schema.properties['endYear'].layout.props.data
  return (
    endYearData.length === years.value.length &&
    endYearData.every((item: any, i: number) => item === years.value[i])
  )
}

const removeYear = () => {
  if (!equalsYearsArrays()) {
    stage.value[index.value - 2].data.endYear = ''
  }
}

const nextYears = (startYear: string) => {
  const start = startYear
    ? parseInt(startYear.split(' ')[1].split('-')[0], 10)
    : new Date().getFullYear()
  return Array.from({ length: number.value }, (_, i) => {
    const nextYear = start + i + 1
    const nextJewishDate = toJewishDate(new Date(nextYear, 0, 1))
    console.log(
      `${toHebrewJewishDate(nextJewishDate).year} ${nextYear - 1}-${nextYear}`,
    )

    return `${toHebrewJewishDate(nextJewishDate).year} ${nextYear - 1}-${nextYear}`
  })
}

watch(
  () => index.value,
  (newValue, oldValue) => {
    const currentStage = stage.value[index.value - 2]
    const previousStage = stage.value[index.value - 3]
    const startYear = previousStage?.data.startYear
    if (index.value < stage.value.length + 1 && index.value != 1) {
      for (const key in currentStage?.schema?.properties) {
        const newData = currentStage?.schema?.properties[key].layout.props.data
        console.log(newData, key, startYear)

        updatePropertyData(newData, key, startYear)
      }
    }
  },
)

const updatePropertyData = (newData: any, key: any, startYear: any) => {
  if (typeof newData === 'string' && newData.endsWith('nextyears')) {
    number.value = extractNumber(newData)
    updateDataForKey(key, startYear)
  }
  if (typeof newData === 'object' && key === 'endYear') {
    updateDataForKey(key, startYear)
  }
}

const extractNumber = (dataString: string) => {
  const match = dataString.match(/\d+(\.\d+)?/)
  return match ? +match[0] : 0
}

const updateDataForKey = (key: any, startYear: any) => {
  years.value =
    stage.value[index.value - 2].schema.properties[key].layout.props.data
  stage.value[index.value - 2].schema.properties[key].layout.props.data =
    nextYears(startYear)
}
</script>

<style scoped></style>
