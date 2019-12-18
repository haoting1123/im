<template>
	<!-- <view class="content">
		<view class="input-group">
			<view class="input-row">
				<text class="pass-title">原密码：</text>
				<input class="uni-input" password="true" type="text" displayable focus v-model="oldPassword" placeholder="请输入原密码"></input>
			</view>
			<view class="input-row">
				<text class="pass-title">新密码：</text>
				<input type="text" class="pass-input" password="true" displayable v-model="newPassword" placeholder="请输入新密码"></input>
			</view>
			<view class="input-row">
				<text class="pass-title">确认密码：</text>
				<input type="text" class="pass-confirm-input" password="true" displayable v-model="confirmPassword" placeholder="请再输入一遍"></input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="modifyPassword">提交</button>
		</view>
	</view> -->
	<view>
		<form>
			<view class="cu-form-group">
				<view class="title">当前密码</view>
				<input password="true" type="text" displayable focus v-model="oldPassword" placeholder="请输入最少六位密码" name="input"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">新密码</view>
				<input type="text" password="true" displayable v-model="newPassword" placeholder="请输入最少六位密码" name="input"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">确认密码</view>
				<input type="text" password="true" displayable v-model="confirmPassword" placeholder="请输入确认密码" name="input"></input>
			</view>
		</form>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	import uniInput from '../../components/uni-input.vue'
	import app from "../../common/common.js"
	export default {
		components: {
			uniInput
		},
		data() {
			return {
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
				currentUser: null,
			}
		},
		onLoad() {
			this.currentUser = uni.getStorageSync('currentUser');
		},
		computed: {
			...mapState({
				userInfo: state => state.home.userInfo
			})
		},
		onNavigationBarButtonTap(e) {
			console.log("修改密码"+JSON.stringify(e))
			this.modifyPassword();
		},
		methods: {
			...mapActions([
				'ChangePassword',
				'Logon'
			]),
			// 修改密码
			modifyPassword() {
				console.log('修改密码进来了'+JSON.stringify(this.oldPassword.length))
		
				if (this.oldPassword.length < 6) {
					console.log('rsers'+JSON.stringify(this.oldPassword))
					uni.showToast({
						title: '当前密码最少输入6位!',
						icon: 'none'
					})
					return
				}
				if (this.newPassword.length < 6) {
					uni.showToast({
						title: '新密码最少输入6位!',
						icon: 'none'
					})
					return
				}
				if (this.newPassword !== this.confirmPassword) {
					uni.showToast({
						title: '两次输入密码不一致!',
						icon: 'none'
					})
					return
				}
				let data = {
					id: this.userInfo.id,
					plainPassword: this.oldPassword,
					newPassword: this.newPassword
				}
				this.ChangePassword(data)
					.then(response => {
						if(response === 1) {
							uni.showToast({
								title: '密码修改成功!',
								icon: 'success'
							})
							this.Logon()
								.then(data => {
									uni.reLaunch({
										url: '../login/login',
									});
								})
								.catch(() => {})
						} else {
							uni.showToast({
								title: '密码修改失败!',
								icon: 'none'
							})
						}
					})
					.catch(error => {
						uni.showToast({
							title: '密码修改失败!',
							icon: 'none'
						})
					})
			},
			// modifyPassword() {
			// 	if (!this.currentUser || !this.currentUser.username || !this.currentUser.userId) {
			// 		uni.showModal({
			// 			title: "温馨提示",
			// 			content: "缺失关键参数，请重新登陆后再修改密码",
			// 			showCancel: false,
			// 			confirmText: "确定"
			// 		})
			// 		return;
			// 	}
			// 	if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
			// 		uni.showModal({
			// 			title: "温馨提示",
			// 			content: "请输入全部表单项",
			// 			showCancel: false,
			// 			confirmText: "确定"
			// 		})
			// 		return;
			// 	}
			// 	if (this.newPassword != this.confirmPassword) {
			// 		uni.showModal({
			// 			title: "温馨提示",
			// 			content: "两次密码输入不一致",
			// 			showCancel: false,
			// 			confirmText: "确定"
			// 		})
			// 		return;
			// 	}
			// 	var token = uni.getStorageSync('token');
			// 	console.log(this.$store.state.globalConfig.hostUrl + '/users/' + this.currentUser.userId + '/password' + token)
			// 	let data = {
			// 		"username": this.currentUser.username,
			// 		"oldPassword": this.oldPassword,
			// 		"newPassword": this.newPassword
			// 	}
			// 	var Fly = require("flyio/dist/npm/wx");
			// 	var fly = new Fly;
			// 	fly.post(this.$store.state.globalConfig.hostUrl + '/users/' + this.currentUser.userId + '/password', data, {
			// 			headers: {
			// 				"X-Token": token,
			// 			},
			// 			timeout: 30000 //超时设置为5s
			// 		})
			// 		.then(d => {
			// 			console.log(JSON.stringify(d))
			// 			if(d && d.data == 1){
			// 				uni.showToast({
			// 					title: "修改成功",
			// 				});
			// 				this.oldPassword = '';
			// 				this.newPassword = '';
			// 				this.confirmPassword = '';
			// 			}
			// 		})
			// 		.catch((e) => console.log(JSON.stringify(e)))
			// },
		},
	}
</script>

<style>
	body {
		background: #f0eff4;
	}
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
	.input-flex {
		display: flex;
		flex-direction: row;
		margin-bottom: 2.2px;
		padding: 22px;
		background-color: #fff;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
		padding: 20px;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 40px;
		position: relative;
	}

	.btn-row {
		margin-top: 50px;
		padding: 20px;
	}

	button.primary {
		background-color: #0faeff;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.input-row .pass-title {
		width: 30%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
		text-align: right;
	}

	.input-flex-label {
		width: 176px;
		line-height: 79.2px;
		font-size: 35.2px;
		color: #333;
		display: block;
	}

	.input-flex-txt {
		flex: 1;
		line-height: 79.2px;
		color: #646464;
	}

	.input-flex-text,
	.input-flex-select {
		flex: 1;
		height: 79.2px;
		box-sizing: border-box;
		display: block;
		border: 2.2px solid #eee !important;
		padding: 0 11px;
		font-size: 30.8px;
		margin: 0;
		width: 220px;
	}

	.input-flex-select {
		-webkit-appearance: menulist-button;
		background-color: #fff;
		color: #323232;
	}

	.input-flex-btn {
		width: 220px;
		height: 79.2px;
		line-height: 79.2px;
		background-color: #007bff;
		box-sizing: border-box;
		border-top-right-radius: 22px;
		border-bottom-right-radius: 22px;
		margin-left: -11px;
		color: #fff;
		font-size: 30.8px;
		text-align: center;
		cursor: pointer;
	}

	.pass-input {
		margin-top: 15upx;
	}

	.pass-confirm-input {
		margin-top: 15upx;
	}
</style>
