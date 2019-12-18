<template>
	<view class="page">

		<view class="mask1" v-show="showMask" @click="hide"></view>
	<!-- 	<view class="input-view">
			<uni-icon type="search" size="22" color="#666666"></uni-icon>
			<input confirm-type="search" class="input" v-model="searchKeyword" type="text" placeholder="搜索" />
		</view> -->
		<!-- 搜索框 -->
		<view class="cu-bar bg-white search" :style="[{top:0 + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" confirm-type="search" placeholder="搜索" @tap="toSearchMessage" disabled></input>
			</view>
		</view>

		<view class="infoAll">

			<view
				class="uni-list-cell my-uni-ul"
				hover-class="uni-list-cell-hover"
				style="background-color: #E7E7E7;"
				v-for="(value, index) in sessionList"
				:key="index"
				@tap="goDetail(value)"
			>
				<view
					class="uni-media-list my-uni-li"
					@touchstart="touchStart($event)"
					@touchend="touchEnd($event, index)"
					v-if="value.top && value.top === 'top'"
					v-bind:class="{ 'my-uni-li-show': value.type, 'my-uni-li-hide': !value.type }"
				>
					<view v-if="value.channelType == 'P'">
						<view class="uni-media-list-logo" v-if="value.headUrl"><image :src="value.headUrl"></image></view>
						<view class="uni-media-list-logo" v-else>
							<image src="../../static/img/normal-avatar.png"></image>
						</view>
					</view>
					<view v-else>
						<view class="uni-media-list-logo"><image src="../../static/img/qun.png"></image></view>
					</view>
                    <view class="message-tip"><uni-badge :text="value.unreadMessageCount" type="error"></uni-badge></view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{ value.alias ? value.alias :value.name }}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">
							<text v-if="value.isAtMe === 'yes'" style="color:#F56C6C">[有人@我]</text>
							<!-- <text v-if="value.channelType == 'G'">{{ value.lastName ? value.lastName + ':' : '' }}</text> -->
							{{ value.lastMessage }}
						</view>
						<view class="message-create-at">{{ value.createTimeStr }}</view>
					</view>
					<view v-if="value.isTip === 'no'" style="margin: 60upx -20upx 0 0;"><image src="../../static/img/no-notice.png" style="width:75upx; height:50upx;"></image> </view>
					<view class="top" @tap.stop="top(value, index)" style="width: 30%;right: -30%">取消置顶</view>
				</view>
			</view>
		</view>
		<view class="infoAll">
			<view class="uni-list-cell my-uni-ul"  hover-class="uni-list-cell-hover" v-for="(value, index) in sessionList" :key="index" @tap="goDetail(value)">
				<view
					class="uni-media-list my-uni-li"
					@touchstart="touchStart($event)"
					@touchend="touchEnd($event, index)"
					v-if="!value.top || value.top === 'no'"
					v-bind:class="{ 'my-uni-li-show': value.type, 'my-uni-li-hide': !value.type }"
				>
				<!-- circle-logo -->
					<view v-if="value.channelType == 'P'">
						<view class="uni-media-list-logo " v-if="value.headUrl"><image :src="value.headUrl"></image></view>
						<view class="uni-media-list-logo" v-else>
							<image src="../../static/img/normal-avatar.png"></image>
						</view>
					</view>
					<view v-if="value.channelType == 'G'">
						<view class="uni-media-list-logo"><image src="../../static/img/qun.png"></image></view>
					</view>
                    <view class="message-tip"><uni-badge :text="value.unreadMessageCount" type="error"></uni-badge></view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{ value.alias ? value.alias :value.name }}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">
							<text v-if="value.isAtMe === 'yes'" style="color:#F56C6C">[有人@我]</text>
							<!-- <text v-if="value.channelType == 'G'">{{ value.lastName ? value.lastName + ':' : '' }}</text> -->
							{{ value.lastMessage }}
						</view>
						<view class="message-create-at">{{ value.createTimeStr }}</view>
					</view>
          <view v-if="value.isTip === 'no'" style="margin: 60upx -20upx 0 0;"><image src="../../static/img/no-notice.png" style="width:75upx; height:50upx;"></image> </view>
					<view class="top" @tap.stop="top(value, index)">置顶</view>
					<view class="delect" @tap.stop="delect(value)">删除</view>
				</view>
			</view>
		</view>

		<view class="popup popup-top dropdown-menu-list" v-show="showAddMenu">
			<view class="dropdown-menu-list-item" style="flex-direction: row;border-bottom:1upx solid #C8C8C8" @tap="addGroup">
				<image style="width: 50upx;height: 50upx;line-height: 60upx;display: inline-block; vertical-align: middle;" src="../../static/img/group.png"></image>
				<text>发起群聊</text>
			</view>
			<view class="dropdown-menu-list-item" style="flex-direction: row;" @tap="addFriend">
				<image style="width: 40upx;height: 40upx; line-height: 60upx;display: inline-block; vertical-align: middle;" src="../../static/img/friendList.png"></image>
				<text>添加联系人</text>
			</view>
		</view>

		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view style="text-align: left; align-items: left; display: flex; padding-left: 30upx;">{{ systemNotice.title }}</view>
					<view class="action justify-end" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					{{systemNotice.content}}
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						{{systemNotice.createTime}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { uniIcon} from '@dcloudio/uni-ui'
import uniBadge from '@/components/uni-badge/uni-badge.vue'
import app from "../../common/common.js"
import { mapState, mapActions, mapMutations} from 'vuex'
import { webSocketUrl } from '@/utils/url'
export default {
	data() {
		return {
			title: 'media-list',
			currentUser: "",
			showImg: true,
			showAddMenu: false,
			showMask: false,
			socketOpen: false,
			socketMsgQueue: [],
			searchKeyword: '',
			channelIds: [],
			curIndex: null,
			noDisturbList: [],
			modalName:'',
            heartbeatTimer: null,
            areaCheckTimer: null // 服务器空间占用检测
		}
	},
	onLoad() {
		this.SET_NODE_MEMBER_INFO('');
		this.setTitleList('');
		this.SET_TREEDATA('');
		console.log('注销机构')
		// 建立会话连接
		this.currentUser = uni.getStorageSync('currentUser');
		this.initSessionList()
		this.hide();
		uni.onNetworkStatusChange(function(res) {
			console.log(res.isConnected);
			console.log(res.networkType);
		});
		// this.refreshUserInfo();
		uni.setStorageSync("isVideoBusy", false);
		// 获取组织机构
		this.getTreeDataInfo();
		// 获取系统公告
		this.getSystemNotice()
		// 监听用户登录（即创建本地XMPP服务成功）
		this.loginListener()
		// 监听系统公告
		this.SystemNoticeListener()
		this.getSystemInfo()
		setTimeout(() => {
			this.conntXMPPServer(this.xmppLoginInfo)
		},100)
        this.heartbeatTimer = setInterval(() => {
            this.sendHeartbeat()
          }, 300000)
          // 5分钟检测服务器空间占用大小
          this.areaCheckTimer = setInterval(() => {
            this.checkServerArea()
          }, 300000)
        this.checkServerArea()
		// switch (plus.os.name) {
		// 	case "Android":
		// 		plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'initApp');
		// 	break;
		// }
	},
	onHide() {
		this.hide();
	},
	onUnload() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
          }
          if (this.areaCheckTimer) {
            clearInterval(this.areaCheckTimer)
          }
	},
	components: {
		uniIcon,
		uniBadge
	},
	onShow() {
		let list = uni.getStorageSync('noDisturbList');
		console.log('list====================',JSON.stringify(list))
		if (list) {
			console.log("------------------" + list)
			this.noDisturbList = JSON.parse(list);
		}
		let currentAction = uni.getStorageSync('currentAction');
		console.log('currentAction====================',JSON.stringify(currentAction))
		if (currentAction) {
			console.log("我认为你刚挂了电话")
			this.SET_CURRENT_VIDEO_CHANNELID(null)
			uni.setStorageSync('currentAction', null);
			uni.setStorageSync("isVideoBusy", false);
		}
		uni.setNavigationBarTitle({
			title: '我的消息'
		});
	},
	onNavigationBarButtonTap(e) {
		// if (e.index === 0) {
		// 	this.show();
		// } else {
		// 	this.hide();
		// }
		this.addGroup()
	},
	computed: { //同步了store中state内的sendMessage值
		...mapState({
			userInfo: state => state.home.userInfo,
			sessionList: state => state.session.sessionList,
			xmppLoginInfo: state => state.home.xmppLoginInfo,
			groupList: state => state.group.groupList,
			sendMessage: state => state.socketStore.sendChannelMessage,
			isPlayAudio: state => state.message.isPlayAudio,
			isNewVideoMessage: state => state.message.isNewVideoMessage,
			closeVideoMessageList: state => state.message.closeVideoMessageList,
			systemNotice: state => state.home.systemNotice,
			remoteUseArea: state => state.message.remoteUseArea, // 服务端文件占用情况
			currentChannel: state => state.message.currentChannel,
			activeDissolveGroup: state => state.group.activeDissolveGroup
		})
	},
	watch: {
// 		sessionList : {
// 		 handler: function (curval, oldVal) {
// 			if(curval && curval.length > 0){
// 					curval.forEach(element => {
// 						element.createTimeStr = this.getFriendlyTime(element.createTime);
// 					})
// 				}
// 			},
// 			// deep: true
// 		},
    // 群组解散进行相应的switchtTab路由跳转（如果处于当前群组会话中或群组信息信息中）
    activeDissolveGroup: function (val, oldVal) {
			if (!val) return
			let pages = getCurrentPages()
			if (pages.length === 1) {
				this.SET_DISSOLVE_GROUP('')
				return
			}
			if (pages[pages.length - 1] && pages[pages.length - 1].route === 'pages/group/group-info' && pages[0].route === 'pages/main/mainPeople') {
				uni.showToast({
					title: '当前群聊已被解散!',
					icon: 'none',
					duration: 500
				})
				setTimeout(() => {
					uni.switchTab({
						url: '../main/mainPeople'
					})
				}, 500)
				this.SET_DISSOLVE_GROUP('')
				return
			}
		  
			let page = pages[pages.length - 2]
			if ((page && page.route === 'pages/message-list/message-list' || pages[pages.length - 3] && pages[pages.length - 3].route === 'pages/message-list/message-list') && this.currentChannel.jid === val) {
				uni.showToast({
					title: '当前群聊已被解散!',
					icon: 'none',
					duration: 500
				})
				setTimeout(() => {
					uni.switchTab({
						url: '../message-list/message-list'
					})
				}, 500)
			} else {
				uni.showToast({
					title: '当前群聊已被解散!',
					icon: 'none',
					duration: 500
				})
				setTimeout(() => {
					uni.switchTab({
						url: '../main/mainPeople'
					})
				}, 500)
			}
			this.SET_DISSOLVE_GROUP('')
		},
		closeVideoMessageList: {
			handler: function (curval, oldVal) {
				if(curval){
					this.cancelPhone(curval)
				}
			},
			deep: true
		},
		isNewVideoMessage: {
			handler: function (curval, oldVal) {
				if(curval){
					this.toPhonePage(JSON.parse(curval))
				}
			},
			deep: true
		},
		// searchKeyword(curval, oldval) {
		// 	this.searchChannel(curval);
		// },
		isPlayAudio(val){
			if (val.value) {
				this.messageTip(val)
			}
		},
		//系统公告
		systemNotice (val, oldval) {
			let localStorageNotice = uni.getStorageSync('system-notice');
			if (localStorageNotice && localStorageNotice !== 'null') {
				localStorageNotice = JSON.parse(localStorageNotice)
			  if (val.id <= localStorageNotice.id) {
					uni.setStorageSync('system-notice', JSON.stringify(localStorageNotice))
					return
			  }
			}
			uni.setStorageSync('system-notice', JSON.stringify(val))
			this.modalName = 'Modal'
			let audioData={
				type:'notice',
				value: true
			}
			this.SET_IS_PLAY_AUDIO(audioData);
      },
	},
	methods: {
		...mapMutations([
			'SET_CURRENT_CHANNEL_ID',
			'SET_CURRENT_CHANNEL',
			'FILTER_SESSION_LIST_BY_KEY',
			'SET_IS_PLAY_AUDIO',
			'CLEAR_MESSAGE_LIST',
			'SET_SYSTEM_INFO',
			'SET_ACTIVE_GROUP',
			'SET_TREEDATA',
			'SET_CURRENT_VIDEO_CHANNELID',
			'setTitleList',
			'SET_NODE_MEMBER_INFO',
			'SET_DISSOLVE_GROUP'
		]),
		...mapActions([
			'GetTreeData',
			'getAllSession',
			'conntXMPPServer',
			'LoginListener',
			'EnterGroup',
			'GroupInviteListener',
			'PutForwardGroupListener',
			'LoginAbnormalListener',
			'Logon',
			'SystemNoticeListener',
			'DestoryGroupListener',
			'changeTopStatus',
			'deleteSessionById',
			'unReadCountReset',
			'atMeStatusReset',
			'GetSystemNotice',
            'sendHeartbeat',
            'getRemoteAreaInfo'
		]),
		hideModal(){
			this.modalName = ''
		},
		toSearchMessage(){
			uni.navigateTo({
				url: './message-search'
			})
		},
		 // 获取最新系统公告
		  getSystemNotice () {
			this.GetSystemNotice()
		  },
          checkServerArea () {
            // 获取占用大小
            this.getRemoteAreaInfo(this.userInfo.account).then(() => {
				console.log(JSON.stringify(this.remoteUseArea))
			  if(!this.remoteUseArea){
				  return;
			  }
              let remoteAreaInfo = this.remoteUseArea
              let remoteMessageCount = remoteAreaInfo.storageMsgCount
              let remoteFileAreaInfo = remoteAreaInfo.storageFileUpSize
              // 每条消息大小
              let remoteMessageUnit = uni.getStorageSync('global_remote_area_unit')
              if (!remoteMessageUnit) {
                remoteMessageUnit = 10000
              }
              // 服务器文件大小
              // let remoteTotalFileArea = localStorage.getItem('global_file_remote_area')
              // if (remoteTotalFileArea) {
              //   if (remoteFileAreaInfo > remoteTotalFileArea) {
              //     this.$notify({
              //       title: '空间已满提示',
              //       message: '您在服务器端的文件空间不足，请您手动清除以往的文件记录',
              //       type: 'warning',
              //       duration: 10000
              //     })
              //   }
              // }
              // let isNoticeMessage = localStorage.getItem('global_message_remote_save')
              // if (isNoticeMessage === '0') {
              //   return
              // } else {
              // }
              // 服务器消息大小
              let remoteTotalMessageArea = uni.getStorageSync('global_message_remote_area')
              if (remoteTotalMessageArea) {
                let useMessageArea = remoteMessageCount
                if (useMessageArea && useMessageArea > (remoteTotalMessageArea * remoteMessageUnit)) {
					plus.nativeUI.toast( "您在服务器端的聊天记录空间不足，请您清除以往的聊天记录，如不清除则无法将当前的聊天记录保存在服务器端", {duration:'long'});
                }
              }
            })
          },
		// 获取系统信息
		getSystemInfo () {
			let system = uni.getSystemInfoSync()
			this.SET_SYSTEM_INFO({
				width: system.windowWidth,
				height: system.windowHeight
			})
		},
		initSessionList(){
			this.getAllSession().then(data => {
			})
		},
		// 监听用户登录
		loginListener () {
			this.LoginListener(data => {
				if (data === 'success') {
					// 默认进群操作
					this.groupList.forEach(item => {
						this.EnterGroup({
							userJid: this.userInfo.jid,
							groupJid: item.jid
						})
					})
					this.initListener()
					return
				} else {
					// uni.showToast({
					// 	title: '创建XMPP服务失败!',
					// 	icon: 'none'
					// })
				}
			})
		},
		// 初始化监听
		initListener () {
			// 监听群组邀请
			this.GroupInviteListener()
			// 群成员退出群组监听
			this.PutForwardGroupListener()
			// 被挤下线
			this.loginAbnormalListener()
			// 群组解散监听
			this.DestoryGroupListener()
		},
		// 别处登录监听(被挤掉)
		loginAbnormalListener () {
			this.LoginAbnormalListener()
				.then(() => {
					uni.showToast({
						title: '账号已在其他地方登录!',
						icon: 'none'
					})
					this.logon('abnormal')
				})
		},
		// 注销登录
		logon (type) {
			this.Logon(type)
				.then(() => {
					// this.SET_ACTIVETAB('message')
					// this.SET_CURRENT_CHANNEL_ID('')
					// this.SET_SELECTED_CHANNEL_BY_JID('')
					uni.reLaunch({
						url: '../login/login'
					})
				})
				.catch(() => {
					uni.showToast({
						title: '系统错误!',
						icon: 'none'
					})
					uni.reLaunch({
						url: '../login/login'
					})
				})
		},
		getTreeDataInfo(){
			let groupCode = this.userInfo.groupCode;
			this.GetTreeData(groupCode)
		},
		top(item, itemIndex) {
			this.changeTopStatus(item)
			this.recover(itemIndex)
		},
		delect(item) {
			this.deleteSessionById(item.id);
			this.curIndex = null;
		},
		// 滑动开始
		touchStart(e) {
			// 获取移动距离，可以通过打印出e，然后分析e的值得出
			this.startX = e.mp.changedTouches[0].clientX;
		},
		// 滑动结束
		touchEnd(e, index) {
			// 获取移动距离
			this.endX = e.mp.changedTouches[0].clientX;
			if (this.startX - this.endX > 40) {
				for (let i = 0; i < this.sessionList.length; i++) {
					this.sessionList[i].type = 0
				}
				this.sessionList[index].type = 1
				this.curIndex = index;
			} else if (this.startX - this.endX < -40) {
				for (let i = 0; i < this.sessionList.length; i++) {
					this.sessionList[i].type = 0
				}
				this.curIndex = null;
			}

		},
		// 点击回复原状
		recover(index) {
			if(this.sessionList[index]){
				this.sessionList[index].type = 0
			}
			this.curIndex = null;
		},
		refreshUserInfo() {

		},
		addGroup() {
			uni.navigateTo({
				url: '../group/addGroupPerson?type=createGroup'
			});
		},
		addFriend() {
			uni.switchTab({
				url: '../organize/index'
			});
		},
		show() {
			console.log("显示菜单")
			this.showMask = true
			this.showAddMenu = true
		},
		hide() {
			console.log("隐藏菜单")
			this.showMask = false;
			this.showAddMenu = false;
		},
		removeMessage(item) {

		},
		sendSocketMessage(msg) {
			console.log(JSON.stringify(msg) + this.socketOpen)
			if (this.socketOpen) {
				uni.sendSocketMessage({
					data: JSON.stringify(msg),
				});
			} else {
				if (this.socketMsgQueue.length >= 100) {
					uni.showModal({
						title: "温馨提示",
						content: "发送失败，请稍候重试",
						showCancel: false,
						confirmText: "确定"
					})
					return;
				}
				this.socketMsgQueue.push(msg);
			}
		},
		getAvatarUrl(message) {},
		goDetail(e) {
			if (this.curIndex != null && this.curIndex >= 0) {
				this.recover(this.curIndex);
				return;
			}
			this.SET_CURRENT_CHANNEL_ID(e.channelId);
			this.SET_CURRENT_CHANNEL(e);
			if(e.channelType === 'G'){
				if(this.groupList && this.groupList.length > 0){
					let group = this.groupList.find(item => {
						return item.jid === e.channelId
					})
					if(group){
						this.SET_ACTIVE_GROUP(group)
					}else{
						// TODO 群组不存在不可以跳转
					}
				}
			}
			uni.navigateTo({
				url: "../im-chat/im-chat?channelId=" + e.channelId + "&name=" + e.name +
					"&channelType=" + e.channelType,
                animationType: 'slide-in-right',
                animationDuration: 200
			})
			// console.log("goDetail"+JSON.stringify(e))
		},
		getList() {
			console.log("获取消息列表");

		},
		// searchChannel(key) {
		// 	if (!key.trim()) {
		// 		this.initSessionList()
		// 		return;
		// 	}
		// 	this.getAllSession().then(data => {
		// 		setTimeout(() => {
		// 			this.FILTER_SESSION_LIST_BY_KEY(key)
		// 		},200)
		// 	})
		// },
		//考虑到群组可能较多，一次性加载占用资源较大，所以在每个用户登录后，将其加载的群组注册到服务中
		bindJoinGroup(groupIds) {

		},
		//接收websocket消息
		receiveNewMessage(data) {

		},
		cancelPhone(data) {
			let busiType = uni.getStorageSync("videoBusyType");
			if (busiType === '2') { //关闭原生
				if (data.action == 'MEMBER_QUIT_MEIDA_MEET') {
					switch (plus.os.name) {
						case "Android":
							// Android平台: plus.android.*
							// if (data.channelType == 'G') {
								// plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'closeGroupVideoPanel', null);
							// } else {
								plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'closeVoicePanel');
							// }
							break;
						case "iOS":
							// iOS平台: plus.ios.*
							// if (data.channelType == 'G') {
								// plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'closeGroupVideoPanel', null);
							// } else {
								var pageHelper = plus.ios.newObject("PageHelper");
								plus.ios.invoke(pageHelper, "closeVoiceMessage");
							// }
							break;
						default:
							// 其它平台,不存在其他平台
							break;
					}
				} else {
					switch (plus.os.name) {
						case "Android":
							// Android平台: plus.android.*
							if (data.channelType == 'G') {
								// plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'closeGroupVideoPanel', null);
							} else {
								plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'closeVideoPanel');
							}
							break;
						case "iOS":
							// iOS平台: plus.ios.*
							if (data.channelType == 'G') {
								// plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'closeGroupVideoPanel', null);
							} else {
								var pageHelper = plus.ios.newObject("PageHelper");
								plus.ios.invoke(pageHelper, "closeVideoMessage");
							}
							break;
						default:
							// 其它平台,不存在其他平台
							break;
					}
				}
			}
		},
		toPhonePage(data) {
            console.log(JSON.stringify(data))
			let isBusy = uni.getStorageSync("isVideoBusy");
			if (isBusy) {
				console.log("正在通话中。。。")
				return;
			}
			uni.setStorageSync("isVideoBusy", true);
			uni.setStorageSync("videoBusyType", '1'); //type 1:网页  2：原生
			console.log(data.channelId)
			this.SET_CURRENT_VIDEO_CHANNELID(data.channelId)
			//跳转个人信息
			uni.navigateTo({
				url: "../im-chat/voice-wating?channelId=" + data.channelId + "&channelName=" +
					data.channelName + "&channelType=" + data.channelType + "&action=" + data.type
					+ "&senderName=" + data.senderName + "&senderId=" + data.senderId + "&roomName=" + data.roomName
			})
		},
		isImage(fileExtension) {
			let extension = fileExtension.toLowerCase()
			return extension === 'png' || extension === 'jpeg' || extension === 'jpg' || extension === 'gif'
		},
		messageTip(item) {
			// let viedoData = uni.getStorageSync('video')
			// console.log('视频播放================'+JSON.stringify(viedoData))

			let voice = uni.getStorageSync('voiceSwitch');
			let shake = uni.getStorageSync('shakeSwitch');
			console.log('voice==========='+voice)
			if (!voice || voice === 'yes') {
				const bgAudioMannager = uni.getBackgroundAudioManager();
				this.messageVoice(item,bgAudioMannager);
				uni.setStorageSync('voiceSwitch','yes')
			}
			if (!shake || shake === 'yes') {

				this.messageShake();
				uni.setStorageSync('shakeSwitch','yes')
			}
			//800毫秒声音播放和震动时间
			// setTimeout(() => {
			// 	let data = {
			// 		type: type,
			// 		value: false
			// 	}
			// 	this.SET_IS_PLAY_AUDIO(data)
			// },800)
		},
		messageShake() {
			//新消息震动
			uni.vibrateLong({
				success: function() {
					// console.log('success');
				}
			});
		},
		messageVoice(item,bgAudioMannager) {
			// console.log('播放类型-------------'+item.type)
			console.log('播放声音进来了'+JSON.stringify(item))
			bgAudioMannager.title = '致爱丽丝';
			bgAudioMannager.singer = '暂无';
			let voiceNumber;
			if(item.type == 'notice'){
				voiceNumber = uni.getStorageSync('noticeVoiceNumber');
			}else if(item.type == 'message'){
				voiceNumber = uni.getStorageSync('voiceNumber');
			}else if(item.type == 'video'){
				voiceNumber = 3
			}

			if (item.type != 'video'&&voiceNumber==undefined||voiceNumber == ""||voiceNumber == 1) {
				bgAudioMannager.src = '../../static/audio/msg1.mp3';
				console.log("播放声音1")
			} else if(voiceNumber == 2) {
				bgAudioMannager.src = '../../static/audio/msg2.mp3';
				// console.log("播放声音2")
			} else if(voiceNumber == 3){
				// console.log("播放声音3")
				// let videoCheck = uni.getStorageSync('video');
				console.log('videoCheck========='+JSON.stringify(item))
				if(item.value=='true'){
					bgAudioMannager.src = '../../static/audio/msg3.mp3';
					console.log('videoCheck.value========='+JSON.stringify(item.value))
					// bgAudioMannager.play();
					// console.log('开始播放')
					let that = this;
					// that.messageVoice(that.isPlayAudio,bgAudioMannager)
					bgAudioMannager.onEnded(function(){
						console.log('播放结束开始重复播放')
						that.messageVoice(that.isPlayAudio,bgAudioMannager)
					})
				}else{
					// console.log('结束播放')

					bgAudioMannager.stop()
					bgAudioMannager.onEnded(function(){
						bgAudioMannager.src=""
					})
					return;
				}
			}
		},
		// repeatPlayVoice(bgAudioMannager){
		// 	bgAudioMannager.play();
		// 	let that=this;
		// 	bgAudioMannager.onEnded(function(){
		// 		console.log('重新播放')
		// 		// bgAudioMannager.play();
		// 		that.repeatPlayVoice(bgAudioMannager)
		// 	})
		// },

		addMessageChannel(data) {
			//如果搜索框里有值，则不进行补充，否则进行补充列表
			if (this.searchKeyword.trim()) {
				return;
			}
			let index = this.channelIds.findIndex(item => item == data.channelId)
			if (index <= -1) {
				this.channelIds.push(data.channelId);
			} else {
				return;
			}
			this.getChannelInfoById(data);
		},
		getChannelInfoById(item) {

		},
		//此方法，如果好友列表为空，则请求一次，用来判断是否已经是好友使用
		getFriendList() {
			var token = uni.getStorageSync('token');
			uni.request({
				url: this.$store.state.globalConfig.hostUrl + '/immc/rest/friends/' + this.currentUser.userId + '/list',
				dataType: "json",
				header: {
					"content-type": "application/x-www-form-urlencoded",
					"X-Token": token,
				},
				success: (data) => {
					if (data.data && data.data.length > 0) {
						this.$store.commit('setFriendList', data.data);
					}
				},
				fail: (data, code) => {
					console.log('fail' + JSON.stringify(data) + 'code=' + code);
				},
			})
		},
	},
}
</script>

<style lang="scss">
body{
	background: #ffffff;
}
.page {
	// background: #efeff4;
	background: #ffffff;
	width: 100%;
}

.mask1 {
	position: fixed;
	z-index: 998;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.3);
}

.popup {
	position: absolute;
	z-index: 999;
	background-color: #ffffff;
	-webkit-box-shadow: 0 0 30upx rgba(0, 0, 0, 0.1);
	box-shadow: 0 0 30upx rgba(0, 0, 0, 0.1);
	border-radius: 8upx;
	/*.dropdown-menu-list-item {*/
		/*display: flex;*/
		/*align-items: center;*/
		/*text-align: center;*/
	/*}*/
}

.popup::before {
	content: '';
	width: 20upx;
	height: 20upx;
	background-color: inherit;
	top: -4upx;
	/*向左侧外部延伸箭头box的一半宽度*/
	position: absolute;
	transform: rotate(45deg);
	/*旋转45度*/
	right: 20upx;
	/*箭头在数值方向上居中*/
	margin-top: -5upx;
	border-top: solid 1px rgba(0, 0, 0, 0.1);
	border-left: solid 1px rgba(0, 0, 0, 0.1);
}

.popup-top {
	top: 20upx;
	right: 10upx;
	width: 300upx;
	height: 200upx;
	text-align: center;
}

.popup-top text {
	line-height: 100upx;
	margin-left: 20upx;
	font-size: 32upx;
	color: #303133;
}

.title {
	padding: 20upx;
}

.uni-ellipsis {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
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
	padding: 0 12upx;
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
	padding-top: 85upx;
}

.message-create-at {
	display: inline-block;
	position: absolute;
	top: -30upx;
	right: 25upx;
	font-size: 23upx;
	color: #909399;
}

.message-tip {
	position: absolute;
	top: -40upx;
	left: 90upx;
}

.top {
	width: 15%;
	height: 150rpx;
	background-color: #c4c7cd;
	color: #fff;
	font-size: 34rpx;
	text-align: center;
}

.delect {
	width: 15%;
	height: 150rpx;
	background-color: #ff3b32;
	color: #fff;
	font-size: 34rpx;
	text-align: center;
}

.my-uni-li-hide {
	transform: translate3d(0, 0, 0);
}

.my-uni-li-show {
	transform: translate3d(-30%, 0, 0);
}

.infoAll {
	width: 100%;
}

.infoAll .my-uni-ul {
	width: 100%;
	overflow: hidden;
}

.infoAll .my-uni-li {
	transition: all 0.2s;
	width: 100%;
	height: 120upx;
	line-height: 120upx;
	// border-bottom: 1px solid #e0eef1;
	display: flex;
	align-items: center;
}

.infoAll .my-uni-ul .my-uni-li .delect {
	width: 15%;
	height: 120upx;
	background-color: #ff3b32;
	color: #ffffff;
	font-size: 34upx;
	text-align: center;
	position: absolute;
	top: 0;
	right: -30%;
}

.infoAll .my-uni-ul .my-uni-li .top {
	width: 15%;
	height: 120upx;
	background-color: #c4c7cd;
	color: #fff;
	font-size: 34upx;
	text-align: center;
	position: absolute;
	top: 0;
	right: -15%;
}
</style>
