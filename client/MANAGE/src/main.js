// 入口文件
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'jquery'
import ElementUI from 'element-ui' // 导入element-ui
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

// 引入全局函数
import '@/utils/globalFunction.js' // 防抖函数
import '@/register/' // 注册第三方库函数
import moment from 'moment' // 时间格式化组件库

// css reset
import '../static/css/init.css'

import App from './App' // 引入App.vue
import router from './router' // 引入路由文件
import store from './store' // 引入全局属性

import '@/icons' // icon svg图标全局配置
import '@/permission' // permission control 访问权限控制文件

Vue.use(ElementUI) // 全局使用element-ui
moment.locale('zh-cn') // 设置本地时间时区
Vue.config.productionTip = false

// let _this = Vue;

// 过滤时间格式 
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  // 将一个 Date 格式化为日期/时间字符串。 
  return moment(dataStr).format(pattern)
})

// 创建一个常量  Vue对象
const _this = new Vue({
  el: '#app', // 挂载到id为app的元素上
  router,
  store,
  //render: function (createElement) {
  //  return createElement(App);
  //} 的缩写：
  // Vue.js 里面的 createElement 函数，这个函数的作用就是生成一个 VNode节点，render 函数得到这个 VNode 节点之后，返回给 Vue.js 的 mount 函数，渲染成真实 DOM 节点，并挂载到根节点上。
  render: h => h(App)
})

// export 用来导出模块，Vue 的单文件组件通常需要导出一个对象。
// 这个对象是 Vue 实例的选项对象，以便于在其它地方可以使用 import 引入。
// 而 new Vue() 相当于一个构造函数，在入口文件 main.js 构造根组件的同时，如果根组件还包含其它子组件，那么 Vue 会通过引入的选项对象构造其对应的 Vue 实例，最终形成一棵组件树。
// export 和export default 的区别在于：export 可以导出多个命名模块，
export default _this
