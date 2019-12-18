import Vue from 'vue'

let debouceTimer = 0
Vue.mixin({
  methods: {
    debouce (func, wait = 50) {
      return function (...args) {
        if (debouceTimer) clearTimeout(debouceTimer)
        debouceTimer = setTimeout(() => {
          func.apply(this, args)
        }, wait)
      }
    }
  }
})
