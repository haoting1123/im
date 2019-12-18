import request from '@/utils/request'
export const getGroupNotice = (dataParam) =>
  request({
    url: '/syntoim/rest/roomnotice/select/?roomJid=' + dataParam.roomJid + '&page=' + dataParam.page + '&size=' + dataParam.size,
    method: 'POST'
  })

export const deleteGroupNotice = (noticeId) =>
  request({
    url: '/syntoim/rest/roomnotice/' + noticeId,
    method: 'DELETE'
  })
export const addGroupNotice = (groupNotice) =>
  request({
    url: '/syntoim/rest/roomnotice',
    method: 'POST',
    data: groupNotice
  })

export const updateGroupNotice = (groupNotice) =>
  request({
    url: '/roomnotice/' + groupNotice.id,
    method: 'PUT',
    data: groupNotice
  })
