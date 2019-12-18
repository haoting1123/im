import globalStatus from '../global'
import X2js from 'x2js'
const { xml } = require('@xmpp/client')

// 登录成功，获取基本信息（通讯录和群组）
export function filterUserBaseInfo (data, xmppDomain) {
  const x2js = new X2js()
  const baseinfo = {
    friendList: [],
    groupList: [],
    userInfo: {}
  }
  data.data.friends.forEach(item => {
    const vcard = item.vcard ? x2js.xml2js(item.vcard) : ''
    const obj = {
      friendJid: item.friendJid,
      groupName: item.groupName,
      groupCode: item.code,
      jid: item.friendJid,
      alias: item.alias,
      name: vcard ? (vcard.vCard ? vcard.vCard.name : '') : '',
      label: vcard ? (vcard.vCard ? vcard.vCard.name : '') : '',
      sex: vcard ? (vcard.vCard ? vcard.vCard.sex : '') : '',
      photo: vcard ? (vcard.vCard ? vcard.vCard.photo : '') : '',
      rightKeyMenu: false,
      username: item.userName,
      id: item.id,
      sign: 'user',
      account: item.friendJid.split('@')[0]
    }
    baseinfo.friendList.push(obj)
  })
  data.data.rooms.forEach(item => {
    const obj = {
      jid: item.roomJid,
      name: item.name,
      rightKeyMenu: false,
      members: []
    }
    item.memberList.forEach(i => {
      const vcard = i.vcard ? x2js.xml2js(i.vcard) : ''
      obj.members.push({
        jid: i.jid,
        affiliation: i.affiliation,
        name: vcard ? (vcard.vCard ? vcard.vCard.name : '') : '',
        label: vcard ? (vcard.vCard ? vcard.vCard.name : '') : '',
        photo: vcard ? (vcard.vCard ? vcard.vCard.photo : '') : '',
        sex: vcard ? (vcard.vCard ? vcard.vCard.sex : '') : '',
        rightKeyMenu: false,
        sign: 'user'
      })
    })
    baseinfo.groupList.push(obj)
  })
  // 用户信息
  const userVCard = data.data.userinfo.vcard ? x2js.xml2js(data.data.userinfo.vcard) : ''
  console.log(userVCard)
  baseinfo.userInfo = {
    id: data.data.userinfo.id,
    name: userVCard ? (userVCard.vCard ? userVCard.vCard.name : '') : '',
    label: userVCard ? (userVCard.vCard ? userVCard.vCard.name : '') : '',
    jid: `${data.data.userinfo.username}${xmppDomain}`,
    friendJid: `${data.data.userinfo.username}${xmppDomain}`,
    sex: userVCard ? (userVCard.vCard ? userVCard.vCard.sex : '') : '',
    photo: userVCard ? (userVCard.vCard ? userVCard.vCard.photo : '') : '',
    sign: 'user',
    account: data.data.userinfo.username,
    groupRootCode: data.data.userinfo.groupRootCode,
    groupCode: data.data.userinfo.groupCode
  }
  if (data.data.sessionID) {
    localStorage.setItem('sessionID', data.data.sessionID)
  }
  window.localStorage.setItem('systemConfig', JSON.stringify(data.data.config))
  if (data.data.config) {
    if (data.data.config.sendFileSuffix) {
      localStorage.setItem('sendFileSuffix', data.data.config.sendFileSuffix)
    }
    if (data.data.config.sendFileSize) {
      localStorage.setItem('sendFileSize', data.data.config.sendFileSize)
    }
    if (data.data.config.chatLogStorage) {
      localStorage.setItem('global_message_remote_save', data.data.config.chatLogStorage)
    }
    // 服务端聊天记录总共大小
    if (data.data.config.storageFileSize) {
      localStorage.setItem('global_file_remote_area', data.data.config.storageFileSize)
    }
    if (data.data.config.storageMsgSize) {
      localStorage.setItem('global_message_remote_area', data.data.config.storageMsgSize)
    }
    if (data.data.config.kbMsgNumber) {
      localStorage.setItem('global_remote_area_unit', data.data.config.kbMsgNumber)
    }
    // 获取服务器时间计算时差
    if (data.data.config.serverTimestamp) {
      let nowDate = new Date().getTime()
      let timeDifference = (nowDate - parseInt(data.data.config.serverTimestamp))
      localStorage.setItem('global_server_time', data.data.config.serverTimestamp)
      localStorage.setItem('global_time_difference', timeDifference)
    }
  }
  return baseinfo
}

// 获取好友列表
export function getFriendList (stanza) {
  // console.log('提取获取好友列表', stanza.children[0].children)
  const result = []
  const friendList = stanza.children[0].children
  friendList.forEach(item => {
    // 好友尚未同意订阅
    if (item.attrs.subscription === 'none') return
    const obj = {}
    obj.name = item.attrs.jid.split('@')[0]
    obj.id = item.attrs.jid
    obj.rightKeyMenu = false
    result.push(obj)
  })
  // globalStatus['iq:result:query'](result)
  return result
}

// 过滤用户信息
export function filterUserInfo (stanza) {
  const user = filterInfo(stanza)
  return user
  // globalStatus['iq:result:vCard'](user)
}

// 过滤好友信息
export function filterFriendInfo (stanza) {
  const friend = filterInfo(stanza)
  return friend
  // globalStatus['iq:result:vCard:friend'](friend)
}

// 过滤好友信息
export function filterMemberInfo (stanza) {
  const friend = filterInfo(stanza)
  return friend
  // globalStatus['iq:result:vCard:friend'](friend)
}

function filterInfo (stanza) {
  const user = {}
  user.jid = stanza.attrs.to.split('/')[0]
  user.rightKeyMenu = false
  if (stanza.attrs.from) {
    user.jid = stanza.attrs.from
  }
  const data = stanza.children[0].children
  data.forEach(item => {
    switch (item.name) {
      case 'name':
        user.name = item.children[0]
        break
      case 'sex':
        user.sex = item.children[0]
        break
      default:
        user.photo = item.children ? item.children[0] : ''
    }
  })
  return user
}

// 收到对方取消订阅，同意取消订阅
export function aggreeDelete (xmppClient, data) {
  xmppClient.send(
    xml('iq', { type: 'set' },
      xml('query', { xmlns: 'jabber:iq:roster' },
        xml('item', { jid: data.id, subscription: 'remove' })
      )
    )
  )
}

// 监听好友上线/下线
export function friendStatusListenerXMPP (callback) {
  globalStatus['presence::oline'] = callback
  globalStatus['presence:unavailable:offline'] = callback
}
