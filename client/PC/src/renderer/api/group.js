import request from '@/utils/request'

// 获取群组信息
export function getGroupInfoByRoomIdRequest (roomJid) {
  return request({
    url: `/syntoim/rest/room/${roomJid}`,
    method: 'get'
  })
}

// 更新群组信息
export function updateGroupInfoByRoomIdRequest (data) {
  return request({
    url: `/syntoim/rest/room`,
    method: 'put',
    data: data
  })
}
