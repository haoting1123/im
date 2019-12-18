import { createXmppClient } from './client'
// import { getStanzaCode, handlerFactory } from './services/stanzaService'
// import { getStanzaCode } from './services/stanzaService'
import globalStatus from './global'
import store from '../store'
const { xml } = require('@xmpp/client')
export let xmppClient = null

// 用户登录(注册本地服务)
export function createXMPPClient (credentials) {
  xmppClient = createXmppClient(credentials, (stanza) => {
    // console.log('创建本地服务器')
    const stanzaCode = getStanzaCode(stanza)
    // console.log('api:1:' + JSON.stringify(stanzaCode))
    // 登录
    // if (stanzaCode === 'iq:result:bind') globalStatus[stanzaCode] = callback
    // 同意取消订阅
    // if (stanzaCode === 'presence:unsubscribe') globalStatus['presence:unsubscribe']()
    // 好友同意订阅
    // if (stanzaCode === 'presence:subscribed') globalStatus['presence:subscribed']()
    // const stanzaHandler = handlerFactory(stanzaCode)
    // if (typeof stanzaHandler === 'function') stanzaHandler(stanza)

    // 如果未登录，需要在client中调用
    if (stanzaCode === 'iq:result:bind') return
    if (stanzaCode === 'message:chat:body') return privateChatHandler(stanza)
    if (stanzaCode === 'message:groupchat:body') return groupChatHandler(stanza)
    if (typeof globalStatus[stanzaCode] === 'function') {
      globalStatus[stanzaCode](stanza)
    }
  })
}

// 获取每个成员的唯一值（id）
const getStanzaCode = (stanza) => {
  // console.log('stanza.attrs::' + JSON.stringify(stanza.attrs))
  const { type, from } = stanza.attrs
  // const stancaCode = `${stanza.name}:${type || ''}:${(from || '').split('/')[0]}`
  let stancaCode = `${stanza.name}:${type || ''}${stanza.children.length > 0 ? `:${stanza.children[0].name}` : ''}`
  // 创建临时群组
  if (stancaCode === 'presence::x' && stanza.children[0].children.length === 4 && stanza.children[0].children[0].attrs.affiliation === 'owner') stancaCode += ':createGroup'
  // 区分获取好友信息/获取用户信息
  if (stancaCode === 'iq:result:vCard' && from) stancaCode += ':friend'
  // 监听成员同意群组邀请
  // if (stancaCode === 'presence::x' && (stanza.children[0].children.length === 1 && stanza.children[0].children[0].attrs.role === 'participant')) stancaCode += ':setpermissions'
  // 解散房间
  if (stancaCode === 'presence:unavailable:x' && stanza.children[0].children[1] && stanza.children[0].children[1].children[0] && stanza.children[0].children[1].children[0].children[0] === '群组已解散!') stancaCode += ':destroyGroup'
  // 被提出房间/或退出房间
  if (stancaCode === 'presence:unavailable:x' && stanza.children[0].children[0] && stanza.children[0].children[0].attrs.affiliation === 'none') stancaCode += ':putForwardGroup'
  // 获取系统公告
  if (stancaCode === 'message::body' && stanza.attrs.from && stanza.attrs.from.indexOf('@') === -1) stancaCode += ':systemNotice'
  // 获取群成员
  if (stancaCode === 'iq:result:query' && stanza.children[0].attrs.xmlns === 'synto:im:muc:member') stancaCode += ':groupMember'
  // 区分群组或单个好友列表
  if (stancaCode === 'iq:result:query' && stanza.children[0].attrs.xmlns === 'http://jabber.org/protocol/disco#items') stancaCode += ':grouplist'
  // 区别群组信息
  if (stancaCode === 'iq:result:query' && stanza.children[0].attrs.xmlns === 'http://jabber.org/protocol/disco#info') stancaCode += ':group'
  return stancaCode
}

// 监听用户登录
export function loginListenerXMPP (callback) {
  globalStatus['iq:result:bind'] = callback
}

// 接收私聊信息内容
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
	const synto = stanza.getChild('synto')
  if (synto) {
    const timestamp = synto.getChild('timestamp').text()
    retObj.createTime = timestamp
  }
  let messageType = body.attrs.messageType
  // 处理群其他消息，不存在则是普通消息
  if (messageType) {
    retObj.messageType = messageType
    store.dispatch('receiveOtherMessage', retObj)
    return retObj
  }
  const fileType = body.attrs.fileType
  if (fileType) {
    retObj.fileType = fileType
  }
  const signId = body.attrs.signId
  if (signId) {
    retObj.signId = signId
  }

  const chatType = body.attrs.chatType
  if (chatType) {
    retObj.chatType = chatType
  }
  // TODO 消息收到后插入数据库并更新信息列表和会话列表
  store.dispatch('receiveMessage', retObj)
  return retObj
}

// 接收群组聊天内容
const groupChatHandler = (stanza) => {
  let { from, to } = stanza.attrs
  // const subject = stanza.getChild('subject')
  const sender = from.split('/')[1]
  from = from.split('/')[0]
  to = to.split('@')[0]
  // 如果发送人和接收人相同则拒收
  if (to === sender) return
	if ((to + '-APP') === sender) return
  const body = stanza.getChild('body')
  // 如果消息为空则拒收
  if (!body) return
  const message = body.text()
  const type = 'G'
  let retObj = {sender, from, message, type}
	const synto = stanza.getChild('synto')
  if (synto) {
    const timestamp = synto.getChild('timestamp').text()
    retObj.createTime = timestamp
  }
  let messageType = body.attrs.messageType
  // 处理群其他消息，不存在则是普通消息
  if (messageType) {
    retObj.messageType = messageType
    store.dispatch('receiveGroupOtherMessage', retObj)
    return retObj
  }
  const fileType = body.attrs.fileType
  if (fileType) {
    retObj.fileType = fileType
  }
  const signId = body.attrs.signId
  if (signId) {
    retObj.signId = signId
  }
  store.dispatch('receiveMessage', retObj)
  // TODO: Too ugly, refactor
  return retObj
}

// 获取用户信息
export function getUserInfoXMPP (from, callback) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('iq', { id: id, from: from, type: 'get' },
      xml('vCard', { xmlns: 'vcard-temp' })
    )
  )
  globalStatus['iq:result:vCard'] = callback
}

// 更新用户信息
export function updateUserInfoXMPP (data) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('iq', { id: id, from: `${data.id}/Spark`, type: 'set' },
      xml('vCard', { xmlns: 'vcard-temp' },
        xml('name', null, data.name),
        xml('sex', null, data.sex),
        xml('photo', null, data.photo)
      )
    )
  )
}

// 用户退出登录，销毁客户端
export function logonXMPP () {
  // xmppClient.send(
  //   //   xml('presence', { type: 'unavailable' })
  //   // )
  xmppClient.stop()
}

// 监听系统公告
export function systemNoticeListenerXMPP (callback) {
  globalStatus['message::body:systemNotice'] = callback
}

// 异常登录 => 被挤下线
export function loginAbnormalListenerXMPP (callback) {
  globalStatus['abnormal:login:offline'] = callback
}

export function sendMessageXMPP (data) {
  // console.log('发送消息')
  const { to, message } = data
  if (data.fileType) {
    xmppClient.send(
      xml('message', { to, type: 'chat' },
        xml('body', {fileType: data.fileType, signId: data.signId, chatType: data.chatType}, message)
      )
    )
  } else {
		console.log('///////////////'+data.chatType)
    xmppClient.send(
      xml('message', { to, type: 'chat' },
        xml('body', {chatType: data.chatType, signId: data.signId}, message)
      )
    )
  }
}

export function sendGroupMessageXMPP (data) {
  // console.log('发送群组消息')
  const { to, message } = data
  if (data.fileType) {
    xmppClient.send(
      xml('message', { to, type: 'groupchat' },
        xml('body', {fileType: data.fileType, signId: data.signId}, message)
      )
    )
  } else {
    xmppClient.send(
      xml('message', { to, type: 'groupchat' },
        xml('body', {signId: data.signId}, message)
      )
    )
  }
}

// 发送群公告通知 type取值 notice:通知 update:更新状态
export function sendOtherMessageXMPP (data) {
  const { to, message, type } = data
  xmppClient.send(
    xml('message', { to, type: 'chat' },
      xml('body', {messageType: type}, message)
    )
  )
}

// 发送群公告通知 type取值 notice:通知 update:更新状态
export function sendGroupOtherMessageXMPP (data) {
  const { to, message, type } = data
  xmppClient.send(
    xml('message', { to, type: 'groupchat' },
      xml('body', {messageType: type}, message)
    )
  )
}

// 获取成员信息(组织结构)
// export function getMemberInfoXMPP (jid, callback) {
//   const id = Math.random().toString(36).substr(2, 10)
//   xmppClient.send(
//     xml('iq', { id: id, to: jid, type: 'get' },
//       xml('vCard', { xmlns: 'vcard-temp' },
//         xml('JABBERID', null, jid)
//       )
//     )
//   )
//   globalStatus['iq:result:vCard:friend'] = callback
// }
