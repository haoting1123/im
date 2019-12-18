// import {
//   getFriendList
//   filterUserInfo,
//   filterFriendInfo
//   getUserInfo
//   aggreeDelete
// } from './friend'
import store from '../../store'
// import globalStatus from './global'

// 获取每个成员的唯一值（id）
export const getStanzaCode = (stanza) => {
  const { type, from } = stanza.attrs
  // const stancaCode = `${stanza.name}:${type || ''}:${(from || '').split('/')[0]}`
  let stancaCode = `${stanza.name}:${type || ''}${stanza.children.length > 0 ? `:${stanza.children[0].name}` : ''}`
  // 区分获取好友信息/获取用户信息
  if (stancaCode === 'iq:result:vCard' && from) stancaCode += ':friend'
  return stancaCode
}

// 获取信息内容
const privateChatHandler = (stanza) => {
  const from = stanza.attrs.from.split('/')[0]
  const body = stanza.getChild('body')
  const delay = stanza.getChild('delay')
  if (!body) return
  const message = body.text()
  const type = 'P'
  let retObj = { from, message, type }
  if (delay) {
    retObj.delay = delay.attrs.stamp
  }
  // TODO 消息收到后插入数据库并更新信息列表和会话列表
  store.dispatch('receiveMessage', retObj)
  return retObj
}

// const searchRoomsHandler = (stanza) => {
//   const rooms = stanza.children[0].children.map(x => {
//     return { address: x.attrs['jid'], name: x.attrs['name'] }
//   })
//   return rooms
// }

const groupChatHandler = (stanza) => {
  const { from } = stanza.attrs
  const subject = stanza.getChild('subject')
  const sender = from.split('/')[1]
  const body = stanza.getChild('body')
  if (!body) return
  const message = body.text()
  const type = 'G'
  let retObj = {sender, from, message, type}

  store.dispatch('receiveMessage', retObj)
  // TODO: Too ugly, refactor
  return { sender, message: message ? message.text() : undefined, subject: subject ? subject.text() : undefined }
}

const groupChatPresenceHandler = (stanza) => {
  const from = stanza.attrs.from.split('/')[1]
  const child = stanza.getChildren('x')[1]
  if (!child) return
  const data = { user: child.getChild('item').attrs.jid, status: child.getChild('status') ? child.getChild('status').attrs.code : undefined, from }
  console.log('--------')
  console.log(data)
  console.log('--------')
  return data
}

// 根据消息类型返回相应的处理函数
export const handlerFactory = (stanzaCode) => {
  const split = stanzaCode.split(':')
  const stanzaType = split[0]
  const type = split[1]
  console.log(stanzaType, type)

  // This is good enough for now; TODO: Make this more functional
  // if (stanzaCode === 'iq:result:vCard') return filterUserInfo
  // if (stanzaCode === 'iq:result:vCard:friend') return filterFriendInfo
  if (stanzaType === 'message' && type === 'groupchat') return groupChatHandler
  if (stanzaType === 'message' && type === 'chat') return privateChatHandler
  // message:chat:body
  // if (stanzaCode === 'presence:subscribe:extra' || stanzaCode === 'presence:subscribe') return addFriendHandler
  // || stanzaCode === 'iq:set:query'
  // if (stanzaCode === 'iq:result:query') return getFriendList
  // if (stanzaCode === 'presence:unsubscribe') return aggreeDelete
  // if (stanzaCode === 'iq:result:bind') return getUserInfo
  // if (stanzaType === 'iq') return searchRoomsHandler
  // if (stanzaType === 'presence' && type === 'subscribe') return addFriendHandler
  if (stanzaType === 'presence') return groupChatPresenceHandler
}
