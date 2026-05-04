<template>
  <div :class="color" class="chip">
    {{ text }}
  </div>
</template>

<script lang="ts" setup>
import {
  RequestStatus,
  RequestStatusColor,
  RequestStatusLabel,
} from '@/enums/RequestStatus'
import { computed } from 'vue'

const props = defineProps<{ status: RequestStatus }>()

const text = computed(() => {
  return RequestStatusLabel.get(props.status) ?? 'לא ידוע'
})

const color = computed(() => {
  return RequestStatusColor.get(props.status)
})
</script>

<style lang="scss">
.chip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3vh;
  width: 24.5vw;
  border-radius: 20px;
  color: rgb(var(--v-theme-Professor-Plum));
  font-weight: 400;
  font-size: 3.271vw;
  line-height: 3.925vw;

  &.red {
    background: rgba(var(--v-theme-Red-Chip), 0.4);
  }

  &.primary {
    background: rgba(var(--v-theme-Primary-Chip), 0.4);
  }

  &.green {
    background: rgba(var(--v-theme-Green-Chip), 0.4);
  }
}
.v-chip.v-chip--size-small {
  --v-chip-size: 2.8vw;
  --v-chip-height: 6.075vw !important;
  font-size: 2.8vw;
  padding: 0 2.336vw !important;
}
</style>
