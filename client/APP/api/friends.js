import request from '@/utils/request'

// 获取好友在线状态
export function getMemberOnlineStatusRequest (params) {
  return request.get('/of/plugins/presence/status', params)
}

// 删除好友
export function deleteFriendRequest (data) {
  return request.delete(`/syntoim/rest/contact/delete/${data.username}/${data.friendname}`)
}

export const friendsApply = (apply) =>
  request({
    url: '/syntoim/rest/friendsapply',
    method: 'POST',
    data: apply
  })

export const friendsApplyList = (id) =>
  request({
    url: '/syntoim/rest/friendsapply/friendid/' + id,
    method: 'GET'
  })

export const friendsNotApplyCount = (id) =>
  request({
    url: '/syntoim/rest/friendsapply/friendid/' + id + '/status2/count',
    method: 'GET'
  })

export const applyPass = (id) =>
  request({
    url: '/syntoim/rest/friendsapply/' + id + '/pass',
    method: 'POST'
  })

export const applyNoPass = (id) =>
  request({
    url: '/syntoim/rest/friendsapply/' + id + '/nopass',
    method: 'POST'
  })

export const friendsList = (id) =>
  request({
    url: '/syntoim/rest/friends/' + id + '/list',
    method: 'GET'
  })

export const friendApplyNotice = (item) =>
  request({
    url: '/friendapply/ws',
    method: 'POST',
    data: item
  })

export const deleteFriend = (id, fid) =>
  request({
    url: '/syntoim/rest/friends/del/' + id + '/' + fid,
    method: 'DELETE'
  })

export const addFriend = (item) =>
  request({
    url: '/syntoim/rest/friends/add',
    method: 'POST',
    data: item
  })

export const searchFriend = (id, name) =>
  request({
    url: '/syntoim/rest/friends/' + id + '/search',
    method: 'GET',
    params: {
      name: name
    }
  })
