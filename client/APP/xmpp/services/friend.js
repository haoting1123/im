import globalStatus from '../global'
import X2js from 'xml2js'
const { xml } = require('@xmpp/client')

// 登录成功，获取基本信息（通讯录和群组）
export function filterUserBaseInfo (data, xmppDomain) {
  const baseinfo = {
    friendList: [],
    groupList: [],
    userInfo: {}
  }
  data.data.friends.forEach(item => {
    let vcard = {}
    if (item.vcard) {
      X2js.parseString(item.vcard, function (err, result) {
        vcard = result
      })
    }
    const obj = {
      friendJid: item.friendJid,
      groupName: item.groupName,
      groupCode: item.code,
      jid: item.friendJid,
      account: item.friendJid.split('@')[0],
      alias: item.alias,
      name: vcard ? (vcard.vCard && vcard.vCard.name ? vcard.vCard.name[0] : '') : '',
      label: vcard ? (vcard.vCard && vcard.vCard.name ? vcard.vCard.name[0] : '') : '',
      sex: vcard ? (vcard.vCard && vcard.vCard.sex ? vcard.vCard.sex[0] : '') : '',
      photo: vcard ? (vcard.vCard && vcard.vCard.photo ? vcard.vCard.photo[0] : '') : '',
      // photo: '',
      rightKeyMenu: false,
      username: item.userName,
      id: item.id,
      sign: 'user',
      isStick: false
    }
    baseinfo.friendList.push(obj)
  })
  // 设置置顶用户
  {
    if (uni.getStorageSync('stickFriendList')) {
      let list = uni.getStorageSync('stickFriendList')
      list.forEach(item => {
        baseinfo.friendList.forEach(i => {
          if (i.jid === item) {
            i.isStick = true
          }
        })
      })
    }
  }
 
  // 用户信息
  let userVCard = ''
  if (!userVCard) {
    X2js.parseString(data.data.userinfo.vcard, function (err, result) {
      userVCard = result
    })
  }
  baseinfo.userInfo = {
    id: data.data.userinfo.id,
    name: userVCard ? (userVCard.vCard ? userVCard.vCard.name[0] : '') : '',
    label: userVCard ? (userVCard.vCard ? userVCard.vCard.name[0] : '') : '',
    jid: `${data.data.userinfo.username}${xmppDomain}`,
    account: data.data.userinfo.username,
    friendJid: `${data.data.userinfo.username}${xmppDomain}`,
    sex: userVCard ? (userVCard.vCard ? userVCard.vCard.sex[0] : '') : '',
    photo: userVCard ? (userVCard.vCard ? userVCard.vCard.photo[0] : '') : '',
    // photo: '',
    sign: 'user',
    groupRootCode: data.data.userinfo.groupRootCode,
    groupCode: data.data.userinfo.groupCode,
    groupName: data.data.userinfo.groupName
  }

  data.data.rooms.forEach(item => {
    const obj = {
      jid: item.roomJid,
      name: item.name,
      rightKeyMenu: false,
      members: []
    }
    item.memberList.forEach(i => {
      let vcard = {}
      if (i.vcard) {
        X2js.parseString(i.vcard, function (err, result) {
          vcard = result
        })
      }
      if (i.jid === baseinfo.userInfo.jid) {
        obj.nickName = i.nickname ? i.nickname : baseinfo.userInfo.name
      }
      obj.members.push({
        jid: i.jid,
        affiliation: i.affiliation,
        name: vcard ? (vcard.vCard && vcard.vCard.name ? vcard.vCard.name[0] : '') : '',
        label: vcard ? (vcard.vCard && vcard.vCard.name ? vcard.vCard.name[0] : '') : '',
        photo: vcard ? (vcard.vCard && vcard.vCard.photo ? vcard.vCard.photo[0] : '') : '',
        // photo: '',
        sex: vcard ? (vcard.vCard && vcard.vCard.sex ? vcard.vCard.sex[0] : '') : '',
        rightKeyMenu: false,
        sign: 'user',
        account: i.jid.split('@')[0],
        nickName: i.nickname ? i.nickname : (vcard ? (vcard.vCard && vcard.vCard.name ? vcard.vCard.name[0] : '') : '')
      })
    })
    baseinfo.groupList.push(obj)
  })
  uni.setStorageSync('systemConfig', data.data.config)
  if (data.data.config) {
    if (data.data.config.sendFileSuffix) {
      uni.setStorageSync('sendFileSuffix', data.data.config.sendFileSuffix)
    }
    if (data.data.config.sendFileSize) {
      uni.setStorageSync('sendFileSize', data.data.config.sendFileSize)
    }
    if (data.data.config.chatLogStorage) {
      uni.setStorageSync('global_message_remote_save', data.data.config.chatLogStorage)
    }
    // 服务端聊天记录总共大小
    if (data.data.config.storageFileSize) {
      uni.setStorageSync('global_file_remote_area', data.data.config.storageFileSize)
    }
    if (data.data.config.storageMsgSize) {
      uni.setStorageSync('global_message_remote_area', data.data.config.storageMsgSize)
    }
    if (data.data.config.kbMsgNumber) {
      uni.setStorageSync('global_remote_area_unit', data.data.config.kbMsgNumber)
    }
		// 获取服务器时间计算时差
		if (data.data.config.serverTimestamp) {
			let nowDate = new Date().getTime()
			let timeDifference = nowDate - parseInt(data.data.config.serverTimestamp)
		  uni.setStorageSync('global_server_time', data.data.config.serverTimestamp)
			uni.setStorageSync('global_time_difference', timeDifference)
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
