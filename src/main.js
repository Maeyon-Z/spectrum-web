import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'


const app = createApp(App)
app.use(ElementPlus)
app.use(VueAxios, axios)
app.mount('#app')
app.config.globalProperties.$http = axios
