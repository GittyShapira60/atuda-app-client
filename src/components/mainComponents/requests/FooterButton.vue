<template>
  <v-footer app class="footer">
    <v-btn
      rounded="pill"
      block
      variant="text"
      class="btn-footer text-white"
      :disabled="disabled"
      :type="type"
      @click="clicked()"
    >
      {{ text }}
    </v-btn>
  </v-footer>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{
  text: string
  disabled?: any
  type?: string
}>()

const emit = defineEmits<{ (next: 'clicked'): void }>()
const clicked = () => {
  emit('clicked')
  if (props.text === 'חזרה לעמוד הראשי') {
    router.replace({ path: '/' })
  }
}
</script>

<style lang="scss" scoped>
.v-btn--size-large {
  --v-btn-size: 4.206vw;
  --v-btn-height: 7vh;
}
.btn-footer {
  font-size: 4.206vw;
  letter-spacing: 0.093vw !important;
  height: 12.85vw !important;
  background: rgb(var(--v-theme-Fruit-Salad));
}
.v-btn--disabled {
  background: rgb(var(--v-theme-Fruit-Salad)) !important;
}
.footer {
  background: transparent;
  padding-bottom: 3.2vh;
  padding-left: 4.2vw;
  padding-right: 4.2vw;
}
</style>
