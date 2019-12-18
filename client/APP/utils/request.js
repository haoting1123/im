import { baseUrl } from '@/utils/url'

const Fly = require('flyio/dist/npm/wx')

const service = new Fly
service.config.baseURL = baseUrl()
service.config.withCredentials = true
service.config.timeout=60000;
const errorPrompt = (err) => {
	// #ifdef APP-PLUS
	uni.showToast({
		title: err.message || 'fetch data error.',
		icon: 'none'
	})
	// #endif
}

service.interceptors.request.use((request) => {
	if (uni.getStorageSync('sessionID')) {
		request.headers['Set-Cookie'] = `JSESSIONID=${uni.getStorageSync('sessionID')}`
	}
	// uni.showLoading({
	// 	title: '加载中'
	// });
	//在浏览器端可以调试
	if(request.headers['Content-Type'].length==0)
		delete request.headers['Content-Type']
	return request
})

service.interceptors.response.use((response, promise) => {
	// uni.hideLoading();
	// if (!(response && response.data && response.data.res === 0)) {
	//   errorPrompt(response)
	// }
	return promise.resolve(response.data)
}, (err, promise) => {
	// wx.hideNavigationBarLoading()
	// uni.hideLoading();
	errorPrompt(err)
	return promise.reject(err)
})

export default service
