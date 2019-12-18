import request from '@/utils/request'

// 获取群组信息
export function getGroupInfoByRoomIdRequest (roomJid) {
    return request.get(`/syntoim/rest/room/${roomJid}`)
}

// 更新群组名称
export function updateGroupInfoByRoomIdRequest (data) {
    return request.put(`/syntoim/rest/room`, data)
}

// 更新在群组中的昵称
export function updateGroupMemberNameByRoomIdRequest (data) {
    return request.put('/syntoim/rest/room/member/nickname', data)
}
