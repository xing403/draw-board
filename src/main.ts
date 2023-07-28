import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import ElementPlus from 'element-plus'
import routes from 'virtual:generated-pages'
import packageJson from '../package.json'
import pinia from './store'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'
import 'uno.css'
import './styles/main.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')

// eslint-disable-next-line no-console
console.log(`%c version %c ${packageJson.version} `,
  'color:#FFF;background:#5c5c5c;border-radius:5px 0 0 5px;padding:5px;margin: 5px 0',
  'color:#FFF;background:#E6A23C;border-radius:0 5px 5px 0;padding:5px;margin: 5px 0',
)
