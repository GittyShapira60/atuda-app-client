<template>
  <v-app>
    <Navigation
      v-if="
        !errorState && !statusError && (errorMessage == '400' || !errorMessage)
      "
    />
    <ErrorHandler v-if="errorState" :status="errorState" />
    <ErrorHandler v-if="errorMessage" :status="errorMessage" />
    <ErrorHandler v-if="statusError" :status="statusError" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { statusError } from './auth/authorization'
import { errorState } from './router'
import { errorMessage } from './services/api/index'
const error = ref(null)
const errorMessageApi = ref('')
const errorMessageAuth = ref('')
watchEffect(() => {
  error.value = errorState.value
  errorMessageAuth.value = statusError.value
  errorMessageApi.value = errorMessage.value
})
</script>

<style lang="scss">
@use './styles/style.scss';
</style>
