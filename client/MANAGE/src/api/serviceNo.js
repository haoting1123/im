import request from '@/utils/request'

export function getServiceNoListPage(params) {
  return request({
    url: '/serviceno',
    method: 'get',
    params: params
  })
}

export function getServiceNoArticleListPage(params) {
  return request({
    url: '/serviceno/gcode/' + params.gcode + '/article',
    method: 'get',
    params: params
  })
}

export function getServiceNoListByGcode(gcode){
  return request({
    url: '/serviceno/gcode/' + gcode + '/listall',
    method: 'get'
  })
}

export function getServiceNoArticleListByScode(scode) {
  return request({
    url: '/serviceno/scode/' + scode,
    method: 'get'
  })
}

export function delServiceNo(id) {
  return request({
    url: '/serviceno/' + id,
    method: 'delete'
  })
}

export function delServiceNoArticle(id) {
  return request({
    url: '/serviceno/article/' + id,
    method: 'delete'
  })
}

export function addServiceNo(data) {
  return request({
    url: '/serviceno',
    method: 'post',
    data: data
  })
}

export function addServiceNoArticle(data) {
  return request({
    url: '/serviceno/article',
    method: 'post',
    data: data
  })
}

export function updateServiceNoById(data) {
  return request({
    url: '/serviceno/' + data.id,
    method: 'put',
    data: data
  })
}

export function getServiceNoUser(scode) {
  return request({
    url: '/serviceno/scode/' + scode + '/user',
    method: 'get'
  })
}

export function savaServiceNoUser(data) {
  return request({
    url: '/serviceno/user',
    method: 'post',
    data: data
  })
}
