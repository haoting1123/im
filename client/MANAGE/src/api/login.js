import request from '@/utils/request'

export function login(username, password) {
  console.log('api/login.js  向url：/security/login发送post请求')
  return request({
    url: '/security/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/security/info',
    method: 'get',
    params: { token }
  })
}

export function logout(param) {
  return request({
    url: '/security/logout',
    method: 'post',
    data: param
  })
}

export function checkPwd(info){
  return request({
    url: '/security/checkPwd',
    method: 'post',
    data: info
  })
}
