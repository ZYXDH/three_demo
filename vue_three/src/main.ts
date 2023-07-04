import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index'
import Vant from 'vant'
console.log('%c 🍣 Vant', 'color:#f5ce50', Vant)
import 'vant/lib/index.css' // 全局引入样式
import 'amfe-flexible/index.js'
import './utils/rem'
import '@/router/main'
import 'uni-js-bridge'
createApp(App).use(router).use(Vant).use(createPinia()).mount('#app')
