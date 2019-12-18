<template>
	<view class="wating-page">
		<image src="../../static/img/voice_back.jpg" style="width: 750upx;height: 100%;"></image>
		<view style="position: absolute; top: 200upx; width: 100%; color: #FFFFFF; font-size: 25upx;  text-align: center;">
			<image src="../../static/img/voice_head.png" style="height: 180upx; width: 180upx;"></image>
		</view>
		<view style="position: absolute; top: 400upx; width: 100%; color: #FFFFFF; font-size: 34upx;  text-align: center;">
			[{{requestType}}]{{sendUserName}}
		</view>
		<view style="position: absolute; bottom: 430upx; width: 100%; color: #FFFFFF; font-size: 25upx;  text-align: center;">
			正在请求{{ requestType }}通话，是否接通？
		</view>
		<view style="position: absolute; bottom: 100upx; width: 100%; color: #FFFFFF; font-size: 25upx;">
			<view style="width: 50%; text-align: center; display: inline-block;">
				<image src="../../static/img/closed.png" style="width: 130upx; height: 130upx;" @tap="closeConnect"></image>
				<view>挂断</view>
			</view>
			<view style="width: 50%; text-align: center; display: inline-block;">
				<image src="../../static/img/connected.png" style="width: 130upx; height: 130upx;" @tap="connectPhone"></image>
				<view>接通</view>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import {uniIcon} from '@dcloudio/uni-ui'
	import {
		mapState,
		mapActions,
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
				sendUserName: '',
				requestType: '',
				channelId: null,
				channelName: null,
				channelType: null,
				action: '',
				senderId: null,
				autoCloseTimer:null,
                roomName:null
			}
		},
		computed: { //同步了store中state内的getCloseH5Message值
			...mapState({
			    userInfo: state => state.home.userInfo,
				currentChannel: state => state.message.currentChannel,
				currentChannelId: state => state.message.currentChannelId,
				hostUrl: state => state.globalConfig.hostUrl,
				closeVideoMessage:  state => state.message.closeVideoMessage
			})
		},
		watch: {
			closeVideoMessage(curval, oldval) { //监听了closeVideoMessage的值,如果收到则关闭
				if (curval) {
					// uni.setStorageSync("videoBusyType", null); //type 1:网页  2：原生
					// uni.setStorageSync("isVideoBusy", false);
					uni.navigateBack({
						delta: 1
					});
				}
			}
		},
		onUnload() {
			// uni.setStorageSync("videoBusyType", null); //type 1:网页  2：原生
			uni.setStorageSync("isVideoBusy", false);
			let videoData={
				type:'video',
				value: 'false'
			}
			this.SET_IS_PLAY_AUDIO(videoData);
			console.log('挂断==================='+JSON.stringify(videoData))
			if(this.autoCloseTimer){
				clearTimeout(this.autoCloseTimer)
			}
            uni.setStorageSync('isVideoLoding', false);
		},
		onLoad(option) {
			// 30S自动挂断
			this.autoCloseTimer = setTimeout(() => {
				this.closeConnect()
			},30000)
			
			this.currentUser = uni.getStorageSync('currentUser');
			if (option.channelType == 'G') {
				if (option.action == 'AUDIO_CONNECT') {
					this.requestType = '群语音';
				} else {
					this.requestType = '群视频';
				}
				this.sendUserName = option.senderName;
                this.channelName = option.senderName;
			} else {
				if (option.action == 'AUDIO_CONNECT') {
					this.requestType = '语音';
				} else {
					this.requestType = '视频';
				}
				this.sendUserName = option.senderName;
                this.channelName = option.senderName;
			}
            this.roomName = option.roomName;
			this.senderId = option.senderId
			this.action = option.action;
			this.channelId = option.channelId;
			
			this.channelType = option.channelType;
			let videoData={
				type:'video',
				value: 'true'
			}
			console.log('SET_IS_PLAY_AUDIO========'+JSON.stringify(videoData))
			this.SET_IS_PLAY_AUDIO(videoData);
			uni.setStorageSync('currentAction', option.action);
			uni.setStorageSync("isVideoBusy", true);
			uni.setStorageSync("videoBusyType", '1');
			uni.setStorageSync("videoReceiveType", 'called'); 
		},
        onShow() {
            let videoLoading =  uni.getStorageSync('isVideoLoding');
            if(videoLoading){
                this.closeConnect()
            }else{
                uni.setStorageSync('isVideoLoding', true);
            }
        },
		methods: {
			...mapMutations(['SET_IS_PLAY_AUDIO']),
			...mapActions(['sendGroupOtherMessage','sendOtherMessage']),
			closeConnect() {
				let obj = {
					channelId: this.channelId,
                    channelType: this.channelType,
					createTime: new Date().getTime()
				}
				let messageData = {
				  to: this.senderId
				}
				if (this.action == 'AUDIO_CONNECT') {
					messageData.type = 'MEMBER_QUIT_MEIDA_MEET';
					obj.content = '语音通话已挂断'
					obj.action = 'MEMBER_QUIT_MEIDA_MEET';
				} else {
					messageData.type = 'MEMBER_QUIT_MEIDA_MEET';
					obj.content = '视频通话已挂断'
					obj.action = 'MEMBER_QUIT_MEIDA_MEET';
				}
				if (this.channelType === 'G') {
					// messageData.groupId = this.channelId;
					//群组不进行断开连接，因为需要都拒绝，但是无法捕获是否都拒绝了
				} else {
					messageData.content = JSON.stringify(obj)
					this.sendOtherMessage(messageData)
				}
                console.log(JSON.stringify(messageData))
				// uni.setStorageSync("videoBusyType", null); //type 1:网页  2：原生
				uni.setStorageSync("isVideoBusy", false);
				uni.navigateBack({
					delta: 1
				});
			},
			connectPhone() {
				uni.setStorageSync("videoBusyType", '2'); //type 1:网页  2：原生
				if (this.action && this.action == 'AUDIO_CONNECT') {
					this.voiceMessage();
					// uni.setStorageSync('currentAction', 'AUDIO_CONNECT');
				} else {
					this.videoMessage();
					// uni.setStorageSync('currentAction', 'VIDEO_CONNECT');
				}
                let videoData={
                    type:'video',
                    value: 'false'
                }
                this.SET_IS_PLAY_AUDIO(videoData);
				if(this.autoCloseTimer){
					clearTimeout(this.autoCloseTimer)
					this.autoCloseTimer =  null
				}
				// uni.navigateBack({
				// 	delta: 1
				// });
			},
			voiceMessage() {
				switch (plus.os.name) {
					case "Android":
						// Android平台: plus.android.*
						this.androidVoiceMessage();
						break;
					case "iOS":
						// iOS平台: plus.ios.*
						this.iosVoiceMessage();
						break;
					default:
						// 其它平台,不存在其他平台
						break;
				}

			},
			androidVoiceMessage() {
				let userId = this.userInfo.id + ''
				let channelId = this.channelId;
				//获取当前Activity
				var main = plus.android.runtimeMainActivity();
                let userName = uni.getStorageSync('currentUser');
				let tokens = uni.getStorageSync('currentUserToken');
				// 通过5 sdk 插件的invoke方法起调对象方法
				plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'showVoicePanel', main, userId, channelId, this.roomName,
					this.channelType, this.channelName,userName,tokens);
			},
			iosVoiceMessage() {
				let userId = this.userInfo.id + ''
				let channelId = this.channelId;
				// 通过5 sdk 插件的invoke方法起调对象方法
				var pageHelper = plus.ios.newObject("PageHelper");
				plus.ios.invoke(pageHelper, "voiceMessage:andChannelId:andUserId:", this.channelName, channelId, userId);
			},
			videoMessage() {
				switch (plus.os.name) {
					case "Android":
						// Android平台: plus.android.*
						if (this.channelType == "G") {
							this.androidGroupVideoMessage();
						} else {
							this.androidVideoMessage();
						}
						break;
					case "iOS":
						// iOS平台: plus.ios.*
						if (this.channelType == "G") {
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
			androidVideoMessage() {
				let userId = this.userInfo.id + ''
				let channelId = this.channelId;
				//获取当前Activity
				var main = plus.android.runtimeMainActivity();
                let userName = uni.getStorageSync('currentUser');
                let tokens = uni.getStorageSync('currentUserToken');
				// 通过5 sdk 插件的invoke方法起调对象方法
				plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'showVideoPanel', main, userId, channelId, this.roomName,
					this.channelType, this.channelName,userName,tokens);
			},
			iosVideoMessage() {
				let userId = this.userInfo.id + ''
				let channelId = this.channelId;
				// 通过5 sdk 插件的invoke方法起调对象方法
				var pageHelper = plus.ios.newObject("PageHelper");
				plus.ios.invoke(pageHelper, "videoMessage:andChannelId:andUserId:", this.channelName, channelId, userId);
			},
			androidGroupVideoMessage() { //群组聊天
				let userId = this.userInfo.id + ''
				let channelId = this.channelId;
				//获取当前Activity
				var main = plus.android.runtimeMainActivity();
                let userName = uni.getStorageSync('currentUser');
                let tokens = uni.getStorageSync('currentUserToken');
				// 通过5 sdk 插件的invoke方法起调对象方法
				plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'showGroupVideoPanel', main, userId, channelId,
					this.roomName, this.channelType, this.channelName,userName,tokens);
			},
			iosGroupVideoMessage() {
				let userId = this.userInfo.id + ''
				let channelId = this.channelId;
				// 通过5 sdk 插件的invoke方法起调对象方法
				var pageHelper = plus.ios.newObject("PageHelper");
				plus.ios.invoke(pageHelper, "groupVideoMessage:andChannelId:andUserId:andChannelTye:", this.channelName, channelId,
					userId, this.channelType);

			},
		}
	}
</script>

<style>
	.wating-page {
		overflow: hidden;
		margin: 0;
		padding: 0;
		position: flex;
		height: 100%;
		width: 100%;
	}
</style>
