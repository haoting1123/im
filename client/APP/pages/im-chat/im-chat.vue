<template>
	<view class="uni-column">
		<view class="content" id="content" :style="{ height: style.contentViewHeight + 'px' }">
			<scroll-view
				id="scrollview"
				scroll-y="true"
				:style="{ height: style.contentViewHeight + 'px' }"
				:scroll-with-animation="isAnimation"
				:scroll-top="scrollTop"
				@tap="hideFootPanel"
			>
				<view class="no-read-message-tip" v-if="isHaveNoReadMessage" @tap="scrollToFirstNoReadMessage">查看更多未读</view>
				<view class="load-more" v-if="hasMore" @tap="initFirstMessage(true)">点击加载更多</view>
				<message-show
					v-for="(message, index) in messageList"
					:key="message.id"
					:message="message"
					:currentChannel="currentChannel"
					@remove-message="delMessage"
					@recall-message="recallMessage"
				></message-show>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<view class="foot" :class="{ showPanel: !showFootPanel }">
			<chat-input
				@send-message="getInputMessage"
				:textValue="textValue"
				:channelId="channelId"
				:channelType="channelType"
				@send-voice-message="addVoiceMessage"
				@showHideFootPanel="isFootPanel"
				@hideFootPanel="hideFootPanel"
				@focus="inputGetFocus"
			></chat-input>
		</view>
		<view class="foot-panel" v-if="showFootPanel">
			<view v-show="!showEmoji">
				<view class="uni-flex uni-row">
					<view class="flex-item" @tap="sendEmoji">
						<view class="footer-sub-panel"><image class="footer-image" src="../../static/img/face-icon.png"></image></view>
						<view class="footer-sub-panel1">表情</view>
					</view>
					<view class="flex-item" @tap="chooseImage">
						<view class="footer-sub-panel"><image class="footer-image" src="../../static/img/image-icon.png"></image></view>
						<view class="footer-sub-panel1">图片</view>
					</view>
					<view class="flex-item" @tap="chooseFile">
						<view class="footer-sub-panel"><image class="footer-image" src="../../static/img/file-icon.png"></image></view>
						<view class="footer-sub-panel1">文件</view>
					</view>
					<view class="flex-item" @tap="goHistoryMessage">
						<view class="footer-sub-panel"><image class="footer-image" src="../../static/img/history-record-icon.png"></image></view>
						<view class="footer-sub-panel1">聊天详情</view>
					</view>
				</view>
				<view class="uni-flex uni-row">
					<!-- <view class="flex-item" @tap="voiceMessage">
						<view class="footer-sub-panel"><image class="footer-image" src="../../static/img/voice-phone-icon.png"></image></view>
						<view class="footer-sub-panel1">语音通话</view>
					</view>
					<view class="flex-item" @tap="videoMessage">
						<view class="footer-sub-panel"><image class="footer-image" src="../../static/img/video-icon.png"></image></view>
						<view class="footer-sub-panel1">视频通话</view>
					</view> -->
					<view class="flex-item" @tap="sendVisitingCard">
						<view class="footer-sub-panel"><image class="footer-image" src="../../static/img/visiting-card-icon.png"></image></view>
						<view class="footer-sub-panel1">个人名片</view>
					</view>
					<view class="flex-item" @tap="sendPosition">
						<view class="footer-sub-panel"><image class="footer-image" src="../../static/img/position-icon.png"></image></view>
						<view class="footer-sub-panel1">个人位置</view>
					</view>
					<!-- <view class="flex-item">&nbsp;</view> -->
					<!-- <view class="flex-item">&nbsp;</view> -->
				</view>
			</view>
			<view class="foot-panel" v-if="showEmoji"><emoji></emoji></view>
		</view>
		<!--群公告弹窗 start-->
		<view class="cu-modal" :class="showGroupNoticeModalFlag?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view style="text-align: left; align-items: left; display: flex; padding-left: 30upx;">群公告</view>
					<view class="action justify-end" @tap="hideGroupNoticeModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					{{ activeGroupNotice.content }}
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						{{activeGroupNotice.createTime}}
					</view>
				</view>
			</view>
		</view>
		<!--群公告弹窗 end-->
	</view>
</template>

<script>
import chatInput from '../../components/im-chat/chatinput.vue';
import messageShow from '../../components/im-chat/messageshow.vue';
import emoji from '../../components/im-chat/emoji.vue';
import app from '../../common/common.js';
import { mapState, mapActions, mapMutations } from 'vuex';
var moment = require('../../common/moment.js');
const xss = require('xss')

export default {
    data() {
        return {
            name: '',
            style: {
                pageHeight: 0,
                contentViewHeight: 0,
                footViewHeight: 90,
                mitemHeight: 0
            },
            textValue: '',
            scrollTop: 0,
            messages: [],
            maxCreateAt: 0,
            channelId: null,
            channelName: null,
            currentUser: null,
            channelType: null,
            toUserId: null,
            hasMore: false,
            creatorId: null,
            toUserOnlineStatus: 'offline',
            showFootPanel: false,
            isAnimation: false,
            messageInfo: '',
            showEmoji: false,
			chatType: '',
			isHaveNoReadMessage: false,
			localNoReadMessageNum: 0,
			// 群公告弹窗
			showGroupNoticeModalFlag: false,
			// 群公告内容
			activeGroupNotice: {},
			isScrollBottom: true
        };
    },
    components: {
        chatInput,
        messageShow,
        emoji
    },
	onBackPress(options) {
		//删除密聊消息
		// console.log('删除密聊消息============'+JSON.stringify(this.channelId))
		// console.log('删除密聊消息options============'+JSON.stringify(options))
		// this.deleteMessageByChatType(this.channelId);
		// this.SET_MESSAGE_CHAT_TYPE('normalChat');
    },
    onNavigationBarButtonTap(e) {
        if (e.index === 0) {
            if (this.channelType === 'G') {
            	  this.groupList.forEach(item => {
            	  	if (item.jid === this.channelId) {
            	  		this.SET_ACTIVE_GROUP({
											...item,
											isTip: this.currentChannel.isTip
										})
									}
								})
                //跳转群组信息
                uni.navigateTo({
                    url: '../group/group-info?channelId=' + this.channelId + '&userId=' + this.creatorId + '&type=channel'
                })
            } else {
            	console.log(`this.currentChannel:${JSON.stringify(this.currentChannel)}`)
				// this.deleteMessageByChatType(this.channelId);//删除密聊消息
				// this.SET_MESSAGE_CHAT_TYPE('normalChat');
				  this.SET_ACTIVE_MEMBER({
									...this.currentChannel,
									account: this.currentChannel.jid.split('@')[0]
            	  })
                //跳转个人信息
                uni.navigateTo({
                    url: '../friends/friend-info?type=channel'
                })
			}
        }
    },
    onShow() {
		this.setBarColor();//修改背景颜色
    	// console.log(`测试:${JSON.stringify(this.currentChannel)}`)
			// TODO:设置标题，避免更新名称后标题不刷新问题
			uni.setNavigationBarTitle({
				title: (this.currentChannel ? (this.currentChannel.alias ? this.currentChannel.alias : this.currentChannel.name)  : '')
			});
        let currentAction = uni.getStorageSync('currentAction');
		let videoReceiveType = uni.getStorageSync("videoReceiveType"); 
        if (currentAction && !videoReceiveType) {
            console.log('我认为你刚挂了电话');
			uni.setStorageSync('currentAction', null);
			let obj = {
				channelId: this.channelId,
                channelType: this.channelType,
				createTime: new Date().getTime()
			}
            let messageData = {
              to: this.channelId
            }
            if (this.channelType == 'G') {
                //群组不发
            } else {
                if (currentAction == 'AUDIO_CONNECT') {
                    messageData.type = 'MEMBER_QUIT_MEIDA_MEET';
					obj.content = '语音通话已挂断'
                } else if (currentAction == 'VIDEO_CONNECT') {
                    messageData.type = 'MEMBER_QUIT_MEIDA_MEET';
					obj.content = '视频通话已挂断'
                }
				messageData.content = JSON.stringify(obj)
				this.sendOtherMessage(messageData)
            }
            
        }
		if(videoReceiveType){
			uni.setStorageSync("videoReceiveType", null); 
		}
		uni.setStorageSync("isVideoBusy", false);
// 		setTimeout(() => {
// 		    this.scrollToBottom();
// 		}, 100);

    },
    onLoad: function(option) {
		this.creatorId = option.creatorId;
        this.channelId = option.channelId;
        // console.log("channelId::" + this.channelId)
        this.channelType = option.channelType;
        this.toUserId = option.toUserId;
		this.chatType = option.chatType;
		let searchTime = option.searchTime;
		console.log('searchTime:'+searchTime)
		this.setBarColor();//根据聊天类型，动态修改Bar背景颜色
        this.toUserOnlineStatus = option.toUserOnlineStatus;
        let lineText = ' (离线)';
        if (this.toUserOnlineStatus == 'online') {
            lineText = ' (在线)';
        }
        if (this.channelType == 'G') {
            lineText = '';
            // console.log('群组会话开始啦~~~')
					  this.getGroupNotice(this.channelId)
        }
        const res = uni.getSystemInfoSync();
        this.style.pageHeight = res.windowHeight;
        this.style.contentViewHeight = (res.windowHeight- (uni.getSystemInfoSync().screenWidth / 750) * 100); //像素
        //查询当前登录用户
        this.currentUser = uni.getStorageSync('currentUser');
		this.localNoReadMessageNum = this.currentChannel.unreadMessageCount
		this.channelName = this.currentChannel.name;
        this.initFirstMessage().then(() => {
			console.log('第一次打开页面初始化')
					if (this.currentChannel.channelType === 'P') this.messageReceipt()
			this.goToTargetMessage()
		});
		this.readAllMessageTip(this.currentChannel);
    },
    onUnload() {
		this.isHaveNoReadMessage = false
		this.maxCreateAt = 0;
        this.SET_CURRENT_CHANNEL_ID(null);
		this.CLEAR_MESSAGE_LIST()
		// 删除密聊消息
		this.deleteMessageByChatType(this.channelId);
		this.SET_MESSAGE_CHAT_TYPE('normalChat');
        // uni.setStorageSync('videoBusyType', null);
    },
    computed: {
        ...mapState({
			groupList: state => state.group.groupList,
            userInfo: state => state.home.userInfo,
            messageList: state => state.message.messageList,
			currentChannel: state => state.message.currentChannel,
			currentChannelId: state => state.message.currentChannelId,
            currentChannelMessage: state => state.socketStore.currentChannelMessage,
			hostUrl: state => state.globalConfig.hostUrl,
			isNewMessage: state => state.message.isNewMessage,
			systemInfo: state => state.home.systemInfo,
			messageChatType: state => state.message.messageChatType,
			recallMessageMember: state => state.message.recallMessageMember,
			recallMessageType: state => state.message.recallMessageType,
			recallMessageSignid: state => state.message.recallMessageSignid,
			recallMessageGroup: state => state.message.recallMessageGroup,
			groupNotice: state => state.group.groupNotice,
            currentVideoChannelId: state => state.message.currentVideoChannelId,
        })
    },
    watch: {
// 		messageList : {
// 		 handler: function (curval, oldVal) {
// // 			if(this.debug){
// // 				 console.log(JSON.stringify(curval))
// // 			}
// 			},
// 		}
		groupList: {
			handler: function(val, oldval) {
				if (this.currentChannel.channelType === 'G') {
					val.forEach(item => {
						if (item.jid === this.currentChannel.jid) {
							var pages = getCurrentPages(); //当前页
							if (pages[pages.length - 1].route === 'pages/im-chat/im-chat') {
								console.log('yes')
								uni.setNavigationBarTitle({
									title: item.name
								});		
							}	
						}
					})
				}
			},
			deep: true
		},
		messageChatType(curval, oldVal){
			this.setBarColor();
		},
			groupNotice: {
				handler: function(val, oldval) {
					if (this.currentChannel.jid !== val.roomJid) return
					let id = uni.getStorageSync(this.currentChannel.jid)
					if (val.id <= id) return
					console.log(`监听显示消息变化` + JSON.stringify(val))
					this.showGroupNoticeModalFlag = true,
					this.activeGroupNotice = {
						title: val.title,
						content: val.content,
						createTime: moment(val.createTime).format('YYYY-MM-DD HH:mm:ss')
					}
					uni.setStorageSync(this.currentChannel.jid, val.id)
				},
				deep: true
			},
		recallMessageMember: {
			handler: function(val, oldval) {
				console.log(`撤回信息啦++++++++:${val.channelId}`)
				if (!val.channelId) return
				// console.log(`this.currentChannel:${JSON.stringify(this.currentChannel)}`)
				if (this.currentChannel.channelType === 'P' && this.recallMessageType === 'P' && val.channelId === this.currentChannel.channelId) {
					this.DELETE_MESSAGE_BY_SIGNID(this.recallMessageSignid)
					uni.showToast({
						title: `${this.currentChannel.name}撤回了一条消息!`,
						icon: 'none',
						position: 'top'
					})
				} else if (this.currentChannel.channelType === 'G' && this.recallMessageType === 'G' && this.recallMessageGroup === this.currentChannel.channelId) {
					this.DELETE_MESSAGE_BY_SIGNID(this.recallMessageSignid)
					let memberName = ''
					this.groupList.forEach(item => {
						if (item.jid === this.recallMessageGroup) {
							item.members.forEach(member => {
								if (member.jid === val.channelId) {
									memberName = member.nickName
								}
							})
						}
					})
					uni.showToast({
						title: `${memberName}撤回了一条消息!`,
						icon: 'none',
						position: 'top'
					})
				}
				this.SET_RECALL_MESSAGE_INFO({
					jid: '',
					type: 'P',
					signid: ''
				})
			},
			deep: true
		},
		isNewMessage(curval){
			let that = this
			setTimeout(function (){
				console.log('to bottom 3')
				that.scrollToBottom();
			},300)
		},
        currentChannelMessage(curval, oldval) {
            //监听了computed中getNewMessage的值，如果发生改变就触发console.log
            if (curval) {
                if(this.debug){
					console.log("来消息了："+JSON.stringify(curval))
				}
                if (curval.action === 'file') {
                    this.sendFileMessage(curval)
                }
				 // else if (curval.action == 'AUDIO_CONNECT' || curval.action == 'VIDEO_CONNECT') {
     //                //接受语音消息
     //                if (curval.senderId !== this.userInfo.id) {
     //                    this.toPhonePage(curval);
     //                }
     //            }
				else if(curval.action == 'emoji' ){
                    this.getInputMessage(curval)
                }else if(curval.action == 'vcard' ){
					let tempUserInfo = {
						username: curval.username,
						name: curval.name,
						groupName: curval.groupName,
						sex: curval.sex,
						photo: curval.photo
					}
					let obj = {
						content: JSON.stringify(tempUserInfo)
					}
                    this.getInputMessage(obj,'','vcard')
                }
            }

        }
    },
    methods: {
        ...mapMutations(['SET_CURRENT_CHANNEL_ID','CLEAR_MESSAGE_LIST', 'SET_ACTIVE_MEMBER', 'SET_ACTIVE_GROUP', 'SET_RECALL_MESSAGE_INFO', 'DELETE_MESSAGE_BY_SIGNID','SET_CURRENT_VIDEO_CHANNELID','SET_MESSAGE_CHAT_TYPE']),
        ...mapActions(['getAllMessage','saveMessage','removeMessageByDb','unReadCountReset','atMeStatusReset','sendOtherMessage','sendGroupOtherMessage','deleteMessageByChatType', 'GetGroupNotice']),
			// 消息回执
			messageReceipt () {
        let obj = {
        	channelId: this.userInfo.jid,
					senderId: this.currentChannelId,
					// signId:
					readTime: Date.now()
				}
				this.sendOtherMessage({
					to: this.channelId,
					content: JSON.stringify(obj),
					type: 'MESSAGE_RECEIPT'
				})
			},
			// 获取群组公告
			getGroupNotice (groupJid) {
				this.GetGroupNotice(groupJid)
					.then(data => {
						// console.log(`群公告数据:${JSON.stringify(data)}`)
						if(data && data.length > 0){
							let noticeData = data[0]
							let id = uni.getStorageSync(this.currentChannel.jid)
							console.log(`群公告数据:${id}`)
							if ((!id || id < noticeData.id) && noticeData.roomJid === this.currentChannel.jid) {
								this.showGroupNoticeModalFlag = true,
								this.activeGroupNotice = {
									title: noticeData.title,
									content: noticeData.content,
									createTime: noticeData.createTime
								}
								uni.setStorageSync(this.currentChannel.jid, noticeData.id)
							}
						}
					})
			},
			// 隐藏群公告弹窗
			hideGroupNoticeModal () {
        	this.showGroupNoticeModalFlag = false
			},
		goToTargetMessage(){
			let isAtMe = uni.getStorageSync('mes_at_' + this.currentChannel.channelId)
			if(isAtMe && isAtMe === 'yes'){
			  let atMeTime = uni.getStorageSync('mes_atTime_' + this.currentChannel.channelId)
			  console.log('有人@我了' + atMeTime)
			  if(atMeTime && atMeTime > 0){
				  this.isScrollBottom = false
				if(this.maxCreateAt < atMeTime){
				  // 跳转到指定消息
				  let that = this
				  setTimeout(function (){
				  	that.scrollToTargetMessage(atMeTime)
				  },300)
				}else{
				  this.getMoreNoReadMessageList(atMeTime)
				}
			  }
			  uni.setStorageSync('mes_at_' + this.currentChannel.channelId,null)
			}
			if(this.localNoReadMessageNum > 10){
				this.isHaveNoReadMessage = true
			}else{
				this.isHaveNoReadMessage = false
			}
		},
		// 用来查询未读消息和@我的消息列表用
		getMoreNoReadMessageList(beginTime) {
		  const limit = 1000; // 默认1000，修改此处无用，需要修改数据库
		  this.getAllMessage({
			channelId: this.channelId,
			maxCreateAt: this.maxCreateAt,
			maxStartAt: beginTime,
			limit: limit
		  })
			.then(response => {
			  // console.log(JSON.stringify(response))
			  if (response) {
				if (response.length > 0) {
				  this.maxCreateAt = this.messageList[0].createTime;
				}
				let that = this
				//滚动到@我的位置
				setTimeout(function (){
					that.scrollToTargetMessage(beginTime)
				},200)
			  }
			})
			.catch(error => {
			});
		},
		 // 滚动到第一条未读消息
		scrollToFirstNoReadMessage(){
		  this.isHaveNoReadMessage = false
		  this.localNoReadMessageNum = 0
		  // 查询所有未读消息
		  let atTime = uni.getStorageSync('mes_noReadAt_' + this.currentChannel.channelId)
		  if(atTime && atTime > 0){
			  this.getMoreNoReadMessageList(atTime)
		  }
		  uni.setStorageSync('mes_noReadAt_' + this.currentChannel.channelId,null)
		},
		//点击某个聊天记录后，未读气泡消失
		readAllMessageTip(userChannel) {
			// console.log('userChannel::'+JSON.stringify(userChannel))
			if(userChannel.unreadMessageCount > 0){
				this.unReadCountReset(userChannel.id)
			}
			if(userChannel && userChannel.isAtMe === 'yes'){
				this.atMeStatusReset(userChannel.id) // @状态去除
			}
		},
        toPhonePage(data) {
            // let isBusy = uni.getStorageSync('isVideoBusy');
            // if (isBusy) {
            //     console.log('正在通话中。。。');
            //     return;
            // }
            // uni.setStorageSync('isVideoBusy', true);
            // //跳转个人信息
            // uni.navigateTo({
            //     url:
            //         './voice-wating?userId=' +
            //         data.senderId +
            //         '&channelId=' +
            //         data.channelId +
            //         '&channelName=' +
            //         data.channelName +
            //         '&channelType=' +
            //         data.channelType +
            //         '&action=' +
            //         data.action
            // });
        },
        voiceMessage() {
            let roomName = `room${Date.now()}${parseInt((Math.random() + 1) * 10000)}`
            let voiceName = this.channelName
            if(this.channelType === 'P'){
                voiceName = (this.userInfo.alias ? this.userInfo.alias : this.userInfo.name);
            }
			let obj = {
				channelId: this.channelId,
				channelName: voiceName,
				senderId: this.userInfo.jid,
				senderName: voiceName,
				channelType: this.channelType,
				roomType: this.channelType,
				roomName: roomName,
				type: 'AUDIO_CONNECT',
				mediaType: 'audio',
				createTime: new Date().getTime()
			}
			let data = {
			  to: this.channelId,
			  content: JSON.stringify(obj),
			  type: 'AUDIO_CONNECT'
			}
			if(this.channelType === 'G'){
				this.sendGroupOtherMessage(data)
			}else{
				this.sendOtherMessage(data)
			}
            uni.setStorageSync('currentAction', 'AUDIO_CONNECT');
			uni.setStorageSync('isVideoBusy', true);
            uni.setStorageSync('videoBusyType', '2');
			this.SET_CURRENT_VIDEO_CHANNELID(this.channelId)
            switch (plus.os.name) {
                case 'Android':
                    // Android平台: plus.android.*
                    this.androidVoiceMessage(roomName);
                    break;
                case 'iOS':
                    // iOS平台: plus.ios.*
                    this.iosVoiceMessage();
                    break;
                default:
                    // 其它平台,不存在其他平台
                    break;
            }
        },
        androidVoiceMessage(roomName) {
            let userId = this.userInfo.id + ''
            let channelId = this.channelId;
            //获取当前Activity
            var main = plus.android.runtimeMainActivity();
            let userName = uni.getStorageSync('currentUser');
            let tokens = uni.getStorageSync('currentUserToken');
            // 通过5 sdk 插件的invoke方法起调对象方法
            plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'showVoicePanel', main, userId, channelId, roomName, this.channelType, this.userInfo.name
            ,userName,tokens);
        },
        iosVoiceMessage() {
            let userId = this.userInfo.id + ''
            let channelId = this.channelId;
            //获取当前Activity
            var pageHelper = plus.ios.newObject('PageHelper');
            plus.ios.invoke(pageHelper, 'voiceMessage:andChannelId:andUserId:', this.channelName, channelId, userId);
        },
        videoMessage() {
            let roomName = `room${Date.now()}${parseInt((Math.random() + 1) * 10000)}`
			let obj = {
				channelId: this.channelId,
				channelName: this.channelName,
				senderId: this.userInfo.jid,
				senderName:  (this.userInfo.alias ? this.userInfo.alias : this.userInfo.name),
				channelType: this.channelType,
				roomType: this.channelType,
				roomName: roomName,
				type: 'VIDEO_CONNECT',
				mediaType: 'video',
				createTime: new Date().getTime()
			}
			let data = {
			  to: this.channelId,
			  content: JSON.stringify(obj),
			  type: 'VIDEO_CONNECT'
			}
			if(this.channelType === 'G'){
				this.sendGroupOtherMessage(data)
			}else{
				this.sendOtherMessage(data)
			}
			uni.setStorageSync('isVideoBusy', true);
            uni.setStorageSync('videoBusyType', '2');
            uni.setStorageSync('currentAction', 'VIDEO_CONNECT');
			this.SET_CURRENT_VIDEO_CHANNELID(this.channelId)
            switch (plus.os.name) {
                case 'Android':
                    // Android平台: plus.android.*
                    if (this.channelType == 'G') {
                        this.androidGroupVideoMessage(roomName);
                    } else {
                        this.androidVideoMessage(roomName);
                    }
                    break;
                case 'iOS':
                    // iOS平台: plus.ios.*
                    if (this.channelType == 'G') {
                        this.iosGroupVideoMessage();
                    } else {
                        this.iosVideoMessage();
                    }
                    break;
                default:
                    // 其它平台,不存在其他平台
                    break;
            }
        },
        androidVideoMessage(roomName) {
            let userId = this.userInfo.id + ''
            let channelId = this.channelId;
            //获取当前Activity
            var main = plus.android.runtimeMainActivity();
            let userName = uni.getStorageSync('currentUser');
            let tokens = uni.getStorageSync('currentUserToken');
            // 通过5 sdk 插件的invoke方法起调对象方法
            plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'showVideoPanel', main, userId, channelId, roomName, this.channelType, this.channelName
            ,userName,tokens);
        },
        iosVideoMessage() {
            let userId = this.userInfo.id + ''
            let channelId = this.channelId;
            // 通过5 sdk 插件的invoke方法起调对象方法
            var pageHelper = plus.ios.newObject('PageHelper');
            plus.ios.invoke(pageHelper, 'videoMessage:andChannelId:andUserId:', this.channelName, channelId, userId);
        },
        androidGroupVideoMessage(roomName) {
            //群组聊天
            let userId = this.userInfo.id + ''
            let channelId = this.channelId;
            //获取当前Activity
            var main = plus.android.runtimeMainActivity();
            let userName = uni.getStorageSync('currentUser');
            let tokens = uni.getStorageSync('currentUserToken');
            // 通过5 sdk 插件的invoke方法起调对象方法
            plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'showGroupVideoPanel', main, userId, channelId, roomName, this.channelType, this.channelName,
            userName,tokens);
        },
        iosGroupVideoMessage() {
            let userId = this.userInfo.id + ''
            let channelId = this.channelId;
            // 通过5 sdk 插件的invoke方法起调对象方法
            var pageHelper = plus.ios.newObject('PageHelper');
            plus.ios.invoke(pageHelper, 'groupVideoMessage:andChannelId:andUserId:andChannelTye:', this.channelName, channelId, userId, this.channelType);
        },
        sendSocketMessage(msg) {
            this.$store.commit('setSendChannelMessage', msg);
        },
        //发送名片
        sendVisitingCard() {
            uni.navigateTo({
                // url: '../friends/selectFriend?channelId=' + this.channelId + '&channelType=' + this.channelType
				url: '../friends/friend-card'
            });
        },
        //发送位置
        sendPosition() {
            uni.chooseLocation({
                success: (res) => {
                    // console.log('位置名称：' + res.name);
                    // console.log('详细地址：' + res.address);
                    // console.log('纬度：' + res.latitude);
                    // console.log('经度：' + res.longitude);
                    let data = {
                        content: JSON.stringify(res)
                    }
					this.getInputMessage(data,res,'position')
                }
            });
        },
        goHistoryMessage() {
            uni.navigateTo({
                url: '../history-message/history-message?channelId=' + this.channelId + '&channelName=' + this.channelName + '&channelType=' + this.channelType
            });
        },
        hideFootPanel() {
            if (this.showFootPanel) {
                this.showFootPanel = false;
                this.showEmoji = false;
                this.style.contentViewHeight += uni.upx2px(355);
            }
        },
        isFootPanel(value) {
            this.showFootPanel = !this.showFootPanel;
            if (this.showFootPanel) {
                this.style.contentViewHeight -= uni.upx2px(355);
				this.showEmoji = false;
            } else {
                this.style.contentViewHeight += uni.upx2px(355);
            }
        },
        initFirstMessage(isLoadMore) {
			this.isLoadMore = isLoadMore
            let limit = 10
            let data = {
                channelId: this.channelId,
                maxCreateAt: this.maxCreateAt,
                limit: limit,
            }
			return new Promise((resolve, reject) => {
				this.getAllMessage(data).then(resp => {
				    if (resp && resp.length > 0) {
				        if (resp.length == limit) {
				            this.hasMore = true;
				        } else {
				            this.hasMore = false;
				        }
				        let resultData = resp;
				        this.maxCreateAt = resultData[0].createTime;
				        if (!isLoadMore) {
				            setTimeout(() => {
								console.log('to bottom 1')
								if(this.isScrollBottom){
									this.scrollToBottom();
								}
				            }, 100);
				        }
				    } else {
				        this.hasMore = false;
				    }
					resolve()
				});
			})
        },
        bytesToSize(bytes) {
            if (bytes === 0) return '-';
            var k = 1024,
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
		//根据聊天类型修改背景颜色
		setBarColor(){
			console.log('修改背景颜色')
			let chatTypeInfo = "";
			chatTypeInfo = this.getChatType(chatTypeInfo);
			console.log('聊天类型============'+chatTypeInfo)
			if(chatTypeInfo=='normalChat'){
				console.log('normalChat设置背景颜色============'+chatTypeInfo)
				uni.setNavigationBarColor({frontColor:'#ffffff',backgroundColor:'#387FB5'});
			}else if(chatTypeInfo=='secretChat'){
				console.log('secretChat设置背景颜色============'+chatTypeInfo)
				uni.setNavigationBarColor({frontColor:'#ffffff',backgroundColor:'#217346'});
			}
		},
		getChatType(chatTypeInfo){
			console.log('进来了')
			chatTypeInfo = 'normalChat';
			if (this.chatType===""&&this.messageChatType!=""){
				chatTypeInfo = this.messageChatType;
			}else if(this.messageChatType=="secretChat"){
				chatTypeInfo = this.messageChatType;
			}else if(this.chatType == 'secretChat'){
				chatTypeInfo = this.chatType
			}
			return chatTypeInfo;
			
		},
        getInputMessage(message, file, fileType) {

			let chatTypeInfo = this.getChatType(chatTypeInfo);
            //获取子组件的输入数据
            this.messageInfo = message;
            if(!fileType){
				if (!message || !message.content) {
					return;
				}
				if(message.action !== 'emoji'){
					message.content = xss(message.content)
				}
			}
            const newMessage = {
                channelId: this.channelId,
                channelType: this.channelType,
                content: (message && message.content ? message.content.replace(new RegExp('\\n', 'gm'), '<br />') : ''),
                senderId: this.userInfo.jid,
                to:this.channelId,
                createTime: new Date().getTime(),
				chatType: chatTypeInfo
              }
			  console.log('newMessage===================='+JSON.stringify(newMessage))
			 if(fileType){
				newMessage.fileType = fileType
				if(fileType === 'img'){
				  newMessage.content = `<img src="` + file.filePath + `" height="80" type="picture" />`
				}else if (fileType === 'file') {
				  newMessage.content = JSON.stringify(file)
				}else if (fileType === 'aac') {
                    newMessage.content = JSON.stringify(file)
				}else if (fileType === 'position') {
					newMessage.content = message.content
				}else if (fileType === 'vcard') {
					newMessage.content = message.content
				}
			 }
            this.saveMessage(newMessage).then(data => {
				setTimeout(() => {
					console.log('to bottom 2')
					this.scrollToBottom();
				},200)
            })
            // 用来修补问题
            let isBusy = uni.getStorageSync("isVideoBusy");
            if(isBusy){
                 uni.setStorageSync("isVideoBusy", false);
            }
           
        },
		sendFileMessage(data){
		  // let grade = '非密'
		  let grade = ''
		  let fileName = data.fileName
		  let fileNameExtension = fileName.substring((fileName.lastIndexOf('.') + 1))
		  // fileName = fileName.substring(0,(fileName.lastIndexOf('.'))) + '【' + grade + '】.' + fileNameExtension
		  let fileObj = {
			fileExtension: fileNameExtension,
			fileSize: data.size,
			fileName: fileName,
			filePath: data.url,
			grade: grade
		  }
		  this.getInputMessage(null,fileObj,'file')
		},
		sendImageMessage(data) {
			data = JSON.parse(data)
		    if (data) {
		        let fileObj = {
					filePath: data.url
				}
				this.getInputMessage(null,fileObj,'img')
		    }
		},
        addVoiceMessage(data) {
            if (data) {
                let fileObj = {
					filePath: data.url,
                    recordTime: data.recordTime,
                    fileSize: data.size
				}
				this.getInputMessage(null,fileObj,'aac')
            }
        },
        addMesssage2List(data) {
            // if (data) {
            //     let resultData = data;
            //     resultData.user = 'customer';
            //     resultData.senderRealAvatarUrl = app.formatAvatarUrl(this.hostUrl, resultData.senderRealAvatarUrl, resultData.senderId);
            //     resultData.createAt = moment(resultData.createAt).format('HH:mm');
            //     resultData.filePath =
            //         this.hostUrl +
            //         '/messages/files?fileName=' +
            //         encodeURIComponent(resultData.fileName) +
            //         '&fullPath=' +
            //         encodeURIComponent(resultData.filePath + '/' + resultData.fileName) +
            //         '&mimetype=' +
            //         encodeURIComponent(resultData.fileMimeType);
            //     if (resultData.type) {
            //         resultData.content = JSON.parse(resultData.content);
            //     }
            //     this.messages.push(resultData);
            //     let that = this;
            //     setTimeout(function() {
            //         that.scrollToBottom();
            //     }, 200);
            // }
        },
		scrollToTargetMessage(id){
			this.$nextTick(function() {
                this.scrollTop = 0
            });
			this.isScrollBottom = true
		},
        scrollToBottom() { 
			var that = this;
            var query = uni.createSelectorQuery();
            query.selectAll('.m-item').boundingClientRect();
            query.exec(function(res) {
                that.style.mitemHeight = 0;
                res[0].forEach(function(rect) {
                    that.style.mitemHeight = that.style.mitemHeight + rect.height + 20;
                });
                if (that.style.mitemHeight > that.style.contentViewHeight) {
                    that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight + 460;
                }
            });
        },
        getToUserId() {
            if (this.channelType === 'G') {
                return null;
            }
            return this.toUserId;
        },
        delMessage(item) {
            if (this.debug) console.log(JSON.stringify(item));
			      this.removeMessageByDb(item.id)
        },
			  // 撤回消息
			  recallMessage (item) {
					if (this.debug) console.log('撤回消息')
					console.log(`撤回消息:${JSON.stringify(item)}`)
					// 删除本地消息
					this.removeMessageByDb(item.id)
					let obj = null
					// 通知用户撤回(个人)
					if (item.channelType === 'P') {
						obj = {
							signId: `${this.userInfo.jid}${item.id}`
						}
						this.sendOtherMessage({
							to: item.channelId,
							content: JSON.stringify(obj),
							type: 'RECALL_MESSAGE'
						})
						return
					}
					// 通知群成员撤回(群组)
					obj = {
						signId: item.signId,
						memberJid: this.userInfo.jid,
						groupJid: item.channelId
					}
					console.log(`obj:${JSON.stringify(obj)}`)
					this.sendGroupOtherMessage({
						to: item.channelId,
						content: JSON.stringify(obj),
						type: 'RECALL_MESSAGE'
					})
				},
        sendEmoji() {
            console.log('ddd');
            this.showEmoji = true;
        },
        chooseImage() {
            uni.chooseImage({
                count: 1,
                success: res => {
                    let filePath = res.tempFilePaths[0];
                    uni.getFileInfo({
                        filePath: filePath,
                        success: fileInfo => {
                            console.log(JSON.stringify(fileInfo));
                            let size = fileInfo.size;
                            uni.getImageInfo({
                                src: filePath,
                                success: image => {
                                    console.log(JSON.stringify(image));
                                    this.uploadImageFile(filePath, size, image.width, image.height);
                                }
                            });
                        }
                    });
                }
            });
        },
        uploadImageFile(filePath, size, width, height) {
            uni.showLoading({
                title: '发送中...'
            });
            var token = uni.getStorageSync('token');
            uni.uploadFile({
                url: this.hostUrl + '/syntoim/rest/file/upload',
                header: {

                },
                formData: {
                    channelId: this.currentChannelId,
                    imageWidth: width,
                    imageHeight: height,
                    size: size
                },
                name: 'file',
                filePath: filePath,
                success: res => {
                    console.log(JSON.stringify(res.data));
                    this.sendImageMessage(res.data);
                },
                fail: err => {
                    console.log(JSON.stringify(err));
                },
                complete: () => {
                    console.log('complate');
                    setTimeout(function() {
                        uni.hideLoading();
                    }, 300);
                }
            });
        },
        chooseFile() {
            uni.navigateTo({
                url: '../file/file-list'
            });
        }
    }
};
</script>

<style>
.uni-column {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background-color: #EDEDED;
}

.content {
	display: flex;
	flex: 1;
	margin-bottom: 100upx;
	overflow: hidden;
}

.foot {
	position: fixed;
	width: 100%;
	height: 100upx;
	min-height: 100upx;
	left: 0;
	bottom: 360upx;
	overflow: hidden;
	padding: 7upx 0 0 0;
}

.showPanel {
	bottom: -3upx;
}

.foot-panel {
	position: fixed;
	width: 100%;
	height: 360upx;
	min-height: 100upx;
	left: 0;
	bottom: 0;
	overflow: hidden;
	background-color: #fafafa;
}

.load-more {
	width: 100%;
	text-align: center;
	margin-top: 10upx;
	font-size: 25upx;
	color: #888888;
}

.flex-item {
	width: 30%;
	height: 180upx;
	text-align: center;
	font-size: 26upx;
}

.footer-image {
	width: 60upx;
	height: 60upx;
	margin-top: 40upx;
}

.footer-sub-panel {
	height: 110upx;
}

.footer-sub-panel1 {
	height: 70upx;
	font-size: 25upx;
	color: #303133;
}

.no-read-message-tip {
	position: fixed;
	top: 70upx;
	right: 0;
	width: 190upx;
	height: 60upx;
	line-height: 60upx;
	padding-left: 22upx;
	z-index: 10;
	border-top-left-radius: 30upx;
	border-bottom-left-radius: 30upx;
	background: #409eff;
	border: 1px solid #dcdfe6;
	color: #fff;
	font-size: 25upx;
}
</style>
