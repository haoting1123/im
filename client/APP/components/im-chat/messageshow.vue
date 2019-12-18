<template>
	<view class="m-item" :id="'message_'+message.createTime" >

		<view class="m-left">
			<view v-if="message.user=='home'" class="head_icon">
				<view class="uni-media-list-logo" v-if="message.channelType === 'P' && headUrl">
					<image class="head_icon" :src="headUrl"></image>
				</view>
				<view class="uni-media-list-logo" v-else-if="message.channelType === 'G' && headUrl">
					<image class="head_icon" :src="headUrl"></image>
				</view>
				<view class="uni-media-list-logo" v-else-if="!headUrl">
					<image class="head_icon" src="../../static/img/normal-avatar.png"></image>
				</view>
			</view>
		</view>
		<view class="m-content">
			<view v-if="message.user==='home' && message.channelType === 'G'" style="color:#606266; font-size: 22upx;">{{userName}}</view>
			<view class="m-content-head" :class="{'m-content-head-right':message.user=='customer'}" @longpress="showActionSheet(message)">
				<view :class="'m-content-head-'+message.user">
					<view v-if="message.fileType && message.fileType !== 'undefined'" class="rich-content-panel">
						<view class="message-image-panel" v-if="message.fileType === 'img'" @tap="previewImage(message)">
							<image class="message-image" :src="imgUrl"></image>
							<!-- <rich-text :nodes="message.content"></rich-text> -->
						</view>
						<view class="message-voice-panel" v-else-if="message.fileType === 'aac'" @tap="playAudio(message)">
							<view v-if="message.user=='customer'">
								<text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{(fileInfo ? fileInfo.recordTime : 0 )+'``'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text>
								<image class="message-voice-image" src="../../static/img/voice-right.png"></image>
							</view>
							<view v-else style="text-align: left;">
								<image class="message-voice-image" src="../../static/img/voice-left.png" style="margin-right: 10upx;"></image>
								<text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{(fileInfo ? fileInfo.recordTime : 0 )+'``'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text>
							</view>
						</view>
						<file-item v-else-if="message.fileType === 'file'"
						 :messageItem="message">
						</file-item>
						<view v-else-if="message.fileType === 'vcard'" @tap="getUserDetail(message)" class="message-position-panel">
							<view class="uni-media-list-logo rich-content-icon">
								<image class="head_icon" :src="vcardInfo.photo" v-if="vcardInfo.photo"></image>
								<image class="head_icon" src="../../static/img/normal-avatar.png" v-else></image>
							</view>
							<view style="width: 290upx;  display: inline-block; font-size: 28upx;">
								<text>{{vcardInfo.name}}</text>
								<view v-if="message.user=='home'" style="font-size: 23upx; color: #8F8F94;">{{vcardInfo.groupName}}</view>
								<view v-else style="font-size: 23upx; color: #8F8F94;">{{vcardInfo.groupName}}</view>
							</view>
							<view class="rich-content-bottom" :class="{'rich-content-left':message.user=='home'}" >
								<view class="rich-content-bottom-item">个人名片</view>
								<!-- <view class="rich-content-bottom-item" style="text-align: right;">{{createTimeStr}}</view> -->
							</view>

						</view>
						<view v-else-if="message.fileType === 'position'" @tap="openPosition(message)" class="message-position-panel">
							<view class="uni-media-list-logo rich-content-icon">
								<image v-if="message.user=='home'" src="../../static/img/location.png" class="head_icon"></image>
								<image v-else src="../../static/img/location.png" class="head_icon"></image>
							</view>
							<view style="width: 290upx;  display: inline-block;  font-size: 28upx;">
								<view>{{positionDetail.name}}</view>
								<view v-if="message.user=='home'" style="font-size: 23upx; color: #8F8F94;">{{positionDetail.address}}</view>
								<view v-else style="font-size: 23upx; color: #8F8F94;">{{positionDetail.address}}</view>
							</view>
							<view class="rich-content-bottom" :class="{'rich-content-left':message.user=='home'}" >
								<view class="rich-content-bottom-item">位置共享</view>
								<!-- <view class="rich-content-bottom-item" style="text-align: right;">{{createTimeStr}}</view> -->
							</view>
						</view>
					</view>
					<view v-else>
						<!-- <text>{{message.content}}</text> -->
						<rich-text :nodes="message.content"></rich-text>
					</view>
				</view>
			</view>
			<view :class="'message-content-time-'+message.user">
				<view v-if="message.user !== 'home'"  class="message-is-read">
					<!-- <view v-if="message.channelType === 'G'" class="message-read-count">
						{{ message.isRead === 'yes' ? ((message.readCount && message.readCount > 0) ? message.readCount + '人已读' : '已读') : '未读'}}
					</view> -->
					<view class="message-read-count">
						{{ message.isRead === 'yes' ? '已读' : '未读' }}
					</view>
				</view>
				{{message.createTimeStr}}
			</view>
		</view>
		<view class="m-right">
			<view v-if="message.user=='customer'" class="head_icon">
				<view class="uni-media-list-logo" v-if="userInfo.photo">
					<image :src="userInfo.photo" class="head_icon"></image>
				</view>
				<view class="uni-media-list-logo" v-else>
					<image class="head_icon" src="../../static/img/normal-avatar.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import app from "../../common/common.js"
	import fileItem from './fileItem.vue';
	import { mapState, mapMutations } from 'vuex';
	var music = null;

	export default {
		data() {
			return {
				playing: false, //播放中
				tempFilePath: '',
                fileInfo: {},
				headUrl:'',
				imgUrl:'',
				positionDetail:{
					name: '',
					address:''
				},
				vcardInfo:{
					username: '',
					name: '',
					groupName: '',
					sex: '',
					photo: ''
				},
				userName:''
			}
		},
		computed: {
		    ...mapState({
		        userInfo: state => state.home.userInfo,
				activeGroup: state => state.group.activeGroup,
				xmppDomain: state => state.home.xmppDomain
		    }),

		},
		components: {
			fileItem,
		},
		onUnload: function() {
			this.end();
		},
		onLoad: function() {
			//如果是密聊消息
			// console.log('查看是否有密聊消息==================================================')
			if(this.message.chatType === 'secretChat'){
				this.SET_MESSAGE_CHAT_TYPE('secretChat');
			}

			if(this.message.channelType === 'P'){
				this.headUrl = this.currentChannel.headUrl
			}
			// 解析群组成员名称
			if(this.message.channelType === 'G' && this.message.user=='home' && this.activeGroup && this.activeGroup.members && this.activeGroup.members.length > 0){
				let member = this.activeGroup.members.find(item => {
					return item.jid.split('@')[0] === this.message.senderId.replace('-APP','')
				})
				if(member){
					this.userName = member.nickName
					this.headUrl = member.photo
				}
			}
// 			// 语音消息
            if(this.message.fileType === 'aac'){
                this.fileInfo = JSON.parse(this.message.content)
                console.log("fileInfo:"+JSON.stringify(this.fileInfo))
				music = uni.createInnerAudioContext();
				console.log('播放语音消息==================')
				music.onEnded(() => {
					this.playing = false;
					console.log('播放结束');
					uni.hideToast();
				});
				music.onPlay(() => {
					uni.showToast({
						title: "播放中...",
						image: "../../static/img/voice.png",
						duration: 60000
					})
					console.log('开始播放');
				});
				let that = this;
				music.onError((res) => {
					
					console.log('播放错误=================='+JSON.stringify(res))
					uni.hideToast();
					uni.showToast({
						title: "播放语音错误" + res.errMsg,
						icon: 'none',
						duration: 1000
					})
					console.log(res.errMsg);
					console.log(res.errCode);
				});
            }
			// 处理其他消息
			if (this.message.fileType === 'img' ) {
				let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
				let url = this.message.content.match(srcReg)
				if(url && url.length > 0){
					this.imgUrl = url[1]
				}
			}else if(this.message.fileType === 'position' ){
				if(this.message.content && this.message.content !== 'undefined'){
					let messageInfo = JSON.parse(this.message.content)
					this.positionDetail.name = messageInfo.name;
					this.positionDetail.address = messageInfo.address;
				}
			}else if(this.message.fileType === 'vcard' ){
				if(this.message.content && this.message.content !== 'undefined'){
					let messageInfo = JSON.parse(this.message.content)
					this.vcardInfo.name = messageInfo.name;
					this.vcardInfo.username = messageInfo.username;
					this.vcardInfo.groupName = messageInfo.groupName;
					this.vcardInfo.sex = messageInfo.sex;
					this.vcardInfo.photo = messageInfo.photo;
				}
			}
		},
		props: ['message', 'currentChannel'],
		methods: {
			...mapMutations(['SET_MESSAGE_CHAT_TYPE','SET_ACTIVE_MEMBER']),
			getUserDetail(message){
				if(message.content){
					let messageInfo = JSON.parse(message.content)
					  this.SET_ACTIVE_MEMBER({
							name: messageInfo.name,
							groupName: messageInfo.groupName,
							sex: messageInfo.sex,
							photo: messageInfo.photo,
							alias: messageInfo.alias,
							username: messageInfo.username,
							jid: messageInfo.username + this.xmppDomain,
							friendJid: messageInfo.username + this.xmppDomain,
							account: messageInfo.username
					  })
				}

				//跳转个人信息
				uni.navigateTo({
				    url: '../friends/friend-info?type=businessCard'
				})
			},
			openPosition(message) {
				let posi = JSON.parse(message.content)
				const latitude = posi.latitude;
				const longitude = posi.longitude;
				uni.openLocation({
					name: posi.name,
					address: posi.address,
					scale: 19,
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
					success: function() {
						console.log('success');
					}
				});
			},
			//播放语音消息
			playAudio(message) {
				if (message.fileType === 'aac') {
					if (this.playing) {
						uni.hideToast();
						this.stopVoice();
					}
					let src = this.fileInfo.filePath.replace(new RegExp("%E3%80%90null%E3%80%91", 'g'), "");
					// let src = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3'
					// let src = 'http://192.168.1.110:8000/syntoimdownload/20190428/70203b525020414ab4e185e796173f41/1556417772801.aac'
					console.log('播放路径playAudio=================='+src)
					//TODO 目前为在线播放
					music.src = src;
					this.playVoice();
				}
			},
            previewImage(message){
				// console.log(JSON.stringify(message))
                if (message.fileType === 'img' ) {
					let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
					let url = message.content.match(srcReg)
					uni.previewImage({
						urls: [url[1]]
					});
				}
            },
			downloadFile(url) {

			},
			showActionSheet(item) {
				let userId = this.userInfo.jid;
				console.log(JSON.stringify(item))
				if (item.senderId == userId) {
					let permissionsList = ['删除消息']
					{
						let nowTime = Date.now()
						if (Number(item.createTime) + 2 * 60 * 1000 > nowTime) {
							permissionsList.push('撤回消息')
						}
					}
					uni.showActionSheet({
						itemList: permissionsList,
						success: (e) => {
							if (e.tapIndex == 0) {
								uni.showModal({ //提醒用户
									title: '温馨提示',
									content: '删除后将不会出现在你的消息记录中，确认删除？',
									success: (res) => {
										if (res.confirm) {
											//点击发送按钮时，通知父组件用户输入的内容
											this.$emit('remove-message', item);
										}
									}
								})
							} else {
								uni.showModal({ //提醒用户
									title: '温馨提示',
									content: '撤回后将不会出现在你和对方的消息记录中，确认撤回？',
									success: (res) => {
										if (res.confirm) {
											//点击发送按钮时，通知父组件用户输入的内容
											this.$emit('recall-message', item);
										}
									}
								})
							}
						}
					})
				}else{
					let itemList = ['删除消息']
					if(item.fileType === 'img'){
						itemList.push('保存图片')
					}
					uni.showActionSheet({
						itemList: itemList,
						success: (e) => {
							if (e.tapIndex == 0) {
								uni.showModal({ //提醒用户
									title: '温馨提示',
									content: '删除后将不会出现在你的消息记录中，确认删除？',
									success: (res) => {
										if (res.confirm) {
											//点击发送按钮时，通知父组件用户输入的内容
											this.$emit('remove-message', item);
										}
									}
								})
							}else if(e.tapIndex == 1){
								console.log(this.imgUrl)
								uni.downloadFile({
									url: this.imgUrl,
									success: (res) => {
										if (res.statusCode === 200) {
											console.log('下载成功'+JSON.stringify(res));
											uni.saveImageToPhotosAlbum({
												filePath: res.tempFilePath,
												success: function () {
													console.log('save success');
													uni.showToast({
														title: '保存成功',
														duration: 2000
													});
												}
											});
										}
									}
								});
							}
						}
					})
				}
			},
			playVoice() {
				console.log("开始播放")
				this.playing = true;
				music.play();
			},
			stopVoice() {
				console.log("停止播放")
				this.playing = false,
				music.stop();
			},
			end() {
				uni.hideToast();
				if(music){
					music.stop();
				}
			}
		}
	}
</script>

<style>

	.m-item {
		display: flex;
		flex-direction: row;
		padding-top: 40upx;
	}

	.m-left {
		display: flex;
		width: 120upx;
		justify-content: center;
		align-items: flex-start;
	}

	.m-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		word-break: break-all;
	}

	.m-right {
		display: flex;
		width: 120upx;
		justify-content: center;
		align-items: flex-start;
	}

	.head_icon {
		width: 80upx;
		height: 80upx;
	}

	.m-content-head {
		position: relative;
	}

	.m-content-head-right {
		display: flex;
		justify-content: flex-end;
	}

	.m-content-head-home {
		text-align: left;
		background: #C8E7FE;
		border: 1px #C8E7FE solid;
		border-radius: 15upx;
		padding: 20upx;
		color: black;
		width: fit-content;
		width: -webkit-fit-content;
		width: -moz-fit-content;
		min-height: 60upx;
		min-width: 60upx;
	}

	.m-content-head-home:before {
		border: 15upx solid transparent;
		border-right: 15upx solid #C8E7FE;
		left: -26upx;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}

	.m-content-head-customer {
		border: 1upx #F2F6FC solid;
		background: white;
		border-radius: 15upx;
		padding: 20upx;
		min-height: 60upx;
	}

	.m-content-head-customer:after {
		border: 15upx solid transparent;
		border-left: 15upx solid white;
		top: 20upx;
		right: -26upx;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}

	.message-content-time-customer {
		font-size: 22upx;
		color: #909399;
		text-align: right;
		display: block;
		padding: 5upx 5upx 0 0;
	}

	.message-content-time-home {
		font-size: 22upx;
		color: #909399;
		text-align: left;
		display: block;
		padding: 5upx 0 0 5upx;
	}

	.message-image-panel {
		width: 200upx;
		height: 200upx;
	}

	.message-image {
		width: 100%;
		height: 100%;
	}

	.message-voice-panel {
		width: 200upx;
		height: 60upx;
		text-align: right;
	}

	.message-voice-image {
		width: 50upx;
		height: 50upx;
		vertical-align: middle;
	}

	.message-voice-panel-right {
		width: 200upx;
		height: 60upx;
		text-align: right;
	}

	.rich-content-panel{
		/* border-bottom: 1px solid #C0C4CC; */
		min-width: 200upx;
	}

	.rich-content-icon {
		width: 80upx; display: inline-block; vertical-align: top;
	}

	.rich-content-bottom {
		border-top: 1px solid #C0C4CC;
		font-size: 20upx;
		position: absolute;
		bottom: 5upx;
		color: #6D6D72;
		width: 400upx;
		padding: 4upx 0 0 5upx;
	}
	.rich-content-bottom-item {
		width: 190upx;
		display: inline-block;
		color: #8F8F94;
	}

	.rich-content-left{
		color: white;
	}
	.message-position-panel {
		padding-bottom: 30upx;
		width: 400upx;
	}
	.message-is-read{
		display: inline;
		margin-right: 20upx;
	}
	.message-read-count {
		display: inline;
	}
</style>
