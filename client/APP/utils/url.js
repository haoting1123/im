const config = require('../common/common.js')

// 普通请求地址
export const baseUrl = () => {
  let serverAddr = uni.getStorageSync('apiHost')
  if(serverAddr){
    return serverAddr
  }
  return config.apiHost
}
// websocket地址
export const webSocketUrl = () => {
  let wsServerAddr = uni.getStorageSync('socketHost')
  if(wsServerAddr){
    return wsServerAddr
  }
  return config.websocketUrl
}
