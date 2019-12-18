import { login, logout, getInfo ,checkPwd} from '@/api/login'
import { getUserPage, delUserById, getUserById, addUser, updateUser, userNameExist, getUserCount, getUserAdminByGroupCode, addUserAdmin, getUserAdminCount
  , validataPwd, updateUserAdmin, resetAdminPassword, resetUserPassword } from '@/api/user'
import { removeToken } from '@/utils/auth'
import { setStore, getStore, removeStore } from '@/utils/mUtils.js'

const user = {
  state: {
    token: getStore('token'),
    name: '',
    avatar: '',
    userId: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USER_ID: (state, userIds) => {
      state.userId = userIds
      setStore('userId', userIds)
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      console.log('store/modules/user.js  执行Login()方法')
      const username = userInfo.username.trim()
      // 
      return new Promise((resolve, reject) => {
        console.log('store/modules/user.js  调用/api/login.js的login()方法')
        login(username, userInfo.password).then(response => {
          const data = response.data
          console.log('store/modules/user.js  请求数据成功：' + response.data)
          // setToken(data.username)
          // 设置SET_USER_ID的值
          console.log('store/modules/user.js  设置SET_USER_ID为' + data.id + '')
          commit('SET_USER_ID', data.id + '')
          // 设置SET_TOKEN的值
          console.log('store/modules/user.js  设置SET_TOKEN为' +  data.username)
          commit('SET_TOKEN', data.username)
          // 调用/utils/mUtils.js的方法setStore() 存储localStorage
          console.log('store/modules/user.js  调用/utils/mUtils.js的方法setStore()')
          setStore('token', data.username)
          setStore('userinfo', data)
          setStore('addRouFlag', false)
          resolve(response)
        }).catch(error => {
          console.log('store/modules/user.js  请求数据失败：' + JSON.stringify(error))
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        console.log('userInfo===', userInfo)
        logout(userInfo).then((response) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeStore('addRouFlag')
          removeStore('token')
          removeStore('userId')
          this.$router.push('/')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 获取用户列表 查询分页显示用户
    GetUserPage({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUserPage(params).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 删除用户
    DelUserById({ commit }, id) {
      return new Promise((resolve, reject) => {
        delUserById(id).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 查询用户
    GetUserById({ commit }, id) {
      return new Promise((resolve, reject) => {
        getUserById(id).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 判断用户名是否已存在
    UserNameExist({ commit }, userName) {
      return new Promise((resolve, reject) => {
        userNameExist(userName).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 根据用户名获取用户数量
    GetUserCount({ commit }, userName) {
      return new Promise((resolve, reject) => {
        getUserCount(userName).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 根据用户名获取管理员用户数量
    GetUserAdminCount({ commit }, userName) {
      return new Promise((resolve, reject) => {
        getUserAdminCount(userName).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 保存用户 
    SaveUser({ commit }, user) {
      return new Promise((resolve, reject) => {
        if (user.id) {
          updateUser(user).then(data => {
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } else {
          addUser(user).then(data => {
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    // 根据机构Code获取管理员用户
    GetUserAdminByGroupCode({ commit }, groupCode) {
      return new Promise((resolve, reject) => {
        getUserAdminByGroupCode(groupCode).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增管理员用户
    AddUserAdmin({ commit }, userAdmin) {
      return new Promise((resolve, reject) => {
        addUserAdmin(userAdmin).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 校验密码是否匹配
    ValidataPwd({ commit }, data) {
      return new Promise((resolve, reject) => {
        validataPwd(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改管理员用户
    EditUserAdmin({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateUserAdmin(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }, // 重置管理员密码
    ResetAdminPassword({ commit }, data) {
      return new Promise((resolve, reject) => {
        resetAdminPassword(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 重置普通用户密码
    ResetUserPassword({ commit }, data) {
      return new Promise((resolve, reject) => {
        resetUserPassword(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //验证密码
    CheckPwd({commit}, data){
      return new Promise((resolve, reject) => {
        checkPwd(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
