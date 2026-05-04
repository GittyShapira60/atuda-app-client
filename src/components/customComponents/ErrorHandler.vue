<template>
  <v-container v-if="status != 400">
    <v-container class="error-handler">
      <v-icon color="red" class="error-icon">$error</v-icon>
      <p class="message-text">{{ message }}</p>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ErrorStatusMessage } from '@/enums/ErrorStatus'
import { ref } from 'vue'

const props = defineProps<{
  status: any
}>()

let message = ref('')
const messageValue =
  ErrorStatusMessage.get(props.status) ||
  (props.status == 'Network Error'
    ? 'השרת אינו זמין אנא נסה שוב מאוחר יותר'
    : 'אופס משהו השתבש נסה שוב מאוחר יותר')
message.value = messageValue
</script>

<style lang="scss">
.error-handler {
  padding-top: 32.397vh !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.message-text {
  font-size: 4.21vw;
  text-align: center;
}
.error-icon {
  font-size: 16.36vw !important;
  padding-bottom: 14.953vw !important;
}
</style>
