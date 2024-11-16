import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.xyz', // Disable dark mode in primevue
      },
    },
  })
app.use(ToastService)
app.component('Toast', Toast)
app.mount('#app')