import {
  addVersion,
  updateVersion,
  getVersionList,
  deleteVersion,
} from '@/api/version'
const version = {
  state: {

  },

  mutations: {

  },

  actions: {
    // 获取版本列表
    GetVersionList({
      commit
    },params) {
      return new Promise((resolve, reject) => {
        getVersionList(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增版本公告
    AddVersion({
      commit
    }, notice) {
      return new Promise((resolve, reject) => {
        addVersion(notice).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改版本
    UpdateVersion({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        updateVersion(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除版本
    DeleteVersion({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        deleteVersion(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default version
