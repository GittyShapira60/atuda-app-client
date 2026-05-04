import AutoComplete from '@/components/customComponents/AutoComplete.vue'
import Checkbox from '@/components/customComponents/Checkbox.vue'
import DateRangePicker from '@/components/customComponents/DateRangePicker.vue'
import Dropdown from '@/components/customComponents/Dropdown.vue'
import FileInput from '@/components/customComponents/FileInput.vue'
import RadioButtons from '@/components/customComponents/RadioButtons.vue'
import RadioLines from '@/components/customComponents/RadioLines.vue'
import Textarea from '@/components/customComponents/Textarea.vue'
import ToggleButton from '@/components/customComponents/ToggleButton.vue'

export const Components = new Map<string, any>([
  ['toggle-button', ToggleButton],
  ['radio-lines', RadioLines],
  ['textarea', Textarea],
  ['file-input', FileInput],
  ['select', AutoComplete],
  ['dropdown', Dropdown],
  ['checkbox', Checkbox],
  ['radio-button', RadioButtons],
  ['date-range-picker', DateRangePicker],
])
