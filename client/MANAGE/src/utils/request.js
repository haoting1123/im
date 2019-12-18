import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getStore, removeStore } from '@/utils/mUtils.js'
import _this from '../main'
const SM4 = require('gm-crypt').sm4
axios.defaults.withCredentials = true

// 创建axios实例
console.log('utils/request.js  创建axios实例service，基本url为：' + process.env.BASE_API)
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000 // 请求超时时间
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
service.interceptors.request.use(
  config => {
    // let sm4 = new SM4(sm4Config)
    console.log('utils/request.js  进行axios的请求拦截')
    if(config.method === "post"){
      // 加密
      // console.log(config.method, config.data)
      let ciphertext = JSON.stringify(config.data); 
      // console.log("config.data",ciphertext)
      // config.data = sm4.encrypt(ciphertext)
    }else if(config.method === 'get'){
      console.log("get======",config.method,config)
      // let ciphertext = JSON.stringify(config.params); 
      // console.log("config.params",ciphertext)
      // config.params = sm4.encrypt(ciphertext)

    }
  // config.headers['Content-Type'] = "text/plain"
    if (store.getters.token) {
      config.headers['X-Token'] = getStore('token') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => { 
    console.log('utils/request.js  进行axios的响应拦截')
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    console.log('utils/request.js  返回值1没有进行解密 ===',response)
    // let sm4 = new SM4(sm4Config)
    // let ciphertext = response.data
    // 解密
    // let plaintextSm4 = sm4.decrypt(ciphertext)
    // response.data = JSON.parse(plaintextSm4);
    const res = response.data

    //res.data是一个对象，不是success  有问题
    if (res.code === 20000 && res.data === 'success') {
      removeStore('userinfo')
      console.log('utils/request.js  响应成功push(/login)')
      _this.$router.push('/login') /** 原代码 */
      location.reload() // 为了重新实例化vue-router对象 避免bug
      return
    }

    // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    if (res.code === '403') {
      console.log('utils/request.js  code:403,Token 过期了、其他客户端登录了、非法的token' )
      MessageBox.confirm(
        '登录已超时，请重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const userinfo = getStore('userinfo')
        console.log('utils/request.js  重新登录，先使用户' + userinfo + '登出')
        store.dispatch('LogOut', userinfo).then(() => {
        })
      })
      // }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
