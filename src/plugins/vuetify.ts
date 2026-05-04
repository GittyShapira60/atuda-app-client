/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { he } from 'vuetify/locale'

const CustomTheme = {
  dark: false,
  colors: {
    background: '#F4F6FA',
    'Light-Cornflower-Blue': '#5C9DE9',
    'Powder-Blue': '#D4E5F9',
    'Green-Chip': '#A4DBA2',
    'Red-Chip': '#F23838',
    'Primary-Chip': '#A1C6F1',
    'Primary-Navy-Blue': '#016DEB',
    'Comment-text': '#F23838',
    'Professor-Plum': '#393143',
    'Light-Purple': '#EDEDFA',
    Gray: '#EDEDFA',
    'Light-Blue': '#EAF1FE',
    'Fruit-Salad': '#4CB245',
    White: '#FFFFFF',
    'Light-Gray': '#D9DCE466',
    'Gray-Status': '#666569',
    'White-Solid': '#F4F7FA',
    'Light-Green': '#A4DBA2',
    'Light-Yellow': '#FDD281',
    'Dark-Orange': '#FFC900',
    'Special-White': '#D1DAE2',
    'Specific-White': '#F9F9F9',
    'on-surface': 'rgba(#282948, 0.6)',
    Manatee: '#8484A8',
    'Cracked-Slate': '#666569',
    'Light-Blue-Border': '#84B4EE',
  },
  variables: {
    'box-shadow': '0px 8px 15px 0px #8484a826',
  },
}

export default createVuetify({
  locale: {
    locale: 'he',
    fallback: 'he',
    messages: { he },
    rtl: { he: true },
  },
  theme: {
    defaultTheme: 'CustomTheme',
    themes: {
      CustomTheme,
    },
  },
})
