<template>
  <div
    v-for="request in requests"
    :key="request.requestType"
    class="style-padding"
  >
    <RequestDetailsCard :request="request" />
  </div>

  <v-dialog v-model="confirmOpen" class="details-dialog" persistent>
    <v-card class="unsaved-dialog-card">
      <v-icon
        icon="mdi-close"
        class="unsaved-close"
        @click="onConfirmChoice('cancel')"
      />
      <p class="unsaved-text text-center">
        האם ברצונך לשמור את השינויים לפני היציאה?
      </p>
      <div class="unsaved-actions">
        <v-btn
          rounded="pill"
          class="unsaved-btn"
          text="שמירה"
          :loading="saving"
          @click="onConfirmChoice('save')"
        />
        <v-btn
          rounded="pill"
          class="unsaved-btn unsaved-btn-outline"
          text="ביטול"
          :disabled="saving"
          @click="onConfirmChoice('cancel')"
        />
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { RequestDetails } from '@/interfaces/RequestDetails'
import { provide, ref } from 'vue'

defineProps<{
  requests: RequestDetails[]
}>()

type UnsavedHandler = {
  requestId: string | number
  save: () => Promise<boolean>
  discard: () => void
}

const unsaved = ref<UnsavedHandler | null>(null)
const confirmOpen = ref(false)
const saving = ref(false)
let pendingAction: (() => void) | null = null
let resolvePending: ((proceed: boolean) => void) | null = null

const confirmLeave = (action?: () => void): Promise<boolean> => {
  if (!unsaved.value) {
    action?.()
    return Promise.resolve(true)
  }

  pendingAction = action ?? null
  confirmOpen.value = true
  return new Promise((resolve) => {
    resolvePending = resolve
  })
}

const finishConfirm = (proceed: boolean) => {
  confirmOpen.value = false
  const action = pendingAction
  pendingAction = null
  resolvePending?.(proceed)
  resolvePending = null
  if (proceed) {
    action?.()
  }
}

const onConfirmChoice = async (choice: 'save' | 'discard' | 'cancel') => {
  if (choice === 'cancel') {
    finishConfirm(false)
    return
  }

  if (choice === 'save' && unsaved.value) {
    saving.value = true
    const ok = await unsaved.value.save()
    saving.value = false
    if (!ok) {
      finishConfirm(false)
      return
    }
  } else if (choice === 'discard' && unsaved.value) {
    unsaved.value.discard()
  }

  finishConfirm(true)
}

provide('requestDetailsGuard', {
  register: (handler: UnsavedHandler) => {
    unsaved.value = handler
  },
  unregister: (requestId: string | number) => {
    if (unsaved.value?.requestId === requestId) {
      unsaved.value = null
    }
  },
  hasOtherUnsaved: (requestId: string | number) =>
    !!unsaved.value && unsaved.value.requestId !== requestId,
  confirmLeave,
})

defineExpose({ confirmLeave })
</script>

<style lang="scss">
.style-padding {
  padding: 0.86vh 0;
  width: 90.5vw;
}

.unsaved-dialog-card {
  padding: 3.738vw;
  border-radius: 12.383vw !important;
  display: flex;
  flex-direction: column;
  gap: 1.869vw;
}

.unsaved-close {
  align-self: flex-start;
}

.unsaved-text {
  font-size: 4.673vw;
  padding: 1.869vw 0;
}

.unsaved-actions {
  display: flex;
  gap: 2.336vw;
  justify-content: center;
  align-self: center;
  width: fit-content;
}

.unsaved-btn {
  min-width: 28vw !important;
  width: 28vw;
  background-color: rgb(var(--v-theme-Primary-Navy-Blue));
  color: white;
  font-size: 3.738vw;
  height: 7.01vw !important;
}

.unsaved-btn-outline {
  background-color: white;
  color: rgb(var(--v-theme-Primary-Navy-Blue));
  border: 0.234vw solid rgb(var(--v-theme-Primary-Navy-Blue));

  &.v-btn--disabled {
    background-color: rgb(var(--v-theme-Light-Blue)) !important;
    color: rgb(var(--v-theme-Primary-Navy-Blue)) !important;
    border-color: rgb(var(--v-theme-Light-Cornflower-Blue)) !important;
    opacity: 0.7 !important;
  }
}
</style>
