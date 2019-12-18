const config = require('../config/index.js')

export const baseUrl = () => {
  let serverAddr = localStorage.getItem('global_server_address_run')
  if(serverAddr){
    return serverAddr
  }
  return config.env.BASE_API
}

export const webSocketUrl = () => {
  let wsServerAddr = localStorage.getItem('global_ws_server_address_run')
  if(wsServerAddr){
    return wsServerAddr
  }
  return config.env.WEBSOCKET_URL
}

export const softwareCheckUrl = () => {
  let serverAddr = localStorage.getItem('global_server_address_run')
  if(serverAddr){
    return serverAddr
  }
  return config.env.BASE_API
}

export const downloadUrl = () => {
  let serverAddr = localStorage.getItem('global_server_address_run')
  if(serverAddr){
    return serverAddr
  }
  return config.env.BASE_API
}
