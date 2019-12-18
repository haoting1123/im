import {
  addClientSet,
  updateClientSet,
  getClientSet,
  reNewClientSet
} from '@/api/clientSet'
const clientSet = {
  state: {

  },

  mutations: {

  },

  actions: {
    // 获取客户端设置
    GetClientSet({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getClientSet().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增客户端设置
    AddClientSet({
      commit
    }, clientSet) {
      return new Promise((resolve, reject) => {
        addClientSet(clientSet).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改客户端设置
    UpdateClientSet({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        updateClientSet(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //初始化客户端信息
    ReNewClientSet({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        reNewClientSet(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default clientSet
