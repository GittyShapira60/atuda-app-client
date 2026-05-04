<template>
  <Loading :loading="loading" />
  <Lobby :requests="requests" :requestTypes="requestTypes" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const requests = ref(null)
const requestTypes = ref(null)
const loading = ref(true)

onMounted(async () => {
  await store.dispatch('requestTypes/get')
  if (!store.state.requests.response) {
    await store.dispatch('requests/get')
  }
  requests.value = store.state.requests.response
  requestTypes.value = store.state.requestTypes.response
  loading.value = store.state.requestTypes.loading
})
</script>
