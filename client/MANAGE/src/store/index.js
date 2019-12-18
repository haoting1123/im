import Vue from 'vue'
import Vuex from 'vuex'
// import app from './modules/app'
// import user from './modules/user'
// import group from './modules/group'
import getters from './getters'
import modules from './modules'
Vue.use(Vuex)

export default new Vuex.Store({
  modules,getters
})
