import {
  createXMPPClient,
  loginListenerXMPP,
  logonXMPP,
  updateUserInfoXMPP,
  getUserInfoXMPP,
  systemNoticeListenerXMPP,
  loginAbnormalListenerXMPP
} from '../../xmpp/index'
import {
  filterUserInfo,
  filterFriendInfo,
  filterUserBaseInfo,
  friendStatusListenerXMPP
  // getFriendList,
} from '../../xmpp/services/friend'
import {
  addFriendRequest,
  setFriendAliasRequest,
  getOfflineMessage,
  // searchFriendRequest,
  getFriendListRequest,
  getMemberInfoRequest
} from '../../api/home'
import {
  loginRequest,
  updateUserInfoRequest,
  logonRequest,
  forgetPasswordRequest,
  saveSessionRecordRequest,
  uploadUserPhotoRequest
} from '../../api/user'
import {
  getMemberOnlineStatusRequest,
  deleteFriendRequest
} from '../../api/friends'
import {
  getSystemNoticeRequest
} from '../../api/notice'
import {
	closeDb
} from '@/db/messagge'
import LocalDb from '../../db/index.js'
// import mockData from '../../views/login/mock'
import X2js from 'xml2js'
var moment = require('../../common/moment.js');
const home = {
  state: {
    // 好友请求列表
    // friendRequestList: [],
    groupOffLineMessage: [],
    // 好友列表
    friendList: [],
    searchFriendList: [],
    // 用户信息
    userInfo: {},
    // 右键菜单开关
    rightKeyMenu: false,
    // 当前tab页面
    activeTab: 'message',
    // 本地缓存成员数据
    localMemberData: [],
    xmppDomain: '@192.168.1.110',
    xmppGroupDomain: '@conference.192.168.1.110',
    // 系统公告
    systemNotice: {},
    // 默认开启自动登录，需配合local中的autoLoginFlag
    isAutoLogin: true,
    // 顶层机构树code
    groupRootCode: '',
    // 关闭selectList
    selectFlag: false,
    // 系统信息
    systemInfo: {},
    // 登录XMPP的信息
    xmppLoginInfo:{},
    // REST登录是否成功
    isLoginSuccess: 'no',
    // 当前操作好友
    activeMember: {}
  },
  mutations: {
    SET_STICK_FRIEND: (state, data) => {
      let index = state.friendList.findIndex(item => {
        return item.jid === data.jid
      })
      state.friendList.splice(index, 1, data)
    },
    CANCEL_STICK_FRIEND: (state, data) => {
      let index = state.friendList.findIndex(item => {
        return item.jid === data.jid
      })
      state.friendList.splice(index, 1, data)
    },
    SET_ACTIVE_MEMBER:(state, data) => {
      state.activeMember = JSON.parse(JSON.stringify(data))
    },
    SET_IS_LOGIN_SUCCESS: (state, data) => {
      state.isLoginSuccess = data
    },
    SET_XMPP_LOGIN_INFO: (state, data) => {
      state.xmppLoginInfo = data
    },
    // TODO:设置系统信息
    SET_SYSTEM_INFO: (state, data) => {
      state.systemInfo = data
    },
    SET_SELECTLIST_STATUS: (state, val) => {
      state.selectFlag = val
    },
    ADD_LOCALMEMBER: (state, member) => {
      if (state.localMemberData.some(item => {
        return item.jid === member.jid
      })) {
        return
      }
      state.localMemberData.push(member)
    },
    SET_XMPPDOMAIN: (state, domain) => {
      state.xmppDomain = domain
      state.xmppGroupDomain = `@conference.${domain.split('@')[1]}`
    },
    SET_ACTIVETAB: (state, tab) => {
      state.activeTab = tab
    },
    SET_USERINFO: (state, user) => {
      state.userInfo = user
      state.groupRootCode = user.groupRootCode
    },
    // 更新用户信息
    UPDATE_USER_INFO: (state, user) => {
      state.userInfo.name = user.name
      state.userInfo.photo = user.photo
      state.userInfo.sex = user.sex
    },
    SET_RIGHTKEYMENU: (state, status) => {
      state.rightKeyMenu = status
    },
    SET_FRIENDLIST: (state, data) => {
      state.friendList = data
    },
    SET_SEARCHFRIENDLIST: (state, data) => {
      // const result = []
      // data.forEach(item => {
      //   state.friendList.forEach(i => {
      //     if (item.friendJid === i.friendJid) {
      //       result.push(i)
      //     }
      //   })
      // })
      const result = state.friendList.filter(item => {
        return item.jid.split('@')[0].indexOf(data) !== -1 || item.alias.indexOf(data) !== -1 || item.name.indexOf(data) !== -1
      })
      state.searchFriendList = result
    },
    CLEAR_SEARCHFRIENDLIST: (state, data) => {
      state.searchFriendList = []
    },
    UPDATE_FRIENDINFO: (state, data) => {
      state.friendList.forEach(item => {
        if (item.jid === data.friendJid) {
          item.alias = data.alias
          item.friendJid = data.friendJid
          item.id = data.id
          item.username = data.username
        }
      })
    },
    // 更新成员信息
    UPDATE_MEMBER_INFO: (state, data) => {
      console.log(`更新成员信息!${JSON.stringify(data)}`)
      let index = state.friendList.findIndex(item => { return item.jid === data.jid })
      if (index > -1) {
        console.log('嘿嘿嘿嘿')
        state.friendList.splice(index, 1, {
          ...state.friendList[index],
          name: data.name,
          sex: data.sex,
          photo: data.photo
        })
      }
      // state.friendList.forEach(item => {
      //   if (item.jid === data.jid) {
      //     console.log(`更新成员信息!${JSON.stringify(data)}`)
      //     item.name = data.name
      //     item.sex = data.sex
      //     item.photo = data.photo
      //   }
      // })
    },
    // 更新本地数据 => 删除好友
    DELETE_FRIEND: (state, jid) => {
      for (let i = 0, len = state.friendList.length; i < len; i++) {
        if (state.friendList[i].jid === jid) {
          console.log(`删除好友:${jid}`)
          state.friendList.splice(i, 1)
          break
        }
      }
      let list = uni.getStorageSync('stickFriendList')
      if (list) {
        let index = list.findIndex(item => {
          return item === jid
        })
        if (index > -1) {
          list.splice(index, 1)
          uni.setStorageSync('stickFriendList', list)
        }
      }
    },
    // 更新本地数据 => 添加好友
    ADD_FRIEND: (state, data) => {
      if (!state.friendList.some(item => { return item.friendJid === data.friendJid })) {
        console.log(`添加好友成功=${JSON.stringify(data)}`)
        state.friendList.unshift(data)
      }
    },
    // 设置系统公告
    SET_SYSTEM_NOTICE: (state, data) => {
      // let time = moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
			// console.log('获取公告时间=================='+JSON.stringify(time))
			// data.createTime = time;
			// console.log('获取公告时间=================='+JSON.stringify(data))
      state.systemNotice = {...data}
    },
    // 设置好友在线状态
    SET_MEMBER_STATUS: (state, data) => {
      let status = 'offline'
      let jid = ''
      let result = {}
      X2js.parseString(data, function (err, res) {
        result = res
      })
      if (result.presence.status && result.presence.status[0] === 'Unavailable') {
        jid = result.presence.$.from
      } else {
        status = 'online'
        jid = result.presence.$.from.split('/')[0]
      }
      console.log(`好友状态:${jid}`)
      for (let i = 0, len = state.friendList.length; i < len; i++) {
        // console.log(state.friendList[i].jid )
        if (state.friendList[i].jid === jid) {
          state.friendList[i].status = status
          let member = {
            ...state.friendList[i]
          }
          if (status === 'online') {
            // console.log(`好友在线:${jid}`)
            state.friendList.splice(i, 1)
            state.friendList.unshift(member)
          } else {
            // console.log(`好友不在线:${jid}`)
            state.friendList.splice(i, 1)
            state.friendList.push(member)
          }
          break
        }
      }
    },
    // 更新好友在线状态
    UPDATE_MEMBER_STATUS: (state, data) => {
      for (let i = 0, len = state.friendList.length; i < len; i++) {
        if (state.friendList[i].jid === data.jid) {
          let member = {
            ...state.friendList[i]
          }
          if (data.status === 'online') {
            console.log(`${data.jid}上线啦`)
            member.status = 'online'
            state.friendList.splice(i, 1)
            state.friendList.unshift(member)
          } else {
            console.log(`${data.jid}下线啦`)
            // console.log(JSON.stringify(state.friendList))
            member.status = 'offline'
            // 只有一个好友，将其状态改为下线即可
            if (state.friendList.length === 1) {
              state.friendList[0].status = 'offline'
              return
            }
            state.friendList.splice(i, 1)
            // 所有好友都在线，将其添加至队列末尾即可
            if (state.friendList.findIndex(item => { return item.status === 'offline' }) === -1) {
              state.friendList.push(member)
              return
            }
            // 将其插入到队列中第一个不在线的好友之前
            for (let i = 0, len = state.friendList.length; i < len; i++) {
              if (state.friendList[i].status === 'offline') {
                state.friendList.splice(i, 0, member)
                break
              }
            }
          }
          break
        }
      }
    },
    // TODO:用户信息更改后，更新本地数据
    UPDATE_LOCAL_OWNER: (state, data) => {
      state.localMemberData.forEach((item, index) => {
        if (item.jid === data.jid) {
          state.localMemberData.splice(index, 1, data)
        }
      })
    },
    // 更新本地数据
    UPDATE_LOCAL_MEMBER_DATA: (state, data) => {
      if (data.type === 'deleteFriend') {
        state.localMemberData.forEach(item => {
          if (item.jid === data.jid) {
            item.friendJid = ''
          }
        })
        return
      }
      state.localMemberData.forEach(item => {
        if (item.jid === data.jid) {
          item.friendJid = data.jid
        }
      })
    },
    // TODO:退出登录，初始化本地数据
    INIT_LOCAL_MEMBER_DATA: (state, data) => {
      state.localMemberData = []
    }
  },
  actions: {
    // 登录异常（被挤下线）
    LoginAbnormalListener () {
      return new Promise((resolve, reject) => {
        loginAbnormalListenerXMPP(response => {
          resolve()
        })
      })
    },
    // 忘记密码
    ForgetPassword ({commit}, username) {
      return new Promise((resolve, reject) => {
        forgetPasswordRequest(username)
          .then(response => {
            resolve(response)
          })
          .catch(err => reject(err))
      })
    },
    GetOfflineMessage ({commit}, param) {
      return new Promise((resolve, reject) => {
        getOfflineMessage(param)
          .then(response => {
            resolve(response)
          })
          .catch(err => reject(err))
      })
    },
    // 用户登录
    Login ({dispatch, commit, state}, data) {
      commit('INIT_LOCAL_MEMBER_DATA')
      return new Promise((resolve, reject) => {
        loginRequest(data.loginData)
          .then(response => {
						// console.log(`response-:${JSON.stringify(response)}`)
            // TODO:登录失败效验
            if (response.code !== 0) return reject(response)
            const xmppDomain = `@${response.data.config.xmppDomain}`
            const baseinfo = filterUserBaseInfo(response, xmppDomain)
            console.log(baseinfo)
            dispatch('SetLoalMemberData', baseinfo)
            commit('SET_XMPPDOMAIN', xmppDomain)
            commit('SET_USERINFO', baseinfo.userInfo)
            commit('SET_FRIENDLIST', baseinfo.friendList)
            commit('SET_GROUP_LIST', baseinfo.groupList)
            // 初始化本地数据库
            let localDb = LocalDb.getInstance()
            localDb.initDb(baseinfo.userInfo.id).then(() => {
              console.log('数据库加载完成了')

							dispatch('refreshSessionUserData', baseinfo, {root: true})
              // 接收群组离线消息
              dispatch('getOfflineGroupMessage', baseinfo).then(() => {
                // XMPP服务登录
                //  createXMPPClient(data.xmpp)
                commit('SET_IS_LOGIN_SUCCESS','yes')
              })
            })
            // commit('SET_IS_LOGIN_SUCCESS','yes')

            uni.setStorageSync('currentUser', JSON.stringify(baseinfo.userInfo))
            // 获取好友在线状态
            baseinfo.friendList.forEach(item => {
              dispatch('GetMemberOnlineStatus', item)
            })
            resolve(response)
          })
          .catch(err => {
            console.log(JSON.stringify(err))
            reject(err)
          })
      })
    },
    // 获取好友信息
    GetMemberInfo ({dispatch, commit, state}, account) {
      return new Promise((resolve, reject) => {
        getMemberInfoRequest(account)
          .then(response => {
            let member = {
              id: response.id,
              name: response.name,
              sex: response.sex,
              photo: response.photo,
              jid: `${response.username}${state.xmppDomain}`,
              groupCode: response.groupCode,
              groupName: response.groupName
            }
            // commit('ADD_LOCALMEMBER', member)
            commit('UPDATE_MEMBER_INFO', member)
            commit('UPDATE_GROUP_INFO_BY_JID', member)
            dispatch('getSessionByJid', { jid: `${response.username}${state.xmppDomain}` })
              .then(channel => {
                if (channel.length) {
				          let session = JSON.parse(JSON.stringify(channel[0]))
                  session.name = member.name
                  session.sex = member.sex
                  session.headUrl = member.photo
                  dispatch('updateSession', { sessionObj: session })
                }
              })
            resolve(member)
          })
          .catch(err => { console.log(err) })
      })
    },
    getOfflineGroupMessage ({commit, dispatch}, baseinfo) {
      console.log('准备解析群离线消息', baseinfo)
      return new Promise((resolve, reject) => {
        if (baseinfo && baseinfo.groupList && baseinfo.groupList.length > 0) {
          let groupList = baseinfo.groupList
          // 开始循环群组
          groupList.forEach(item => {
						// console.log('groupList====' + JSON.stringify(item))
            // 数据库查找
            dispatch('searchMessageByChannelId', item.jid, {root: true}).then(resp => {
              let searchTime = 0
              if (resp && resp.length > 0) {
                searchTime = resp[0].createTime
              }
              let paramData = {
                username: baseinfo.userInfo.account,
                roomJid: item.jid,
								timestamp: searchTime
              }
              // console.log('this.paramData===========================' +  JSON.stringify(paramData))
              getOfflineMessage(paramData).then(data => {
                // console.log('this.paramData2===========================' + JSON.stringify(data))
                let messageList = data
                if (messageList && messageList.length > 0) {
                  console.log('开始解析群离线消息', messageList)
                  messageList.forEach(element => {
                    // 解析消息后进行收消息操作
                    if (element.stanza) {
                      let jsonMessage = ''
											X2js.parseString(element.stanza, function (err, res) {
											  jsonMessage = res
											})
                      console.log(JSON.stringify(jsonMessage))
                      if (jsonMessage && jsonMessage.message) {
                        jsonMessage = jsonMessage.message
                        // 处理消息逻辑
                        let from = jsonMessage.$.from

                        const sender = from.split('/')[1]
                        from = from.split('/')[0]
												
												let userAccount = baseinfo.userInfo.account
                        const body = jsonMessage.body
                        // 如果发送人和接收人相同则拒收
												if (userAccount === sender) return
                        if ((userAccount + '-APP') === sender) return
                        // 如果消息为空则拒收
                        if (body && body.toString()) {
                          const type = 'G'
                          let retObj = {sender, from, type}
                          let delay = (jsonMessage.synto ? jsonMessage.synto[0].timestamp[0] : null)
                          if (delay && delay.toString()) {
                            retObj.delay = parseInt(delay.toString())
                          }
                          let messageType = (body[0].$ ? body[0].$.messageType : null )
                          // 处理群其他消息，不存在则是普通消息
                          if (messageType) {
														const message = JSON.stringify(body[0]._)
														retObj.message = message
														console.log('存在messageType' + messageType)
                            retObj.messageType = messageType
                            dispatch('receiveGroupOtherMessage', retObj, {root: true})
                          } else {
														console.log('不存在messageType')
                            const fileType = (body[0].$ ? body[0].$.fileType : null )
                            if (fileType) {
															const message = body[0]._
															retObj.message = message
                              retObj.fileType = fileType
                            }else{
															let message = body[0]._
															if(!message){
																message = body[0]
															}
															retObj.message = message
														}

                            // console.log(retObj)
                            dispatch('receiveMessage', retObj, {root: true})
                          }
                        }
                      }
                    }
                  })
                }
              })
            })
          })
        }
        resolve()
      })
    },
    SetLoalMemberData ({commit}, data) {
      console.log(data)
      commit('ADD_LOCALMEMBER', data.userInfo)
      data.friendList.forEach(item => {
        commit('ADD_LOCALMEMBER', item)
      })
      // data.groupList.forEach(item => {
      //   item.members.forEach(i => {
      //     commit('ADD_LOCALMEMBER', i)
      //   })
      // })
    },
    // 获取用户在线状态（好友）
    GetMemberOnlineStatus ({commit}, member) {
      console.log(`member.jid:${member.jid}`)
      return new Promise((resolve, reject) => {
        getMemberOnlineStatusRequest({
          jid: member.jid,
          type: 'xml'
        })
          .then(response => {
            commit('SET_MEMBER_STATUS', response)
          })
          .catch(err => reject(err))
      })
    },
    // 获取最新系统公告
    GetSystemNotice ({commit}) {
      let id = ''
      let localStorageNotice = {}
      if (uni.getStorageSync('system-notice') && uni.getStorageSync('system-notice') !== 'null') {
        // console.log("uni.getStorageSync('system-notice')=================================="+uni.getStorageSync('system-notice'))
        localStorageNotice = JSON.parse(uni.getStorageSync('system-notice'))
        id = localStorageNotice.id
      }
      return new Promise((resolve, reject) => {
        getSystemNoticeRequest()
          .then(response => {
						// console.log('获取系统公告==================================' + JSON.stringify(response))
            if (!response || response.length <= 0) return
						response.forEach(item => {
						  item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
						})
            setTimeout(() => {
              commit('SET_SYSTEM_NOTICE', response[0])
            }, 2000)
						resolve(response)
          })
          .catch(() => {
						resolve([])
          })
      })
    },
    // 监听系统公告
    SystemNoticeListener ({commit}) {
      systemNoticeListenerXMPP(response => {
        let result = {}
        X2js.parseString(response.toString(), function (err, res) {
          result = res
        })
        console.log(`辣辣：${JSON.stringify(result)}`)
        if (uni.getStorageSync('system-notice')) {
          let notice = JSON.parse(uni.getStorageSync('system-notice'))
          let noticeRemind = uni.getStorageSync('global_sys_message_tip_type')
          // 新公告提醒
          if (notice.id !== result.id && (!noticeRemind || noticeRemind === 'true')) {
            // 播放声音
						let data = {
							type:'message',
							value:true
						}
            commit('SET_IS_PLAY_AUDIO', data)
            // 图标闪烁
            // ipcRenderer.send('trayFlicker')
          }
        }
				console.log('SET_SYSTEM_NOTICE========================'+JSON.stringify(result))
        commit('SET_SYSTEM_NOTICE', JSON.parse(result.message.body[0]))
      })
    },
    // 监听好友上线/下线
    FriendStatusListener ({commit, rootState}) {
      friendStatusListenerXMPP(response => {
        let result = {}
        X2js.parseString(response, function (err, res) {
          result = res
        })
        commit('UPDATE_MEMBER_STATUS', {
          jid: result.presence.$.from,
          status: Object.prototype.toString.call(result.presence.oline) === '[object Array]' ? 'online' : 'offline'
        })
        // 实时更新机构成员状态
        // commit('UPDATE_NODE_MEMBER_STATUS', {
        //   jid: result.presence.$.from,
        //   status: Object.prototype.toString.call(result.presence.oline) === '[object Array]' ? 'online' : 'offline',
        //   xmppDomain: rootState.home.xmppDomain
        // })
      })
    },
    // 是否将会话记录保存至服务端
    SaveSessionRecordToService ({commit}, data) {
      return new Promise((resolve, reject) => {
        saveSessionRecordRequest(data)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => reject(err))
      })
    },
    // 监听用户登录
    LoginListener ({commit}, callback) {
      return new Promise((resolve, reject) => {
        loginListenerXMPP(callback)
      })
    },
    // 获取用户信息
    GetUserInfo ({commit}, username) {
      return new Promise((resolve, reject) => {
        getUserInfoXMPP(username, (response) => {
          const data = filterUserInfo(response)
          console.log('获取用户信息成功', data)
          commit('ADD_LOCALMEMBER', data)
          commit('UPDATE_USER_INFO', data)
          commit('UPDATE_GROUP_INFO_BY_JID', data)
          resolve()
        })
      })
    },
    // 更新用户信息
    UpdateUserInfo ({dispatch, commit, rootState}, data) {
      return new Promise((resolve, reject) => {
        // TODO:更新rest服务器用户信息
        updateUserInfoRequest({
          id: rootState.home.userInfo.id,
          sex: data.sex,
          name: data.name
        })
          .then(() => {
            // 更新openfire用户信息
            updateUserInfoXMPP(data)
            dispatch('GetUserInfo', rootState.home.userInfo.jid)
              .then(() => {
                resolve()
              })
          })
      })
    },
    // 退出登录
    Logon ({commit, state}, type) {
      uni.setStorageSync('isAutoLogin', 'no')
      return new Promise((resolve, reject) => {
        const account = uni.getStorageSync('account')
        logonRequest({
          id: account.id,
          username: account.username,
          terminal: 'Syntoim-Android'
        })
          .then(() => {
            if (uni.getStorageSync('sessionID')) uni.removeStorageSync('sessionID')
            logonXMPP()
            commit('INIT_LOCAL_MEMBER_DATA')
            commit('SET_IS_LOGIN_SUCCESS', 'no')
            // 关闭数据库
            closeDb()
            resolve()
          })
          .catch(err => {
            logonXMPP()
            commit('INIT_LOCAL_MEMBER_DATA')
            commit('SET_IS_LOGIN_SUCCESS', 'no')
            reject(err)
          })
      })
    },
    // 添加好友
    AddFriend ({dispatch, commit}, data) {
      return new Promise((resolve, reject) => {
        addFriendRequest(data)
          .then(response => {
            if (response.friendJid) {
              // commit('UPDATE_TREE_DATA', {
              //   jid: response.friendJid,
              //   type: 'addFriend'
              // })
              commit('UPDATE_LOCAL_MEMBER_DATA', {
                jid: response.friendJid,
                type: 'addFriend'
              })
              // 获取好友在线状态
              dispatch('GetMemberOnlineStatus', {jid: response.friendJid})
              resolve(response)
            } else {
              reject(response)
            }
          })
          .catch(err => console.log(err))
      })
    },
    // 删除好友
    DeleteFriend ({dispatch, commit}, data) {
      return new Promise((resolve, reject) => {
        deleteFriendRequest(data)
          .then(response => {
            // TODO:更新组织树
            // commit('UPDATE_TREE_DATA', {
            //   jid: data.friendname,
            //   type: 'deleteFriend'
            // })
            commit('UPDATE_LOCAL_MEMBER_DATA', {
              jid: data.friendname,
              type: 'deleteFriend'
            })
            // commit('up')
            // TODO:删除对应会话和数据
            dispatch('getSessionByJid', {jid: data.friendname})
              .then(channel => {
                if (!channel.length) return
                // console.log(`删除会话数据:${JSON.stringify(channel)}`)
                dispatch('deleteSessionById', channel[0].id)
                  .then(() => {
                    dispatch('removeMessageByDbSessionId', channel[0].channelId)
                  })
              })
            resolve(response)
          })
          .catch(err => reject(err))
      })
    },
    // 设置备注
    SetFriendAlias ({state, dispatch, commit}, data) {
      return new Promise((resolve, reject) => {
        console.log(`data:${JSON.stringify(data)}`)
        setFriendAliasRequest(data)
          .then(response => {
            console.log(`response:${JSON.stringify(response)}`)
            data.username = state.userInfo.jid.split('@')[0]
            // TODO:更新本地好友别名
            commit('UPDATE_FRIENDINFO', data)
            // TODO:更新会话
            dispatch('getSessionByJid', {jid: data.friendJid}, {root: true})
              .then(res => {
                if (!res.length) return
                let channel = res[0]
                channel.alias = data.alias
                // console.log(`更新会话:${JSON.stringify(channel)}`)
                dispatch('updateSession', {sessionObj: channel}, {root: true})
                  .then(data => {
                    commit('SET_CURRENT_CHANNEL', {
                      ...channel
                    })
                  })
              })
            resolve(response.data)
          })
          .catch(err => reject(err))
      })
    },
    // 获取好友列表
    GetFriendList ({ dispatch, commit }, { username, friendJid }) {
      return new Promise((resolve, reject) => {
        getFriendListRequest(username)
          .then(response => {
            // console.log(`好友列表:${JSON.stringify(response)}`)
            console.log(`friendJid:${friendJid}`)
            response.forEach(item => {
              if (item.friendJid === friendJid) return resolve(item)
            })
            // commit('SET_FRIENDLIST', response.data)
            // dispatch('MatchLocalMeberToFriend', response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
		conntXMPPServer ({ commit }, userInfo) {
		  return new Promise((resolve, reject) => {
		     createXMPPClient(userInfo)
		  })
		},
    // 上传用户头像
    UploadUserPhoto () {
      uploadUserPhotoRequest()
    }
    // 搜索好友
    // SearchFriend ({ commit }, data) {
    //   return new Promise((resolve, reject) => {
    //     searchFriendRequest(data)
    //       .then(response => {
    //         commit('SET_SEARCHFRIENDLIST', response.data)
    //         resolve()
    //       })
    //       .catch(err => reject(err))
    //   })
    // },
    // 匹配本地成员数据
    // MatchLocalMeberToFriend ({ dispatch, commit, state, rootState }, data) {
    //   data.forEach(item => {
    //     state.localMemberData.forEach(i => {
    //       if (item.friendJid === i.jid) {
    //         commit('SET_FRIENDINFO', i)
    //       }
    //     })
    //   })
    //   // console.log(state.friendList)
    //   // 逐一获取好友信息
    //   state.friendList.forEach(item => {
    //     if (!item.photo) dispatch('GetMemberInfo', item.friendJid)
    //   })
    // },
  }
}
export default home
