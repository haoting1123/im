import {
  changePassword,
  heartbeat,
	getAllUser,
	getUserByName
} from '../../api/user'

const user = {
  state: {

  },
  mutations: {},
  actions: {
    // 修改密码
    ChangePassword ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        changePassword(data)
          .then(response => {
            if (response === 1) {
              resolve(response)
            } else {
              reject(response)
            }
          })
          .catch(error => {
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
    },
		// 获取所有用户
		GetAllUser ({ dispatch, commit }, data) {
		  return new Promise((resolve, reject) => {
		    getAllUser(data).then(response => {
					resolve(response)
				}).catch(error => {
					reject(error)
				})
		  })
		},
		// 根据用户名模糊查询
		GetUserByName ({ dispatch, commit }, data) {
		  return new Promise((resolve, reject) => {
		    getUserByName(data).then(response => {
					resolve(response)
				}).catch(error => {
					reject(error)
				})
		  })
		},
  }
}
export default user
