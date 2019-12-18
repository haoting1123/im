import {
  changePassword,
  heartbeat
} from '../../api/user'

const user = {
  state: {

  },
  mutations: {},
  actions: {
    // 修改密码
    ChangePassword ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        changePassword(data).then(response => {
          if (response.data === 1) {
            dispatch('Logon')
              .then(() => {
                resolve(response)
              })
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 发送心跳
    sendHeartbeat ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        heartbeat()
        resolve()
      })
    }

  }
}
export default user
