import axios from 'axios'
import { baseUrl } from '@/utils/url'
const SM4 = require('gm-crypt').sm4
// 创建axios实例
const service = axios.create({
  // api的base_url
  baseURL: baseUrl(),
  // 请求超时时间
  timeout: 60000,
  // 允许携带cookie
  withCredentials: true
})
const sm4Config = {
  // encrypt/decypt main key; cannot be omitted
  key: 'JeF8U9wHFOMfs2Y8',
  // optional; can be 'cbc' or 'ecb'
  mode: 'cbc', // default
  // optional; when use cbc mode, it's necessary
  iv: 'UISwD9fW6cFh9SNS', // default is null
  // optional: this is the cipher data's type; Can be 'base64' or 'text'
  cipherType: 'base64' // default is base64
}

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  
  // let sm4 = new SM4(sm4Config)
  if(config.method === "post"){
    // 加密
    console.log(config.method,config.data)
    // let ciphertext = JSON.stringify(config.data); 
    // console.log("config.data",ciphertext)
    // config.data = sm4.encrypt(ciphertext)
  }else if(config.method === 'get'){
    // let ciphertext = JSON.stringify(config.params); 
    // console.log("config.params",ciphertext)
    // config.params = sm4.encrypt(ciphertext)
  }
  // config.headers['Content-Type'] = "text/plain"
  // console.log('request拦截器==========',config)
  if (sessionStorage.getItem('token')) {
    // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['X-Token'] = sessionStorage.getItem('token')
  }
  if (localStorage.getItem('sessionID')) {
    if(!config.headers){
      config.headers = {}
    }
    config.headers['Set-Cookie'] = `JSESSIONID=${localStorage.getItem('sessionID')}`
  }
  let serverAddr = localStorage.getItem('global_server_address_run')
  if (serverAddr) {
    config.url = serverAddr + config.url
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    // console.log("response拦截器===",response)
    if (response.data.errCode === 2) {
    //   router.push({
    //     path: '/login',
    //     // 从哪个页面跳转
    //     querry: { redirect: router.currentRoute.fullPath }
    //   })
    }
    // let sm4 = new SM4(sm4Config)
    // let ciphertext = response.data
    // 解密
    // let plaintextSm4 = sm4.decrypt(ciphertext)
    // response.data = JSON.parse(plaintextSm4);
    // console.log('response拦截器解密',response)
    return response
  },
  error => {
    return Promise.reject(error)
  })

export default service
