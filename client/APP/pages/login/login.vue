<template>
	<view class="login-main-component">
		<view class="logo">
			<view class="user-photo-box">
				<span style="display: inline-block; width: 150upx; height: 150upx; background: #fff; border-radius: 50%">
					<img src="../../static/img/login-head.png" style="height: 110upx; width: 110upx; margin-top:18upx;" alt="icon" />
				</span>
			</view>
		</view>
		<!-- 账号密码输入框 -->
		<view class="form-login">
			<view class="username form-item">
				<image src="../../static/img/login-username-icon.png"></image>
				<input placeholder="请输入账号" v-model="account" :disabled="loading" placeholder-style="color: rgba(0,0,0,0.5);" />
			</view>
			<view class="password form-item">
				<image src="../../static/img/login-password-icon.png"></image>
				<input placeholder="请输入密码" v-model="password" :disabled="loading" password="true" placeholder-style="color: rgba(0,0,0,0.5);" />
			</view>
			<button class="btn" :loading="loading" @tap="bindLogin">登 录</button>
			<view class="res"><text @tap="startForgatPassowrd">忘记密码</text></view>
		</view>
		<!--设置服务地址-->
		<view class="change-service-address" v-if="account == '切换服务地址'">
			<view class="input-row border">
				<text style="padding: 10upx;">服务地址:</text>
				<!--<input class="uni-input" type="text" v-model="serverIP" placeholder="请输入服务器地址" />-->
				<uni-input class="uni-input" type="text" clearable v-model="serverIP" placeholder="请输入服务器地址"></uni-input>
			</view>
			<view class="input-row border">
				<text style="padding: 10upx;">消息地址:</text>
				<!--<input class="uni-input" type="text" v-model="socketIP" placeholder="请输入消息服务器地址" />-->
				<uni-input class="uni-input" type="text" clearable v-model="socketIP" placeholder="请输入消息服务器地址"></uni-input>
			</view>
			<view class="btn-row" @tap="modifyServerIp">确认修改</view>
		</view>
		<!--忘记密码-->
		<forgat-password ref="forgatPassword"></forgat-password>
	</view>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import uniInput from '../../components/uni-input.vue';
import forgatPassword from '../../components/home/forgatPassword-component'
import app from '../../common/common.js';
import { webSocketUrl } from '@/utils/url'

export default {
	components: {
		uniInput,
		forgatPassword
	},
	data() {
		return {
			providerList: [],
			hasProvider: false,
			account: '',
			password: '',
			positionTop: 0,
			loading: false,
			serverIP: '',
			socketIP: ''
		};
	},
	computed: {
		...mapState({
			hostUrl: state => state.globalConfig.hostUrl,
			isLoginSuccess: state => state.home.isLoginSuccess,
		})
	},
	onLoad() {
		this.initConfig()
		this.initPosition()
		this.checkIsLogin()
	},
	watch: {
		isLoginSuccess(val){
			if(val === 'yes'){
				uni.setStorageSync('isAutoLogin', 'yes')
				this.toMain()
			}
		}
	},
	methods: {
		...mapMutations([
			'SET_FRIENDLIST',
			'SET_GROUP_LIST',
			'SET_XMPP_LOGIN_INFO',
			'SET_IS_LOGIN_SUCCESS'

		]),
		...mapActions([
			'Login',
			'EnterGroup',
			'ForgetPassword',
			'FriendStatusListener',
			'GetTreeData'
		]),
		// 忘记密码
		startForgatPassowrd () {
			this.$refs.forgatPassword.$emit('showModal')
		},
		initPosition() {
			/**
			 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			 * 反向使用 top 进行定位，可以避免此问题。
			 */
			this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
		},
		modifyServerIp() {
			if (this.serverIP == '' || this.serverIP.length < 1) {
				uni.showToast({
					icon: 'none',
					title: '服务地址最短为 1 个字符'
				});
				return;
			}
			//设置IP
			uni.setStorageSync('apiHost', this.serverIP);
			uni.setStorageSync('socketHost', this.socketIP);
			this.account = '';
			uni.showToast({
				icon: 'success',
				title: '修改成功'
			});
		},
		// 登录数据校验
		bindLogin() {
			/**
			 * 客户端对账号信息进行一些必要的校验。
			 * 实际开发中，根据业务需要进行处理，这里仅做示例。
			 */
			if (this.account.length < 1) {
				uni.showToast({
					icon: 'none',
					title: '账号最短为 2 个字符'
				});
				return;
			}
			// if (this.password.length < 6) {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '密码最短为 6 个字符'
			// 	});
			// 	return;
			// }
			this.submitLogin(this.account, this.password);

			// this.loading = true;
			// if(this.loading){
			// 	this.submitLogin(this.account, this.password);
			// }

		},
		// 进行登录
		submitLogin(username, password) {
			if (this.loading) return
			this.loading = true;
			const credentials = { service: webSocketUrl(), username: username, password: password }
			this.SET_XMPP_LOGIN_INFO(credentials)
			const form = {
				xmpp: credentials,
				loginData: {
					username: username,
					password: password
				}
			}
			this.Login(form)
				.then(data => {
					// console.log(`登录成功:${JSON.stringify(data)}`)
					this.loading = false;
					if (data.data.sessionID) uni.setStorageSync('sessionID', data.data.sessionID)
					// uni.setStorageSync('token', data.data.token);
					uni.setStorageSync('currentUser', username);
					uni.setStorageSync('currentUserToken', password);
					// TODO: 登录成功，缓存账户信息
					let account = {
						...form.loginData,
						id: data.data.userinfo.id
					}
					uni.setStorageSync('account', account)
					this.FriendStatusListener()
					this.loading = false
				})
				.catch(err => {
					this.loading = false;
					if (err.code === 401 || err.code === 402) {
						uni.showModal({
							title: '温馨提示',
							content: '登录失败，请检查用户名密码是否正确!',
							showCancel: false,
							confirmText: '确定'
						})
						return
					}
					uni.showModal({
						title: '温馨提示',
						content: '网络错误!',
						showCancel: false,
						confirmText: '确定'
					})
				})
		},
		toMain() {
			/**
			 * 强制登录时使用reLaunch方式跳转过来
			 * 返回首页也使用reLaunch方式
			 */
			uni.reLaunch({
				url: '../message-list/message-list'
			});
		},
		checkIsLogin() {
			// let token = uni.getStorageSync('token');
			// let user = uni.getStorageSync('currentUser');
			// if (token && user) {
			// 	let pass = uni.getStorageSync('currentUserPass');
			// 	this.submitLogin(user.username, pass);
			// }
			let account = uni.getStorageSync('account')
			if (account.username) {
				this.account = account.username
				this.password = account.password
			}
			if (uni.getStorageSync('isAutoLogin') && uni.getStorageSync('isAutoLogin') === 'yes') {
				this.submitLogin(account.username, account.password)
			}
		},
		initConfig() {
			//登录服务IP
			let ip = uni.getStorageSync('apiHost');
			if (!ip) {
				ip = app.apiHost;
				uni.setStorageSync('apiHost', ip);
			}
			this.serverIP = ip;
			this.$store.commit('setHostUrl', ip);
			//消息服务IP
			let socketHost = uni.getStorageSync('socketHost');
			if (!socketHost) {
				socketHost = app.websocketUrl;
				uni.setStorageSync('socketHost', socketHost);
			}
			this.socketIP = socketHost;
			this.$store.commit('setSocketHostUrl', socketHost);
		}
	}
}
</script>

<style lang="scss">
@import '../../static/css/style.scss';
@font-face {
	font-family: 'HMfont-login';
	src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAVwAAsAAAAACiwAAAUhAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqHTIY+ATYCJAMUCwwABCAFhG0HRhvICBEVpCGR/UgwbhrPeq6LhESdqBKaSN/kw79n/bk3aCYZKO1yZCbTFZBZqLv71CzRPvkPQPDEzrPbAAEEdy/nHLBRL1RJVpMf+cAnKX4Do/NzekpNyAm5/zlmunw+sPy2tUt22QBHAx5Q5EUGHvAdnfOh3DK8OuQd0OlAAIiIQw5IS1uPAgEstFUEAFmxdPFcCDE92AIcgaDigV1ZkBvBQaCH6csAbnB/nnyDIiIAFBwDbePAotYFaAjIY0OMFtTMsBEQdGcFwOwFMAByALAAWQfaV4Dx4zlgIEpRFg2A/DsBFDQgB2oDc8eGgkGQeEFKUZejCznt9o/HQ5OHYmxDggUCskkBBgjUUoAAgbkUoMDYkPDCyDliuQhABkgJQK6yyhT38BIY8CBxYSRMEkkMSSATwkJdISFRxmEK1/vOnrTzXjViHzwz8aKlGEYs2iibpmp+5ratsgWGNWLbfrapGoZCpmU/tfdypWk3P2UpyrXbL9yT7r9NuzXF7fWdOOu/rp+KJfM9J10u24o94tV0yTZj7Q1k2sNGbKz3FE7fJrlO6jZTvS8u0ZhJun8isa0RspKxyKuEe2NZXZZOEuakK+yhNyZTXZI887RY8YQzlSXpoBHeCI5wo155sye1OndEW2qmqrgfekbypF8gtj1yfSpZR24fvUPxWVJPRLG2DHcxzf7n0tWR1+x5R0CV6j3Gds3IOfkK9MdFr5Un3mk4rSddo6/Jd1vEsCbatsu6R7YZUv2mevIuRf9nThs/zvYVz49u+Zw5nLqge+KujIq2hXHLc265lFGtRqxMdB4ZW7GDGxWkhRXLMpfNnaPMmLeT8S2mw3TIt3Ynv5P1TWOGGMW3c6cDCdUbnElHp9An2M7UvfFrl9Se3Mpl2OsC/OPrLn+Z/t+8OYMbyc7EULKrYRH0H8RvBcrsPjrZH/r9uO9DFSlsbnuo+4UQU/18N/9U41O/hEONfOLyA79rcYXtbq65rDorfijy9epSZFw8fEWNBN4peoL0Ll7SS4QBfh0/4Jnj+Jabk3XpkHSMdxxyuKysOZ4BfiuXySHl2UXydcnnx30kioxf/vShfUSnz/oZraNzc1Nu0tJttfyZxEhcTaOb/Ofrls75Pu/7/A/zPvxwpc/TJ34YSpffeeM2qlH/jVhDV9gcvNONnb7ZJePd7ubF++dFqYkkt2sh8dkoHjBpXMs3De/mt/y3dmCZ8424T5Y6B9aQf4r8dxu+imujrYtcywuiBztmF7Bt/yXK7wSmVlUEpshvJ/7HthUAHPDGBa7l2AIACD6yMPolEHyG+Y62A8EXmZ8Xf8adtzCtX+sirIn7vGB2RM1vgnSbRt7WD193ec251eT45BSoLPg221gAwV8Wxoo0A8eK3SZfLOSwDxLwhIWfYccX6Y7Gh90o5crFAIEAOQQKByYDAwEpSBabAxwktBLgCepBlK3eWxLDWSILAZDljYCI9AEq3GPAiPRFstgfcJz+wItsCaKRYg4pSas5NDtkASXwFzSCRmWYwsErPaK+9cxFRS7+is43IUijJJmqcUTXxRb+rrMQFChHA1TobNj3BJOjFkWITAhTHscKeqFI0DA7aOYgJkAS4F5AQyAjZQ8PDqnvP0LaTY9xBT0l9ivkeM34IBVJKiBr+Vip51SqvTstE4ioAhRTTAagIqyo1+METPC8FhKCiGkQneRiYpCqKo+GVw7nWPBn9NWuwEUJQ1jCER7cseG02dIwGppNhOPnjIu1djYDAAAA')
		format('woff2');
}
.login-main-component {
	.user-photo-box {
		text-align: center;
	}
	.form-login {
		.form-item {
			display: flex;
			// margin-left: 100upx;
			align-items: center;
			image {
				width: 50upx;
				height: 50upx;
			}
			input {
				text-align: left;
				margin-left: 20upx;
			}
		}
		.res {
			height: 100upx;
			margin-top: 30upx;
			text-align: center;
			// margin-right: 40upx;
			color: rgba($color: #ffffff, $alpha: 0.8);
		}
	}
	.change-service-address {
		padding: 0 7%;
		font-size: 28px;
		color: gray;
		.input-row {
			display: flex;
			align-items: center;
			height: 90upx;
			padding: 0 20upx;
			background: white;
			border-radius: 40upx;
			input {
				flex: 1;
			}
		}
		.input-row + .input-row {
			margin-top: 20upx;
		}
		.btn-row {
			/*width: 400upx;*/
			height: 90upx;
			line-height: 90upx;
			margin-top: 20upx;
			font-size: 34upx;
			text-align: center;
			border-radius: 45upx;
			color: #FAFBFC;
			background-color: #77B3D7;
		}
	}
}
</style>
