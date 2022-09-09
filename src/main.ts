import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import directives from './directives'
import '@/assets/scss/index.scss'
createApp(App).use(directives).use(store).use(router).mount('#app')
