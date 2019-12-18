<template>
	<view>
		<!-- <view class="footer-left">
			<view class="uni-icon uni-icon-mic" @touchstart="recordStart()" @touchend="recordEnd()">
			</view>
		</view>
		<view class="footer-left">
			<view class="uni-icon uni-icon-plus" @tap="showFootPanel">
			</view>
		</view>
		<view class="footer-center">
			<textarea class="input-text" ref="textarea" v-model="inputValue" @linechange="lineChange" :auto-height="isAutoHeight"/>
			</view>
		<view class="footer-right" @tap="sendMessge">
			<view id='msg-type' > 发送 </view>
		</view> -->
		<view class="cu-bar foot input" style="background-color: #F7F7F7; position: relative; padding-bottom: 20upx;">
			<view class="action" @tap="speech()">
				<text v-if="!speechVisible" class="cuIcon-sound text-grey"></text>
				<image v-else src="../../static/img/jianpan.png" style="width: 45upx;height: 45upx; margin-right: 20upx;"></image>
			</view>
			<input
				v-if="speechVisible"
				class="textarea speechTextArea"
				placeholder="按住   说话"
				@touchstart="recordStart()"
				@touchend="recordEnd()"
				disabled
			/>
			<textarea
				v-else
				class="textarea speechTextArea"
				style="text-align: left;"
				ref="textarea"
				maxlength="300"
				:focus="textFocus"
				cursor-spacing="10"
				v-model="inputValue"
				@focus="textFocusInfo()"
				@linechange="lineChange"
				:auto-height="isAutoHeight"
			/>
			<button v-if='inputValue&&inputValue.length>0'  class="cu-btn shadow" style="color: #FFFFFF; background-color: #3F88BF; margin-left: 20upx;" @tap="sendMessge">发送</button>
			<view v-else class="action" style="margin-right: 16upx;" @tap="showFootPanel()"><text class="cuIcon-roundadd text-grey"></text></view>
			
		</view>
	</view>
</template>

<script>
var music = null;
var recorderManager = null;
var recordTimeInterval = null;
var util = require('../../common/util.js');
import { mapState, mapActions, mapMutations } from 'vuex';
import app from '../../common/common.js';

export default {
	name: 'chat-input',
	data() {
		return {
			inputValue: '',
			recording: false, //录音中
			playing: false, //播放中
			hasRecord: false, //是否有了一个
			tempFilePath: '',
			recordTime: 0,
			formatedRecordTime: '00:00:00', //录音的总时间
			formatedPlayTime: '00:00:00', //播放录音的当前时间
			isAutoHeight: true,
			speechVisible: false,
			speechSound:'按住   说话',
			textFocus:false
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.home.userInfo,
			historyMessageList: state => state.message.historyMessageList,
			currentChannelId: state => state.message.currentChannelId,
			hostUrl: state => state.globalConfig.hostUrl
		})
	},
	onShow() {
		let nickName = uni.getStorageSync('nickValue');
		if (nickName) {
			this.inputValue += nickName + ' ';
			uni.setStorageSync('nickValue', '');
			this.$refs.textarea.$el.focus = true;
		}
	},
	props: ['channelId','channelType', 'textValue'],
	watch: {
		inputValue(curval, oldval) {
			let item = curval.charAt(curval.length - 1);
			if (item == '@' && this.channelType === 'G') {
				this.goSelectPeople();
			}
		},
	},
	onLoad() {
		if (this.textValue != '') {
			this.inputValue = this.textValue;
		}
		recorderManager = uni.getRecorderManager();
		recorderManager.onStart(() => {
			uni.showToast({
				title: '录音中...',
				image: '../../static/img/voice.png',
				duration: 60000
			});
		});
		recorderManager.onStop(res => {
			if (this.recordTime >= 1) {
				// console.log('录音临时路径========================'+JSON.stringify(res.tempFilePath));
				uni.getFileInfo({
					filePath: res.tempFilePath,
					success: fileInfo => {
						console.log(JSON.stringify(fileInfo));
						if (fileInfo.size && fileInfo.size > 0) {
							this.uploadAudioFile(res.tempFilePath, fileInfo.size);
						} else {
							uni.showToast({
								title: '太短了哟！',
								icon: 'none',
								duration: 1500
							});
						}
					}
				});
			} else {
				uni.showToast({
					title: '太短了哟！',
					icon: 'none',
					duration: 1500
				});
			}
			this.hasRecord = true;
			this.recording = false;
		});
	},
	onUnload: function() {
		this.end();
	},
	methods: {
		...mapActions(['getRemoteAreaInfo']),
		// textBlur(){
		// 	
		// },
		textFocusInfo(){
			this.$emit('hideFootPanel', '');
		},
		speech() {
			this.speechVisible = !this.speechVisible;
			setTimeout(()=>{
				if(!this.speechVisible){
					this.textFocus = true;
				}else{
					this.textFocus = false;
				}
			},500)
			
		},
		//选择需要@的人
		goSelectPeople: function() {
			uni.navigateTo({
				url: '../group/atGroupPeople?channelId=' + this.channelId
			});
		},
		showFootPanel() {
			this.$emit('showHideFootPanel', '');
		},
		lineChange(e) {
			if (e.detail.lineCount >= 2) {
				this.isAutoHeight = false;
			} else {
				this.isAutoHeight = true;
			}
		},
	
		uploadAudioFile(filePath, size) {
			
			// console.log(filePath);
			uni.uploadFile({
				url: this.hostUrl + '/syntoim/rest/file/upload',
				header: {},
				formData: {
					channelId: this.currentChannelId,
					imageWidth: this.recordTime,
					imageHeight: 0,
					size: size
				},
				name: 'file',
				filePath: filePath,
				success: res => {
					console.log('上传文件成功=============================='+res.data);
					let resData = JSON.parse(res.data);
					resData.recordTime = this.recordTime;
					this.sendVoiceMessge(resData);
				},
				fail: err => {
					console.log(JSON.stringify(err));
				},
				complete: () => {
					console.log('complate');
				}
			});
		},
		recordStart() {
			this.startRecord();
		},
		recordEnd() {
			this.stopRecord();
			uni.hideToast();
			// console.log(this.formatedRecordTime);
		},
		startRecord() {
			//开始录音
			this.recording = true;
			this.recordTime = 0;
			recordTimeInterval = setInterval(() => {
				this.recordTime += 1;
				this.formatedRecordTime = util.formatTime(this.recordTime);
			}, 1000);
			recorderManager.start({
					format: 'mp3'
				});
		},
		stopRecord() {
			//停止录音
			recorderManager.stop();
			clearInterval(recordTimeInterval);
		},
		sendMessge() {
			if (this.inputValue.trim() == '') {
				this.inputValue = '';
			} else {
				//点击发送按钮时，通知父组件用户输入的内容
				this.$emit('send-message', {
					type: 'text',
					content: this.inputValue
				});
				this.inputValue = '';
			}
		},
		sendVoiceMessge(data) {
			this.$emit('send-voice-message', data);
		},
		end() {
			recorderManager.stop();
			clearInterval(recordTimeInterval);
			(this.recording = false), (this.hasRecord = false);
			(this.formatedRecordTime = '00:00:00'), (this.formatedRecordTime = '00:00:00');
		}
	}
};
</script>

<style>
@import '../../common/icon.css';

.footer {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 80upx;
	min-height: 80upx;
	overflow: hidden;
	padding: 5upx;
	background-color: #f7f7f7;
}
.footer-left {
	color: #606266;
	width: 60upx;
	height: 80upx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.speechTextArea {
	background-color: #ffffff;
	text-align: center;
	height: 50upx;
	line-height:  50upx;
	vertical-align: middle;
	/* flex: 1; */
/* 	padding: 10upx !important; */
	font-family: verdana !important;
	overflow: hidden;
	border-radius: 15upx;
}
.footer-right {
	width: 120upx;
	height: 80upx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #1482d1;
	font-size: 35upx;
}
.footer-center {
	flex: 1;
	/* height: 80upx; */
	width: 510upx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.footer-center .input-text {
	height: 50upx;
	flex: 1;
	background: #fff;
	border: solid 1upx #ddd;
	padding: 10upx !important;
	font-family: verdana !important;
	overflow: hidden;
	border-radius: 15upx;
}
</style>
