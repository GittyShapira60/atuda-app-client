/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Routes
import router from './router'

// Components
import App from './App.vue'
import store from './store/index'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.use(store)
app.use(router)

app.mount('#app')
