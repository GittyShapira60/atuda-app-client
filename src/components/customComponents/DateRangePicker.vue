<template>
  <div class="d-flex align-center flex-column">
    <div class="date-title mb-0">{{ title }}</div>
    <v-row class="date-input">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="displayDate"
          readonly
          prepend-inner-icon="mdi-calendar"
          class="styled-text-field"
          @click="dialog = true"
          variant="solo-inverted"
        ></v-text-field>

        <v-dialog v-model="dialog" width="450">
          <v-card class="styled-dialog">
            <v-card-text>
              <v-date-picker
                hide-header
                v-model="dates"
                color="rgb(var(--v-theme-Primary-Navy-Blue))"
                multiple="range"
                scrollable
                class="styled-date-picker"
                :min="minDate"
                :max="maxDate"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="true" @click="onDatesChange()" class="close-btn"
                >סגור</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

const props = defineProps<{
  modelValue: any
  statefulLayout: any
  error?: boolean
}>()
const emit = defineEmits<{
  (change: 'checked'): void
  (err: 'error', value: { valid: boolean }): void
}>()
const title = props.modelValue.layout.title
const dialog = ref(false)
const dates = ref<Date[]>([])
const dateToDB = ref<string[]>([])
const range = ref<Date[]>([])

const { maxRangeMonths, minRangeMonths } =
  props.statefulLayout._compiledLayout.schema.properties[props.modelValue.key]
    .validation

const minDate = dayjs().subtract(minRangeMonths, 'month').format('YYYY-MM-DD')
const maxDate = dayjs().add(maxRangeMonths, 'month').format('YYYY-MM-DD')

const onDatesChange = () => {
  props.statefulLayout.input(props.modelValue, dateToDB.value)
  dialog.value = false
}

const expandedRange = computed<Date[]>(() => {
  if (!props.modelValue.data || props.modelValue.data.length < 2) return []
  const startDate = dayjs(props.modelValue.data[0])
  const endDate = dayjs(props.modelValue.data[1])
  let current = startDate
  while (current.isSameOrBefore(endDate, 'day')) {
    range.value.push(new Date(current.format('YYYY-MM-DD')))
    current = current.add(1, 'day')
  }
  return range.value
})

watch(dates, (newDates) => {
  if (!newDates || newDates.length < 2) {
    return
  }
  const startDate = dayjs(newDates[0])
  const endDate = dayjs(newDates[newDates.length - 1])
  dateToDB.value = [
    startDate.format('YYYY-MM-DD'),
    endDate.format('YYYY-MM-DD'),
  ]
})

watch(
  () => props.modelValue.data,
  (newVal) => {
    if (newVal && newVal.length === 2) {
      dates.value = expandedRange.value
    }
  },
  { immediate: true },
)

const displayDate = computed(() => {
  if (!props.modelValue.data || props.modelValue.data.length == 0) return ''
  return (
    dayjs(props.modelValue.data[1]).format('DD/MM/YYYY') +
    ' - ' +
    dayjs(props.modelValue.data[0]).format('DD/MM/YYYY')
  )
})
</script>

<style scoped lang="scss">
.styled-text-field:deep(.v-field) {
  border-radius: 2.8vw;
  box-shadow: 0px 0.47vw 1.4vw rgba(0, 0, 0, 0.08);
  padding: 0.93vw 1.87vw;
  margin: 1.869vw;
}
.styled-dialog {
  border-radius: 3.74vw !important;
  box-shadow: 0 0.93vw 2.8vw rgba(0, 0, 0, 0.1);
  .v-date-picker {
    width: 100%;
  }
}
.styled-date-picker {
  border-radius: 2.8vw;
}

.error-text {
  padding-right: 0.625vw;
}

.close-btn {
  color: rgb(var(--v-theme-Light-Cornflower-Blue));
  font-weight: 500;
}
.v-date-picker-header__content {
  font-size: 2.8vw !important;
  color: white;
}
.date-title {
  font-size: 3.738vw;
  font-weight: 600;
  line-height: 5.234vw;
  text-align: right;
  margin-top: 5.607vw;
}
.date-input {
  width: 100%;
}
</style>
