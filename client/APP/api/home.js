import request from '../utils/request'

// 获取好友列表
export function getFriendListRequest (username) {
  return request.get(`/syntoim/rest/contact/select/${username}`)
}

// 添加好友
export function addFriendRequest (data) {
  return request.post('/syntoim/rest/contact/add', data)
}

// 搜索好友
export function searchFriendRequest (data) {
  return request.get(`/syntoim/rest/contact/like/${data.username}/${data.key}`)
}

// 设置好友备注
export function setFriendAliasRequest (data) {
  return request.put(`/syntoim/rest/contact/${data.id}`, data)
}

// 获取群离线消息
export function getOfflineMessage (params) {
  return request.get('/syntoim/rest/muc/offlinemessage', params)
}

// 获取成员信息(组织结构)
export function getMemberInfoRequest (account) {
  return request.get(`/syntoim/rest/user/username/${account}/vo`)
}
