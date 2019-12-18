import request from '@/utils/request'

export function getMiniProgramList(params) {
  return request({
    url: '/miniprogram',
    method: 'get',
    params: params
  })
}

export function getMiniProgramListAll() {
  return request({
    url: '/miniprogram/listall',
    method: 'get'
  })
}

export function getMiniProgramByGcode(gcode) {
  return request({
    url: '/miniprogram/gcode/' + gcode,
    method: 'get'
  })
}

export function delMiniProgram(id) {
  return request({
    url: '/miniprogram/' + id,
    method: 'delete'
  })
}

export function addMiniProgram(data) {
  return request({
    url: '/miniprogram',
    method: 'post',
    data: data
  })
}

export function updateMiniProgram(data) {
  return request({
    url: '/miniprogram/' + data.id,
    method: 'put',
    data: data
  })
}
