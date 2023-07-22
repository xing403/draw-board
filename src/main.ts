import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import ElementPlus from 'element-plus'
import routes from 'virtual:generated-pages'
import pinia from './store'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
