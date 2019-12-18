import globalStatus from '../global'
import {xmppClient} from '../index'
// import normalUrl from '../../utils/normalAvatar'
// import X2js from 'x2js'
const { xml } = require('@xmpp/client')

// 递归请求搜友成员信息
// const result = []
export function recursionRequestMembers (data, xmppDomain, callback) {
  data.forEach(item => {
    if (item.sign === 'user') {
      const jid = `${item.id}${xmppDomain}`
      callback(jid)
    }
    if (item.children && item.children.length > 0) {
      recursionRequestMembers(item.children, xmppDomain, callback)
    }
  })
}

// 过滤子节点成员基本信息
export function filterNodeMemberData (data, xmppDomain, treeData) {
  let department = ''
  toParse(treeData, data[0])
  function toParse (arr, member) {
    arr.forEach(item => {
      if (item.sign === 'group' && item.id === member.groupCode) {
        department = item.label
      }
      if (item.children && item.children.length) {
        toParse(item.children, member)
      }
    })
  }
  const result = []
  data.forEach(item => {
    const obj = {}
    obj.jid = `${item.username}${xmppDomain}`
    obj.groupName = department
    obj.groupCode = item.groupCode
    obj.label = item.username
    obj.sign = 'user'
    result.push(obj)
  })
  return result
}

// 获取成员信息
export function getMemberInfoXMPP (jid, callback) {
  const id = Math.random().toString(36).substr(2, 10)
  xmppClient.send(
    xml('iq', { id: id, to: jid, type: 'get' },
      xml('vCard', { xmlns: 'vcard-temp' },
        xml('JABBERID', null, jid)
      )
    )
  )
  globalStatus['iq:result:vCard:friend'] = callback
}

// 递归设置子节点成员的基本信息(成员jid)
export function recursionSetNodeMemberInfo (data, members) {
  // data = data.slice()
  function toParse (arr, members) {
    arr.forEach(item => {
      if (item.sign === 'group' && item.id === members[0].groupCode) {
        members.forEach(i => {
          if (item.children.some(j => { return i.jid === j.jid })) return
          item.children.push(i)
        })
      }
      if (item.children && item.children.length) {
        toParse(item.children, members)
      }
    })
    return arr
  }
  return toParse(data, members)
}

// 递归设置子节点成员信息
export function recursionSetMemberInfo (data, member) {
  // data = data.slice()
  function toParse (arr, member) {
    arr.forEach(item => {
      if (item.sign === 'user' && item.jid === member.jid) {
        // item.jid = member.jid
        item.photo = member.photo
        item.sex = member.sex
        item.name = member.name
        item.label = member.name
        if (!item.label) {
          item.name = member.jid.split('@')[0]
          item.label = member.jid.split('@')[0]
          item.photo = normalUrl
        }
        if (!item.photo) item.photo = normalUrl
      }
      if (item.children && item.children.length) {
        toParse(item.children, member)
      }
    })
    return arr
  }
  return toParse(data, member)
}

// 递归设置搜索成员信息
export function recursionSetSearchMemberInfo (data, member) {
  function toParse (arr, member) {
    arr.forEach(item => {
      if (item.sign === 'group' && item.id === member.groupCode) {
        member.groupName = item.label
        if (item.children.some(i => { return i.jid === member.jid })) return
        item.children.push(member)
      }
      if (item.children && item.children.length) {
        toParse(item.children, member)
      }
    })
    return arr
  }
  return toParse(data, member)
}

// 递归更新子节点成员信息(删除好友/添加好友)
export function recursionUpdateTreeData (treeData, data) {
  function toParse (arr, jid) {
    arr.forEach(item => {
      if (item.sign === 'user' && item.jid === jid) {
        switch (data.type) {
          case 'deleteFriend':
            item.friendJid = ''
            break
          default:
            item.friendJid = jid
        }
      }
      if (item.children && item.children.length) {
        toParse(item.children, data.jid)
      }
    })
    return arr
  }
  return toParse(treeData, data.jid)
}
