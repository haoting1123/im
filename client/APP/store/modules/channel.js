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

  },
  mutations: {
    // SET_HOME_WINDOW_HEIGHT (state, data) {
    //   state.homeWindowHeight = data
    // },

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
