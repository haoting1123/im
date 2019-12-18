import {
  sendPrivateMessage,
  sendGroupChatMessage,
  privateMessageListener,
  registerEventKey,
  listMessage,
  saveMessage,
  uploadFileMessage,
  // readMessage,
  removeMessageAll,
  // getAllMessage,
  qtMessagePlay,
  qtBackupsMessage,
  uploadImgFile,
  sendGroupOtherMessage,
  sendOtherMessage,
  getRemoteAreaInfo,
  resetRemoteMessageArea,
  resetRemoteFileArea
} from '@/api/message'
import {
  unload
} from '../../../../static/js/media/example'
import { Message } from 'element-ui'
import {ipcRenderer} from 'electron'

const fs = require('fs')
const xss = require('xss')

const message = {
  state: {
    avatarUrl: '',
    imClient: null,
    currentChannelId: '',

    homeWindowHeight: '',
    homeContentWidth: '',
    msgChannelListHeight: '',
    qunChannelInfoHeight: '',
    qunChannelInfoWidth: '',
    groupUserListHeight: '',
    msgDlgContainerWidth: '',
    msgDlgContainerAllWidth: '',
    msgDlgMemberHeight: '',
    msgDlgContainerSubPx: 0,
    noticeNew: '',
    sendFileSuffix: 'ofd',
    sendFileSize: '10',
    msgFontSize: 13,

    clientGUID: '',
    messageList: [],
    historyMessageList: [],
    isPlayAudio: false, // 用来控制声音播放是否被占用
    isPlaySound: false, // 用来控制全局是否播放声音
    sendHotKey: true, // Enter发送为true, Ctrl+Enter发送为false
    remoteUseArea: {}, // 服务端文件占用情况
    downloadingFileList: [], // 正在下载文件列表
    windowIsShow: true, // 窗口是否显示，不显示需要提醒
    // 撤回消息的人员id
    recallMessageMember: '',
    recallMessageType: 'P',
    recallMessageGroup: '',
    recallMessageSignid: ''
  },
  mutations: {
    // 设置撤回消息的必要信息（接收方）
    SET_RECALL_MESSAGE_INFO: (state, data) => {
      console.log(`嘿嘿：${JSON.stringify(data)}`)
      console.log(state.recallMessageMember)
      state.recallMessageMember = data.memberJid
      state.recallMessageType = data.type
      state.recallMessageSignid = data.signId
      state.recallMessageGroup = data.groupJid
    },
    // 删除对应消息体 by signId
    DELETE_MESSAGE_BY_SIGNID: (state, signId) => {
      let index = state.messageList.findIndex(item => item.signId === signId)
      console.log(`index: ${index}`)
      if (index > -1) {
        console.log('删除对应消息体')
        state.messageList.splice(index, 1)
      }
    },
    SET_WINDOW_IS_SHOW: (state, data) => {
      state.windowIsShow = data
    },
    PUSH_DOWNLOADING_FILE_ITEM: (state, data) => {
      state.downloadingFileList.push(data)
    },
    DEL_DOWNLOADING_FILE_ITEM: (state, data) => {
      let index = state.downloadingFileList.findIndex(item => item === data)
      if (index > -1) {
        state.downloadingFileList.splice(index, 1)
      }
    },
    SET_REMOTE_USE_AREA: (state, data) => {
      state.remoteUseArea = data
    },
    SET_NOTICE_NEW: (state, data) => {
      state.noticeNew = data
    },
    // 替换数组对象
    REPLACE_MESSAGE_ITEM: (state, data) => {
      let index = state.messageList.findIndex(item => item._id === data._id)
      if (index > -1) {
        state.messageList.splice(index, 1, data)
      }
    },
    SET_SEND_HOT_KEY: (state, data) => {
      state.sendHotKey = data
    },
    SET_AVATAR_URL: (state, data) => {
      state.avatarUrl = data
    },
    SET_IM_CLIENT: (state, data) => {
      state.imClient = data
    },
    SET_CURRENT_CHANNEL_ID: (state, data) => {
      state.currentChannelId = data
    },
    SET_IS_PLAY_AUDIO: (state, data) => {
      state.isPlayAudio = data
    },
    SET_IS_PLAY_SOUND: (state, data) => {
      state.isPlaySound = data
    },
    SET_HOME_WINDOW_HEIGHT: (state, data) => {
      state.homeWindowHeight = data
    },
    SET_HOME_CONTENT_WIDTH: (state, data) => {
      state.homeContentWidth = data
    },
    SET_MSG_CHANNEL_LIST_HEIGHT: (state, data) => {
      state.msgChannelListHeight = data
    },
    SET_QUN_CHANNEL_INFO_HEIGHT: (state, data) => {
      state.qunChannelInfoHeight = data
    },
    SET_QUN_CHANNEL_INFO_WIDTH: (state, data) => {
      state.qunChannelInfoWidth = data
    },
    SET_GROUP_USER_LIST_HEIGHT: (state, data) => {
      state.groupUserListHeight = data
    },
    SET_MSG_DLG_CONTAINER_WIDTH: (state, data) => {
      state.msgDlgContainerWidth = data
    },
    SET_MSG_DLG_CONTAINER_ALL_WIDTH: (state, data) => {
      state.msgDlgContainerAllWidth = data
    },
    SET_MSG_DLG_MEMBER_HEIGHT: (state, data) => {
      state.msgDlgMemberHeight = data
    },
    SET_MSG_DLG_CONTAINER_SUB_PX: (state, data) => {
      state.msgDlgContainerSubPx = data
    },
    SET_SEND_FILE_SUFFIX: (state, data) => {
      state.sendFileSuffix = data
    },
    SET_SEND_FILE_SIZE: (state, data) => {
      state.sendFileSize = data
    },
    SET_MSG_FONT_SIZE: (state, data) => {
      state.msgFontSize = data
    },
    CLIENT_GUID: (state, data) => {
      state.clientGUID = data
    },
    SET_MESSAGE_LIST: (state, data) => {
      state.messageList = data
      console.log(`消息记录: ${JSON.stringify(data)}`)
    },
    PUSH_MESSAGE_LIST: (state, data) => {
      state.messageList.push(data)
    },
    // 把传入的数组追加到数组头部
    APPEND_FRONT_MESSAGE_LIST: (state, data) => {
      state.messageList = [...data, ...state.messageList]
    },
    DELETE_MESSAGE_BY_ID: (state, messageId) => {
      let index = state.messageList.findIndex(item => item._id === messageId)
      if (index > -1) {
        state.messageList.splice(index, 1)
      }
    },
    CLEAR_MESSAGE_LIST: (state) => {
      state.messageList = []
    },
    SET_HISTORY_MESSAGE_LIST: (state, data) => {
      state.historyMessageList = data
      console.log(`历史消息记录：${JSON.stringify(data)}`)
    },
    PUSH_HISTORY_MESSAGE_LIST: (state, data) => {
      state.historyMessageList.push(data)
    },
    APPEND_HISTORY_MESSAGE_LIST: (state, data) => {
      state.historyMessageList = [...data, ...state.historyMessageList]
    },
    DELETE_HISTORY_MESSAGE_BY_ID: (state, messageId) => {
      let index = state.historyMessageList.findIndex(item => item._id === messageId)
      if (index > -1) {
        state.historyMessageList.splice(index, 1)
      }
    },
    CLEAR_HISTORY_MESSAGE_LIST: (state) => {
      state.historyMessageList = []
    },
    UPDATE_MESSAGE_LIST_ALL: (state) => {
      state.messageList.forEach(item => {
        if (!item.isRead || item.isRead === 'undefined' || item.isRead === 'no') {
          // console.log(JSON.stringify(item))
          item.isRead = 'yes'
        }
      })
    },
    UPDATE_MESSAGE_LIST_ONCE: (state, signId) => {
      state.messageList.find(item => {
        if (signId === item.signId) {
          item.isRead = 'yes'
        }
      })
    }
  },
  actions: {
    sendPrivateMessage ({commit}, data) {
      return new Promise((resolve, reject) => {
        sendPrivateMessage(data).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    sendGroupChatMessage ({commit}, data) {
      return new Promise((resolve, reject) => {
        sendGroupChatMessage(data).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    privateMessageListener ({commit}, jid, listener) {
      return new Promise((resolve, reject) => {
        privateMessageListener(jid, listener).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    registerEventKey ({commit}, eventKey) {
      return new Promise((resolve, reject) => {
        registerEventKey(eventKey).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    listMessage ({commit}, channelId, maxCreateAt, limit, searchMsg) {
      return new Promise((resolve, reject) => {
        listMessage(channelId, maxCreateAt, limit, searchMsg).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 更新消息
    updateMessage ({ commit, rootState }, {messageObj}) {
      return new Promise((resolve, reject) => {
        let reqId = Math.random()
        ipcRenderer.once('updateMessageDataReply' + reqId, function (event, dbMessage) {
          // console.log(dbMessage.numReplaced)
          // TODO 替换sessionList中的值
          commit('REPLACE_MESSAGE_ITEM', messageObj)
          resolve(messageObj)
        })
        ipcRenderer.send('updateMessageData', reqId, messageObj)
      })
    },
    saveMessage ({dispatch, commit, rootState}, messageData) {
      messageData.status = 'no' // no：未发送 success：发送成功 fail：发送失败
      let timeDifference = localStorage.getItem('global_time_difference')
      // 计算服务器的时间差
      if (timeDifference) {
        messageData.createTime = (messageData.createTime - parseInt(timeDifference))
      }
      // 插入本地数据库
      let reqId = Math.random()
      if (messageData.fileType === 'img') {
        messageData.reqId = reqId + '' // 用来找寻此次更新的数据
      }
      ipcRenderer.once('insertMessageReply' + reqId, function (event, dbMessage) {
        // 批量发送的不插入当前消息列表
        if (dbMessage.newDoc && (!dbMessage.newDoc.isBatch || dbMessage.newDoc.isBatch !== 'yes')) {
          commit('PUSH_MESSAGE_LIST', dbMessage.newDoc)
        }
      })
      ipcRenderer.send('insertMessageData', reqId, messageData)
      // 更新会话列表
      let resp = rootState.session.sessionList.find(element => {
        return element.channelId === messageData.channelId
      })
      let lastMessage = messageData.content
      if (messageData.fileType) {
        if (messageData.fileType === 'file') {
          lastMessage = '[文件]'
        } else {
          lastMessage = '[图片]'
        }
      }
      if (resp) {
        // console.log('存在会话', resp)
        // 当前会话是否被打开，如果被打开则为0
        resp.unreadMessageCount = 0
        var html = xss(lastMessage, {
          whiteList: [], // 白名单为空，表示过滤所有标签
          stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
          stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
        })
        // console.log(html)
        resp.lastMessage = html
        resp.lastName = rootState.home.userInfo.name
        resp.createTime = messageData.createTime
        dispatch('updateSession', {
          sessionObj: resp
        }, {root: true})
      } else {
        // 新增 批量发送的时候会走此逻辑
        dispatch('addNewSession', {
          jid: messageData.channelId,
          lastMessage: lastMessage,
          createTime: messageData.createTime,
          unreadMessageCount: 0,
          channelType: messageData.channelType,
          lastName: rootState.home.userInfo.name,
          isAtMe: 'no',
          atTime: ''
        }, {root: true})
      }
      // 如果是图片则先不发XMPP，上传成功后再发
      if (messageData.fileType === 'img') {
        console.log(messageData.fileInfo.filePath)
        let path = messageData.fileInfo.filePath
        // 读取本地文件
        fs.readFile(path, (err, data) => {
          let fileName = 'pic_' + new Date().getTime() + '.' + path.substring((path.lastIndexOf('.') + 1))
          let uploadFile = new File([data], fileName)
          console.log(fileName)
          // 上传图片
          let formData = new FormData()
          formData.append('file', uploadFile)
          uploadImgFile(formData, {'Content-Type': 'multipart/form-data'}).then(res => {
            console.log('上传成功', res.data.url)
            // 发送消息，并更新本地
            let reqId1 = Math.random()
            ipcRenderer.once('searchMessageDataByReqIdReply' + reqId1, function (event, dbMessage) {
              if (dbMessage.doc) {
                let dbMessageDoc = JSON.parse(JSON.stringify(dbMessage.doc))
                // console.log(dbMessageDoc)
                dbMessageDoc.reqId = null
                dbMessageDoc.status = 'success'
                dbMessageDoc.content = `<img src="` + res.data.url + `" height="80" type="picture" />`
                dispatch('updateMessage', {messageObj: dbMessageDoc})
                messageData.content = dbMessageDoc.content
                dispatch('sendXMPPMessage', messageData)
              } else {
                console.log('没有查询到数据')
              }
            })
            ipcRenderer.send('searchMessageDataByReqId', reqId1, reqId + '')
          }).catch(err => {
            console.log(err)
          })
          console.log(err, data)
        })
      } else {
        // 发送xmpp
        dispatch('sendXMPPMessage', messageData)
      }
    },
    sendXMPPMessage ({commit}, messageData) {
      return new Promise((resolve, reject) => {
        saveMessage(messageData).then(data => {
        // TODO 发送成功后更新发送状态
        // commit('PUSH_MESSAGE_LIST', messageData)
          resolve(data)
        }).catch(error => {
          reject(error)
        // TODO 发送失败后更新为失败状态
        })
      })
    },
    receiveMessage ({state, dispatch, commit, rootState}, data) {
      // console.log('收到消息', data)
      let msgType = data.type // 消息类型
      let fileType = data.fileType // 文件类型
      let signId = data.signId
      let insertTime = data.createTime
      if (!insertTime) {
        insertTime = new Date().getTime() // 插入时间
        let timeDifference = localStorage.getItem('global_time_difference')
        // 计算服务器的时间差
        if (timeDifference) {
          insertTime = (insertTime - parseInt(timeDifference))
        }
      } else {
        insertTime = parseInt(insertTime)
      }
      let isAtMe = '' // 是否有人@我
      let atTime = '' // @我的消息时间戳，用来定位消息
      if (data.delay) {
        if (msgType === 'G') {
          insertTime = data.delay
        } else {
          insertTime = new Date(data.delay).getTime()
        }
        // console.log('收到离线消息' + insertTime)
      }
      const newMessage = {
        channelId: data.from,
        channelType: msgType,
        content: data.message.replace(new RegExp('\\n', 'gm'), '<br />'),
        senderId: data.from,
        to: 'me',
        createTime: insertTime,
        signId: signId,
        isRead: 'no',
        readCount: 0
      }
      if (fileType) {
        newMessage.fileType = fileType
        if (fileType === 'file') {
          newMessage.fileInfo = JSON.parse(newMessage.content)
        } else if (fileType === 'aac') {
          newMessage.content = '[语音消息]PC端不支持查看'
        } else if (fileType === 'position') {
          newMessage.content = '[位置共享]PC端不支持查看'
        } else if (fileType === 'vcard') {
          newMessage.content = '[个人名片]PC端不支持查看'
        }
      }
      if (msgType === 'G') {
        // 群不存在则忽略消息
        let groupList = rootState.group.groupList
        // console.log(friendList)
        if (groupList && groupList.length > 0) {
          let group = groupList.find((value, index, arr) => {
            return value.jid === data.from
          })
          if (!group) {
            console.log('当前群不存在，消息忽略')
            return
          }
        }
        newMessage.senderId = data.sender
        // 正在聊天中不提示@信息
        if (!state.currentChannelId || state.currentChannelId !== data.from) {
          // 处理消息是否有人@我
          let userName = rootState.home.userInfo.name
          // console.log(userName, isAtMe)
          let atIndex = newMessage.content.indexOf('@' + userName)
          if (atIndex > -1) {
            isAtMe = 'yes'
            // 记录@我的位置
            localStorage.setItem('mes_at_' + data.from, 'yes')
            localStorage.setItem('mes_atTime_' + data.from, insertTime)
          }
        } else if (state.currentChannelId && state.currentChannelId === data.from) {
          console.log('发送群组消息回执')
          dispatch('GroupMessageReceipt', {
            channelId: state.currentChannelId,
            signId: signId
          })
        }
      } else {
        // 个人消息回执
        if (state.currentChannelId && state.currentChannelId === data.from) {
          console.log('发送个人消息回执')
          dispatch('MessageReceipt', {
            senderId: data.from,
            signId: signId
          })
        }
      }
      // 增加信息列表
      let reqId = Math.random()
      ipcRenderer.once('insertMessageReply' + reqId, function (event, dbMessage) {
        if (state.currentChannelId && state.currentChannelId === newMessage.channelId) {
          commit('PUSH_MESSAGE_LIST', dbMessage.newDoc)
        }
      })
      ipcRenderer.send('insertMessageData', reqId, newMessage)
      // 更新会话列表
      let resp = ipcRenderer.sendSync('SYNC_searchUserData', data.from)
      if (resp.err) {
        console.log(resp ? resp.err : '')
        return
      }
      resp = resp.doc
      let isTip = 'yes' // 当前会话是否需要提醒
      // console.log(resp)
      // 最后消息过滤HTML信息
      var html = xss(newMessage.content, {
        whiteList: [], // 白名单为空，表示过滤所有标签
        stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
        stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
      })
      newMessage.content = html
      if (newMessage.fileType) {
        if (newMessage.fileType === 'file') {
          newMessage.content = '[文件]'
        } else if (newMessage.fileType === 'img') {
          newMessage.content = '[图片]'
        } else if (newMessage.fileType === 'aac') {
          newMessage.content = '[语音消息]PC端不支持查看'
        } else if (newMessage.fileType === 'position') {
          newMessage.content = '[位置共享]PC端不支持查看'
        } else if (newMessage.fileType === 'vcard') {
          newMessage.content = '[个人名片]PC端不支持查看'
        }
      }
      // 是否存在会话，不存在则插入，存在则更新
      if (resp) {
        // console.log('存在会话', resp)
        // 当前会话是否被打开，如果被打开则为0
        if (state.currentChannelId && state.currentChannelId === resp.jid) {
          resp.unreadMessageCount = 0
        } else {
          // 用来记录第一条未读消息的位置
          if (resp.unreadMessageCount === 0) {
            localStorage.setItem('mes_noReadAt_' + resp.jid, insertTime)
          }
          resp.unreadMessageCount += 1
        }
        if (isAtMe) {
          resp.isAtMe = isAtMe
        }
        resp.lastMessage = newMessage.content
        resp.createTime = insertTime
        isTip = (resp.isTip ? resp.isTip : 'yes')
        if (msgType === 'G') {
          resp.lastName = data.sender
        }
        console.log('resp', resp)
        dispatch('updateSession', {
          sessionObj: resp
        }, {root: true})
      } else {
        // 新增
        dispatch('addNewSession', {
          jid: data.from,
          lastMessage: newMessage.content,
          createTime: insertTime,
          unreadMessageCount: 1,
          channelType: msgType,
          lastName: (data.sender ? data.sender : ''),
          isAtMe: isAtMe,
          atTime: atTime
        }, {root: true})
      }
      // 是否进行声音闪烁 离线消息不进行提示 @自己都提示
      if ((!state.currentChannelId || state.currentChannelId !== data.from || !state.windowIsShow) && ((!data.delay && isTip === 'yes' && !state.isPlaySound) || isAtMe === 'yes')) {
        // 播放声音
        commit('SET_IS_PLAY_AUDIO', true)
        // 图标闪烁
        ipcRenderer.send('trayFlicker')
      }
    },
    // 消息回执
    MessageReceipt ({ dispatch, rootState }, { senderId, signId }) {
      let obj = {
        channelId: rootState.home.userInfo.jid,
        senderId: senderId,
        signId: signId,
        readTime: Date.now()
      }
      dispatch('sendOtherMessage', {
        to: senderId,
        content: JSON.stringify(obj),
        type: 'MESSAGE_RECEIPT'
      })
    },
    // 群消息回执
    GroupMessageReceipt ({ dispatch, rootState }, { channelId, signId }) {
      let obj = {
        channelId: channelId,
        signId: signId
      }
      dispatch('sendGroupOtherMessage', {
        to: channelId,
        content: JSON.stringify(obj),
        type: 'GROUP_MESSAGE_RECEIPT'
      })
    },
    // 处理其他提醒消息
    receiveOtherMessage ({
      state,
      dispatch,
      commit,
      rootState
    }, data) {
      // console.log(`接收到其他消息了:${JSON.stringify(data)}`)
      // let jid = data.from // JID
      let messageType = data.messageType // 消息类型
      if (messageType === 'RECALL_MESSAGE') {
        // console.log(`接收到消息撤回通知:${JSON.stringify(data.message)}`)
        let body = JSON.parse(data.message)
        dispatch('RecallMessage', {
          channelId: data.from,
          signId: body.signId
        })
          .then(() => {
            commit('SET_RECALL_MESSAGE_INFO', {
              memberJid: data.from,
              type: data.type,
              signId: body.signId,
              groupJid: body.groupJid
            })
            // 清空会话消息最后的消息内容
            dispatch('resetSessionLastMessage', data.from, {root: true})
          })
      } else if (messageType === 'MESSAGE_RECEIPT') {
        // 消息回执
        // console.log(`接收到消息回执:${data.message}`)
        dispatch('updateMessageIsReadByReadTime', JSON.parse(data.message))
      } else if (messageType === 'PORT_SYNC') {
        // console.log(JSON.parse(data.message))
        // 多端同步
        let body = JSON.parse(data.message)
        if (body.type === 'createGroup' || body.type === 'addMemberToGroup' || body.type === 'deleteMemberToGroup' || body.type === 'updateGroupInfo') {
          console.log('多端消息同步')
          dispatch('getGroupInfoByRoomId', { roomJid: body.roomId })
        }
      } else if (messageType === 'AUDIO_CONNECT') {
        let body = JSON.parse(data.message)
        console.log('语音会议提醒', body)
        if (body.roomType === 'P') {
          dispatch('GetMemberInfo', body.senderId.split('@')[0])
            .then(data => {
              commit('SET_MEDIA_SPEAK_FLAG', true)
              commit('SET_MEDIA_SPEAK_ROLE', 'acceptor')
              commit('SET_MEDIA_MEET_INFO', {
                roomName: body.roomName,
                roomType: body.roomType,
                mediaType: body.mediaType,
                memberInfo: [data]
              })
            })
        } else {
          // let memberInfo = []
          // rootState.group.groupList(item => {
          //   if ()
          // })
          commit('SET_MEDIA_SPEAK_FLAG', true)
          commit('SET_MEDIA_SPEAK_ROLE', 'acceptor')
          commit('SET_MEDIA_MEET_INFO', {
            roomName: body.roomName,
            roomType: body.roomType,
            mediaType: body.mediaType,
            memberInfo: body.memberInfo
          })
        }
      } else if (messageType === 'VIDEO_CONNECT') {
        let body = JSON.parse(data.message)
        console.warn('视频会议提醒', body)
        if (body.roomType === 'P') {
          dispatch('GetMemberInfo', body.senderId.split('@')[0])
            .then(data => {
              commit('SET_MEDIA_SPEAK_FLAG', true)
              commit('SET_MEDIA_SPEAK_ROLE', 'acceptor')
              commit('SET_MEDIA_MEET_INFO', {
                roomName: body.roomName,
                roomType: body.roomType,
                mediaType: body.mediaType,
                memberInfo: [data, {
                  jid: rootState.home.userInfo.jid,
                  name: rootState.home.userInfo.name,
                  username: rootState.home.userInfo.username,
                  photo: rootState.home.userInfo.photo
                }]
              })
            })
        } else {
          commit('SET_MEDIA_SPEAK_FLAG', true)
          commit('SET_MEDIA_SPEAK_ROLE', 'acceptor')
          commit('SET_MEDIA_MEET_INFO', {
            roomName: body.roomName,
            roomType: body.roomType,
            mediaType: body.mediaType,
            memberInfo: body.memberInfo
          })
        }
      } else if (messageType === 'MEMBER_QUIT_MEIDA_MEET') {
        console.warn('成员退出会议')
        let body = JSON.parse(data.message)
        console.log(body)
        if (body.roomType === 'P' || body.channelType === 'P') {
          Message({
            message: '媒体会议已被挂断!'
          })
          if (rootState.channel.acceptRequestFlag) {
            unload()
          } else {
            setTimeout(() => {
              commit('SET_MEDIA_SPEAK_FLAG', false)
              commit('SET_ACCEPT_REQUEST_FLAG', false)
              commit('SET_MEDIA_SPEAK_ROLE', '')
              commit('INIT_MEDIA_MEET_INFO')
              commit('SET_IS_MEDIA_MINIMIZE', false)
              commit('SET_ACTIVE_MEDIA_MEMBER_ID', 'localVideo1')
            }, 500)
          }
        } else {
          // 会议结束
          if (body.messageType === 'meetEnd') {
            Message({
              message: '媒体会议结束!'
            })
            if (rootState.channel.acceptRequestFlag) {
              unload()
            } else {
              commit('SET_MEDIA_SPEAK_FLAG', false)
              commit('SET_ACCEPT_REQUEST_FLAG', false)
              commit('SET_MEDIA_SPEAK_ROLE', '')
              commit('INIT_MEDIA_MEET_INFO')
              commit('SET_IS_MEDIA_MINIMIZE', false)
              commit('SET_ACTIVE_MEDIA_MEMBER_ID', 'localVideo1')
            }
          } else if (body.messageType === 'memberQuit') {
            console.warn(`username: ${body.username}`)
            // 成员退出会议
            commit('DELETE_MEDIA_MEET_MEMBER', body.username)
            if (rootState.channel.mediaMeetInfo.memberInfo.length === 1) {
              Message({
                message: '媒体会议结束!'
              })
              unload()
            }
          }
        }
      }
    },
    // 撤回消息
    RecallMessage ({ commit }, data) {
      return new Promise((resolve, reject) => {
        let reqId = Math.random()
        ipcRenderer.once('deleteMessageBySignIdReply' + reqId, function (event, delObj) {
          console.log(delObj.numRemoved)
          resolve()
        })
        ipcRenderer.send('deleteMessageBySignId', reqId, data.channelId, data.signId)
      })
    },
    // 批量更新当前消息已读状态 senderId：当前登录用户的JID，channelId：要更新的会话channelId，readTime：小于等于此事件的消息都更新为已读
    updateMessageIsReadByReadTime ({
      commit,
      rootState
    }, {senderId, channelId, readTime, signId}) {
      return new Promise((resolve, reject) => {
        let reqId = Math.random()
        ipcRenderer.once('updateMessageIsReadReply' + reqId, function (event, delObj) {
          console.log(delObj.numRemoved)
          resolve()
          if (channelId !== rootState.message.currentChannelId) return
          if (signId) {
            commit('UPDATE_MESSAGE_LIST_ONCE', signId)
            return
          }
          commit('UPDATE_MESSAGE_LIST_ALL')
        })
        ipcRenderer.send('updateMessageIsRead', reqId, senderId, channelId, readTime)
      })
    },
    uploadFileMessage ({commit}, data, headers) {
      return new Promise((resolve, reject) => {
        uploadFileMessage(data, headers).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除单条消息
    removeMessageByDb ({commit}, messageId) {
      let reqId = Math.random()
      ipcRenderer.once('deleteMessageDataReply' + reqId, function (event, delObj) {
        console.log(delObj.numRemoved)
        if (delObj.numRemoved > 0) {
          commit('DELETE_MESSAGE_BY_ID', messageId)
          commit('DELETE_HISTORY_MESSAGE_BY_ID', messageId)
        }
      })
      ipcRenderer.send('deleteMessageData', reqId, messageId)
    },
    // 清空单个会话消息数据
    removeMessageByDbSessionId ({commit}, sessionId) {
      let reqId = Math.random()
      ipcRenderer.once('deleteMessageBySessionIdReply' + reqId, function (event, delObj) {
        console.log(delObj.numRemoved)
        if (delObj.numRemoved > 0) {
          commit('CLEAR_HISTORY_MESSAGE_LIST')
          commit('CLEAR_MESSAGE_LIST')
        }
      })
      ipcRenderer.send('deleteMessageBySessionId', reqId, sessionId)
    },
    // 清空所有消息数据
    removeAllMessageByDb ({commit}) {
      let reqId = Math.random()
      ipcRenderer.once('deleteAllMessageReply' + reqId, function (event, delObj) {
        console.log(delObj.numRemoved)
        if (delObj.numRemoved > 0) {
          commit('CLEAR_HISTORY_MESSAGE_LIST')
          commit('CLEAR_MESSAGE_LIST')
        }
      })
      ipcRenderer.send('deleteAllMessageData', reqId)
    },
    removeMessageAll ({commit}, channelId) {
      return new Promise((resolve, reject) => {
        removeMessageAll(channelId).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAllMessage ({dispatch, commit, rootState}, {channelId, maxCreateAt, limit, maxStartAt}) {
      return new Promise((resolve, reject) => {
        // TODO 获取当前消息列表的第一页
        let reqId = Math.random()
        console.log(channelId, maxCreateAt, limit, maxStartAt)
        ipcRenderer.send('searchMessageDataPage', reqId, channelId, maxCreateAt, limit, null, maxStartAt)
        ipcRenderer.once('searchMessageDataPageReply' + reqId, function (event, dbMessage) {
          if (dbMessage.docs && dbMessage.docs.length > 0) {
            let retMessageList = dbMessage.docs.reverse()
            if (maxCreateAt && maxCreateAt > 0) {
              commit('APPEND_FRONT_MESSAGE_LIST', retMessageList)
            } else {
              commit('SET_MESSAGE_LIST', retMessageList)
            }
            retMessageList.forEach(item => {
              if ((item.isRead === 'no' || item.isRead === 'undefined') && item.senderId !== rootState.home.userInfo.jid) {
                dispatch('updateMessageIsReadToGroupBySignId', {
                  channelId: channelId,
                  signId: item.signId
                })
                  .then(() => {
                    let obj = {
                      channelId: channelId,
                      signId: item.signId
                    }
                    dispatch('sendGroupOtherMessage', {
                      to: channelId,
                      content: JSON.stringify(obj),
                      type: 'GROUP_MESSAGE_RECEIPT'
                    })
                  })
              }
            })
            resolve(retMessageList)
          } else {
            resolve()
          }
        })
      })
    },
    getAllHistoryMessage ({commit}, {channelId, maxCreateAt, limit, content}) {
      return new Promise((resolve, reject) => {
        // 获取当前历史消息列表
        let reqId = Math.random()
        ipcRenderer.send('searchMessageDataPage', reqId, channelId, maxCreateAt, limit, content)
        ipcRenderer.once('searchMessageDataPageReply' + reqId, function (event, dbMessage) {
          console.log(dbMessage)
          if (dbMessage.docs && dbMessage.docs.length > 0) {
            let retMessageList = dbMessage.docs.reverse()
            if (maxCreateAt && maxCreateAt > 0) {
              commit('APPEND_HISTORY_MESSAGE_LIST', retMessageList)
            } else {
              commit('SET_HISTORY_MESSAGE_LIST', retMessageList)
            }
            resolve(retMessageList)
          } else {
            resolve()
          }
        })
      })
    },
    qtMessagePlay ({commit}) {
      return new Promise((resolve, reject) => {
        qtMessagePlay().then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    qtBackupsMessage ({commit}, exportPath, content) {
      return new Promise((resolve, reject) => {
        qtBackupsMessage(exportPath, content).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAllMessageNoLimit ({commit}, {channelId}) {
      return new Promise((resolve, reject) => {
        // 获取当前消息列表
        let reqId = Math.random()
        ipcRenderer.once('searchMessageDataAllReply' + reqId, function (event, dbMessage) {
          if (dbMessage.docs && dbMessage.docs.length > 0) {
            resolve(dbMessage.docs)
          } else {
            resolve()
          }
        })
        ipcRenderer.send('searchMessageDataAll', reqId, channelId)
      })
    },
    sendOtherMessage ({
      commit
    }, messageData) {
      return new Promise((resolve, reject) => {
        sendOtherMessage(messageData).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    sendGroupOtherMessage ({commit}, messageData) {
      return new Promise((resolve, reject) => {
        sendGroupOtherMessage(messageData).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 处理群的其他提醒消息
    receiveGroupOtherMessage ({state, dispatch, commit, rootState}, data) {
      console.log('接收到群的其他消息了', data)
      let jid = data.from // 群JID
      let messageType = data.messageType // 消息类型
      if (messageType === 'GROUP_NOTICE') {
        // 准备提示群公告了
        commit('SET_NOTICE_NEW', Math.random())
        // 存储
        localStorage.setItem('notice_' + jid, data.message)
        console.log(jid)
      } else if (messageType === 'newMember') {
        // 有新成员加入群
        dispatch('GetGroupMember', {
          groupJid: jid,
          userJid: rootState.home.userInfo.jid
        })
      } else if (messageType === 'RECALL_MESSAGE') {
        // 撤回消息
        // console.log(`接收到消息撤回通知:${JSON.stringify(data.message)}`)
        let body = JSON.parse(data.message)
        dispatch('RecallMessage', {
          channelId: data.from,
          signId: body.signId
        })
          .then(() => {
            commit('SET_RECALL_MESSAGE_INFO', {
              memberJid: body.memberJid,
              type: data.type,
              signId: body.signId,
              groupJid: body.groupJid
            })
            // 清空会话消息最后的消息内容
            dispatch('resetSessionLastMessage', data.from, {root: true})
          })
      } else if (messageType === 'GROUP_MESSAGE_RECEIPT') {
        console.log(`群消息回执:${data.message}`)
        dispatch('updateMessageIsReadToGroupBySignId', JSON.parse(data.message))
      } else if (messageType === 'UPDATE_GROUP_INFO') {
        console.log('更新群组消息')
        dispatch('getGroupInfoByRoomId', JSON.parse(data.message))
      } else if (messageType === 'AUDIO_CONNECT') {
        let body = JSON.parse(data.message)
        console.warn('语音会议提醒', body)
        let memberInfo = []
        rootState.group.groupList.forEach(item => {
          if (item.jid === body.channelId) {
            memberInfo = JSON.parse(JSON.stringify(item.members))
          }
        })
        commit('SET_MEDIA_SPEAK_FLAG', true)
        commit('SET_MEDIA_SPEAK_ROLE', 'acceptor')
        commit('SET_MEDIA_MEET_INFO', {
          // 请求者jid
          senderId: body.senderId,
          // 会话jid
          channelId: body.channelId,
          roomName: body.roomName,
          channelName: body.channelName,
          // P => 单人 G => 群聊
          roomType: body.roomType,
          channelType: body.channelType,
          // VIDEO => 视频 VOICE => 语音
          mediaType: body.mediaType,
          type: body.type,
          memberInfo: memberInfo
        })
      } else if (messageType === 'VIDEO_CONNECT') {
        // let body = JSON.parse(data.message)
        // console.warn('视频会议提醒', body)
        // commit('SET_MEDIA_SPEAK_FLAG', true)
        // commit('SET_MEDIA_SPEAK_ROLE', 'acceptor')
        // commit('SET_MEDIA_MEET_INFO', {
        //   roomName: body.roomName,
        //   roomType: body.roomType,
        //   mediaType: body.mediaType,
        //   memberInfo: body.memberInfo
        // })
      } else if (messageType === 'MEMBER_QUIT_MEIDA_MEET') {
        let body = JSON.parse(data.message)
        console.warn('成员退出会议')
        console.warn('body', body)
        // 会议结束
        if (body.messageType === 'meetEnd') {
          // 不在线直接忽略
          if (!rootState.channel.mediaSpeakFlag) return
          Message({
            message: '媒体会议结束!'
          })
          if (rootState.channel.acceptRequestFlag) {
            unload()
          } else {
            commit('SET_MEDIA_SPEAK_FLAG', false)
            commit('SET_ACCEPT_REQUEST_FLAG', false)
            commit('SET_MEDIA_SPEAK_ROLE', '')
            commit('INIT_MEDIA_MEET_INFO')
            commit('SET_IS_MEDIA_MINIMIZE', false)
            commit('SET_ACTIVE_MEDIA_MEMBER_ID', 'localVideo1')
          }
        } else if (body.messageType === 'memberQuit') {
          console.warn(`username: ${body.username}`)
          // 成员退出会议
          commit('DELETE_MEDIA_MEET_MEMBER', body.username)
          if (rootState.channel.mediaMeetInfo.memberInfo.length === 1) {
            Message({
              message: '媒体会议结束!'
            })
            unload()
          }
        }
      }
    },
    // 处理消息回执(群组)
    updateMessageIsReadToGroupBySignId ({ commit, rootState }, { channelId, signId }) {
      return new Promise((resolve, reject) => {
      // 获取当前消息列表
        let reqId = Math.random()
        ipcRenderer.once('updateMessageIsReadBySignIdReply' + reqId, function (event, dbMessage) {
          resolve()
          // 当前会话
          if (channelId !== rootState.message.currentChannelId) return
          commit('UPDATE_MESSAGE_LIST_ONCE', signId)
        })
        ipcRenderer.send('updateMessageIsReadBySignId', reqId, channelId, signId)
      })
    },
    searchMessageByChannelId ({state, dispatch, commit, rootState}, channelId) {
      return new Promise((resolve, reject) => {
        // 获取当前消息列表
        let reqId = Math.random()
        ipcRenderer.once('searchMessageByChannelIdReply' + reqId, function (event, dbMessage) {
          if (dbMessage.doc) {
            resolve(dbMessage.doc)
          } else {
            resolve()
          }
        })
        ipcRenderer.send('searchMessageByChannelId', reqId, channelId)
      })
    },
    getRemoteAreaInfo ({commit}, userName) {
      return new Promise((resolve, reject) => {
        // 获取当前用户文件区域信息
        getRemoteAreaInfo(userName).then(data => {
          commit('SET_REMOTE_USE_AREA', data.data)
          resolve(data.data)
        })
      })
    },
    resetRemoteMessageArea ({commit}, userName) {
      return new Promise((resolve, reject) => {
        // 重置服务端的聊天区域
        resetRemoteMessageArea(userName).then(data => {
          resolve(data)
        })
      })
    },
    resetRemoteFileArea ({commit}, userName) {
      return new Promise((resolve, reject) => {
        // 重置服务端的文件区域
        resetRemoteFileArea(userName).then(data => {
          resolve(data)
        })
      })
    },
    // 更新当前消息已读状态
    updateMessageIsReadById ({
      commit
    }, id) {
      return new Promise((resolve, reject) => {
        let reqId = Math.random()
        ipcRenderer.once('updateMessageDataSinglePropReply' + reqId, function (event, dbMessage) {
        // console.log(dbMessage.doc)
          resolve()
        })
        ipcRenderer.send('updateMessageDataSingleProp', reqId, id, {isRead: 'yes'})
      })
    }
  }
}
export default message
