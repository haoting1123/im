import request from '../utils/request'

// 用户登录
export function loginRequest (data) {
  return request({
    url: '/syntoim/rest/um/login',
    method: 'post',
    data: data
  })
}

// 获取好友列表
export function getFriendListRequest (username) {
  return request({
    url: `/syntoim/rest/contact/select/${username}`,
    method: 'get'
  })
}

// 添加好友
export function addFriendRequest (data) {
  return request({
    url: '/syntoim/rest/contact/add',
    method: 'post',
    data
  })
}

// 删除好友
export function deleteFriendRequest (data) {
  return request({
    url: `/syntoim/rest/contact/delete/${data.username}/${data.friendname}`,
    method: 'delete'
  })
}

// 搜索好友
export function searchFriendRequest (data) {
  return request({
    url: `/syntoim/rest/contact/like/${data.username}/${data.key}`,
    method: 'get'
  })
}

// 设置好友备注
export function setFriendAliasRequest (data) {
  return request({
    url: `/syntoim/rest/contact/${data.id}`,
    method: 'put',
    data
  })
}

// 获取群离线消息
export function getOfflineMessage (params) {
  return request({
    url: '/syntoim/rest/muc/offlinemessage',
    method: 'get',
    params: params
  })
}

// 获取成员信息(组织结构)
export function getMemberInfoRequest (account) {
  return request({
    url: `/syntoim/rest/user/username/${account}/vo`,
    method: 'get'
  })
}

// 获取系统公告
export function getSystemNoticeRequest (params) {
  return request({
    url: '/syntoim/rest/notice/codes/list',
    method: 'get',
    params: params
  })
}

// 获取最新系统公告
// export function getSystemNoticeRequest (params) {
//   return request({
//     url: '/syntoim/rest/notice/unread',
//     method: 'get',
//     params
//   })
// }
