import request from '@/utils/request'

export function addVersion(version) {
  return request({
    url: '/sc',
    method: 'post',
    data: version
  })
}

export function updateVersion(version) {
  return request({
    url: '/sc/' + version.id,
    method: 'put',
    data: version
  })
}

export function deleteVersion(id) {
  return request({
    url: '/sc/' + id,
    method: 'delete',
  })
}

export function getVersionList(params) {
  return request({
    url: '/sc',
    method: 'get',
    params: params
  })
}
