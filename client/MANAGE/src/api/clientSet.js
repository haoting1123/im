import request from '@/utils/request'

export function addClientSet(clientSet) {
  return request({
    url: '/client',
    method: 'post',
    data: clientSet
  })
}

export function updateClientSet(clientSet) {
  return request({
    url: '/client/' + clientSet.id,
    method: 'put',
    data: clientSet
  })
}

export function getClientSet() {
  return request({
    url: '/client/listall' ,
    method: 'get'
  })
}

// 初始化客户端信息
export function reNewClientSet(clientSet) {
  console.log("初始化客户端API")
  return request({
    url: '/client/renew/' + clientSet.id,
    method: 'put',
    data: clientSet
  })
}
