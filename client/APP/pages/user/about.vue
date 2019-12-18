<template>
	<view class="setting-up">
		<view><image src="../../static/img/icon.png" style="width: 150upx; height: 150upx;"></image></view>
		<view>
			<view>v{{ currentVerion }}</view>
		</view>
		
		<button class="cu-btn bg-grey" style="margin-top: 20upx;" @tap="checkVersion">检查更新</button>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import app from '../../common/common.js';

export default {
	data() {
		return {
			currentVerion: ''
		};
	},
	computed: {},
	onLoad() {
		this.currentVerion = app.appVersion;
	},
	methods: {
		...mapActions(['GetVersionInfo']),
		checkVersion() {
			uni.showLoading({
				title: '检查更新中...'
			});
			console.log('App Launch');
			let sysType = 'android';
			this.GetVersionInfo(sysType).then( res => {
				console.log('检查系统版本=================='+JSON.stringify(res));
				if (res.version && res.version != app.appVersion) {
					uni.hideLoading();
					var openUrl = encodeURI(res.updateUrl);
					uni.showModal({
						//提醒用户更新
						title: '更新提示',
						content: '检测到有新版本，是否立即更新？',
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
					uni.hideLoading();
					uni.showToast({
						title: '已经是最新版本'
					});
					
				}
			}).catch(error => {
				uni.hideLoading();
			})
			
			
			/* 5+环境升级提示 */
			// var server = this.$store.state.globalConfig.hostUrl + (plus.os.name === 'iOS' ? '/immc/rest/sc/ios/version' : '/immc/rest/sc/android/version');
			// var req = {
			// 	//升级检测数据
			// };
			// uni.request({
			// 	url: server,
			// 	data: req,
			// 	success: res => {
			// 		console.log(JSON.stringify(res));
			// 		if (res && res.data && res.data.version) {
			// 			if (res.data.version != app.appVersion) {
			// 				var openUrl = encodeURI(res.data.updateUrl);
			// 				uni.showModal({
			// 					//提醒用户更新
			// 					title: '更新提示',
			// 					content: '是否选择更新到最新版本？',
			// 					success: res => {
			// 						if (res.confirm) {
			// 							// console.log("点击了更新"+openUrl)
			// 							plus.runtime.openURL(openUrl, function(error) {
			// 								console.log(JSON.stringify(error));
			// 							});
			// 						}
			// 					}
			// 				});
			// 			} else {
			// 				uni.showToast({
			// 					title: '已经是最新版本'
			// 				});
			// 			}
			// 		}
			// 		setTimeout(function() {
			// 			uni.hideLoading();
			// 		}, 500);
			// 	},
			// 	fail: (data, code) => {
			// 		console.log('fail' + JSON.stringify(data) + 'code=' + code);
			// 		setTimeout(function() {
			// 			uni.hideLoading();
			// 		}, 500);
			// 	}
			// });
		}
	}
};
</script>

<style scoped>
page {
	background: #ffffff;
	text-align: center;
}
.setting-up {
	font-size: 28upx;
	padding-top: 170upx;
	text-align: center;
	
}
</style>
