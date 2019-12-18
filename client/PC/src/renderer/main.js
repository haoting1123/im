import Vue from 'vue'
//首先不推荐使用 ajax 了，因为他的特点是 dom操作不适合。
//用 axios
import axios from 'axios'
import 'jquery'
// xml数据处理插件
import X2js from 'x2js'

import App from './App'
import router from './router'
import store from './store'

//Element ，是由饿了么开发的，东西都是组件，专门给vue来用的。
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/common.css'
import './assets/css/element-ui.less'
import './assets/css/init.css'
import '../../static/icon/iconfont.css'
import { emoji } from './utils/emoji.js'
// 引入jitsi-meet
// import '../../static/js/media/lib-jitsi-meet.min'

// 全局混入
import './utils/mixin'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

//配置axios
Vue.http = Vue.prototype.$http = axios

Vue.config.productionTip = false
//这个是配置全局环境，不需要用，就已经存在了，就是直接可以用，不要调用什么东西了
Vue.use(ElementUI)
// 创建x2js对象，挂到vue原型上
Vue.prototype.$x2js = new X2js()
// 创建emoji对象，挂到vue原型上
Vue.prototype.emoji = emoji
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app') 
