import {
  getLoginLogList
} from '@/api/systemLog'
const systemLog = {
  state: {

  },

  mutations: {

  },

  actions: {
    // 获取系统登录日志列表
    GetLoginLogList({
      commit
    },params) {
      return new Promise((resolve, reject) => {
        getLoginLogList(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default systemLog
