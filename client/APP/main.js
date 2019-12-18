import Vue from 'vue'
import App from './App'
import store from '@/store'
import cuCustom from './colorui/components/cu-custom.vue'

// Vue.component('cu-custom',cuCustom)
Vue.prototype.debug = true
Vue.config.productionTip = false
App.mpType = 'app'
App.store = store

const app = new Vue({
    store,
    ...App
})
app.$mount()
