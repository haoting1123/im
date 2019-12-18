<template>
	<view class="page1">
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in personList" :key="key">
				<view class="uni-media-list" @tap="getUserDetail(value)">
					<view class="uni-media-list-logo" v-if="value.photo">
						<image :src="value.photo" :class="{'avatar-gray': value.status !== 'online'}"></image>
					</view>
					<view class="uni-media-list-logo" v-else>
						<image  src="../../static/img/normal-avatar.png" :class="{'avatar-gray': value.status !== 'online'}"></image>
					</view>
					<view style="padding-top: 20upx;">
						<view>{{value.name}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import { mapState, mapMutations} from 'vuex'
	import app from "../../common/common.js"
	import {uniIcon} from '@dcloudio/uni-ui'
	export default {
		data() {
			return {
				currentUser: "",
			};
		},
		props: ['personList'],

		components: {
			uniIcon,
		},
		onLoad() {

			this.currentUser = uni.getStorageSync('currentUser');
			if(this.debug){
				console.log('人员列表============='+JSON.stringify(this.personList))
			}
		},
		computed: {
			...mapState({
				xmppDomain: state => state.home.xmppDomain
			})
		},
		methods: {
				...mapMutations([
				'SET_ACTIVE_MEMBER'
			]),
			getUserDetail(user){
				if(this.debug){
					console.log('跳转个人信息=============',JSON.stringify(user))
				}
				this.SET_ACTIVE_MEMBER({
					...user,
					jid: `${user.username}${this.xmppDomain}`,
					account: user.username
				})
				//跳转个人信息
				uni.navigateTo({
					url: "../friends/friend-info?type=personList"
				})
			},
			createChannel(item) {
				var token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/channels',
					header: {
						"Content-type": "application/json;charset=UTF-8",
						"X-Token": token,
					},
					method: "POST",
					data: {
						type: 'P',
						fromUsername: this.currentUser.username,
						fromUserNickname: this.currentUser.nickname,
						toUserId: item.id,
						toUserNickname: item.nickname
					},
					success: (data) => {
						// console.log("获取消息列表成功")
						console.log(JSON.stringify(data))
						//TODO 跳转到聊天页面，并刷新会话列表
						if (data.data) {
							this.$store.commit('setCurrentChannelId', data.data.channelId);
							setTimeout(function() {
								uni.navigateTo({
									url: "../im-chat/im-chat?channelId=" + data.data.channelId + "&channelDisplayName=" + data.data.channelDisplayName +
										"&channelType=" + data.data.channelType + "&toUserId=" + data.data.toUserId
								})
							}, 100)
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);

					},
				})
			},
			addFriend(item) {
				console.log(JSON.stringify(item))
				var token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/immc/rest/friends/add',
					method: 'POST',
					header: {
						"Content-type": "application/json;charset=UTF-8",
						"X-Token": token,
					},
					data: {
						userId: this.currentUser.userId,
						friendId: item.id
					},
					success: (data) => {
						console.log("请求成功")
						console.log(JSON.stringify(data))
						if (data && data.data && data.data.id) {
							uni.showToast({
								title: "添加成功",
							});
							uni.setStorageSync('isRefreshFriends',true);
							item.isAdd = true;
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);
					}
				})
			}
		},
		onPullDownRefresh() {

		},
	};
</script>

<style>
	/***checkbox****/
	.checkbox-flex {
		flex-direction: row;
		align-items: center;
	}

	.checkbox {
		width: 44px;
		height: 44px;
		display: inline-flex;
		position: relative;
	}

	.checkbox-3 {
		display: block;
		margin: 30upx 0;
	}

	.uni-btn {
		height: 90upx;
		right: 5upx;
	}

	.uni-checkbox {
		margin-top: 15upx;
	}

	.page1 {
		background: #ffffff;
	}

	.input-view {
		position: absolute;
		width: 715upx;
		top: 35upx;
		transform: translateY(-50%);
		align-items: center;
		display: flex;
		background-color: #e7e7e7;
		height: 60upx;
		border-radius: 15px;
		padding: 0 10upx;
		margin: 10upx;
	}

	.input {
		flex: 1;
		padding: 0 5px;
		height: 40upx;
		line-height: 40upx;
		margin-top: 8upx;
	}

	.margin-search {
		margin-top: 85upx;
	}

	.product-list {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		flex-direction: row;
	}

	.product {
		padding: 20upx 20upx 20upx;
		display: inline;
		flex-direction: column;

	}

	.image-view {
		height: 84upx;
		width: 84upx;
	}

	.product-image {
		height: 33upx;
		width: 33upx;
	}

	.product-title {

		font-size: 32upx;
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.product-price {
		font-size: 28upx;
		position: relative;
	}

	.product-price-original {
		color: #e80080;
	}

	.product-price-favour {
		color: #888888;
		text-decoration: line-through;
		margin-left: 10upx;
	}

	.product-tip {
		position: absolute;
		right: 10upx;
		background-color: #ff3333;
		color: #ffffff;
		padding: 0 10upx;
		border-radius: 5upx;
	}

	.person-list-add-label {
		font-size: 25upx;
		color: #8F8F94;
		line-height: 100upx;
	}
	.avatar-gray {
		filter: grayscale(100%);
		filter: gray;
	}
</style>
