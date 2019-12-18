import request from '@/utils/request'

export function addNotice(notice) {
  return request({
    url: '/notice',
    method: 'post',
    data: notice
  })
}

export function addNoticeOrg(notice) {
  return request({
    url: '/notice/addorg',
    method: 'post',
    data: notice
  })
}

export function updateNotice(notice) {
  return request({
    url: '/notice/' + notice.id,
    method: 'put',
    data: notice
  })
}

export function deleteNotice(id) {
  return request({
    url: '/notice/' + id,
    method: 'delete'
  })
}

// 根据标题获取公告信息
export function getNoticeList(params) {
  return request({
    url: '/notice/get',
    method: 'post',
    params: params
  })
}

export function sendNotice(id) {
  return request({
    url: '/notice/send',
    method: 'post',
    params: { id: id }
  })
}
