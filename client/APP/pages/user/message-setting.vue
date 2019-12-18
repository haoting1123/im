<template>
	<view>
		<view style="padding: 25upx 15upx 10upx 25upx; color: #606266;">即时消息通知</view>
		<view class="column-panel">
			<view class="voice-panel">声音</view>
			<view class="message-tip-label"><switch :checked="voiceCheck" @change="voiceSwitch" /></view>
		</view>
		<view class="column-panel">
			<view class="voice-panel">震动</view>
			<view class="message-tip-label"><switch :checked="shakeCheck" @change="shakeSwitch" /></view>
		</view>

		<view style="padding: 25upx 15upx 10upx 25upx; color: #606266;">系统消息通知</view>
		<view class="column-panel">
			<view class="voice-panel">声音</view>
			<view class="message-tip-label"><switch :checked="sysVoiceCheck" @change="sysVoiceSwitch" /></view>
		</view>
		<view class="column-panel">
			<view class="voice-panel">震动</view>
			<view class="message-tip-label"><switch :checked="sysShakeCheck" @change="sysShakeSwitch" /></view>
		</view>
		
		<view style="padding: 25upx 15upx 10upx 25upx; color: #606266;">系统启动登录设置</view>
		<view class="column-panel">
			<view class="voice-panel">自动登录</view>
			<view class="message-tip-label"><switch :checked="isAutoLogin" @change="autoLoginSwitch" /></view>
		</view>
		
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import app from '../../common/common.js';

export default {
	data() {
		return {
			isAutoLogin:false,
			voiceCheck: true,
			shakeCheck: true,
			sysVoiceCheck: true,
			sysShakeCheck: true
		};
	},
	onLoad() {
		let autoLogin = uni.getStorageSync('isAutoLogin');
		let voice = uni.getStorageSync('voiceSwitch');
		let shake = uni.getStorageSync('shakeSwitch');
		let sysVoice = uni.getStorageSync('sysVoiceSwitch');
		let sysShake = uni.getStorageSync('sysShakeSwitch');
		
		if(autoLogin == undefined)
			autoLogin = false;
		if (!voice || voice === 'yes') {
			voice = true;
		}else{
			voice = false;
		}
		if (!shake || shake === 'yes') {
			shake = true;
		}else{
			shake = false;
		}
		if (sysVoice == undefined) {
			sysVoice = true;
		}
		if (sysShake == undefined) {
			sysShake = true;
		}

		this.isAutoLogin = autoLogin;
		this.voiceCheck = voice;
		this.shakeCheck = shake;
		this.sysVoiceCheck = sysVoice;
		this.sysShakeCheck = sysShake;
	},
	methods: {
		autoLoginSwitch(e){
			uni.setStorageSync('isAutoLogin', e.detail.value);
			console.log('switch1 发生 change 事件，携带值为' + e.detail.value);
			this.isAutoLogin = e.detail.value;
		},
		voiceSwitch(e) {
			
			console.log('switch1 发生 change 事件，携带值为' + e.detail.value);
			this.voiceCheck = e.detail.value;
			if(e.detail.value){
				uni.setStorageSync('voiceSwitch', 'yes');
			}else{
				uni.setStorageSync('voiceSwitch', 'no');
			}
		},
		shakeSwitch(e) {
			this.shakeCheck = e.detail.value;
			console.log('switch2 发生 change 事件，携带值为' + e.detail.value);
			if(e.detail.value){
				uni.setStorageSync('shakeSwitch', 'yes');
			}else{
				uni.setStorageSync('shakeSwitch', 'no');
			}
		},
		sysVoiceSwitch(e) {
			uni.setStorageSync('sysVoiceSwitch', e.detail.value);
			console.log('switch1 发生 change 事件，携带值为' + e.detail.value);
			this.sysVoiceSwitch = e.detail.value;
		},
		sysShakeSwitch(e) {
			uni.setStorageSync('sysShakeSwitch', e.detail.value);
			this.sysShakeSwitch = e.detail.value;
			console.log('switch2 发生 change 事件，携带值为' + e.detail.value);
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
}

.person-info-panel {
	background: #ffffff;
	padding: 20upx;
	margin-top: 40upx;
	border-top: 1px solid #d8d8d8;
	border-bottom: 1px solid #d8d8d8;
}

.person-info-panel .image-panel {
	display: inline-block;
	width: 90upx;
	height: 90upx;
}

.person-info-panel .image-panel image {
	width: 90upx;
	height: 90upx;
	display: inline-block;
}

.person-info-panel .user-info {
	width: 500upx;
	height: 40upx;
	display: inline-block;
	margin-left: 30upx;
}

.person-info-panel .user-info .user-name {
	width: 500upx;
	margin-bottom: 10upx;
}

.person-info-panel .user-info .account {
	width: 500upx;
	font-size: 25upx;
	color: #9b9b9b;
}

.column-panel {
	background: #ffffff;
	padding: 20upx;
	border-bottom: 1px solid #d8d8d8;
}

.logout-btn {
	margin-top: 100upx;
	width: 700upx;
	margin-left: 25upx;
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

.version-label {
	float: right;
	display: inline-block;
	width: 80upx;
	color: #8f8f94;
}

.message-tip-label {
	float: right;
	display: inline-block;
	width: 70upx;
	margin-right: 30upx;
	color: #8f8f94;
	margin-top: -10upx;
}

.message-voice-label {
	float: right;
	display: inline-block;
	margin-right: 30upx;
	color: #8f8f94;
}
</style>
