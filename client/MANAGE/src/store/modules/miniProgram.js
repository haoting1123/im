import {
  getMiniProgramList,
  delMiniProgram,
  addMiniProgram,
  updateMiniProgram,
  getMiniProgramListAll,
  getMiniProgramByGcode
} from '@/api/miniProgram'
const miniProgram = {
  state: {

  },

  mutations: {

  },

  actions: {
    // 获取公告列表
    GetMiniProgramList({
      commit
    },params) {
      return new Promise((resolve, reject) => {
        getMiniProgramList(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增系统公告
    AddMiniProgram({
      commit
    }, notice) {
      return new Promise((resolve, reject) => {
        addMiniProgram(notice).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改客户端设置
    UpdateMiniProgram({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        updateMiniProgram(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除客户端设置
    DelMiniProgram({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        delMiniProgram(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetMiniProgramListAll({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getMiniProgramListAll().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetMiniProgramByGcode({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        getMiniProgramByGcode(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default miniProgram
