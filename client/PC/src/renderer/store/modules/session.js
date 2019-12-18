// import {
//   getMemberInfoXMPP
// } from '../../xmpp/index'
// import {
//   filterFriendInfo
// } from '../../xmpp/services/friend'
import { ipcRenderer } from 'electron'

const session = {
  state: {
    sessionList: [],
    selectedChannel: ''
  },
  mutations: {
    SET_SESSION_LIST: (state, data) => {
      console.log(`会话列表：${JSON.stringify(data)}`)
      state.sessionList = data
    },
    SET_SELECTEDCHANNEL: (state, data) => {
      state.selectedChannel = data
      console.log(`当前会话: ${JSON.stringify(state.selectedChannel)}`)
    },
    SET_SELECTED_CHANNEL_BY_JID: (state, data) => {
      if (data) {
        let index = state.sessionList.findIndex(item => item.channelId === data)
        if (index > -1) {
          state.selectedChannel = state.sessionList[index]
        }
      } else {
        state.selectedChannel = ''
      }
    },
    PUSH_SESSION_LIST: (state, data) => {
      state.sessionList.unshift(data) // 向头部追加
    },
    // 替换数组对象
    REPLACE_SESSION_ITEM: (state, data) => {
      let sess = state.sessionList.find(item => {
        return item._id === data._id
      })
      if (sess) {
        sess.alias = data.alias
        sess.atTime = data.atTime
        sess.createTime = data.createTime
        sess.headUrl = data.headUrl
        sess.isAtMe = data.isAtMe
        sess.isTip = data.isTip
        sess.lastMessage = data.lastMessage
        sess.lastName = data.lastName
        sess.name = data.name
        sess.sex = data.sex
        sess.sort = data.sort
        sess.top = data.top
        sess.unreadMessageCount = data.unreadMessageCount
        // state.sessionList.splice(index, 1, data)
      }
      console.log('会话更新成功')
    },
    UNREADCOUNT_RESET: (state, sessionId) => {
      let index = state.sessionList.findIndex(item => item.channelId === sessionId)
      if (index > -1) {
        let sessionItem = state.sessionList[index]
        sessionItem.unreadMessageCount = 0
      }
    },
    AT_ME_STATUS_RESET: (state, sessionId) => {
      let sess = state.sessionList.find(item => {
        return item.channelId === sessionId
      })
      if (sess) {
        sess.isAtMe = 'no'
      }
    },
    DELETE_SESSION_ITEM: (state, data) => {
      let index = state.sessionList.findIndex(item => item._id === data._id)
      if (index > -1) {
        state.sessionList.splice(index, 1)
      }
    },
    UPDATE_SESSION_ITEM: (state, {jid, dbOption}) => {
      console.log('dbOption', jid, dbOption)
      console.log(state.sessionList)
      let obj = state.sessionList.find(item => {
        return item.jid === jid
      })
      if (obj) {
        obj.name = dbOption.name
        obj.sex = dbOption.sex
        obj.headUrl = dbOption.headUrl
        // state.sessionList.splice(index, 1, obj)
      }
    },
    RESET_SESSION_LAST_MESSAGE: (state, jid) => {
      let obj = state.sessionList.find(item => {
        return item.jid === jid
      })
      if (obj) {
        obj.lastMessage = ''
      }
    }
  },
  actions: {
    getAllSession ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        // TODO 获取当前消息列表的第一页
        let reqId = Math.random()
        ipcRenderer.send('searchUserDataAll', reqId)
        ipcRenderer.once('searchUserDataAllReply' + reqId, function (event, dbMessage) {
          // console.log(dbMessage.docs)
          commit('SET_SESSION_LIST', dbMessage.docs)
          resolve(dbMessage.docs)
        })
      })
    },
    // 获取会话根据JID，从数据库
    getSessionByJid ({ commit }, {jid}) {
      return new Promise((resolve, reject) => {
        // TODO 获取当前消息列表的第一页
        let reqId = Math.random()
        ipcRenderer.once('searchUserDataReply' + reqId, function (event, dbMessage) {
          // console.log(dbMessage.doc)
          resolve(dbMessage.doc)
        })
        ipcRenderer.send('searchUserData', reqId, jid)
      })
    },
    // 新建会话
    addNewSession ({ dispatch, commit, rootState }, {jid, lastMessage, createTime, unreadMessageCount = 0, channelType, lastName = '', alias = '', isAtMe = 'no', atTime}) {
      let sessionObj = {
        jid: jid,
        createTime: createTime,
        name: '',
        alias: alias,
        sex: '',
        channelType: channelType,
        channelId: jid,
        lastName: lastName,
        lastMessage: lastMessage,
        unreadMessageCount: unreadMessageCount,
        sort: 0,
        top: 'no',
        isTip: 'yes', // 是否免打扰
        isAtMe: isAtMe,
        atTime: atTime,
        headUrl: ''
      }
      if (channelType === 'P') {
        // 从好友列表获取会话用户信息
        let friendList = rootState.home.friendList
        let friend = null
        // console.log(friendList)
        if (friendList && friendList.length > 0) {
          friend = friendList.find((value, index, arr) => {
            return value.friendJid === jid
          })
          if (friend) {
            sessionObj.name = friend.name
            sessionObj.headUrl = friend.photo
            sessionObj.sex = friend.sex
            sessionObj.alias = friend.alias
            return dispatch('insertSession', sessionObj)
          }
        }
        // 好友列表中不存在
        if (!friend) {
          return dispatch('insertSession', sessionObj)
            .then(() => {
              // TODO 不存在则查询好友的Vcard
              dispatch('GetMemberInfo', jid.split('@')[0])
                .then(data => {
                  // console.log(`大大`, data)
                  if (data) {
                    let dbOption = {
                      userId: data.id,
                      channelId: data.jid,
                      name: data.name,
                      sex: data.sex,
                      headUrl: (data.photo ? data.photo : ''),
                      groupName: data.groupName
                    }
                    // 获取数量
                    let dbMessage = ipcRenderer.sendSync('SYNC_updateUserSingleProp', dbOption.channelId, dbOption)
                    console.log(dbMessage, dbOption.channelId, '66666666666666666')
                    if (dbMessage.numReplaced && dbMessage.numReplaced > 0) {
                      // 更新会话
                      commit('UPDATE_SESSION_ITEM', {jid: dbOption.channelId, dbOption})
                    }
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            })
        }
        // return new Promise((resolve, reject) => {
        //   resolve()
        // })
      } else {
        // 从群组列表获取会话用户信息
        let groupList = rootState.group.groupList
        // console.log(friendList)
        if (groupList && groupList.length > 0) {
          let group = groupList.find((value, index, arr) => {
            return value.jid === jid
          })
          if (group) {
            sessionObj.name = group.name
            sessionObj.sex = ''
            sessionObj.headUrl = ''
            sessionObj.alias = ''
          }
        } else {
        // 不存在则忽略消息
        }
        return dispatch('insertSession', sessionObj)
      }
    },
    insertSession ({ commit }, sessionObj) {
      return new Promise((resolve, reject) => {
        let reqId = Math.random()
        ipcRenderer.once('insertUserDataReply' + reqId, function (event, dbMessage) {
          console.log(dbMessage.newDoc)
          commit('PUSH_SESSION_LIST', dbMessage.newDoc)
          resolve()
        })
        ipcRenderer.send('insertUserData', reqId, sessionObj)
      })
    },
    // 更新会话
    updateSession ({ commit }, {sessionObj}) {
      let reqId = Math.random()
      ipcRenderer.once('updateUserDataReply' + reqId, function (event, dbMessage) {
        console.log('sessionObj', sessionObj, dbMessage.numReplaced)
        // TODO 替换sessionList中的值
        commit('REPLACE_SESSION_ITEM', sessionObj)
      })
      ipcRenderer.send('updateUserData', reqId, sessionObj)
    },
    // 更新会话
    updateSessionSync ({ commit }, {sessionObj}) {
      let sess = {
        alias: sessionObj.alias,
        atTime: sessionObj.atTime,
        createTime: sessionObj.createTime,
        headUrl: sessionObj.headUrl,
        isAtMe: sessionObj.isAtMe,
        isTip: sessionObj.isTip,
        lastMessage: sessionObj.lastMessage,
        lastName: sessionObj.lastName,
        name: sessionObj.name,
        sex: sessionObj.sex,
        sort: sessionObj.sort,
        top: sessionObj.top,
        unreadMessageCount: sessionObj.unreadMessageCount
      }
      let dbMessage = ipcRenderer.sendSync('SYNC_updateUserSingleProp', sessionObj.channelId, sess)
      console.log(dbMessage, sessionObj.channelId, sessionObj, '66666666666666666')
      if (dbMessage.numReplaced && dbMessage.numReplaced > 0) {
        // 更新会话
        commit('REPLACE_SESSION_ITEM', sessionObj)
      }
    },
    unReadCountReset ({ commit }, sessionId) {
      // 获取数量
      let reqId = Math.random()
      ipcRenderer.once('updateUserSinglePropReply' + reqId, function (event, dbMessage) {
        // console.log(dbMessage.doc)
        commit('UNREADCOUNT_RESET', sessionId)
      })
      ipcRenderer.send('updateUserSingleProp', reqId, sessionId, {unreadMessageCount: 0})
    },
    atMeStatusReset ({ commit }, sessionId) {
      // 获取数量
      let reqId = Math.random()
      ipcRenderer.once('updateUserSinglePropReply' + reqId, function (event, dbMessage) {
        // console.log(dbMessage.doc)
        commit('AT_ME_STATUS_RESET', sessionId)
      })
      ipcRenderer.send('updateUserSingleProp', reqId, sessionId, {isAtMe: 'no'})
    },
    deleteSessionById ({ commit, state }, sessionObj) {
      return new Promise((resolve, reject) => {
        console.log(sessionObj)
        if (!sessionObj) {
          return
        }
        // 获取数量
        let reqId = Math.random()
        ipcRenderer.once('deleteUserDataReply' + reqId, function (event, dbMessage) {
          // console.log(dbMessage.doc)
          commit('DELETE_SESSION_ITEM', sessionObj)
          if (state.sessionList && state.sessionList.length <= 0) {
            commit('SET_CURRENT_CHANNEL_ID', '')
            commit('SET_SELECTED_CHANNEL_BY_JID', '')
          }
          resolve()
        })
        ipcRenderer.send('deleteUserData', reqId, sessionObj._id)
      })
    },
    // 置顶状态设置
    changeTopStatus ({ commit }, sessionObj) {
      if (!sessionObj.top || sessionObj.top === 'no') {
        sessionObj.top = 'top'
      } else {
        sessionObj.top = 'no'
      }
      // 获取数量
      let reqId = Math.random()
      ipcRenderer.once('updateUserSinglePropReply' + reqId, function (event, dbMessage) {
        // console.log(dbMessage.doc)
        commit('REPLACE_SESSION_ITEM', sessionObj)
      })
      ipcRenderer.send('updateUserSingleProp', reqId, sessionObj.jid, {top: sessionObj.top})
    },
    // 消息提醒设置
    changeTipStatus ({ commit }, sessionObj) {
      if (!sessionObj.isTip || sessionObj.isTip === 'no') {
        sessionObj.isTip = 'yes'
      } else {
        sessionObj.isTip = 'no'
      }
      // 获取数量
      let reqId = Math.random()
      ipcRenderer.once('updateUserSinglePropReply' + reqId, function (event, dbMessage) {
        // console.log(dbMessage.doc)
        commit('REPLACE_SESSION_ITEM', sessionObj)
      })
      ipcRenderer.send('updateUserSingleProp', reqId, sessionObj.jid, {isTip: sessionObj.isTip})
    },
    // 重置会话最新消息
    resetSessionLastMessage ({ commit }, jid) {
      // 获取数量
      let reqId = Math.random()
      ipcRenderer.once('updateUserSinglePropReply' + reqId, function (event, dbMessage) {
        // console.log(dbMessage.doc)
        commit('RESET_SESSION_LAST_MESSAGE', jid)
      })
      ipcRenderer.send('updateUserSingleProp', reqId, jid, {lastMessage: ''})
    },
    refreshSessionUserData ({ state, commit, dispatch }, baseInfo) {
      // 循环会话列表
      return dispatch('getAllSession').then(res => {
        // 循环会话列表
        if (state.sessionList && state.sessionList.length > 0 && baseInfo) {
          state.sessionList.forEach(element => {
            if (element.channelType === 'P') {
              // 查询好友列表更新
              if (baseInfo.friendList && baseInfo.friendList.length > 0) {
                let friend = baseInfo.friendList.find(item => {
                  return item.jid === element.jid
                })
                if (friend) {
                  element.name = friend.name
                  element.alias = friend.alias
                  element.headUrl = friend.photo
                  element.sex = friend.sex
                  console.log('查询常用联系人列表更新')
                  dispatch('updateSession', {sessionObj: element})
                }
              }
            } else {
              // 查询群组更新
              if (baseInfo.groupList && baseInfo.groupList.length > 0) {
                let group = baseInfo.groupList.find(item => {
                  return item.jid === element.jid
                })
                if (group) {
                  if (group.name !== element.name) {
                    // 更新数据库  群组只更新名称
                    element.name = group.name
                    dispatch('updateSession', {sessionObj: element})
                  }
                }
              }
            }
          })
        }
      })
    }
  }
}
export default session
