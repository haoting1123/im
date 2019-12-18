import request from '@/utils/request'

export const updateOnlineStatus = (userId, onlineStatus) => {
  request({
    url: '/users/' + userId,
    method: 'PATCH',
    data: {
      'onlineStatus': onlineStatus
    }
  })
}

// 更新用户信息
export const updateUserInfoRequest = (data) => {
  return request({
    url: '/syntoim/rest/user/sexname',
    method: 'put',
    data: data
  })
}

// 修改密码
export const changePassword = (data) => {
  return request({
    // url: '/users/' + userId + '/password',
    url: '/syntoim/rest/user/changepwd',
    method: 'PUT',
    data: data
  })
}

// 注销登录
export const logonRequest = (data) => {
  return request({
    url: '/syntoim/rest/um/logout',
    method: 'post',
    data
  })
}

// 忘记密码
export const forgetPasswordRequest = (username) => {
  return request({
    url: `/syntoim/rest/sys/info/${username}`,
    method: 'get'
  })
}

// 是否将聊天记录保存至服务端
export const saveSessionRecordRequest = (data) => {
  return request({
    url: '/syntoim/rest/userconfig/save',
    method: 'post',
    data
  })
}

export const heartbeat = () =>
  request({
    url: '/syntoim',
    method: 'options'
  })
