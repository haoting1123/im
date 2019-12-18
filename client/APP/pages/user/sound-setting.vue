<template>
	<view>
		<!-- <view style="padding: 25upx 15upx 10upx 25upx; color: #606266;">音频设置</view> -->
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-blue margin-right-xs"></text>
						声音
					</view>
				</view>
				<view class="action"><switch class="switch" @change="soundChange" :class="soundCheck ? 'checked' : ''" :checked="soundCheck ? true : false"></switch></view>
			</view>
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-blue margin-right-xs"></text>
						震动
					</view>
				</view>
				<view class="action"><switch class="switch" @change="shakeSwitch" :class="shakeCheck ? 'checked' : ''" :checked="shakeCheck ? true : false"></switch></view>
			</view>
			<!-- <view class="column-panel">
				<view class="voice-panel">音量设置</view>
				<view class="volumeInt-label"><slider :value="volumeInt" @change="volumeChange" step="5" /></view>
			</view> -->
			<view class="column-panel">
				<view class="voice-panel">消息提示音</view>
				<view class="message-voice-label">
					<radio-group @change="radioChange">
						<view v-for="item in voidList" :key="item.value" style="display: inline-block; width: 180upx;margin-left: 20upx;">
							<view style="display: inline-block; width: 50upx;"><radio :value="item.value" :checked="currentVoice == item.value" /></view>
							<view style="display: inline-block; width: 130upx; ">{{ item.name }}</view>
						</view>
					</radio-group>
				</view>
			</view>
			<view class="column-panel">
				<view class="voice-panel">公告提示音</view>
				<view class="message-voice-label">
					<radio-group @change="radioNoticeChange">
						<view v-for="item in voidList" :key="item.value" style="display: inline-block; width: 180upx;margin-left: 20upx;">
							<view style="display: inline-block; width: 50upx;"><radio :value="item.value" :checked="currentNoticeVoice == item.value" /></view>
							<view style="display: inline-block; width: 130upx; ">{{ item.name }}</view>
						</view>
					</radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import app from '../../common/common.js';

export default {
	data() {
		return {
			volumeInt: 50,
			voidList: [{ name: '提示音1', value: '1' }, { name: '提示音2', value: '2' }],
			currentVoice: 1,
			shakeCheck: true,
			soundCheck: true,
			currentNoticeVoice:1
		};
	},
	computed: {},
	onLoad() {
		//获取音量
		// let volume = uni.getStorageSync('volumeInt');
		// if (volume == undefined || !volume) volume = 50;
		// this.volumeInt = volume
		// 
		
		//获取公告消息提示音
		let noticeVoiceNumber = uni.getStorageSync('noticeVoiceNumber');
		if (noticeVoiceNumber == undefined || !noticeVoiceNumber) {
			noticeVoiceNumber = 1;
		}
		this.currentNoticeVoice = noticeVoiceNumber
		//获取消息提示音
		let voiceNumber = uni.getStorageSync('voiceNumber');
		if (voiceNumber == undefined || !voiceNumber) {
			voiceNumber = 1;
		}
		
		this.currentVoice = voiceNumber;
		//获取震动
		let shake = uni.getStorageSync('shakeSwitch');
		if (shake == undefined|| shake==='yes' ) {
			shake = true;
		}else if(shake === 'no'){
			shake = false;
		}
		this.shakeCheck = shake;
		//获取声音
		let soundCheck = uni.getStorageSync('voiceSwitch');
		if (soundCheck == undefined|| soundCheck==='yes' ) {
			soundCheck = true;
		}else if(soundCheck === 'no'){
			soundCheck = false;
		}
		this.soundCheck = soundCheck;
	},
	methods: {
		...mapMutations(['SET_IS_PLAY_AUDIO']),
		messageShake() {
			uni.vibrateLong({
				success: function() {
					// console.log('success');
				}
			});
		},
		//震动
		shakeSwitch(e) {
			this.shake = e.detail.value;
			if(this.shake){
				uni.setStorageSync('shakeSwitch', 'yes');
				this.messageShake();
			}else{
				
				uni.setStorageSync('shakeSwitch', 'no');
				let shake12 = uni.getStorageSync('shakeSwitch');
				// console.log('关闭震动==============='+shake12)
			}
			this.shakeCheck = e.detail.value;
		},
		//公告消息提示音
		radioNoticeChange(e) {
			this.currentNoticeVoice = e.detail.value;
			uni.setStorageSync('noticeVoiceNumber', this.currentNoticeVoice);
			let audioData={
				type:'notice',
				value: true
			}
			this.SET_IS_PLAY_AUDIO(audioData);
		},
		//消息提示音
		radioChange(e) {
			
			this.currentVoice = e.detail.value;
			uni.setStorageSync('voiceNumber', this.currentVoice);
			let audioData={
				type:'message',
				value: true
			}
			this.SET_IS_PLAY_AUDIO(audioData);
		},
		soundChange(e){
			if(e.detail.value){
				uni.setStorageSync('voiceSwitch', 'yes');
				let audioData={
					type:'notice',
					value: true
				}
				this.SET_IS_PLAY_AUDIO(audioData);
			}else{
				uni.setStorageSync('voiceSwitch', 'no');
			}
			this.soundCheck = e.detail.value;
			
		}
	}
};
</script>

<style>
body {
	background: #f0eff4;
}

.setting-up {
	font-size: 28upx;
}

.voice-panel {
	display: inline-block;
	line-height: 30upx;
	padding-left: 17upx;
}

.column-panel {
	background: #ffffff;
	padding: 20upx;
	border-bottom: 1px solid #d8d8d8;
}

.right-arrow-top {
	width: 18upx;
	height: 18upx;
	border-top: 3upx solid #c0c4cc;
	border-right: 3upx solid #c0c4cc;
	transform: rotate(45deg);
	float: right;
	margin-top: 40upx;
	margin-right: 10upx;
}

.right-arrow {
	width: 18upx;
	height: 18upx;
	border-top: 3upx solid #c0c4cc;
	border-right: 3upx solid #c0c4cc;
	transform: rotate(45deg);
	float: right;
	margin-top: 10upx;
	margin-right: 10upx;
}

.volumeInt-label {
	/* float: right;
	display: inline-block;*/
	margin-right: 30upx;
	color: #8f8f94;
}
.message-voice-label {
	/* float: right;
	display: inline-block;*/
	/* margin-right: 30upx; */
	color: #8f8f94;
}
</style>
