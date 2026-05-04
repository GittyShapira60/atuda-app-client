<template>
  <Loading :loading="loading" />
  <Login
    v-if="requests"
    :requests="requests"
    :username="store.state.soldier.firstname"
    @clicked="requestsLobby"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const requests = ref(null)
const loading = ref(true)

onMounted(async () => {
  await store.dispatch('requests/get', { identity: store.state.soldier.tz })
  requests.value = store.state.requests.response
  loading.value = store.state.requests.loading
})

const requestsLobby = () => {
  router.push({ path: '/requests' })
}
</script>
