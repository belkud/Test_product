import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupStore } from './stores'
import { setupRouter } from './router'
import { setupElementPlus } from './plugins/element-plus'

const app = createApp(App)

setupStore(app)
setupElementPlus(app)
const router = setupRouter()
app.use(router)

app.mount('#app')
