<template>
	<view class="create-group-main-component">
		<view class="cu-bar bg-white search group-name-section" v-if="useType === 'createGroup'">
			<view class="search-form round" style="margin: 0">
				<input
					v-model="groupName"
					class="input"
					type="text"
					placeholder="请输入群组名称!"
					placeholder-class="search-palceholder-style"
				/>
			</view>
		</view>
		<view class="member-list uni-list margin-search">
			<checkbox-group @change="checkboxChange">
				<label v-for="friend in filterFriendList" :key="friend.jid">
					<view class="uni-list-cell">
						<view class="uni-media-list member-list-item">
							<view class="uni-media-list-logo" v-if="friend.photo">
								<image :src="friend.photo"></image>
							</view>
							<view class="uni-media-list-logo" v-else>
								<image src="../../static/img/normal-avatar.png"></image>
							</view>
							<view class="uni-media-list-bodyfriend-name">
								<view class="uni-media-list-text-top">{{friend.alias ? friend.alias : friend.name }}</view>
								<view class="uni-media-list-text-bottom">{{friend.groupName}}</view>
							</view>
							<checkbox :class="friend.isAdd ? 'checked' : ''" :checked="friend.isAdd ? true : false" :disabled="friend.isAdd" :value="friend.jid"></checkbox>
						</view>
					</view>
				</label>
			</checkbox-group>
			<!--<load-more :loadingType="loadingType" :contentText="contentText"></load-more>-->
		</view>
	</view>
</template>
<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import loadMore from '../../components/load-more.vue'
	import { mapState, mapMutations, mapActions } from 'vuex'
	var app = require("../../common/common.js")

	var formatAvatarUrl = app.formatAvatarUrl;
	export default {
		data() {
			return {
				// 要邀请进群的成员列表
				addMemberList: [],
				searchKeyword: '',
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				// 新增群组昵称
				groupName: '',
				// 使用类型
				useType: '',
				groupJid: '',
				// 使用新数据，避免因好友上下线导致数据错乱
				memberList: [],
				oldMemberList: []
			};
		},
		computed: {
			...mapState({
				friendList: state => state.home.friendList,
				userInfo: state => state.home.userInfo,
				activeGroup: state => state.group.activeGroup
			}),
			// 过滤出已添加的成员
			filterFriendList () {
				if (this.useType === 'createGroup') return this.memberList
				let friendList = JSON.parse(JSON.stringify(this.memberList))
				this.activeGroup.members.forEach(member => {
					friendList.forEach((friend, index) => {
						if (member.jid === friend.jid) {
							friendList[index].isAdd = true
							this.oldMemberList.push(member.jid)
						}
					})
				})
				return friendList
			}
		},
		onLoad(option) {
			this.initData(option)
		},
		onShow () {
			this.memberList = JSON.parse(JSON.stringify(this.friendList))
		},
		onReachBottom() {},
		watch: {
			searchKeyword(curval, oldval) {
				this.searchChannel(curval);
			}
		},
		components: {
			uniIcon,
			loadMore
		},
		onPullDownRefresh() {},
		onNavigationBarButtonTap(e) {
			switch (this.useType) {
				// 创建群聊
				case 'createGroup':
					this.createGroup()
					break
				// 添加群成员
				case 'addMember':
					this.startAddGroupMember()
					break
			}
		},
		methods: {
			...mapMutations([
				'SET_CURRENT_CHANNEL_ID',
				'SET_CURRENT_CHANNEL',
				'SET_ACTIVE_GROUP'
			]),
			...mapActions([
				'CreateGroup',
				'SaveGroup',
				'AddGroupMember',
				'getSessionByJid',
				'addNewSession',
				'sendOtherMessage'
			]),
			initData (options) {
				this.useType = options.type
				switch (options.type) {
					case 'createGroup':
						uni.setNavigationBarTitle({
							title: '创建群聊'
						})
						break
					case 'addMember':
						uni.setNavigationBarTitle({
							title: '添加群成员'
						})
						break
				}
				if (options.groupJid) {
					this.groupJid = options.groupJid
				}
			},
			// 是否已经加入群聊判定
			isMember (member) {
				if (this.activeGroup.members.some(item => {  return item.jid === member.jid })) {
					if (this.debug) console.log(`${member.name}已加入群组`)
					return true
				}
				return false
			},
			checkboxChange: function(e) {
				// if (this.debug) console.log(e.detail.value)
				// if (this.debug) console.log(JSON.stringify(this.getArrDifference(this.oldMemberList, e.detail.value)))
				// 过滤已添加的成员，避免重复添加，导致重复收到群组邀请通知
				let result = this.getArrDifference(this.oldMemberList, e.detail.value)
				this.addMemberList = result
			},
			// 取出两个数组中不同的值
			getArrDifference(arr1, arr2) {
				return arr1.concat(arr2).filter(function(v, i, arr) {
					return arr.indexOf(v) === arr.lastIndexOf(v);
				})
			},
			// 创建群聊
			createGroup () {
				if (!this.groupName.replace(/\s/g, '')) {
					uni.showToast({
						title: '请输入有效群组名称!',
						icon: 'none'
					})
					return
				}
				const formData = {
					userName: this.userInfo.jid.split('@')[0],
					groupName: this.groupName
				}
				this.CreateGroup(formData)
					.then(data => {
						this.groupJid = data.groupJid
						data = {
							...data,
							...formData
						}
						this.saveGroup(data)
					})
			},
			// 保存为永久群聊
			saveGroup (data) {
				this.SaveGroup(data)
					.then(data => {
						uni.showToast({
							title: '群组创建成功!',
							icon: 'success'
						})
						// 多端消息同步 => 创建群聊
						this.sendOtherMessage({
							to: `${this.userInfo.jid}/SyntoIM-PC`,
							content: JSON.stringify({
								type: 'createGroup',
								roomId: this.groupJid
							}),
							type: 'PORT_SYNC'
						})
						this.startSendMessage(this.groupJid)
						// 添加群成员
						if (this.addMemberList.length) {
							if (this.debug) console.log(`开始添加群成员${JSON.stringify(this.addMemberList)}`)
							this.AddGroupMember({
								groupJid: this.groupJid,
								addList: this.addMemberList
							})
						}
						this.groupName = ''
					})
			},
			// 添加群成员
			startAddGroupMember() {
				// 过滤出未添加的成员 start
				let memberList = []
				this.friendList.forEach((friend, index) => {
					if (!this.activeGroup.members.some(member => { return friend.jid === member.jid })) {
						memberList.push(friend.jid)
					}
				})
				// 过滤出未添加的成员 end
				this.AddGroupMember({
					groupJid: this.groupJid,
					addList: this.addMemberList
				})
				uni.navigateBack()
			},
			// 创建群聊成功，默认打开会话窗口
			startSendMessage (jid) {
				// 更新会话列表
				this.getSessionByJid({ jid: jid })
					.then(resp => {
						if (resp.length) {
							// console.log('存在会话', resp)
							let channel = resp[0]
							this.SET_CURRENT_CHANNEL_ID(this.activeGroup.jid)
							this.SET_CURRENT_CHANNEL(channel)
							uni.redirectTo({
								url: "../im-chat/im-chat?channelId=" + channel.channelId + "&channelType=" + channel.channelType
							})
						} else {
							// 新增
							this.addNewSession({
								jid: jid,
								lastMessage: '',
								createTime: Date.now(),
								unreadMessageCount: 0,
								channelType: 'G'
							}).then((channel) => {
								this.SET_CURRENT_CHANNEL_ID(channel.channelId)
								this.SET_CURRENT_CHANNEL(channel)
								uni.redirectTo({
									url: "../im-chat/im-chat?channelId=" + channel.channelId + "&channelType=" + channel.channelType
								})
							})
						}
					})
			}
		}
	};
</script>

<style lang="scss">
	.create-group-main-component {
		.group-name-section {
			padding: 0 20upx;
			input {
				padding: 0 20upx;
				margin: 0;
			}
		}
		.member-list {
			.member-list-item {
				display: flex;
				align-items: center;
				.friend-name {
					flex: 1;
				}
			}
		}
		.uni-media-list-bodyfriend-name {
			flex: 1;
		}

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
	}
</style>
