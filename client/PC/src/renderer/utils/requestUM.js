import axios from 'axios'
import { softwareCheckUrl } from '@/utils/url'

// 创建axios实例
const serviceUM = axios.create({
    // api的base_url
    baseURL: softwareCheckUrl(),
    // 请求超时时间
    timeout: 60000,
    // 允许携带cookie
    withCredentials: true
})

// request拦截器
serviceUM.interceptors.request.use(config => {
    // Do something before request is sent
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
serviceUM.interceptors.response.use(
    response => {
        if (response.data.errCode == 2) {
            router.push({
                path: "/login",
                // 从哪个页面跳转
                querry: { redirect: router.currentRoute.fullPath }
            })
        }
        return response;
    },
    error => {
        return Promise.reject(error)
    })

export default serviceUM
