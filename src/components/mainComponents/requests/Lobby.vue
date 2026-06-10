<template>
  <v-container class="wrap d-flex flex-column align-center">
    <v-container>
      <v-card
        title="בקשות"
        class="main-card d-flex flex-column-reverse"
        color="rgb(var(--v-theme-Primary-Navy-Blue))"
      >
        <div class="file-icon-loby">
          <RequestIcon />
        </div>
        <v-row class="green circle"></v-row>
        <v-row class="yellow circle"></v-row>
      </v-card>
    </v-container>

    <div class="toggle">
      <v-btn-toggle
        :model-value="toggle"
        class="toggle-request"
        color="rgb(var(--v-theme-Primary-Navy-Blue))"
        mandatory
        @update:model-value="onToggleChange"
      >
        <v-btn :class="{ active: toggle === 0 }" class="ml-0"
          >בקשות שניתן להגיש</v-btn
        >
        <v-btn :class="{ active: toggle === 1 }" class="mr-0"
          >בקשות שהוגשו</v-btn
        >
      </v-btn-toggle>
    </div>
  </v-container>

  <div class="content">
    <div v-if="toggle === 0">
      <p class="explain">
        לפניך מאגר בקשות שניתן לשלוח באופן דיגיטלי למנט”א. <br />על מנת לראות את
        סטטוס הבקשות שלך, עלייך להיכנס ל"סטטוס בקשות" בצ360.
      </p>
      <div class="overflow-lobby">
        <RequestList
          :requestTypes="requestTypes"
          :requests="requests"
          @click-request="click"
        />
      </div>
    </div>
    <div v-if="toggle === 1">
      <p v-if="props.requests.length == 0" class="explain">
        אין בקשות שהוגשו כרגע
      </p>
      <div class="overflow-lobby-details">
        <RequestDetailsList
          ref="detailsListRef"
          :requests="requestsSubmitted"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RequestReason } from '@/enums/RequestReason'
import { RequestCard } from '@/interfaces/RequestCard'
import { RequestDetails } from '@/interfaces/RequestDetails'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const props = defineProps<{
  requests: RequestDetails[]
  requestTypes: RequestCard[]
}>()
const emit = defineEmits<{ (click: 'click-request', id: any): void }>()

const toggle = ref(0)
const identity = ref('')
const requestsSubmitted = ref<RequestDetails[]>([])
const detailsListRef = ref<{ confirmLeave: () => Promise<boolean> } | null>(
  null,
)

const onToggleChange = async (newToggle: number) => {
  if (newToggle === toggle.value) return

  if (newToggle === 0 && detailsListRef.value) {
    const proceed = await detailsListRef.value.confirmLeave()
    if (!proceed) return
  }

  toggle.value = newToggle
}

const click = async (id: any) => {
  identity.value = id
  router.replace({ path: `/flow/${identity.value}` })
  emit('click-request', id)
}

const fetchRequestDetails = async (requests: any) => {
  if (requests) {
    for (const request of requests) {
      await store.dispatch('requestDetails/get', { requestId: request?.id })
      store.state.requestDetails.response =
        store.state.requestDetails.response?.map((item: any) => {
          const isReason = item.title === 'requestReason'
          if (isReason) {
            item.title = RequestReason[0].key
            item.value = filteredRequestReason(item)
          }
          return item
        })

      requestsSubmitted.value.push({
        ...request,
        requestDetails: store.state.requestDetails.response,
      })
    }
  }
}

const filteredRequestReason = (stage: any) => {
  return RequestReason[0].options.find((item) => item.id === stage.value)
    ?.displayName
}

watch(
  () => props.requests,
  (newRequests) => {
    fetchRequestDetails(newRequests)
  },
)
onMounted(() => {
  fetchRequestDetails(props.requests)
})
</script>

<style lang="scss">
.wrap {
  padding: 3.73vw !important;
  padding-bottom: 0 !important;

  .v-container {
    padding: 0 !important;
    padding-top: 3.73vw !important;

    .main-card {
      padding: 3.73vw;
      border-radius: 4.673vw !important;
      box-shadow: var(--v-box-shadow) !important;
    }

    .v-row {
      margin: 0 !important;
    }

    .v-card-item,
    .v-card-title {
      color: white;
      text-align: center;
      font-size: 5.607vw !important;
      font-weight: 600 !important;
      padding: 0vw 3.74vw !important;
    }
  }

  .circle {
    width: 15.654vw;
    height: 7.944vw;
    position: absolute;

    &.green {
      background-color: rgb(var(--v-theme-Light-Green));
      right: -4.86vw;
      bottom: 5.61vw;
      border-radius: 0 0 11.682vw 11.682vw;
    }

    &.yellow {
      background-color: rgb(var(--v-theme-Light-Yellow));
      left: -4.86vw;
      top: 5.61vw;
      border-radius: 11.682vw 11.682vw 0 0;
    }
  }

  .toggle {
    width: 100% !important;
    margin: 3.73vw 0;

    .v-btn__content {
      font-weight: 400;
      letter-spacing: 0;
      font-size: 3.505vw;
    }

    .v-btn-group {
      box-shadow: var(--v-box-shadow) !important;
      width: 100% !important;
      height: 11.215vw !important;
      background-color: white;
      border-radius: 5.607vw !important;
    }

    .v-btn {
      padding: 0 !important;
      width: 48.7%;
      letter-spacing: 0.117vw;
      line-height: 5.607vw;
      border-radius: 4.673vw !important;
      margin: 1.168vw;

      &.active {
        color: white !important;
      }
    }
  }
}

.content {
  padding: 3.73vw !important;
  padding-top: 0 !important;

  .explain {
    color: rgb(var(--v-theme-Professor-Plum));
    line-height: 4.486vw;
    padding: 1.87vw 0;
    text-align: center;
  }
}

.overflow-lobby {
  padding: 2vw;
  height: 44vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(env(safe-area-inset-bottom), 20px) !important;
}

@media screen and (max-height: 668px) {
  .overflow-lobby {
    height: 44vh;
    padding: 0 5px;
    padding-bottom: max(env(safe-area-inset-bottom), 20px) !important;
  }
}

.overflow-lobby-details {
  padding: 2vw;
  height: 58vh;
  overflow-y: auto;
  overflow-x: hidden;
}

@media screen and (max-height: 668px) {
  .overflow-lobby-details {
    height: 53vh;
    padding: 0 5px;
  }
}

.file-icon-loby {
  margin: 1vw 32.4vw;
}
</style>
