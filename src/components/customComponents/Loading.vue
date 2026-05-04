<template>
  <v-progress-linear
    v-if="loading"
    color="primary"
    indeterminate
    class="loading-progress"
  ></v-progress-linear>
</template>

<script lang="ts" setup>
defineProps<{
  loading: Boolean
}>()
</script>

<style lang="scss">
.loading-progress {
  margin-top: -0.935vw !important;
}
</style>
