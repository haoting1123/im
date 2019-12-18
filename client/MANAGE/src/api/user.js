import request from '@/utils/request'

export function getAllUser() {
  return request({
    url: '/user/listall',
    method: 'get'
  })
}

//查询分页用户
export function getUserPage(params) {
  return request({
    url: '/user/get',
    method: 'get',
    params: params
  })
}
 
//根据用户ID删除用户
export function delUserById(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}

export function getUserById(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

//增加普通用户
export function addUser(user) {
  return request({
    url: '/user/save',
    method: 'post',
    data: user
  })
}

//修改普通用户
export function updateUser(user) {
  return request({
    url: '/user/' + user.id,
    method: 'put',
    data: user
  })
}

export function userNameExist(userName) {
  return request({
    url: '/user/exist/' + userName,
    method: 'get'
  })
}

export function getUserCount(userName) {
  return request({
    url: '/user/count/' + userName,
    method: 'get'
  })
}

export function getUserAdminCount(userName) {
  return request({
    url: '/user/count/' + userName,
    method: 'get'
  })
}

export function getUserAdminByGroupCode(groupCode) {
  return request({
    url: '/useradmin/groupcode/' + groupCode,
    method: 'get'
  })
}

//新增管理员
export function addUserAdmin(userAdmin) {
  return request({
    url: '/useradmin',
    method: 'post',
    data: userAdmin
  })
}

export function updateUserAdmin(userAdmin) {
  return request({
    url: '/useradmin/' + userAdmin.id,
    method: 'put',
    data: userAdmin
  })
}

export function validataPwd(param) {
  return request({
    url: '/useradmin/validata',
    method: 'get',
    params: param
  })
}

// 重置普通管理员密码
export function resetAdminPassword(groupCode) {
  return request({
    url: '/useradmin/resetpassword/' + groupCode,
    method: 'get'
  })
}

// 重置普通用户密码
export function resetUserPassword(data) {
  return request({
    url: '/user/resetpwd',
    method: 'put',
    data: data
  })
}
