<template>
	<view class="friend-info-main-component">
		<view class="friend-info-item base-info">
			<view class="friend-avatar">
				<image v-if="activeMember.photo" :src="activeMember.photo"></image>
				<image v-else-if="activeMember.headUrl" :src="activeMember.headUrl"></image>
				<image v-else src="../../static/img/normal-avatar.png"></image>
			</view>
			<view class="friend-name">
				<view class="alias">{{ activeMember.name }}</view>
				<view class="account">账号: {{ activeMember.account }}</view>
			</view>
		</view>
		<view class="friend-info-item other-info" @tap="startSetAlias" v-if="isFriend && useType !== 'personList' && useType !== 'businessCard' && activeMember.jid !== userInfo.jid">
			<text>编辑备注</text>
			<text v-if="!editFriendAliasFlag">{{ activeMember.alias ? activeMember.alias : '点击编辑' }}</text>
			<input v-show="editFriendAliasFlag" class="alias-input" type="text" v-model="newAlias" @blur="setFriendAlias" :focus="editFriendAliasFlag" />
		</view>
		<!--v-if="isFriend || (!isFriend && useType !== 'channel')"-->
		<view class="friend-info-item other-info">
			<text>部门</text>
			<text style="color: gray">{{ activeMember.groupName }}</text>
		</view>
		<view v-if="useType === 'channel'" class="friend-info-item other-info">
			<text class="uni-list-cell-db">消息免打扰</text>
			<switch @change="noVoiceSwitch" :checked="activeMember.isTip === 'no'" />
		</view>
		<view v-if="useType === 'channel'" class="friend-info-item other-info">
			<text class="uni-list-cell-db">开启密聊</text>
			<switch @change="secretChat" />
		</view>
		<view v-if="useType === 'channel'" class="friend-info-item message-history" @tap="clearMessageHistory">
			<text class="uni-list-cell-db">消息记录</text>
			<text>清空</text>
		</view>
	  <view class="button-group">
			<button v-if="!isFriend" class="button-group-item" type="primary" @tap="addFriend">添加常用联系人</button>
			<button v-if="!isAdmin && useType !== 'channel' && useType !== 'businessCard'" class="button-group-item" type="primary" @tap="startSendMessage('normalChat')">发消息</button>
			<button v-if="!isAdmin && useType !== 'channel' && useType !== 'businessCard'" class="button-group-item"type="primary" @tap="startSendMessage('secretChat')">密聊</button>
			<!--v-if="this.activeMember.jid !== this.userInfo.jid"-->
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
	data() {
		return {
			newAlias: '',
			editFriendAliasFlag: false,
			useType: ''
		};
	},
	onLoad(params) {
		this.useType = params.type
	},
	onShow() {
		// console.log(`activeMember:${JSON.stringify(this.activeMember)}`)
		console.log('显示啦')
		// 获取成员信息
		this.GetMemberInfo(this.activeMember.jid.split('@')[0])
			.then(data => {
				// console.log(`成员信息:${JSON.stringify(data)}`)
				// 设置导航栏标题
				if (data.name) {
					uni.setNavigationBarTitle({
						title: data.name
					})
				}
				this.SET_ACTIVE_MEMBER({
					...this.activeMember,
					sex: data.sex,
					name: data.name,
					photo: data.photo
				})
				// 保存到本地成员列表
				this.ADD_LOCALMEMBER(this.activeMember)
			})
			.catch(err => {})
	},
	computed: {
		...mapState({
			userInfo: state => state.home.userInfo,
			activeMember: state => state.home.activeMember,
			xmppDomain: state => state.home.xmppDomain,
			friendList: state => state.home.friendList,
			localMemberData: state => state.home.localMemberData
		}),
		// TODO:好友判定（或用户自己）
		isFriend () {
			// console.log(`this.friendList:${JSON.stringify(this.friendList)}`)
			if (this.friendList.some(friend => { return friend.jid === this.activeMember.jid }) || this.activeMember.jid === this.userInfo.jid) {
				return true
			}
			return false
		},
		isAdmin () {
			if (this.activeMember.jid === this.userInfo.jid) {
				return true
			}
			return false
		}
	},
	watch: {},
	methods: {
		...mapMutations([
			'ADD_FRIEND',
			'SET_SELECTED_CHANNEL_BY_JID',
			'SET_CURRENT_CHANNEL_ID',
			'SET_CURRENT_CHANNEL',
			'ADD_LOCALMEMBER',
			'SET_MESSAGE_CHAT_TYPE',
			'SET_ACTIVE_MEMBER'
		]),
		...mapActions([
			'SetFriendAlias',
			'AddFriend',
			'getSessionByJid',
			'addNewSession',
			'changeTipStatus',
			'removeMessageByDbSessionId',
			'GetMemberInfo'
		]),
		// 启用/关闭密聊
		secretChat (e) {
			console.log('启用/关闭密聊============='+e.target.value)
			if(e.target.value){
				this.SET_MESSAGE_CHAT_TYPE('secretChat');
			}else{
				this.SET_MESSAGE_CHAT_TYPE('normalChat');
			}

		},
		// 清空消息记录
		clearMessageHistory () {
			if (this.debug) console.log(`清空消息记录`)
			uni.showModal({
				title: '提示',
				content: '消息记录清空后，不可恢复!',
				success: (res) => {
					if (res.confirm) {
						this.removeMessageByDbSessionId(this.activeMember.jid)
							.then(() => {
								uni.showToast({
									title: '记录已清空!',
									icon: 'success'
								})
							})
					}
				}
			})
		},
		// 消息免打扰
		noVoiceSwitch(event) {
			if (this.debug) console.log(event.target.value)
			this.getSessionByJid({ jid: this.activeMember.jid })
				.then(res => {
					if (res.length) {
						let channel = JSON.parse(JSON.stringify(res[0]))
						this.changeTipStatus(channel)
					}
				})
		},
		// 设置现有备注
		startSetAlias() {
			this.newAlias = this.activeMember.alias;
			this.editFriendAliasFlag = true;
		},
		// 设置备注
		setFriendAlias(event) {
			if (!this.newAlias.replace(/\s/g, '')) {
				this.editFriendAliasFlag = false;
				return;
			}
			let alias = event.target.value;
			let id = ''
			this.friendList.find(item => {
				if (item.jid === this.activeMember.jid) {
					id = item.id
				}
			})
			const formData = {
				// id: this.activeMember.id ? this.activeMember.id : this.activeMember.userId,
				id: id,
				userName: this.userInfo.jid.split('@')[0],
				friendJid: this.activeMember.friendJid ? this.activeMember.friendJid : this.activeMember.jid,
				alias: alias
			};
			// console.log(`设置好友备注:${JSON.stringify(this.activeMember)}`)
			this.SetFriendAlias(formData)
				.then(data => {
					this.activeMember.alias = this.newAlias;
					this.newAlias = '';
					this.editFriendAliasFlag = false;
				})
				.catch(err => {
					uni.showToast({
						title: '设置备注失败!',
						icon: 'none'
					});
					console.log(err);
				});
		},
		// 添加好友
		addFriend() {
			if(this.debug) {
				console.log(`展示个人信息=${JSON.stringify(this.activeMember)}`)
			}
			uni.showModal({
				title: '温馨提示',
				content: '确定添加到常用联系人吗?',
				success: res => {
					if (res.confirm) {
						this.AddFriend({
							// alias: this.activeMember.name,
							alias: '',
							friendJid: this.activeMember.jid,
							userName: this.userInfo.jid.split('@')[0]
						})
							.then(data => {
								console.log(`添加好友成功:${JSON.stringify(data)}`)
								if (data.friendJid) {
									let nodeInfo = {
										...this.activeMember,
										id: data.id,
										jid: this.activeMember.jid,
										friendJid: this.activeMember.jid,
										alias: '',
										username: this.userInfo.jid.split('@')[0],
										rightKeyMenu: false
									}
									if (this.useType === 'channel') nodeInfo.photo = this.activeMember.headUrl
									// console.log(`nodeInfo:${JSON.stringify(nodeInfo)}`)
									this.ADD_FRIEND(nodeInfo)
									uni.showToast({
										title: '添加常用联系人成功!',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: '添加常用联系人失败!',
										icon: 'none'
									});
								}
							})
							.catch(err => {
								console.log(err);
								uni.showToast({
									title: '添加常用联系人失败!',
									icon: 'none'
								});
							});
					}
				}
			});
		},
		// 发消息
		startSendMessage(chatType) {
			console.log(`开始发送消息:${this.activeMember.jid}`)
			// 更新会话列表
			this.getSessionByJid({ jid: this.activeMember.jid }).then(resp => {
				// console.log(`是否存在会话:${JSON.stringify(resp)}`)
				if (resp.length) {
					let channel = resp[0]
					// console.log(`存在会话:${JSON.stringify(channel)}`)
					this.SET_CURRENT_CHANNEL_ID(this.activeMember.jid)
					this.SET_CURRENT_CHANNEL(channel)
					uni.redirectTo({
						url: "../im-chat/im-chat?channelId=" + channel.channelId + "&channelType=" + channel.channelType + "&chatType=" + chatType
					})
				} else {
					// 新增
					this.addNewSession({
						jid: this.activeMember.jid,
						lastMessage: '',
						createTime: Date.now(),
						unreadMessageCount: 0,
						channelType: 'P'
					}).then((channel) => {
						this.getSessionByJid({ jid: this.activeMember.jid })
							.then(resp => {
								if (this.debug) console.log(`是否存在会话:${JSON.stringify(resp)}`)
								if (resp.length) {
									// console.log(`存在会话:${JSON.stringify(channel)}`)
									let channel = resp[0]
									this.SET_CURRENT_CHANNEL_ID(channel.channelId)
									this.SET_CURRENT_CHANNEL(channel)
									uni.redirectTo({
										url: "../im-chat/im-chat?channelId=" + channel.channelId + "&channelType=" + channel.channelType+"&chatType="+chatType
									})
								}
							})
					})
				}
			})
		}
	}
};
</script>

<style lang="scss">
	body {
		background: white;
	}
	.friend-info-main-component {
		padding: 0 40upx;
		.friend-info-item {
			display: flex;
			align-items: center;
			padding: 20upx 0;
			border-bottom: 1px solid #e2e2e2;
			font-size: 32upx;
			.friend-avatar {
				image {
					width: 90upx;
					height: 90upx;
					border-radius: 10upx;
				}
			}
			.friend-name {
				margin-left: 30upx;
				.alias {
					/*font-size: 40upx;*/
					line-height: 1;
				}
				.account {
					margin-top: 10upx;
					font-size: 24upx;
					line-height: 1;
					color: gray;
				}
			}
			.alias-input {
				flex: 1;
				text-align: right;
				height: 60upx;
				line-height: 60upx;
			}
		}
		.other-info {
			justify-content: space-between;
			height: 100upx;
			line-height: 100upx;
		}
		.message-history {
			text:nth-child(2) {
				color: #3d89c3;
			}
		}
		.button-group {
			margin-top: 70upx;
			.button-group-item {
				width: 500upx;
				height: 70upx;
				line-height: 70upx;
				font-size: 30upx;
				background-color: #3d89c3;
				border-radius: 40upx;
			}
		}
	}
</style>
