import {
  getGroupNotice,
  deleteGroupNotice,
  addGroupNotice,
  updateGroupNotice
} from '../../api/notice'

const notice = {
  state: {
    // 群公告列表
    groupNoticeList: []
  },
  mutations: {
    SET_GROUP_NOTICE_LIST: (state, data) => {
      state.groupNoticeList = data
    }
  },
  actions: {
    // 获取群公告列表
    GetGroupNotice ({
      commit
    }, dataParam) {
      return new Promise((resolve, reject) => {
        getGroupNotice(dataParam).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    DeleteGroupNotice ({
      commit
    }, noticeId) {
      return new Promise((resolve, reject) => {
        deleteGroupNotice(noticeId).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    AddGroupNotice ({
      commit
    }, notice) {
      return new Promise((resolve, reject) => {
        addGroupNotice(notice).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateGroupNotice ({
      commit
    }, notice) {
      return new Promise((resolve, reject) => {
        updateGroupNotice(notice).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default notice
