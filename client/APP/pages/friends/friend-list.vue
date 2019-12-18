<template>
	<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!此类暂时无用!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
	<view class="page">
		<!-- <view class="input-view">
			<uni-icon type="search" size="22" color="#666666"></uni-icon>
			<input confirm-type="search" @confirm="confirm" v-model="searchKeyword" class="input" type="text" placeholder="搜索" />
		</view> -->
		<view class="cu-bar bg-white search" :style="[{top:0 + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" confirm-type="search"  placeholder="查找" v-model="searchKeyword"></input>
			</view>
		</view>
		<view class="uni-list margin-search">
			<view class="uni-list-cell" style="height: 50upx; line-height: 50upx; padding-top: 10upx;" hover-class="uni-list-cell-hover" v-for="(value,key) in friendList" :key="key" @tap="createChannel(value)"
			 @longpress="showActionSheet(value)">
				<view class="uni-media-list" >
					<view class="uni-media-list-logo" v-if="value.avatarUrl">
						<image :src="value.avatarUrl"></image>
					</view>
					<view class="uni-media-list-logo" v-else>
						<image v-if="value.sex=='男'" src="../../static/img/boy.png"></image>
						<image v-else src="../../static/img/girl.png"></image>
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{value.nickname}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{value.organization}}-{{value.department}}</view>
					</view>
					<view>
						<uni-badge :text="value.unreadMessageCount" type="danger"></uni-badge>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import {uniIcon} from '@dcloudio/uni-ui'

	import {
		mapState,
		mapMutations
	} from 'vuex'
	var app = require("../../common/common.js");
	var formatAvatarUrl = app.formatAvatarUrl;
	export default {
		components: {
			uniIcon,
		},
		data() {
			return {
				currentUser: null,
				friendList: [],
				searchKeyword: '',
			}
		},
		onLoad() {
			this.currentUser = uni.getStorageSync('currentUser');
			this.getList();
		},
		onPullDownRefresh() {
			this.getList();
		},
		watch: {
			searchKeyword(curval, oldval) {
				this.searchChannel(curval);
			}
		},
		methods: {
			searchChannel(key) {
				if (!key.trim()) {
					this.getList();
					return;
				}
				var token = uni.getStorageSync('token');
				console.log("获取好友列表");
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/immc/rest/friends/' + this.currentUser.userId + '/search',
					dataType: "json",
					data:{
						name:this.searchKeyword
					},
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"Accept": "application/json, text/plain, */*",
						"X-Token": token,
					},
					success: (data) => {
						console.log("获取好友列表成功")
						let resultData = data.data;
						if (resultData) {
							resultData.forEach(item => item.avatarUrl = formatAvatarUrl(this.$store.state.globalConfig.hostUrl, item.avatarUrl,
								item.id))
						}
						this.friendList = resultData;
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);
					},
				})
			},
			getList() {
				console.log("获取好友列表");
				console.log(this.$store.state.globalConfig.hostUrl + '/immc/rest/friends/' + this.currentUser.userId + '/list');
				var token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/immc/rest/friends/' + this.currentUser.userId + '/list',
					dataType: "json",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"Accept": "application/json, text/plain, */*",
						"X-Token": token,
					},
					success: (data) => {
						uni.stopPullDownRefresh();
						console.log("获取好友列表成功")
						let resultData = data.data;
						if (resultData) {
							resultData.forEach(item => item.avatarUrl = formatAvatarUrl(this.$store.state.globalConfig.hostUrl, item.avatarUrl,
								item.id))
						}
						this.friendList = resultData;
						this.$store.commit('setFriendList', resultData);
						console.log("获取token=" + token);
					},
					fail: (data, code) => {
						uni.stopPullDownRefresh();
						console.log('fail' + JSON.stringify(data) + 'code=' + code);
					},
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
			showActionSheet(item) {
				uni.showActionSheet({
					itemList: ['删除联系人'],
					success: (e) => {
						uni.showModal({ //提醒用户更新
							title: '温馨提示',
							content: '确认删除常用联系人？',
							success: (res) => {
								if (res.confirm) {
									//点击发送按钮时，通知父组件用户输入的内容
									this.delFriend(item);
								}
							}
						})
					}
				})
			},
			delFriend(item) {
				var token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/immc/rest/friends/del/' + this.currentUser.userId + "/" + item.id,
					method: 'DELETE',
					header: {
						"Content-type": "application/json;charset=UTF-8",
						"X-Token": token,
					},
					data: {

					},
					success: (data) => {
						console.log("请求成功")
						console.log(JSON.stringify(data))
						if (data && data.data && data.data === 1) {
							this.getList();
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);
					}
				})
			},

		}
	}
</script>

<style>
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
		display: none;
	}

	.input {
		flex: 1;
		padding: 0 5px;
		height: 40upx;
		line-height: 40upx;
		margin-top: 8upx;
	}

	.margin-search {
		/* margin-top: 85upx; */
	}

	.head {
		padding: 0 20upx;
		margin-top: 20upx;
		height: 100upx;
	}

	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300upx;
		text-align: center;
	}
</style>
