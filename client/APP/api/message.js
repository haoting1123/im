import request from '@/utils/request'
// import requestUM from '@/utils/requestUM'
import { sendMessageXMPP, sendGroupMessageXMPP, sendGroupOtherMessageXMPP, sendOtherMessageXMPP } from '../xmpp/index'

const fs = require('fs')
let registratedEventKeys = []

// 个人消息
export const sendPrivateMessage = (data) => {
  // ipcRenderer.send('send-message', data)
}

// 群组消息
export const sendGroupChatMessage = (data) => {
  // ipcRenderer.send('send-groupchat-message', data)
}

// 消息监听
export const privateMessageListener = (jid, listener) => {
  const eventKey = `message:chat:${jid}`
  // console.log(eventKey)
  console.log('监听：message:chat:lis@192.168.1.110')
  // registerEventKey(eventKey)

  // 模拟登录监听
  // ipcRenderer.on(eventKey, (_, data) => {
  //   console.log('msg::', data)
  //   listener(data)
  // })
}

// 发送信息时，创建会话标识
export const registerEventKey = (eventKey) => {
  console.log(registratedEventKeys)
  if (registratedEventKeys.includes(eventKey)) return
  console.log('添加会话标识 -> 本地')
  registratedEventKeys.push(eventKey)
  // ipcRenderer.send('registerEventKey', eventKey)
}

export const listMessage = (channelId, maxCreateAt, limit, searchMsg) =>
  request({
    url: '/messages',
    method: 'GET',
    params: {
      channelId: channelId,
      maxCreateAt: maxCreateAt,
      limit: limit,
      searchMsg: searchMsg
    }
  })

export const saveMessage = (message) => {
  // request({
  //   url: '/messages',
  //   method: 'POST',
  //   data: message
  // })
// TODO 发送XMPP
  let data = {
    to: message.to,
    message: message.content,
		signId: message.signId,
		chatType: message.chatType
  }
  if (message.fileType) {
    data.fileType = message.fileType
  }
  return new Promise((resolve, reject) => {
    if (message.channelType === 'P') {
      sendMessageXMPP(data)
    } else {
      sendGroupMessageXMPP(data)
    }

    resolve()
  })
}

export const sendOtherMessage = (message) => {
// TODO 发送XMPP
  console.log(message)
  let data = {
    to: message.to,
    message: message.content,
    type: message.type
  }
  return new Promise((resolve, reject) => {
    sendOtherMessageXMPP(data)
    resolve()
  })
}

export const sendGroupOtherMessage = (message) => {
// TODO 发送XMPP
  console.log(message)
  let data = {
    to: message.to,
    message: message.content,
    type: message.type
  }
  return new Promise((resolve, reject) => {
    sendGroupOtherMessageXMPP(data)
    resolve()
  })
}

export const uploadFileMessage = (data, headers) =>
  request({
    url: '/syntoim/rest/file/upload',
    method: 'POST',
    headers: headers,
    data: data
  })

export const uploadImgFile = (data, headers) =>
  request({
    url: '/syntoim/rest/file/upload',
    method: 'POST',
    headers: headers,
    data: data
  })

export const readMessage = (channelId, total) =>
  request({
    url: '/messages/read',
    method: 'POST',
    data: {
      channelId: channelId,
      total: total
    }
  })

export const removeMessage = (messageId, channelId, toUserId) =>
  request({
    url: '/messages',
    method: 'DELETE',
    data: {
      messageId: messageId,
      channelId: channelId,
      toUserId: toUserId
    }
  })

export const removeMessageAll = (channelId) =>
  request({
    url: '/messages/all',
    method: 'DELETE',
    data: {
      channelId: channelId
    }
  })

// export const getAllMessage = (userId, maxCreateAt) => {
//   requestUM({
//     url: '/rest/message/' + userId,
//     method: 'GET',
//     params: {
//       maxCreateAt: maxCreateAt
//     }
//   })
// }
// 声音提醒
export const qtMessagePlay = () => {
  console.log('qtMessagePlayFlag')
  msgAudioPlay()
  // 托盘闪烁
  ipcRenderer.send('trayFlicker')
}

export const qtBackupsMessage = (exportPath, content) => {
  console.log('qtBackupsMessageFlag', exportPath, content)
  saveContent2Disk(exportPath, content)
}

export const saveContent2Disk = (exportPath, content) => {
  fs.writeFile(exportPath, content, {}, (err) => {
    console.log(err)
  })
}

export const msgAudioPlay = () => {
  // var audio = new Audio('../assets/audio/msg.wav');
  // console.log('msgAudioPlay:::', audio)
  // audio.play();
}

export function getRemoteAreaInfo (userName) {
  return request.get('/syntoim/rest/user/storage/' + userName)
}

export function resetRemoteMessageArea (userName){
  return request.put('/syntoim/rest/user/storage/' + userName + '/cleanmsg')
}

export function resetRemoteFileArea (userName) {
  return request.put('/syntoim/rest/user/storage/' + userName + '/cleanfile')
}
