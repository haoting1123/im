import request from '@/utils/request'

export function getTreeInfo(code) {
  return request({
    url: '/group/directly/' + code,
    method: 'get'
  })
}

//删除组织机构 并删除其子机构、管理员信息、授权文件信息。并删除机构下用户信息
export function delGroup(code) {
  return request({
    url: '/group/delete/' + code,
    method: 'delete'
  })
}

//组织机构添加子机构
export function addGroup(data) {
  return request({
    url: '/group',
    method: 'post',
    data: data
  })
}
export function getGroupMessage(organizeCode) {
  return request({
    url: '/group/message/' + organizeCode,
    method: 'get'
  })
}
// 获取所有非直属机构根节点
export function getGroupNo(params) {
  return request({
    url: '/group/groupno',
    method: 'get',
    params: params
  })
}

// 获取所有非直属机构根节点List
export function getGroupNoList(params) {
  return request({
    url: '/group/groupno/list',
    method: 'get',
    params: params
  })
}

// 拖拽排序
export function sequenceTree(data) {
  return request({
    url: '/group/sequence',
    method: 'post',
    params: data
  })
}

// 配置组织机构的可见范围
export function groupVisible(data) {
  return request({
    url: '/visible/add',
    method: 'post',
    data: data
  })
}

// 获取可见该机构的机构列表
export function getGroupVisible(groupCode) {
  return request({
    url: '/visible/select/' + groupCode,
    method: 'get'
  })
}

// 根据组织机构代码查询机构信息
export function getGroupCount(groupCode) {
  return request({
    url: '/group/count/' + groupCode,
    method: 'get'
  })
}

// 生成授权文件
export function createLicense(data) {
  return request({
    url: '/im/license/add',
    method: 'post',
    data: data
  })
}

export function getLicense(groupCode) {
  return request({
    url: '/im/license/group/'+groupCode,
    method: 'get'
  })
}

export function saveMiniprogram(data) {
  return request({
    url: '/group/miniprogram',
    method: 'post',
    data: data
  })
}

export function getGroupTreeAndUser(code) {
  return request({
    url: '/group/get/' + code,
    method: 'get'
  })
}

export function updateServiceLisence(data) {
  return request({
    url: '/group/' + data.code + '/servicelisence/' + data.yn,
    method: 'post'
  })
}

export function getServiceLisence(code) {
  return request({
    url: '/group/' + code + '/servicelisence',
    method: 'get'
  })
}
