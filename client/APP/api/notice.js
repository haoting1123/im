import request from '@/utils/request'
export const getGroupNoticeRequest = (data) => {
  return request.post(`/syntoim/rest/roomnotice/select/?roomJid=${data.roomJid}&page=${data.page}&size=${data.size}`, data)
}

export const getSystemNoticeRequest = (data) => {
  return request.get('/syntoim/rest/notice/codes/list?page=0&size=100')
}

export const addGroupNoticeRequest = (data) => {
  return request.post('/syntoim/rest/roomnotice', data)
}

export const deleteGroupNotice = (noticeId) => {
	return request.delete('/syntoim/rest/roomnotice/' + noticeId)
}
	
  

export const updateGroupNotice = (groupNotice) =>
  request({
    url: '/roomnotice/' + groupNotice.id,
    method: 'PUT',
    data: groupNotice
  })
