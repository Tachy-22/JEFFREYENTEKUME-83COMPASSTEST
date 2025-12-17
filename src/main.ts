import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import './style.css'
import 'vue3-toastify/dist/index.css'

import App from './App.vue'
import router from './router'
import { installVueQuery } from './lib/vue-query'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Install Vue Query
installVueQuery(app)

// Install Vue3 Toastify
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'dark',
  transition: 'bounce',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 60,
} as ToastContainerOptions)

app.mount('#app')
