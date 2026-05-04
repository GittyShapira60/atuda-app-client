<template>
  <v-container class="general">
    <v-card
      @click="click()"
      class="classic-card"
      :id="true"
      :title="request.name"
      v-slot:append
    >
      <v-icon
        icon="mdi-chevron-left"
        color="white"
        class="rounded-circle"
      ></v-icon>
    </v-card>
    <Popup
      v-if="dialog"
      v-model="dialog"
      :title="dialogContent.title"
      :content="dialogContent.content"
      :move="false"
      :btnText="'סגירה'"
      @close-popup="dialog = false"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { RequestCard } from '@/interfaces/RequestCard'
import { ref } from 'vue'

const props = defineProps<{
  request: RequestCard
}>()
const dialog = ref(false)
const dialogContent = ref({
  title: 'שים לב!',
  content: 'יש ברשותך בקשה פתוחה, אין באפשרותך להזין בקשה נוספת כרגע',
})
const emit = defineEmits<{ (click: 'click-request', id: number): void }>()
const click = () => {
  emit('click-request', props.request.id)
}
</script>

<style lang="css">
.general {
  padding: 0 !important;
}

#true {
  background: rgb(var(--v-theme-White)) !important;
  color: rgb(var(--v-theme-Professor-Plum));
}

#true .v-icon {
  background-color: rgb(var(--v-theme-Primary-Navy-Blue));
  border: 0.234vw solid rgb(var(--v-theme-Light-Gray));
  align-items: baseline !important;
}

#false {
  background: rgb(var(--v-theme-White-Solid));
  color: rgb(var(--v-theme-Gray-Status));
}

#false .v-icon {
  background: rgb(var(--v-theme-Gray-Status));
  border: 0.234vw solid rgb(var(--v-theme-Light-Gray));
  align-items: baseline !important;
}
</style>
