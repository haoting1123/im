import {
  getMemberInfoXMPP
} from '../../xmpp/index'
import {
  filterFriendInfo
} from '../../xmpp/services/friend'
import {
	getSessionByChannelId,
	insertSession,
	getAllSessionDb,
	getSessionById,
	deleteSessionById,
	deleteSessionBychannelId,
	deleteAllSession,
	updateSession,
	resetSessionLastMessageDb
 }  from '@/db/session'
import { convertFriendlyTime } from '../../common/util.js'

const session = {
  state: {
    sessionList: [],
    selectedChannel: ''
  },
  mutations: {
		RESET_SESSION_LAST_MESSAGE: (state, jid) => {
      let obj = state.sessionList.find(item => {
        return item.jid === jid
      })
      if (obj) {
        obj.lastMessage = ''
      }
    },
    SET_SESSION_LIST: (state, data) => {
      state.sessionList = data
    },
    SET_SELECTEDCHANNEL: (state, data) => {
      state.selectedChannel = data
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
		FILTER_SESSION_LIST_BY_KEY: (state, data)=> {
			let reg = new RegExp(data)
			state.sessionList = state.sessionList.filter(element => {
				let alias = reg.test(element.alias)
				if(!alias){
					alias = reg.test(element.name)
				}
				return alias
			})
		},
    // 替换数组对象
    REPLACE_SESSION_ITEM: (state, data) => {
      let sess = state.sessionList.find(item => {
        return item.id === data.id
      })
      if (sess) {
        sess.alias = data.alias
				sess.groupName = data.groupName
        sess.atTime = data.atTime
        sess.createTime = data.createTime
				sess.createTimeStr = data.createTimeStr
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
    },
    UNREADCOUNT_RESET: (state, sessionId) => {
       let sess = state.sessionList.find(item => {
        return item.id === sessionId
	  })
	  if (sess) {
		sess.unreadMessageCount = 0
	  }
    },
    AT_ME_STATUS_RESET: (state, sessionId) => {
      let sess = state.sessionList.find(item => {
        return item.id === sessionId
      })
      if (sess) {
        sess.isAtMe = 'no'
      }
    },
		LAST_MESSAGE_RESET: (state, sessionId) => {
		  let sess = state.sessionList.find(item => {
		    return item.id === sessionId
		  })
		  if (sess) {
		    sess.lastMessage = ''
		  }
		},
    DELETE_SESSION_ITEM: (state, sessionId) => {
      let index = state.sessionList.findIndex(item => item.id === sessionId)
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
        obj.groupName = dbOption.groupName
        // state.sessionList.splice(index, 1, obj)
      }
    }
  },
  actions: {
    getAllSession ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        // 获取当前会话列表
				getAllSessionDb().then(docs => {
					let retMessageList = docs
					if(retMessageList && retMessageList.length > 0){
						retMessageList.forEach(item => {
							item.createTimeStr = convertFriendlyTime(item.createTime)
						})
					}
          // console.log(JSON.stringify(docs))
					commit('SET_SESSION_LIST', retMessageList)
					resolve(retMessageList)
				})
      })
    },
    // 获取会话根据JID，从数据库
    getSessionByJid ({ commit }, {jid}) {
      return new Promise((resolve, reject) => {
				getSessionByChannelId(jid).then(data => {
				  console.log(`session:${JSON.stringify(data)}`)
					resolve(data)
				})
      })
    },
    // 新建会话
    addNewSession ({ dispatch, commit, rootState }, {jid, lastMessage, createTime, unreadMessageCount = 0, channelType, lastName = '', alias = '', isAtMe = 'no', atTime, userId = ''}) {
      let sessionObj = {
        userId: userId,
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
            sessionObj.userId = friend.id
            sessionObj.name = friend.name
						sessionObj.groupName = friend.groupName
            sessionObj.headUrl = friend.photo
            sessionObj.sex = friend.sex
            sessionObj.alias = friend.alias
            return dispatch('insertSession', sessionObj)
          }
        }
        // 好友列表中不存在
        if (!friend) {
          return new Promise((resolve, reject) => {
            dispatch('insertSession', sessionObj)
              .then(() => {
                // TODO 不存在则查询好友的Vcard
                dispatch('GetMemberInfo', jid.split('@')[0])
                  .then(data => {
                    if (data) {
                      console.log(`data:${JSON.stringify(data)}`)
                      let dbOption = {
                        userId: data.id,
                        channelId: data.jid,
                        name: data.name,
                        sex: data.sex,
                        headUrl: (data.photo ? data.photo : ''),
                        groupName: data.groupName
                      }
                      getSessionByChannelId(data.jid).then(sessResp => {
                        if(sessResp && sessResp.length > 0){
                          updateSession(sessResp[0].id, dbOption).then(data2 => {
                            console.log(`会话数据更新成功!${JSON.stringify(dbOption)}`)
                            commit('UPDATE_SESSION_ITEM', {jid: dbOption.channelId, dbOption})
                            resolve(sessResp[0])
                          })
                        }
                      })
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
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
					let randId = Math.floor(Math.random () * 900) + 100
					sessionObj.id =  new Date().getTime() + '' + randId
					sessionObj.createTimeStr = convertFriendlyTime(sessionObj.createTime)
					commit('PUSH_SESSION_LIST', sessionObj)
          insertSession(sessionObj).then(data => {
            console.log('插入会话成功了：：'+JSON.stringify(data))
            // if(data && data.id){
              console.log(data)
              resolve(data)
            // }
					})

      })
    },
    // 更新会话
    updateSession ({ commit }, {sessionObj}) {
      return new Promise((resolve, reject) => {
        // console.log(`开始更新session:${JSON.stringify(sessionObj)}`)
        updateSession(sessionObj.id, sessionObj).then(data => {
					sessionObj.createTimeStr = convertFriendlyTime(sessionObj.createTime)
          commit('REPLACE_SESSION_ITEM', sessionObj)
          resolve(data)
        })
      })
    },
    unReadCountReset ({ commit }, sessionId) {
        let sess = {
          unreadMessageCount: 0
        }
        updateSession(sessionId, sess).then(data => {
          commit('UNREADCOUNT_RESET', sessionId)
        })
    },
    atMeStatusReset ({ commit }, sessionId) {
        let sess = {
          isAtMe: 'no'
        }
        updateSession(sessionId, sess).then(data => {
          commit('AT_ME_STATUS_RESET', sessionId)
        })
    },
		lastMessageReset ({ commit }, sessionId) {
		    let sess = {
		      lastMessage: ''
		    }
		    updateSession(sessionId, sess).then(data => {
		      commit('LAST_MESSAGE_RESET', sessionId)
		    })
		},
    deleteSessionById ({ commit, state }, sessionId) {
      return new Promise((resolve, reject) => {
        console.log(`删除会话:${sessionId}`)
        if (!sessionId) {
          resolve()
          return
        }
        deleteSessionById(sessionId).then(data => {
          console.log('删除会话')
          commit('DELETE_SESSION_ITEM', sessionId)
          if (state.sessionList && state.sessionList.length <= 0) {
            commit('SET_CURRENT_CHANNEL_ID', '')
            commit('SET_SELECTED_CHANNEL_BY_JID', '')
          }
          resolve()
        })
      })
    },
    // 置顶状态设置
    changeTopStatus ({ commit }, sessionObj) {
      let sess = {}
      if (!sessionObj.top || sessionObj.top === 'no') {
        sess.top = 'top'
        sessionObj.top = 'top'
      } else {
        sess.top = 'no'
        sessionObj.top = 'no'
      }
      updateSession(sessionObj.id, sess).then(data => {
        commit('REPLACE_SESSION_ITEM', sessionObj)
      })
    },
    // 消息提醒设置
    changeTipStatus ({ commit }, sessionObj) {
      console.log(`sessionObj:${JSON.stringify(sessionObj)}`)
      let sess = {}
      if (!sessionObj.isTip || sessionObj.isTip === 'no') {
        sessionObj.isTip = 'yes'
        sess.isTip = 'yes'
      } else {
        sessionObj.isTip = 'no'
        sess.isTip = 'no'
      }
      updateSession(sessionObj.id, sess).then(data => {
        commit('REPLACE_SESSION_ITEM', sessionObj)
        commit('SET_CURRENT_CHANNEL', { ...sessionObj })
      })
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
									element.groupName = friend.groupName
                  element.alias = friend.alias
                  element.headUrl = friend.photo
                  element.sex = friend.sex
                  console.log('查询好友列表更新')
                  dispatch('updateSession', {sessionObj: element})
                }
              }
            } else {
							// console.log('我要更新群组了')
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
    },
		// 重置会话最新消息
    resetSessionLastMessage ({ commit }, jid) {
      resetSessionLastMessageDb(jid).then(data => {
				commit('RESET_SESSION_LAST_MESSAGE', jid)
			})
    },
  }
}
export default session
