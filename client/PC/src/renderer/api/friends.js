import requestUM from '@/utils/requestUM'
import request from '@/utils/request'

// 获取好友在线状态
export function getMemberOnlineStatusRequest (params) {
  return request({
    url: '/of/plugins/presence/status',
    method: 'get',
    params
  })
}

export const friendsApply = (apply) =>
  requestUM({
    url: '/syntoim/rest/friendsapply',
    method: 'POST',
    data: apply
  })

export const friendsApplyList = (id) =>
  requestUM({
    url: '/syntoim/rest/friendsapply/friendid/' + id,
    method: 'GET'
  })

export const friendsNotApplyCount = (id) =>
  requestUM({
    url: '/syntoim/rest/friendsapply/friendid/' + id + '/status2/count',
    method: 'GET'
  })

export const applyPass = (id) =>
  requestUM({
    url: '/syntoim/rest/friendsapply/' + id + '/pass',
    method: 'POST'
  })

export const applyNoPass = (id) =>
  requestUM({
    url: '/syntoim/rest/friendsapply/' + id + '/nopass',
    method: 'POST'
  })

export const friendsList = (id) =>
  requestUM({
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
  requestUM({
    url: '/syntoim/rest/friends/del/' + id + '/' + fid,
    method: 'DELETE'
  })

export const addFriend = (item) =>
  requestUM({
    url: '/syntoim/rest/friends/add',
    method: 'POST',
    data: item
  })

export const searchFriend = (id, name) =>
  requestUM({
    url: '/syntoim/rest/friends/' + id + '/search',
    method: 'GET',
    params: {
      name: name
    }
  })
