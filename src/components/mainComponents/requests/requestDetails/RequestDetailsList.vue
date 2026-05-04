<template>
  <div
    v-for="request in requests"
    :key="request.requestType"
    class="style-padding"
  >
    <RequestDetailsCard :request="request" />
  </div>
</template>

<script lang="ts" setup>
import { RequestDetails } from '@/interfaces/RequestDetails'

defineProps<{
  requests: RequestDetails[]
}>()
</script>

<style lang="scss">
.style-padding {
  padding: 0.86vh 0;
  width: 90.5vw;
}
</style>
