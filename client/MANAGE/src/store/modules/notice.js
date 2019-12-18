import {
  addNotice,
  updateNotice,
  getNoticeList,
  deleteNotice,
  sendNotice,
  addNoticeOrg
} from '@/api/notice'
const notice = {
  state: {

  },

  mutations: {

  },

  actions: {
    // 获取公告列表
    GetNoticeList({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getNoticeList(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增系统公告
    AddNotice({
      commit
    }, notice) {
      return new Promise((resolve, reject) => {
        addNotice(notice).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增系统公告
    AddNoticeOrg({
      commit
    }, notice) {
      return new Promise((resolve, reject) => {
        addNoticeOrg(notice).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改客户端设置
    UpdateNotice({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        updateNotice(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除客户端设置
    DeleteNotice({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        deleteNotice(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 发送公告
    SendNotice({ commit }, data) {
      return new Promise((resolve, reject) => {
        sendNotice(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default notice
