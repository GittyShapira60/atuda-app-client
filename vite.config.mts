// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import { commonjsDeps } from '@koumoul/vjsf/utils/build.js'
// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bakashot',
  optimizeDeps:{
    include:commonjsDeps
  },
  // build:{
  //   commonjsOptions:{
  //     transformMixedEsModules: true,
  //   }
  // },
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify(),
    Components(),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
  ],
  define: { 'process.env': {
    VITE_APP_NODE: JSON.stringify(process.env.VITE_APP_NODE),
    VITE_APP_CLIENT_ID: JSON.stringify(process.env.VITE_APP_CLIENT_ID),
    VITE_APP_TENANT_ID: JSON.stringify(process.env.VITE_APP_TENANT_ID),
    VITE_APP_REDIRECT_URL: JSON.stringify(process.env.VITE_APP_REDIRECT_URL),
    VITE_DEFAULT_USER_NAME: JSON.stringify(process.env.VITE_DEFAULT_USER_NAME),
    VITE_DEFAULT_NAME: JSON.stringify(process.env.VITE_DEFAULT_NAME)
  } },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 8081,
    watch: {
      usePolling: true
    }
  },
})
