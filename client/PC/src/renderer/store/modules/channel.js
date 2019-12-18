import {
  listUserChannels,
  getUserChannel,
  getChannelList,
  createChannel,
  getChannelById,
  isAdmin,
  updateUserChannelDisplayName,
  updateChannelName,
  updateChannelPurpose,
  addMember,
  listMember,
  removeMember,
  changeAdmin,
  leaveChannel,
  removeChannel,
  hideChannel,
  searchUserChannel,
  saveNotice,
  updateNotice
} from '@/api/channel'

const channel = {
  state: {
    // 显示语音/视频选项
    showMediaServer: false,
    // 打开媒体通话面板
    mediaSpeakFlag: false,
    // 同意请求
    acceptRequestFlag: false,
    // 媒体会议角色：initiator => 发起方 acceptor => 接收方
    mediaSpeakRole: '',
    // 当前最大化窗口显示的成员的ID
    activeMediaMemberId: 'localVideo1',
    // 媒体会议信息
    mediaMeetInfo: {
      // 请求者jid
      senderId: '',
      // 会话id
      channelId: '',
      roomName: '',
      channelName: '',
      // P => 单人 G => 群聊
      roomType: '',
      channelType: '',
      // VIDEO => 视频 VOICE => 语音
      mediaType: '',
      type: '',
      memberInfo: []
    },
    // 是否媒体窗口最小化
    isMediaMinimize: false
  },
  mutations: {
    SET_MEDIA_SPEAK_FLAG (state, data) {
      state.mediaSpeakFlag = data
    },
    SET_ACCEPT_REQUEST_FLAG (state, data) {
      state.acceptRequestFlag = data
    },
    SET_MEDIA_SPEAK_ROLE (state, data) {
      state.mediaSpeakRole = data
    },
    INIT_MEDIA_MEET_INFO (state) {
      state.mediaMeetInfo = {
        senderId: '',
        channelId: '',
        roomName: '',
        channelName: '',
        // P => 单人 G => 群聊
        roomType: '',
        channelType: '',
        // VIDEO => 视频 VOICE => 语音
        mediaType: '',
        type: '',
        memberInfo: []
      }
    },
    SET_IS_MEDIA_MINIMIZE (state, data) {
      state.isMediaMinimize = data
    },
    SET_ACTIVE_MEDIA_MEMBER_ID (state, data) {
      state.activeMediaMemberId = data
    },
    SET_SHOWMEDIASERVER (state, data) {
      state.showMediaServer = data
    },
    SET_MEDIA_MEET_INFO (state, data) {
      state.mediaMeetInfo = data
    },
    // 删除房间成员
    DELETE_MEDIA_MEET_MEMBER (state, data) {
      let index = state.mediaMeetInfo.memberInfo.findIndex(item => {
        return item.jid === data
      })
      if (index > -1) {
        state.mediaMeetInfo.memberInfo.splice(index, 1)
      }
    },
    // 更新房间成员状态 => 加入房间
    UPDATE_MEDIA_MEET_MEMBER_STATUS (state, data) {
      console.warn('state.mediaMeetInfo.memberInfo', state.mediaMeetInfo.memberInfo)
      let index = state.mediaMeetInfo.memberInfo.findIndex(item => {
        return item.jid === data
      })
      if (index > -1) {
        state.mediaMeetInfo.memberInfo[index].join = true
      }
    }
    // SET_MEDIA_ID (state, data) {}
  },
  actions: {
    listUserChannels ({ commit }, userId, limit) {
      return new Promise((resolve, reject) => {
        listUserChannels(userId, limit).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    getUserChannel ({ commit }, userId, channelId) {
      return new Promise((resolve, reject) => {
        getUserChannel(userId, channelId).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    getChannelList ({ commit }) {
      return new Promise((resolve, reject) => {
        getChannelList().then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    createChannel ({ commit }, channel) {
      return new Promise((resolve, reject) => {
        createChannel(channel).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    getChannelById ({ commit }, id) {
      return new Promise((resolve, reject) => {
        getChannelById(id).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    isAdministrator ({ commit }, channelId) {
      return new Promise((resolve, reject) => {
        isAdmin(channelId).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    updateUserChannelDisplayName ({ commit }, channelId, displayName) {
      return new Promise((resolve, reject) => {
        updateUserChannelDisplayName(channelId, displayName).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    updateChannelName ({ commit }, channelId, name) {
      return new Promise((resolve, reject) => {
        updateChannelName(channelId, name).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    updateChannelPurpose ({ commit }, channelId, purpose) {
      return new Promise((resolve, reject) => {
        updateChannelPurpose(channelId, purpose).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    addMember ({ commit }, channelId, userIds) {
      return new Promise((resolve, reject) => {
        addMember(channelId, userIds).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    listMember ({ commit }, channelId, username, limit, offset) {
      return new Promise((resolve, reject) => {
        listMember(channelId, username, limit, offset).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    removeMember ({ commit }, channelId, memberId) {
      return new Promise((resolve, reject) => {
        removeMember(channelId, memberId).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    changeAdmin ({ commit }, channelId, memberId, isAdmin) {
      return new Promise((resolve, reject) => {
        changeAdmin(channelId, memberId, isAdmin).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    leaveChannel ({ commit }, channelId, memberId, memberNickname) {
      return new Promise((resolve, reject) => {
        leaveChannel(channelId, memberId, memberNickname).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    removeChannel ({ commit }, channelId) {
      return new Promise((resolve, reject) => {
        removeChannel(channelId).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    hideChannel ({ commit }, userId, channelId) {
      return new Promise((resolve, reject) => {
        hideChannel(userId, channelId).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    searchUserChannel ({ commit }, userId, name) {
      return new Promise((resolve, reject) => {
        searchUserChannel(userId, name).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    saveNotice ({ commit }, channelId, notice) {
      return new Promise((resolve, reject) => {
        saveNotice(channelId, notice).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    updateNotice ({ commit }, id, notice) {
      return new Promise((resolve, reject) => {
        updateNotice(id, notice).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default channel
