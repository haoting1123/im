<template>
	<view class="friend-list-main-component">
		<!--联系人搜索-->
		<view style="padding: 0 20upx;">
			<search-component @onsearch="searchFriend" searchWidth="710" type="friend"></search-component>
		</view>
		<!--联系人列表-->
		<view class="friend-list" :style="{height: calculateListHeight}">
			<!--联系人置顶列表-->
			<view v-if="showStickFlag" class="friend-list-title">星标联系人</view>
			<view
				class="friend-list-item"
				hover-class="uni-list-cell-hover"
				v-for="friend in filterFriendList"
				v-if="friend.isStick"
				:key="friend.jid"
				@tap="goMemberInfo(friend)"
				@longpress="showActionSheetForFriend(friend)"
			>
				<view class="friend-avatar">
					<image :class="{'avatar-gray': friend.status !== 'online'}" :src="friend.photo" v-if="friend.photo"></image>
					<image :class="{'avatar-gray': friend.status !== 'online'}" src="../../static/img/normal-avatar.png" v-else></image>
				</view>
				<view class="friend-name">
					<view class="alias" :style="{color: friend.status === 'online' ? '#555756' : 'gray'}">{{friend.alias ? friend.alias : friend.name}}</view>
					<view class="name" :style="{color: friend.status === 'online' ? '#AEAEB0' : 'gray'}">{{friend.groupName}}</view>
				</view>
				<div class="stick-icon">
					<image src="../../static/img/star-icon.png"></image>
				</div>
			</view>
			<!--非置顶联系人列表-->
			<view class="friend-list-title">常用联系人</view>
			<view
				class="friend-list-item"
				hover-class="uni-list-cell-hover"
				v-for="friend in filterFriendList"
				v-if="!friend.isStick"
				:key="friend.jid"
				@tap="goMemberInfo(friend)"
				@longpress="showActionSheetForFriend(friend)"
			>
				<view class="friend-avatar">
					<image :class="{'avatar-gray': friend.status !== 'online'}" :src="friend.photo" v-if="friend.photo"></image>
					<image :class="{'avatar-gray': friend.status !== 'online'}" src="../../static/img/normal-avatar.png" v-else></image>
				</view>
				<view class="friend-name">
					<view class="alias" :style="{color: friend.status === 'online' ? '#555756' : 'gray'}">{{friend.alias ? friend.alias : friend.name}}</view>
					<view class="name" :style="{color: friend.status === 'online' ? '#AEAEB0' : 'gray'}">{{friend.groupName}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	import searchComponent from '../../components/home/search-component'

	var app = require("../../common/common.js");
	var formatAvatarUrl = app.formatAvatarUrl;
	export default {
		components: {
			searchComponent
		},
		data() {
			return {
				currentUser: null,
				searchContent: '',
				// 当前操作联系人
				activeFriend: {},
				showStickFlag: false
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.home.userInfo,
				friendList: state => state.home.friendList,
				systemInfo: state => state.home.systemInfo
			}),
			filterFriendList () {
				return this.friendList.filter(item => {
					return item.alias.indexOf(this.searchContent) !== -1 || item.name.indexOf(this.searchContent) !== -1
				})
			},
			// 计算列表的高度
			calculateListHeight () {
				console.log(`系统信息:${JSON.stringify(this.systemInfo)}`)
				return uni.upx2px(750 / this.systemInfo.width * this.systemInfo.height - 188) + 'px'
			}
		},
		onLoad () {},
		onReady () {
			if (this.friendList.some(item => { return item.isStick })) {
				this.showStickFlag = true
			} else {
				this.showStickFlag = false
			}
		},
		onShow () {},
		watch: {
			friendList: {
				handler: function (val, oldval) {
					console.log('常用联系人更新!')
					if (val.some(item => { return item.isStick })) {
						this.showStickFlag = true
					} else {
						this.showStickFlag = false
					}
				},
				deep: true
			}
		},
		methods: {
			...mapMutations([
				'DELETE_FRIEND',
				'SET_ACTIVE_MEMBER',
				'SET_STICK_FRIEND',
				'CANCEL_STICK_FRIEND'
			]),
			...mapActions([
				'DeleteFriend'
			]),
			// 搜索好友
			searchFriend (value) {
				this.searchContent = value
			},
			// 显示操作菜单
			showActionSheetForFriend(item) {
				this.activeFriend = JSON.parse(JSON.stringify(item))
				let permissionsList = ['星标联系人', '删除联系人']
				if (item.isStick) {
					permissionsList[0] = '取消星标联系人'
				}
				uni.showActionSheet({
					itemList: permissionsList,
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								if (permissionsList[0] === '星标联系人') {
									this.stickUser(item)
								} else if (permissionsList[0] === '取消星标联系人') {
									this.cancelStickUser(item)
								}
								break
							case 1:
								this.deleteFriend(item.friendJid)
								break
						}
					}
				})
			},
			// 删除好友
			deleteFriend (jid) {
				uni.showModal({ //提醒用户更新
					title: '温馨提示',
					content: '确认删除该常用联系人吗？',
					success: (res) => {
						if (res.confirm) {
							const data = {
								username: this.userInfo.jid.split('@')[0],
								friendname: jid
							}
							this.DeleteFriend(data)
								.then(data => {
									// console.log(`删除好友成功!${jid}`)
									// TODO:删除本地好友列表的对应成员
									this.DELETE_FRIEND(jid)
								})
								.catch(err => console.log(err))
						}
					}
				})
			},
			// 置顶用户
			stickUser (item) {
				item.isStick = true
				this.SET_STICK_FRIEND(item)
				if (uni.getStorageSync('stickFriendList')) {
					let list = uni.getStorageSync('stickFriendList')
					list.push(item.jid)
					uni.setStorageSync('stickFriendList', list)
				} else {
					uni.setStorageSync('stickFriendList', [item.jid])
				}
			},
			// 取消置顶用户
			cancelStickUser (item) {
				item.isStick = false
				this.CANCEL_STICK_FRIEND(item)
				let list = uni.getStorageSync('stickFriendList')
				let index = list.findIndex(jid => {
					return item.jid === jid
				})
				list.splice(index, 1)
				uni.setStorageSync('stickFriendList', list)
			},
			// 进入用户详情页
			goMemberInfo (item) {
				this.SET_ACTIVE_MEMBER(item)
				uni.navigateTo({
					url: `../friends/friend-info?type=friendList`
				})
			}
		}
	}
</script>

<style lang="scss">
	.friend-list-main-component {
		.friend-list{
			// margin-top: 10upx;
			overflow: auto;
			.friend-list-title {
				padding: 10upx 20upx;
				color: gray;
				background: #f3f3f3;
			}
			.friend-list-item {
				display: flex;
				align-items: center;
				padding: 20upx;
				border-bottom: 2upx solid #F4F3F3;
				.friend-avatar {
					width: 80upx;
					height: 80upx;
					// border-radius: 50%;
					overflow: hidden;
					image {
						width: 100%;
						height: 100%
					}
				}
				.friend-name {
					margin-left: 20upx;
					.alias {
						font-size: 32upx;
						color: #555756;
						line-height: 1;
					}
					.name {
						margin-top: 16upx;
						line-height: 1;
						font-size: 28upx;
						color: #AEAEB0;
					}
				}
				.stick-icon {
					flex: 1;
					font-size: 28upx;
					text-align: right;
					color: #3d89c3;
					image {
						width: 48upx;
						height: 48upx;
					}
				}
				.avatar-gray {
					filter: grayscale(100%);
					filter: gray;
					// border-radius: 50%;
				}
			}
		}
	}
</style>
