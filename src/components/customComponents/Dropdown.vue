<template>
  <div class="d-flex align-center flex-column px-0">
    <div class="dropdown-header" v-show="show">{{ title }}</div>
    <v-card class="rounded-lg dropdown-card" width="100%">
      <div class="filter" v-if="values.length > 10">
        <v-icon>mdi-magnify</v-icon>
        <input type="text" class="filter-box" v-model="filter" />
      </div>
      <div>
        <v-list
          v-model:opened="open"
          class="text-right dropdown-list"
          :class="values.length > 10 ? 'no-space' : ''"
        >
          <v-list-group value="value">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-title
                  class="dropdown-title font-weight-black pr-0"
                >
                  {{ subTitle }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-virtual-scroll class="scroll" :height="0" :items="filteredData">
              <template v-slot:default="{ item }">
                <v-list-item @click="selectValue(item)">
                  <v-list-item-title class="dropdown-item"
                    >{{ item }}
                    <v-icon
                      class="trash-icon float-left"
                      v-if="subTitle === item"
                      >mdi-trash-can-outline</v-icon
                    >
                  </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
              </template>
            </v-virtual-scroll>
          </v-list-group>
        </v-list>
      </div>
      <div
        v-if="props.error && !isValid"
        class="error-message"
        aria-live="assertive"
        aria-atomic="true"
      >
        {{ errorMessage }}
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { ErrorSchema } from '@/enums/ErrorSchema'
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: any
  statefulLayout: any
  error?: Boolean
  property?: String
}>()
const emit = defineEmits<{ (change: 'checked'): void }>()
const title = props.modelValue.props.title
const defaultSubTitle = props.modelValue.props.subTitle
let show = title !== 'none' && title !== 'null'
const open = ref(['value'])
const values = ref(
  props.modelValue.props.data.map((item: any) => item.name || item),
)
const selectedValue = ref(null)

const filter = ref('')

const filteredData = computed(() => {
  if (!filter.value) {
    return values.value
  }

  return values.value.filter((item: any) =>
    item.toLowerCase().includes(filter.value.toLowerCase()),
  )
})

const isValid = computed(() => {
  return !(
    (props.modelValue.data === undefined ||
      props.modelValue.data?.length == 0) &&
    (props.statefulLayout._compiledLayout.schema.required.includes(
      props.modelValue.key,
    ) ||
      props.property == props.modelValue.key)
  )
})

const subTitle = computed(() => {
  return (
    props.modelValue.data?.name ||
    props.modelValue.data ||
    selectedValue.value ||
    defaultSubTitle
  )
})

const errorMessage = computed(() => {
  return ErrorSchema.MissingField
})

const selectValue = (value: any) => {
  selectedValue.value =
    !selectedValue.value || selectedValue.value !== value ? value : null

  props.modelValue.props.data.every((item: any) => typeof item === 'object')
    ? props.statefulLayout.input(
        props.modelValue,
        props.modelValue.props.data.filter(
          (item: any) => item.name === selectedValue.value,
        )[0],
      )
    : props.statefulLayout.input(props.modelValue, selectedValue.value)

  emit('checked')
}
</script>

<style lang="scss">
.mdi-chevron-down,
.mdi-chevron-up {
  color: white !important;
}

.v-list-item__append {
  border-radius: 50%;
  background-color: rgb(var(--v-theme-Primary-Navy-Blue));
}

.v-list-item__spacer {
  position: absolute;
  left: 7%;
}

.list-wrapper {
  position: relative;
}

.dropdown-header {
  font-size: 3.738vw !important;
  font-weight: 600;
  line-height: 5.234vw;
  text-align: right;
  padding: 3.738vw;
}

.dropdown-item {
  font-size: 3.271vw !important;
  padding: 3.738vw 0 1vw 0;
}

.dropdown-title {
  font-size: 3.738vw !important;
}

.dropdown-list {
  padding: 1.869vw 0 !important;

  .scroll {
    height: fit-content !important;
    max-height: 38vw !important;
  }

  &.no-space {
    padding-top: 0 !important;
  }

  .v-list-group__items {
    --indent-padding: 0 !important;
    padding: 0 3.738vw;
  }

  .v-list-item--density-default.v-list-item--one-line {
    min-height: fit-content;
  }
}

.dropdown-card {
  box-shadow: var(--v-box-shadow) !important;
  margin-bottom: 1.869vw;

  .v-list-item:has(.dropdown-title) {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
  }

  .filter {
    padding: 3vw 3vw 0 0;

    .filter-box {
      border: none;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>
