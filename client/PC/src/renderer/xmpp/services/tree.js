// 过滤子节点成员基本信息
export function filterNodeMemberData (data, xmppDomain, groupName) {
  const result = []
  // let userJid = JSON.parse(localStorage.getItem('account')).username + xmppDomain
  data.forEach(item => {
    const obj = {}
    obj.jid = `${item.username}${xmppDomain}`
    obj.groupName = groupName
    obj.groupCode = item.groupCode
    obj.label = item.name
    obj.name = item.name
    obj.sign = 'user'
    obj.photo = item.photo
    obj.status = item.online !== 0 ? 'online' : 'offline'
    if (obj.status === 'online') {
      result.unshift(obj)
    } else {
      result.push(obj)
    }
  })
  return result
}

// 递归设置子节点成员的基本信息(成员jid)
export function recursionSetNodeMemberInfo (data, members) {
  function toParse (arr, members) {
    arr.forEach(item => {
      if (item.sign === 'group' && item.id === members[0].groupCode) {
        // 获取第一个不是子目录的位置
        let index = item.children.findIndex(item => { return item.jid })
        if (index > -1) {
          item.children.splice(index)
        }
        let result = []
        members.forEach(i => {
          let j = item.children.findIndex(item => { return item.status === 'online' })
          if (i.status === 'online') {
            if (j > -1) {
              result.splice(j + 1, 0, i)
            } else {
              result.unshift(i)
            }
          } else {
            result.push(i)
          }
        })
        result.forEach(i => {
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
