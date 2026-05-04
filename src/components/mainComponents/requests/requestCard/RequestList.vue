<template>
  <div
    v-for="request in availableRequests"
    :key="request.name"
    class="style-padding"
  >
    <RequestTypeCard :request="request" @click-request="click" />
    <Popup
      v-if="dialog"
      v-model="dialog"
      :title="dialogContent.title"
      :content="dialogContent.content"
      :btnText="'המשך'"
      :move="true"
      @close-popup="handleClosePopup"
    />
  </div>
</template>

<script lang="ts" setup>
import { RequestCard } from '@/interfaces/RequestCard'
import { ref, computed } from 'vue'
const props = defineProps<{
  requestTypes: RequestCard[]
  requests: any
}>()
const identity = ref(0)
const dialog = ref(false)
const dialogContent = ref({
  title: 'שימו לב!',
  content: 'הגשת  כבר בקשה מסוג זה, הבקשה החדשה לא תקושר לאחת הקיימת.',
})
const emit = defineEmits<{
  (click: 'click-request', id: number): void
}>()
const click = (id: number) => {
  identity.value = id
  if (props.requests?.find((item: any) => item.requestTypeId === id)) {
    dialog.value = true
  } else {
    emit('click-request', identity.value)
  }
}

const handleClosePopup = (move: boolean = false) => {
  dialog.value = false
  if (move) emit('click-request', identity.value)
}

const availableRequests = computed(() =>
  props?.requestTypes?.filter((req) => req && req.isAvailable),
)
</script>

<style lang="scss">
.style-padding {
  padding: 0.86vh 0;
}
</style>
