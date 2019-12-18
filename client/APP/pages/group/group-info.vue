<template>
	<view class="group-detail-main-component">
		<!--群组成员-->
		<view class="group-members">
			<view class="member-info" v-for="member in activeGroup.members" :key="member.jid" @longpress="showActionSheetForMember(member)">
				<view class="member-avatar">
					<image v-if="member.photo" :src="member.photo"></image>
					<image v-else src="../../static/img/normal-avatar.png"></image>
				</view>
				<view class="member-name ellipsis">
					<text :style="{ color: member.affiliation === 'owner' ? 'orange' : 'gray' }">{{ member.nickName }}</text>
				</view>
			</view>
			<view class="member-info" @tap="goAddMember">
				<view
					class="member-avatar"
					style="dispaly: flex; align-items: center; border: 1px dashed #bfbfbf; border-radius: 10upx;">
					<image src="../../static/img/add-group-member.png" style="width: 50upx; height: 50upx; margin-top: 20upx"></image>
				</view>
			</view>
		</view>
		<view class="group-detail-item">
			<text>群组名称</text>
			<text v-if="!editGroupNameFlag" class="content" style="color: black" @tap="startEditGroupName">{{ newGroupName }}</text>
			<input v-show="editGroupNameFlag" class="content" type="text" v-model="newGroupName" placeholder="请输入群组名称!" @blur="editGroupName" :focus="editGroupNameFlag" />
			<view class="right-arrow">&nbsp;</view>
		</view>
		<view class="group-detail-item">
			<text>群中角色</text>
			<text class="content group-role" v-if="isAdmin">群主</text>
			<text class="content group-role" v-if="!isAdmin">群成员</text>
		</view>
		<view class="group-detail-item">
			<text>群中昵称</text>
			<text v-if="!editGroupMemberNameFlag" class="content group-member-name" style="color: black" @tap="startEditGroupMemberName">{{ activeGroup.nickName }}</text>
			<input v-show="editGroupMemberNameFlag" class="content" type="text" v-model="newAlias" placeholder="请输入在群中的昵称!" @blur="editGroupMemberName" :focus="editGroupMemberNameFlag" />
			<view class="right-arrow">&nbsp;</view>
		</view>
		<view class="group-detail-item">
			<text>群组成员</text>
			<view class="content group-nums">{{ activeGroup.members.length }}人</view>
		</view>
		<view v-if="useType === 'channel'" class="group-detail-item">
			<text>消息免打扰</text>
			<view class="content group-voice">
				<switch :checked="activeGroup.isTip === 'no'" @change="noVoiceSwitch" />
			</view>
		</view>
		<view v-if="useType === 'channel'" class="group-detail-item" @tap="goGroupNotice">
			<text>群公告</text>
			<text v-if="groupNoticeList.length" class="content ellipsis">{{ groupNoticeList[0].title }}</text>
			<text v-else class="content">暂无公告</text>
			<view class="right-arrow">&nbsp;</view>
		</view>
		<view v-if="useType === 'channel'" class="group-detail-item message-history" @tap="clearMessageHistory">
			<text>消息记录</text>
			<text class="content">清空</text>
			<view class="right-arrow">&nbsp;</view>
		</view>

		<view class="button-group">
			<button v-if="useType !== 'channel'" @tap="startSendMessage">发消息</button>
			<button @tap="exitGroup">离开群组</button>
			<button v-if="isAdmin" type="warn" @tap="destoryGroup">解散群组</button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	import app from "../../common/common.js"
	var moment = require('../../common/moment.js')
	export default {
		data() {
			return {
				groupVoice: true,
				noVoiceCheck: false,
				noDisturbList: [],
				// 新的群名
				newGroupName: '',
				// 新的别名
				newAlias: '',
				// 编辑群名称标识
				editGroupNameFlag: false,
				// 编辑群中昵称标识
				editGroupMemberNameFlag: false,
				// 在退出群组/解散群组判断返回页面栈的层级
				useType: ''
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.home.userInfo,
				activeGroup: state => state.group.activeGroup,
				groupList: state => state.group.groupList,
				groupNoticeList: state => state.group.groupNoticeList
			}),
			// 判断是否为群主
			isAdmin () {
				if (this.activeGroup.members.some(item => { return item.jid === this.userInfo.jid && item.affiliation === 'owner'})) {
					return true
				}
				return false
			}
		},
		onUnload() {
			// uni.setStorageSync('noDisturbList', JSON.stringify(this.noDisturbList));
		},
		onLoad(option) {
			this.useType = option.type
		},
		onShow () {
			// console.log(JSON.stringify(this.activeGroup))
			this.newAlias = this.activeGroup.nickName ? this.activeGroup.nickName : ''
			this.newGroupName = this.activeGroup.name ? this.activeGroup.name : ''
		},
		onReady() {},
		watch: {
			// 得到群消息变动通知（其他群组消息），响应更新
			groupList: {
				handler: function(val, oldval) {
					val.forEach(item => {
						if (item.jid === this.activeGroup.jid) {
							// console.log(`activeGroup: ${JSON.stringify(item)}`)
							this.SET_ACTIVE_GROUP(item)
							setTimeout(() => {
								this.newGroupName = item.name
							}, 200)
						}
					})
				},
				deep: true
			},
		},
		methods: {
			...mapMutations([
				'SET_CURRENT_CHANNEL_ID',
				'SET_CURRENT_CHANNEL',
				'SET_ACTIVE_GROUP'
			]),
			...mapActions([
				'DeleteGroupMember',
				'DestoryGroup',
				'ExitGroup',
				'SetGroupName',
				'getSessionByJid',
				'addNewSession',
				'changeTipStatus',
				'removeMessageByDbSessionId',
				'UpdateGroupInfoByRoomId',
				'UpdateGroupMemberNameByRoomId',
				'sendOtherMessage'
			]),
			// 群公告
			goGroupNotice () {
				uni.navigateTo({
					url: '../group/group-notice'
				})
			},
			// 清空消息记录
			clearMessageHistory () {
				if (this.debug) console.log(`清空消息记录`)
				uni.showModal({
					title: '提示',
					content: '消息记录清空后，不可恢复!',
					success: (res) => {
						if (res.confirm) {
							this.removeMessageByDbSessionId(this.activeGroup.jid)
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
			// 开始编辑群名
			startEditGroupName () {
				// 群主判定
				// if (!this.isAdmin) return
				this.newGroupName = this.activeGroup.name
				this.editGroupNameFlag = true
			},
			// 编辑群名
			editGroupName () {
				if (!this.newGroupName.replace(/\s/g, '')) {
					uni.showToast({
						title: '请输入有效的群组名称!',
						icon: 'none'
					})
					this.newGroupName = this.activeGroup.name
					this.editGroupNameFlag = false
					return
				}
				// this.SetGroupName({
				// 	jid: this.userInfo.jid,
				// 	groupJid: this.activeGroup.jid,
				// 	groupName: this.newGroupName
				// })
				this.UpdateGroupInfoByRoomId({
					roomJid: this.activeGroup.jid,
					naturalName: this.newGroupName
				})
				    .then(data => {
						if (data === 1) {
						    // 多端消息同步 => 创建群聊
							this.sendOtherMessage({
								to: `${this.userInfo.jid}/SyntoIM-PC`,
								content: JSON.stringify({
									type: 'updateGroupInfo',
									roomId: this.activeGroup.jid
								}),
								type: 'PORT_SYNC'
							})
						} else {
							uni.showToast({
								title: '群组名称修改失败!',
								icon: 'none'
							})
						}
						this.editGroupNameFlag = false
					})
					.catch(err => {
						this.newGroupName = this.activeGroup.name
						this.editGroupNameFlag = false
					})
			},
			// 开始编辑在群中的昵称
			startEditGroupMemberName () {
				this.newAlias = this.activeGroup.nickName
				this.editGroupMemberNameFlag = true
			},
			// 编辑在群中的昵称
			editGroupMemberName () {
				if (!this.newAlias.replace(/\s/g, '')) {
					uni.showToast({
						title: '请输入有效的昵称!',
						icon: 'none'
					})
					this.editGroupMemberNameFlag = false
					return
				}
				this.UpdateGroupMemberNameByRoomId({
					jid: this.userInfo.jid,
					roomJid: this.activeGroup.jid,
					nickname: this.newAlias
				})
				  .then(data => {
						this.activeGroup.nickName = this.newAlias
						this.newAlias = ''
						this.editGroupMemberNameFlag = false
					})
					.catch(err => {
						this.newAlias = ''
						this.editGroupMemberNameFlag = false
					})
			},
			// 显示操作菜单
			showActionSheetForMember (item) {
				if (!this.isAdmin) return
				if (item.jid === this.userInfo.jid) return
				let permissionsList = ['删除群成员']
				uni.showActionSheet({
					itemList: permissionsList,
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								this.deleteMember(item)
								break
						}
					}
				})
			},
			// 前往添加新成员
			goAddMember () {
				uni.navigateTo({
					url: `../group/addGroupPerson?type=addMember&groupJid=${this.activeGroup.jid}&groupName=${this.activeGroup.name}`
				})
			},
			// 删除成员
			deleteMember (member) {
				uni.showModal({
					title: '提示',
					content: '确定删除成员吗?',
					success: (res) => {
						if (res.confirm) {
							this.DeleteGroupMember({
								groupJid: this.activeGroup.jid,
								memberJid: member.jid
							})
						}
					}
				})
			},
			// 解散群组
			destoryGroup () {
				uni.showModal({
					title: '提示',
					content: '确定解散该群组吗?',
					success: (res) => {
						if (res.confirm) {
							this.DestoryGroup({
								jid: this.userInfo.jid,
								groupJid: this.activeGroup.jid
							})
							this.pageBack()
						}
					}
				})
			},
			// 群出群组
			exitGroup () {
				uni.showModal({
					title: '提示',
					content: '确定退出群组吗?',
					success: (res) => {
						if (res.confirm) {
							this.ExitGroup({
								userJid: this.userInfo.jid,
								groupJid: this.activeGroup.jid
							})
							this.pageBack()
						}
					}
				})
			},
			// 返回页面栈的层级判定
			pageBack () {
				switch (this.useType) {
					case 'groupList':
						uni.navigateBack()
						break
					case 'channel':
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							})
						}, 300)
						break
				}
			},
			// 群消息免打扰
			noVoiceSwitch (event) {
				if (this.debug) console.log(event.target.value)
				this.getSessionByJid({ jid: this.activeGroup.jid })
					.then(res => {
						if (res.length) {
							let channel = JSON.parse(JSON.stringify(res[0]))
							this.changeTipStatus(channel)
						}
					})
			},
			// 发消息
			startSendMessage () {
				// 更新会话列表
				this.getSessionByJid({ jid: this.activeGroup.jid })
					.then(resp => {
						console.log(`是否存在会话:${resp}`)
						if (resp.length) {
							let channel = resp[0]
							// console.log('存在会话', resp)
							this.SET_CURRENT_CHANNEL_ID(this.activeGroup.jid)
							this.SET_CURRENT_CHANNEL(channel)
							uni.navigateTo({
								url: "../im-chat/im-chat?channelId=" + channel.channelId + "&channelType=" + channel.channelType
							})
						} else {
							// 新增
							this.addNewSession({
								jid: this.activeGroup.jid,
								lastMessage: '',
								createTime: Date.now(),
								unreadMessageCount: 0,
								channelType: 'G'
							}).then((channel) => {
								this.SET_CURRENT_CHANNEL_ID(this.activeGroup.jid)
								this.SET_CURRENT_CHANNEL(channel)
								uni.navigateTo({
									url: "../im-chat/im-chat?channelId=" + channel.channelId + "&channelType=" + channel.channelType
								})
							})
						}
					})
			},
		}
	}
</script>

<style lang="scss">
	body {
		background: white;
	}
	.group-detail-main-component {
		padding: 0 40upx;
		.group-members {
			display: flex;
			flex-wrap: wrap;
			padding-top: 30upx;
			.member-info {
				margin-right: 14upx;
				padding-bottom: 10upx;
				.member-avatar {
					width: 100upx;
					height: 100upx;
					line-height: 100upx;
					text-align: center;
					image {
						width: 100upx;
						height: 100upx;
						border-radius: 10upx;
					}
				}
				.member-name {
					width: 100upx;
					font-size: 24upx;
					text-align: center;
					color: gray;
				}
			}
			.member-info:nth-child(6n) {
				margin-right: 0;
			}
		}
		.group-detail-item {
			display: flex;
			align-items: center;
			height: 100upx;
			border-bottom: 1px solid #F4F3F3;
			color: #5A5959;
			font-size: 32upx;
			.content {
				flex: 1;
				margin-right: 6upx;
				text-align: right;
				color: gray;
			}
			.group-role, .group-nums, .group-voice {
				margin-right: 30upx;
			}
			input {
				height: 100upx;
				text-align: right;
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
		.message-history {
			text:nth-child(2) {
				color: #3d89c3;
			}
		}
		.button-group {
			margin-top: 50upx;
			button {
				width: 500upx;
				height: 70upx;
				line-height: 70upx;
				font-size: 30upx;
				background-color: #3D89C3;
				border-radius: 40upx;
				color: #FFFFFF;
			}
		}
		// .ellipsis {}
	}
</style>
