import {
  createXMPPClient,
  loginListenerXMPP,
  logonXMPP,
  updateUserInfoXMPP,
  getUserInfoXMPP,
  systemNoticeListenerXMPP,
  loginAbnormalListenerXMPP
  // getMemberInfoXMPP,
} from '../../xmpp/index'
import {
  filterUserInfo,
  filterUserBaseInfo,
  friendStatusListenerXMPP
  // filterFriendInfo,
  // getFriendList,
} from '../../xmpp/services/friend'
import {
  loginRequest,
  addFriendRequest,
  deleteFriendRequest,
  setFriendAliasRequest,
  getSystemNoticeRequest,
  getOfflineMessage,
  getMemberInfoRequest
  // getFriendListRequest,
  // searchFriendRequest,
} from '../../api/home'
import {
  updateUserInfoRequest,
  logonRequest,
  forgetPasswordRequest,
  saveSessionRecordRequest
} from '../../api/user'
import {
  getMemberOnlineStatusRequest
} from '../../api/friends'
// import mockData from '../../views/login/mock'
import { ipcRenderer } from 'electron'
import X2js from 'x2js'
import moment from 'moment'

const home = {
  state: {
    // 好友请求列表
    // friendRequestList: [],
    groupOffLineMessage: [],
    // 好友列表
    friendList: [],
    // 当前操作成员信息
    activeMember: [],
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
    // 系统公告列表
    systemNoticeList: [],
    // 默认开启自动登录，需配合local中的autoLoginFlag
    isAutoLogin: true,
    // 顶层机构树code
    groupRootCode: '',
    groupCode: '',
    // 关闭selectList
    selectFlag: false
  },
  mutations: {
    SET_ACTIVE_MEMBER: (state, data) => {
      state.activeMember = JSON.parse(JSON.stringify(data))
    },
    SET_SELECTLIST_STATUS: (state, val) => {
      state.selectFlag = val
    },
    // 新版本将替换为独立的接口 => reset
    ADD_LOCALMEMBER: (state, member) => {
      let index = state.localMemberData.findIndex(item => { return item.jid === member.jid })
      if (index > -1) {
        state.localMemberData.splice(index, 1, {
          ...state.localMemberData[index],
          name: member.name,
          sex: member.sex,
          photo: member.photo
        })
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
      console.log(`当前登录用户信息：${JSON.stringify(user)}`)
      state.userInfo = user
      state.groupCode = user.groupCode
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
      const result = state.friendList.filter(item => {
        return item.jid.split('@')[0].indexOf(data) !== -1 || item.alias.indexOf(data) !== -1 || item.name.indexOf(data) !== -1
      })
      state.searchFriendList = result
    },
    CLEAR_SEARCHFRIENDLIST: (state, data) => {
      state.searchFriendList = []
    },
    // 更新成员信息
    UPDATE_MEMBER_INFO: (state, data) => {
      state.friendList.forEach(item => {
        if (item.jid === data.jid) {
          item.name = data.name
          item.photo = data.photo
          item.sex = data.sex
        }
      })
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
    // 更新本地数据 => 删除好友
    DELETE_FRIEND: (state, jid) => {
      for (let i = 0, len = state.friendList.length; i < len; i++) {
        if (state.friendList[i].jid === jid) {
          state.friendList.splice(i, 1)
          break
        }
      }
    },
    // 更新本地数据 => 添加好友
    ADD_FRIEND: (state, data) => {
      if (!state.friendList.some(item => { return item.friendJid === data.friendJid })) {
        state.friendList.unshift(data)
      }
    },
    // 设置系统公告
    SET_SYSTEM_NOTICE: (state, data) => {
      console.log(`当前弹出公告:${JSON.stringify(data)}`)
      state.systemNotice = {...data}
      if (data && data.createTime) {
        state.systemNotice.createTime = data.createTime ? moment(data.createTime).format('YYYY-MM-DD HH:mm:ss') : moment(data.time).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 设置系统公告列表
    SET_SYSTEM_NOTICE_LIST: (state, data) => {
      console.log(`系统公告:${JSON.stringify(data)}`)
      state.systemNoticeList = data
    },
    // 监听到有新的系统公告,添加到列表
    ADD_SYSTEM_NOTICE: (state, data) => {
      data.createTime = data.createTime ? moment(data.createTime).format('YYYY-MM-DD HH:mm:ss') : moment(data.time).format('YYYY-MM-DD HH:mm:ss')
      state.systemNoticeList.unshift(data)
    },
    // 设置好友在线状态
    SET_MEMBER_STATUS: (state, data) => {
      let x2js = new X2js()
      let status = 'offline'
      let jid = ''
      let result = x2js.xml2js(data)
      if (result.presence.status !== 'Unavailable') {
        status = 'online'
        jid = result.presence._from.split('/')[0]
      } else {
        jid = result.presence._from
      }
      for (let i = 0, len = state.friendList.length; i < len; i++) {
        if (state.friendList[i].jid === jid) {
          state.friendList[i].status = status
          let member = {
            ...state.friendList[i]
          }
          if (status === 'online') {
            state.friendList.splice(i, 1)
            state.friendList.unshift(member)
          } else {
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
            member.status = 'online'
            state.friendList.splice(i, 1)
            state.friendList.unshift(member)
          } else {
            member.status = 'offline'
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
            resolve(response.data)
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
      return new Promise((resolve, reject) => {
        loginRequest(data.loginData)
          .then(response => {
            if (response.data.code !== 0) return reject(response.data)
            ipcRenderer.send('winHide') // 显示内容窗口
            const xmppDomain = `@${response.data.data.config.xmppDomain}`
            const baseinfo = filterUserBaseInfo(response.data, xmppDomain)
            console.log(baseinfo)
            dispatch('SetLoalMemberData', baseinfo)
            commit('SET_XMPPDOMAIN', xmppDomain)
            commit('SET_USERINFO', baseinfo.userInfo)
            commit('SET_FRIENDLIST', baseinfo.friendList)
            commit('SET_GROUP_LIST', baseinfo.groupList)
            // 初始化本地数据库
            let reqId = Math.random()
            ipcRenderer.send('loadUserTable', baseinfo.userInfo.jid, reqId)
            // 数据库加载完成后才可以进行接收群组离线消息
            ipcRenderer.once('loadUserTableReply' + reqId, (event, dbMessage) => {
              // console.log('数据库加载完成了')
              // 接收群组离线消息
              dispatch('getOfflineGroupMessage', baseinfo).then(() => {
                // 更新会话的信息
                return dispatch('refreshSessionUserData', baseinfo, {root: true})
              }).then(() => {
                // XMPP服务登录

                createXMPPClient(data.xmpp)
              })
            })

            sessionStorage.setItem('currentUser', JSON.stringify(baseinfo.userInfo))
            // 初始化截图快捷键
            ipcRenderer.send('initWork', baseinfo.userInfo.jid)
            // 获取好友在线状态
            baseinfo.friendList.forEach(item => {
              dispatch('GetMemberOnlineStatus', item)
            })
            resolve()
          })
          .catch(err => reject(err))
      })
    },
    getOfflineGroupMessage ({commit, dispatch}, baseinfo) {
      console.log('准备解析群离线消息', baseinfo)
      return new Promise((resolve, reject) => {
        if (baseinfo && baseinfo.groupList && baseinfo.groupList.length > 0) {
          let groupList = baseinfo.groupList
          console.log('groupList====', groupList)
          // 开始循环群组
          groupList.forEach(item => {
            // 数据库查找
            dispatch('searchMessageByChannelId', item.jid, {root: true}).then(resp => {
              let searchTime = 0
              if (resp) {
                searchTime = resp.createTime
              }
              let paramData = {
                username: baseinfo.userInfo.account,
                roomJid: item.jid,
                timestamp: searchTime
              }
              // console.log('this.paramData===========================', paramData)
              getOfflineMessage(paramData).then(data => {
                // console.log('this.paramData2===========================', data)
                let messageList = data.data
                if (messageList && messageList.length > 0) {
                  let x2js = new X2js()
                  console.log('开始解析群离线消息', messageList)
                  messageList.forEach(element => {
                    // 解析消息后进行收消息操作
                    if (element.stanza) {
                      let jsonMessage = x2js.xml2js(element.stanza)
                      console.log(jsonMessage)
                      if (jsonMessage && jsonMessage.message) {
                        jsonMessage = jsonMessage.message
                        // 处理消息逻辑
                        let from = jsonMessage._from

                        // let to = jsonMessage._to
                        // const subject = stanza.getChild('subject')
                        const sender = from.split('/')[1]
                        from = from.split('/')[0]
                        // to = to.split('@')[0]
                        let userAccount = baseinfo.userInfo.account
                        const body = jsonMessage.body
                        // 如果发送人和当前用户相同则拒收
                        if (userAccount === sender) return
                        if ((userAccount + '-APP') === sender) return
                        // 如果消息为空则拒收
                        if (body && body.toString()) {
                          const message = body.toString()
                          const type = 'G'
                          let retObj = {sender, from, message, type}
                          let delay = (jsonMessage.synto ? jsonMessage.synto.timestamp : null)
                          if (delay && delay.toString()) {
                            retObj.delay = parseInt(delay.toString())
                          }
                          let messageType = body._messageType
                          // 处理群其他消息，不存在则是普通消息
                          if (messageType) {
                            retObj.messageType = messageType
                            if (messageType !== 'AUDIO_CONNECT' && messageType !== 'VIDEO_CONNECT' && messageType !== 'MEMBER_QUIT_MEIDA_MEET') {
                              dispatch('receiveGroupOtherMessage', retObj, {root: true})
                            }
                          } else {
                            const fileType = body._fileType
                            if (fileType) {
                              retObj.fileType = fileType
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
      data.groupList.forEach(item => {
        item.members.forEach(i => {
          commit('ADD_LOCALMEMBER', i)
        })
      })
    },
    // 获取用户在线状态（好友）
    GetMemberOnlineStatus ({commit, state}, member) {
      return new Promise((resolve, reject) => {
        getMemberOnlineStatusRequest({
          jid: member.jid,
          type: 'xml'
        })
          .then(response => {
            commit('SET_MEMBER_STATUS', response.data)
          })
          .catch(err => reject(err))
      })
    },
    // 获取系统公告
    GetSystemNotice ({commit}) {
      return new Promise((resolve, reject) => {
        getSystemNoticeRequest({ page: 0, size: 10 })
          .then(response => {
            if (!response.data) return
            {
              let list = response.data
              list.forEach(item => {
                item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
              })
              commit('SET_SYSTEM_NOTICE_LIST', list)
            }
            setTimeout(() => {
              commit('SET_SYSTEM_NOTICE', response.data[0])
            }, 2000)
          })
          .catch(() => {
          })
      })
    },
    // 监听系统公告
    SystemNoticeListener ({commit}) {
      systemNoticeListenerXMPP(response => {
        let x2js = new X2js()
        const result = JSON.parse(x2js.xml2js(response.toString()).message.body)
        if (localStorage.getItem('system-notice')) {
          let notice = JSON.parse(localStorage.getItem('system-notice'))
          let noticeRemind = localStorage.getItem('global_sys_message_tip_type')
          // 新公告提醒
          if (notice.id !== result.id && (!noticeRemind || noticeRemind === 'true')) {
            // 播放声音
            commit('SET_IS_PLAY_AUDIO', true)
            // 图标闪烁
            ipcRenderer.send('trayFlicker')
          }
        }
        commit('ADD_SYSTEM_NOTICE', result)
        commit('SET_SYSTEM_NOTICE', result)
      })
    },
    // 监听好友上线/下线
    FriendStatusListener ({commit}) {
      friendStatusListenerXMPP(response => {
        let x2js = new X2js()
        let result = x2js.xml2js(response.toString())
        commit('UPDATE_MEMBER_STATUS', {
          jid: result.presence._from,
          status: result.presence.oline === '' ? 'online' : 'offline'
        })
        // TODO:更新组织机构成员在线/离线状态
        // commit('UPDATE_NODE_MEMBER_STATUS', {
        //   jid: result.presence._from,
        //   status: result.presence.oline === '' ? 'online' : 'offline'
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
    // 获取好友信息
    GetMemberInfo ({dispatch, commit, state}, account) {
      return new Promise((resolve, reject) => {
        getMemberInfoRequest(account)
          .then(response => {
            let member = {
              id: response.data.id,
              name: response.data.name,
              sex: response.data.sex,
              photo: response.data.photo,
              jid: `${response.data.username}${state.xmppDomain}`,
              groupCode: response.data.groupCode,
              groupName: response.data.groupName,
              username: response.data.username
            }
            commit('ADD_LOCALMEMBER', member)
            commit('UPDATE_MEMBER_INFO', member)
            commit('UPDATE_GROUP_INFO_BY_JID', member)
            dispatch('getSessionByJid', { jid: `${response.data.username}${state.xmppDomain}` })
              .then(channel => {
                if (channel) {
                  channel.name = response.data.name
                  channel.sex = response.data.sex
                  channel.headUrl = response.data.photo
                  dispatch('updateSession', { sessionObj: channel })
                }
              })
            resolve(member)
          })
          .catch(err => { console.log(err) })
      })
    },
    // 更新用户信息
    UpdateUserInfo ({dispatch, commit, rootState}, data) {
      // TODO:更新rest服务器用户信息
      updateUserInfoRequest({
        id: rootState.home.userInfo.id,
        sex: data.sex,
        name: data.name
      })
      // 更新openfire用户信息
      updateUserInfoXMPP(data)
      dispatch('GetUserInfo')
    },
    // 注销登录
    Logon ({commit, state}, type) {
      return new Promise((resolve, reject) => {
        logonRequest({
          id: state.userInfo.id,
          username: state.userInfo.jid.split('@')[0],
          terminal: 'SyntoIM-PC'
        })
          .then(() => {
            if (localStorage.getItem('sessionID')) {
              localStorage.removeItem('sessionID')
            }
            logonXMPP()
            commit('SET_SYSTEM_NOTICE_LIST', [])
            commit('INIT_LOCAL_MEMBER_DATA')
            commit('SET_RECALL_MESSAGE_INFO', {
              memberJid: '',
              type: 'P',
              signid: '',
              groupJid: ''
            })
            resolve()
          })
          .catch(err => {
            logonXMPP()
            reject(err)
          })
      })
    },
    // 添加好友
    AddFriend ({dispatch, commit}, data) {
      return new Promise((resolve, reject) => {
        addFriendRequest(data)
          .then(response => {
            if (response.data.friendJid) {
              // 获取好友在线状态
              dispatch('GetMemberOnlineStatus', {jid: data.friendJid})
              resolve(response.data)
            } else {
              reject(response.data)
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
            // TODO:删除对应会话和数据
            dispatch('getSessionByJid', {jid: data.friendname})
              .then(channel => {
                // console.log(`channel`, channel)
                if (!channel) return
                dispatch('deleteSessionById', channel)
                  .then(() => {
                    dispatch('removeMessageByDbSessionId', channel.channelId)
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
        setFriendAliasRequest(data)
          .then(response => {
            data.username = state.userInfo.jid.split('@')[0]
            // TODO:更新本地好友别名
            commit('UPDATE_FRIENDINFO', data)
            dispatch('getSessionByJid', {jid: data.friendJid}, {root: true})
              .then(channel => {
                if (!channel) return
                channel.alias = data.alias
                dispatch('updateSession', {sessionObj: channel}, {root: true})
              })
            resolve(response.data)
          })
          .catch(err => reject(err))
      })
    }
    // 获取好友列表
    // GetFriendList ({ dispatch, commit }, { username, friendJid }) {
    //   return new Promise((resolve, reject) => {
    //     getFriendListRequest(username)
    //       .then(response => {
    //         response.data.forEach(item => {
    //           if (item.friendJid === friendJid) return resolve(item)
    //         })
    //         // commit('SET_FRIENDLIST', response.data)
    //         // dispatch('MatchLocalMeberToFriend', response.data)
    //       })
    //       .catch(err => {
    //         reject(err)
    //       })
    //   })
    // }
    // 获取最新系统公告
    // GetSystemNotice ({commit}) {
    //   let id = ''
    //   let localStorageNotice = {}
    //   if (localStorage.getItem('system-notice') && localStorage.getItem('system-notice') !== 'null') {
    //     console.log(localStorage.getItem('system-notice'))
    //     localStorageNotice = JSON.parse(localStorage.getItem('system-notice'))
    //     id = localStorageNotice.id
    //   }
    //   return new Promise((resolve, reject) => {
    //     getSystemNoticeRequest({id: id})
    //       .then(response => {
    //         if (!response.data) return
    //         setTimeout(() => {
    //           commit('SET_SYSTEM_NOTICE', response.data)
    //         }, 2000)
    //       })
    //       .catch(() => {
    //       })
    //   })
    // },
    // 获取基本信息
    // GetBaseInfo ({dispatch, commit, state}) {
    //   const data = JSON.parse(window.localStorage.getItem('account'))
    //   data.password = ipcRenderer.sendSync('EncryptStr', data.password)
    //   return new Promise((resolve, reject) => {
    //     loginRequest(data)
    //       .then(response => {
    //         commit('INIT_LOCAL_MEMBER_DATA')
    //         const xmppDomain = `@${response.data.data.config.xmppDomain}`
    //         const baseinfo = filterUserBaseInfo(response.data, xmppDomain)
    //         dispatch('SetLoalMemberData', baseinfo)
    //         commit('SET_XMPPDOMAIN', xmppDomain)
    //         commit('SET_USERINFO', baseinfo.userInfo)
    //         commit('SET_FRIENDLIST', baseinfo.friendList)
    //         commit('SET_GROUP_LIST', baseinfo.groupList)
    //         // 默认进群操作
    //         baseinfo.groupList.forEach(item => {
    //           dispatch('EnterGroup', {
    //             userJid: baseinfo.userInfo.jid,
    //             groupJid: item.jid
    //           })
    //         })
    //         // 获取好友在线状态
    //         baseinfo.friendList.forEach(item => {
    //           dispatch('GetMemberOnlineStatus', item)
    //         })
    //         // 更新会话的信息
    //         dispatch('refreshSessionUserData', baseinfo, {root: true})
    //         resolve()
    //       })
    //       .catch(err => reject(err))
    //   })
    // },
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
