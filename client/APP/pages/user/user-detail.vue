<template>
	<view class="user-info-main-component">
		<view class="user-info-item" @tap="selectAvatar">
			<text>头像</text>
			<view class="user-avatar">
				<image v-if="newUserInfo.photo" :src="newUserInfo.photo"></image>
				<image v-else src="../../static/img/normal-avatar.png"></image>
			</view>
			<view class="right-arrow">&nbsp;</view>
		</view>

		<view class="user-info-item">
			<text>帐号</text>
			<text class="user-account content">{{ account }}</text>
		</view>

		<view class="user-info-item">
			<text>姓名</text>
			<input class="user-name content" type="text" v-model="newUserInfo.name" placeholder="请输入姓名" />
			<view class="right-arrow">&nbsp;</view>
		</view>

		<view class="user-info-item">
			<text>性别</text>
			<view class="user-sex content">
				<radio-group @change="selectSex">
					<label><radio value="男" :checked="newUserInfo.sex === '男'" />男</label>
					<label style="margin-left: 20upx"><radio value="女" :checked="newUserInfo.sex === '女'" />女</label>
				</radio-group>
			</view>
		</view>
		<view class="user-info-item">
			<text>部门</text>
			<text class="user-group content">{{newUserInfo.groupName}} </text>
		</view>

		<view class="button-group">
			<button type="primary" class="button-group-item" @tap="updateUserInfo">确认修改</button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions }from 'vuex'

	export default {
		data() {
			return {
				newUserInfo: {},
				account: ''
			}
		},
		components: {},
		computed: {
			...mapState({
				userInfo: state => state.home.userInfo,
				hostUrl: state => state.globalConfig.hostUrl
			})
		},
		onLoad() {},
		onShow () {
			this.newUserInfo = JSON.parse(JSON.stringify(this.userInfo))
			this.account = this.userInfo.jid.split('@')[0]
		},
		mounted () {},
		methods: {
			...mapActions([
				'UpdateUserInfo'
			]),
			// 选择性别
			selectSex (event) {
				console.log(`当前选中性别：${event.target.value}`)
				this.newUserInfo.sex = event.target.value
			},
			// 选择头像
			selectAvatar () {
				// return
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (chooseImageRes) => {
						console.log(`图片属性:${JSON.stringify(chooseImageRes)}`)
						console.log(`this.hostUrl:${this.hostUrl}`)
						if (chooseImageRes.tempFiles[0].size > 200 * 1024) {
							uni.showToast({
								title: '图片大小必须小于200KB!',
								icon: 'none'
							})
							return
						}
						uni.uploadFile({
							url: `${this.hostUrl}/syntoim/rest/file/uploadphoto`,
							filePath: chooseImageRes.tempFilePaths[0],
							fileType: 'image',
							name: 'file',
							success: (res) => {
								// console.log(`res: ${JSON.stringify(res)}`)
								if (res.errMsg === 'uploadFile:ok') {
									let url = JSON.parse(res.data).url
									this.newUserInfo.photo = url
									// console.log(`this.userInfo.photo:${this.newUserInfo.photo}`)
									this.UpdateUserInfo({
										...this.userInfo,
										photo: url
									})
										.then(() => {})
										.catch(err => {
											uni.showToast({
												title: '修改失败!',
												icon: 'none'
											})
										})
									return
								}
								uni.showToast({
									title: '上传失败!',
									icon: 'none'
								})
							}
						})
						// TODO:转为base64存贮
						// pathToBase64(res.tempFilePaths[0])
						// 	.then(base64 => {
						// 		this.userInfo.photo = base64
						// 	})
						// 	.catch(err => console.log(err))
					}
				})
			},
			// 更新用户信息
			updateUserInfo () {
				uni.showModal({
					title: '温馨提示',
					content: '确定修改用户信息吗?',
					success: (res) => {
						if (res.confirm) {
							// if (!this.userInfo.photo) {
							// 	uni.showToast({
							// 		title: '请选择用户头像!',
							// 		icon: 'none'
							// 	})
							// 	return
							// }
							if (!this.newUserInfo.name.replace(/\s/g, '')) {
								uni.showToast({
									title: '请输入有效的用户名!',
									icon: 'none'
								})
								return
							}
							this.UpdateUserInfo({ ...this.newUserInfo })
								.then(() => {
									uni.showToast({
										title: '修改成功!',
										icon: 'success'
									})
									uni.navigateBack({
										delta: 1
									})
								})
								.catch(err => {
									uni.showToast({
										title: '修改失败!',
										icon: 'none'
									})
								})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	body {
		background: #F0EFF4;
	}
	.user-info-main-component {
		font-size: 32upx;
		.user-info-item {
			display: flex;
			align-items: center;
			padding: 20upx 40upx;
			border-bottom: 1px solid #D8D8D8;
			background: #FFFFFF;
			.user-avatar {
				flex: 1;
				display: flex;
				flex-direction: row-reverse;
				align-item: center;
				margin-right: 20upx;
				text-align: right;
				image {
					width: 90upx;
					height: 90upx;
					border-radius: 50%;
				}
			}
			.content {
				flex: 1;
				margin-right: 20upx;
				text-align: right;
				color: gray;
				input {
					text-align: right;
				}
			}
			.user-account, .user-group, .user-sex {
				margin-right: 40upx;
			}
			.user-name {
				color: #000000;
			}
		}

		.button-group {
			margin-top: 100upx;
			.button-group-item {
				width: 500upx;
				height: 70upx;
				line-height: 70upx;
				font-size: 30upx;
				background-color: #3D89C3;
				border-radius: 40upx;
			}
		}

		.right-arrow {
			width: 18upx;
			height: 18upx;
			margin-top: -6upx;
			border-top: 3upx solid #C0C4CC;
			border-right: 3upx solid #C0C4CC;
			transform: rotate(45deg);
		}
	}
</style>
