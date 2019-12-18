import globalStatus from '../global'
import { xmppClient } from '../index'
import X2js from "xml2js";
// import X2js from 'x2js'
const { xml } = require('@xmpp/client')

// 获取群组基本信息
export function getGroupBaseInfoXMPP (group, callback) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('iq', { id: id, to: group.jid, type: 'get' },
      xml('query', { xmlns: 'http://jabber.org/protocol/disco#info' })
    )
  )
  globalStatus['iq:result:query:group'] = callback
}

// 过滤群基本信息
export function filterGroupBaseInfo (data) {
  const group = {}
  group.id = data.attrs.from
  group.name = data.children[0].children[0].attrs.name
  const info = data.children[0].children.filter(item => {
    return item.name === 'x'
  })
  info[0].children.forEach(item => {
    switch (item.attrs.var) {
      case 'FORM_TYPE':
        group.type = item.attrs.type
        break
      case 'muc#roominfo_description':
        group.desc = item.children[0].children[0]
        break
      case 'muc#roominfo_occupants':
        group.occupants = item.children[0].children[0]
        break
      case 'x-muc#roominfo_creationdate':
        group.time = item.children[0].children[0]
    }
  })
  group.rightKeyMenu = false
  return group
}

// 进入房间
export function enterGroupXMPP (data) {
  xmppClient.send(
    xml('presence', { from: data.userJid, to: `${data.groupJid}/${data.userJid.split('@')[0]}-APP` })
  )
}

// 退出群组
export function exitGroupXMPP (data) {
  const id = Date.now().toString() + Math.floor(Math.random() * 10000 + 1)
  xmppClient.send(
    xml('iq', { id: id, type: 'set', xmlns: 'jabber:client' },
      xml('query', { xmlns: 'synto:im:muc:admin', to: data.groupJid },
        xml('item', { affiliation: 'none', jid: data.userJid })
      )
    )
  )
  // xmppClient.send(
  //   xml('presence', { from: data.userJid, to: `${data.groupJid}/${data.userJid.split('@')[0]}`, type: 'unavailable' })
  // )
}

// 监听群组邀请
export function groupInviteListenerXMPP (callback) {
  globalStatus['message::addmember'] = callback
}

export function filterGroupInviteInfoXMPP (stanza) {
  const group = {}
  group.groupJid = stanza.attrs.from
  group.fromJid = stanza.children[1].children[0].attrs.from
  group.userJid = stanza.attrs.to
  return group
}

// 过滤出游客信息（同意加入群组）
export function filterVisitorInfoXMPP (stanza) {
  const data = {
    userJid: stanza.attrs.to.split('/')[0],
    visitorJid: stanza.children[0].children[0].attrs.jid.split('/')[0],
    groupJid: stanza.attrs.from.split('/')[0]
  }
  return data
}

// 删除成员资格
export function deleteMemberPermissionsXMPP (data) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('iq', { id: id, to: data.groupJid, type: 'set' },
      xml('query', { xmlns: 'http://jabber.org/protocol/muc#admin' },
        xml('item', { affiliation: 'none', jid: data.memberJid })
      )
    )
  )
}

// 添加普通成员
export function addGroupMemberXMPP (data, xmppDomain) {
  // const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    // xml('message', { from: data.userJid, to: data.groupJid, id: id },
    xml('message', { from: data.userJid, to: data.groupJid },
			xml('addmember', null, ''),
      xml('x', { xmlns: 'http://jabber.org/protocol/muc#user' },
        xml('invite', { to: data.member },
          xml('reason', null, 'join us')
        )
      )
    )
  )
  // xmppClient.send(
  //   xml('message', { from: data.groupJid, to: data.member },
  //     xml('x', { xmlns: 'http://jabber.org/protocol/muc#user' },
  //       xml('invite', { from: data.userJid },
  //         xml('reason', null, '加入我们吧')
  //       )
  //     )
  //   )
  // )
}

// 拒绝群组邀请
export function rejectInviteXMPP (data) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('message', { id: id, to: data.groupJid },
      xml('x', { xmlns: 'http://jabber.org/protocol/muc#user' },
        xml('decline', { to: data.fromJid },
          xml('reason', null, '不用啦，谢谢！')
        )
      )
    )
  )
}

// 获取群组成员
export function getGroupMemberXMPP (data, callback) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('iq', { id: id, type: 'get', from: data.userJid },
      xml('query', { xmlns: 'synto:im:muc:member', to: data.groupJid })
    )
  )
  globalStatus['iq:result:query:groupMember'] = callback
}

// 过滤出群组成员
export function filterGroupMemberXMPP (stanza) {
  let group = []
  X2js.parseString(stanza.toString(), function (err, result) {
    group = result.iq
  })
  let result = {
    jid: group.$.from,
    members: []
  }
  if (Object.prototype.toString.call(group.query[0].item) === '[object Array]') {
    group.query[0].item.forEach(item => {
      let obj = {
        jid: item.$.jid,
        affiliation: item.$.affiliation,
        name: item.vCard[0].name[0],
        photo: item.vCard[0].photo[0],
        sex: item.vCard[0].sex[0]
      }
      result.members.push(obj)
    })
  } else {
    console.log('只有一个成员+++++++')
    let obj = {
      jid: group.query.item._jid,
      affiliation: group.query.item._affiliation,
      name: group.query.item.vCard.name,
      photo: group.query.item.vCard.photo,
      sex: group.query.item.vCard.sex
    }
    result.members.push(obj)
  }
  return result
}

// 获取群聊列表
export function getGroupListXMPP (xmppGroupDomain, callback) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('iq', { id: id, to: xmppGroupDomain, type: 'get' },
      xml('query', { xmlns: 'http://jabber.org/protocol/disco#items' })
    )
  )
  globalStatus['iq:result:query:grouplist'] = callback
}

// 过滤群组数据
export function filterGroupList (stanza) {
  const result = []
  const data = stanza.children[0].children
  data.forEach(item => {
    result.push({ ...item.attrs })
  })
  return result
}

// 创建群聊
export function createGroupXMPP (data, callback) {
  const id = Math.random().toString(36).substr(2, 10)
  const groupName = `${Date.now()}${Math.floor(Math.random() * 10000 + 1)}`
  xmppClient.send(
    xml('presence', { id: id, to: `${groupName}${data.xmppGroupDomain}/${data.userName}` },
      xml('x', { xmlns: 'http://jabber.org/protocol/muc' })
    )
  )
  globalStatus['presence::x:createGroup'] = callback
}

// 保存为永久群
export function saveGroupXMPP (data, callback) {
  // const id = Math.random().toString(36).substr(2, 10)
  const id = Date.now()
  xmppClient.send(
    xml('iq', { id: id, to: data.groupJid, type: 'set' },
      xml('query', { xmlns: 'http://jabber.org/protocol/muc#owner' },
        xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
          xml('field', { var: 'FORM_TYPE', type: 'hidden' },
            xml('value', null, 'http://jabber.org/protocol/muc#roomconfig')
          ),
          // 群名
          xml('field', { var: 'muc#roomconfig_roomname', type: 'text-single' },
            xml('value', null, data.groupName)
          ),
          // 群描述
          xml('field', { var: 'muc#roomconfig_roomdesc', type: 'text-single' },
            xml('value', null, '')
          ),
          // 保存为永久群
          xml('field', { var: 'muc#roomconfig_persistentroom', type: 'boolean' },
            xml('value', null, 1)
          ),
          // 群主
          xml('field', { var: 'muc#roomconfig_roomowners', type: 'jid-multi' },
            xml('value', null, data.groupOwner)
          ),
          // 允许邀请
          xml('field', { var: 'muc#roomconfig_allowinvites' },
            xml('value', null, 1)
          ),
          // 是否为公开群
          xml('field', { var: 'muc#roomconfig_publicroom' },
            xml('value', null, 0)
          ),
          // 仅限成员可用
          xml('field', { var: 'muc#roomconfig_membersonly', type: 'jid-multi' },
            xml('value', null, 1)
          )
        )
      )
    )
  )
}

// 过滤出保存永久群聊的数据
export function filterSaveGroupData (stanza) {
  const result = {}
  result.groupJid = stanza.attrs.from.split('/')[0]
  result.groupOwner = stanza.attrs.to.split('/')[0]
  return result
}

// 设置群中昵称
export function SetAliasToGroupXMPP (data) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('presence', { id: id, to: `${data.groupJid}/${data.alias}` })
  )
}

// 修改群昵称和描述
export function setGroupNameXMPP (data) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('iq', { id: id, from: data.jid, to: data.groupJid, type: 'set' },
      xml('query', { xmlns: 'http://jabber.org/protocol/muc#owner' },
        xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
          xml('field', { var: 'FORM_TYPE' },
            xml('value', null, 'http://jabber.org/protocol/muc#roomconfig')
          ),
          xml('field', { var: 'muc#roomconfig_roomname' },
            xml('value', null, data.groupName)
          )
          // xml('field', { var: 'muc#roomconfig_roomdesc' },
          //   xml('value', null, '')
          // )
          // xml('field', { var: 'muc#roomconfig_enablelogging' },
          //   xml('value', null, 0)
          // ),
          // 改变话题
          // xml('field', { var: 'muc#roomconfig_changesubject' },
          //   xml('value', null, 1)
          // ),
          // xml('field', { var: 'muc#roomconfig_allowinvites' },
          //   xml('value', null, 0)
          // ),
          // 最大成员数
          // xml('field', { var: 'muc#roomconfig_maxusers' },
          //   xml('value', null, 30)
          // ),
          // xml('field', { var: 'muc#roomconfig_publicroom' },
          //   xml('value', null, 0)
          // ),
          // 持续的房间
          // xml('field', { var: 'muc#roomconfig_persistentroom' },
          //   xml('value', null, 0)
          // ),
          // 主持的房间
          // xml('field', { var: 'muc#roomconfig_moderatedroom' },
          //   xml('value', null, 0)
          // ),
          // 成员仅有
          // xml('field', { var: 'muc#roomconfig_membersonly' },
          //   xml('value', null, 0)
          // ),
          // 密码保护的房间
          // xml('field', { var: 'muc#roomconfig_passwordprotectedroom' },
          //   xml('value', null, 1)
          // ),
          // 秘密房间
          // xml('field', { var: 'muc#roomconfig_roomsecret' },
          //   xml('value', null, 'cauldronburn')
          // ),
          // 域名查询服务
          // xml('field', { var: 'muc#roomconfig_whois' },
          //   xml('value', null, 'moderators')
          // ),
          // 房间管理员
          // xml('field', { var: 'muc#roomconfig_roomadmins' })
        )
      )
    )
  )
}

// 解散群组
export function destoryGroupXMPP (data) {
  const id = Math.random().toString(36).substr(2, 10)
  // xmppClient.send(
  //   xml('iq', { id: id, type: 'set', from: data.jid },
  //     xml('query', { xmlns: 'synto:im:muc:owner', to: data.groupJid },
  //       xml('destroy', null,
  //         xml('reason', null, '群主已解散群聊!')
  //       )
  //     )
  //   )
  // )
  xmppClient.send(
    xml('iq', { id: id, to: data.groupJid, type: 'set' },
      xml('query', { xmlns: 'http://jabber.org/protocol/muc#owner' },
        xml('destroy', { jid: data.groupJid },
          xml('reason', null, '群组已解散!')
        )
      )
    )
  )
}

// 群组解散监听
export function destoryGroupListenerXMPP (callback) {
  globalStatus['presence:unavailable:x:destroyGroup'] = callback
}

// 被踢出群组监听
export function putForwardGroupListenerXMPP (callback) {
  globalStatus['presence:unavailable:x:putForwardGroup'] = callback
}
