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

// 用户登录
export function loginRequest (data) {
  return request.post('/syntoim/rest/um/login', data)
}

// 注销登录
export const logonRequest = (data) => {
  return request.post('/syntoim/rest/um/logout', data)
}

// 获取所有用户
export const getAllUser = (groupCode) => {
  return request.get('/syntoim/rest/visible/users/'+groupCode)
}

// 根据用户名模糊查询
export const getUserByName = (data) => {
  return request.get('/syntoim/rest/user/search', data)
}


// 更新用户信息
export const updateUserInfoRequest = (data) => {
  return request.put('/syntoim/rest/user/sexname', data)
}

// 修改密码
export const changePassword = (data) => {
  return request.put('/syntoim/rest/user/changepwd', data)
}


// 忘记密码
export const forgetPasswordRequest = (username) => {
  return request.get(`/syntoim/rest/sys/info/${username}`)
}

// 是否将聊天记录保存至服务端
export const saveSessionRecordRequest = (data) => {
  return request.post(`/syntoim/rest/userconfig/save`,data)
}

export const heartbeat = () => {
  return request.request("/syntoim", null, {method:"OPTIONS"})
}
