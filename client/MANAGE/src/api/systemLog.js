import request from '@/utils/request'

export function getLoginLogList(params) {
    return request({
      url: '/loginlog/get',
      method: 'GET',
      params: params
    })
  }
