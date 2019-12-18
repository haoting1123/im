<template>
	<view class="sys-setting">
		<!-- <view class="column-panel" @tap="toSecurity">
			安全设置
			<view class="right-arrow">&nbsp;</view>
		</view>
		<view class="column-panel" @tap="toMessage">
			<view class="right-arrow">&nbsp;</view>
		</view>
		<view class="column-panel" @tap="toSound">
			音频设置
			<view class="right-arrow">&nbsp;</view>
		</view> -->
		
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class=" text-blue margin-right-xs"></text> 震动</view>
				</view>
				<view class="action">
					<switch class="switch" @change="SwitchSex" :class="skin?'checked':''" :checked="skin?true:false"></switch>
				</view>
			</view>
			<uni-list >
				<uni-list-item title="修改密码" @click="toEditPassword(value)"></uni-list-item>
				<uni-list-item title="声音设置" @click="toSound(value)"></uni-list-item>
			</uni-list>
		</view>
		
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import app from '../../common/common.js';
import {uniList, uniListItem} from '@dcloudio/uni-ui'
export default {
	components: {
		uniList, uniListItem
	},
	data() {
		return {
			currentUser: {
				nickname: '',
				avatarUrl: ''
			},
			userState: null,
			currentVerion: '',
			onlineStatus: '离线',
			voiceCheck: true,
			shakeCheck: true,
			currentVoice: 1,
			skin:false,
		};
	},
	computed: {},
	onLoad() {
		this.currentVerion = app.appVersion;
		let voice = uni.getStorageSync('voiceSwitch');
		let shake = uni.getStorageSync('shakeSwitch');
		let voiceNumber = uni.getStorageSync('voiceNumber');
		if (voice == undefined) {
			voice = true;
		}
		if (shake == undefined) {
			shake = true;
		}
		if (voiceNumber == undefined || !voiceNumber) {
			voiceNumber = 1;
		}
		this.voiceCheck = voice;
		this.shakeCheck = shake;
		this.currentVoice = voiceNumber;
		console.log(this.currentVoice);
	},
	onShow() {},
	methods: {
		toEditPassword(){
			uni.navigateTo({
				url: './modify-password'
			});
		},
		
		toSecurity() {
			uni.navigateTo({
				url: './security-setting'
			});
		},
		toMessage() {
			uni.navigateTo({
				url: './message-setting'
			});
		},
		toSound() {
			uni.navigateTo({
				url: './sound-setting'
			});
		},
		toAbout() {
			uni.navigateTo({
				url: './about'
			});
		},
		radioChange(e) {
			uni.setStorageSync('voiceNumber', e.detail.value);
			this.currentVoice = e.detail.value;
		},
		voiceSwitch(e) {
			uni.setStorageSync('voiceSwitch', e.detail.value);
			console.log('switch1 发生 change 事件，携带值为' + e.detail.value);
			this.voiceCheck = e.detail.value;
		},
		shakeSwitch(e) {
			uni.setStorageSync('shakeSwitch', e.detail.value);
			this.shakeCheck = e.detail.value;
			console.log('switch2 发生 change 事件，携带值为' + e.detail.value);
		},
		toModifyPass() {
			uni.navigateTo({
				url: './modify-password'
			});
		},
		checkVersion() {
			uni.showLoading({
				title: '检查更新中...'
			});
			console.log('App Launch');
			/* 5+环境升级提示 */
			var server = this.$store.state.globalConfig.hostUrl + (plus.os.name === 'iOS' ? '/immc/rest/sc/ios/version' : '/immc/rest/sc/android/version');
			var req = {
				//升级检测数据
			};
			uni.request({
				url: server,
				data: req,
				success: res => {
					console.log(JSON.stringify(res));
					if (res && res.data && res.data.version) {
						if (res.data.version != app.appVersion) {
							var openUrl = encodeURI(res.data.updateUrl);
							uni.showModal({
								//提醒用户更新
								title: '更新提示',
								content: '是否选择更新到最新版本？',
								success: res => {
									if (res.confirm) {
										// console.log("点击了更新"+openUrl)
										plus.runtime.openURL(openUrl, function(error) {
											console.log(JSON.stringify(error));
										});
									}
								}
							});
						} else {
							uni.showToast({
								title: '已经是最新版本'
							});
						}
					}
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
				},
				fail: (data, code) => {
					console.log('fail' + JSON.stringify(data) + 'code=' + code);
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
				}
			});
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
