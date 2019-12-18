<script>
import app from './common/common.js';
import Vue from 'vue'
import { mapMutations } from 'vuex';

export default {
	onLaunch: function() {
		console.log('App Launch');
		/* 5+环境锁定屏幕方向为竖屏 */
		plus.screen.lockOrientation('portrait-primary'); //锁定
		/* 5+环境升级提示 */
		//         	var server = this.$store.state.globalConfig.hostUrl + "/update"; //检查更新地址
		//         	var req = { //升级检测数据
		//         		"appid": plus.runtime.appid,
		//         		"version": plus.runtime.version,
		//         		"imei": plus.device.imei
		//         	};
		//         	uni.request({
		//         		url: server,
		//         		data: req,
		//         		success: (res) => {
		//         			console.log("success", res);
		//         			if (res.statusCode == 200 && res.data.isUpdate) {
		//         				let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
		//         				uni.showModal({ //提醒用户更新
		//         					title: '更新提示',
		//         					content: res.data.note ? res.data.note : '是否选择更新',
		//         					success: (res) => {
		//         						if (res.confirm) {
		//         							plus.runtime.openURL(openUrl);
		//         						}
		//         					}
		//         				})
		//         			}
		//         		}
		//         	})
		uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
	},
	onShow: function() {

	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {}
};
</script>

<style>

/*每个页面公共css */
/* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
/* 这是页面的公用css */
@import './colorui/main.css';
@import './colorui/icon.css';
@import './common/uni.css';
@import './common/icon.css';

body{
	background-color: #ffffff;
}
page {
	background-color: #ffffff;
	height: 100%;
	font-size: 32upx;
	line-height: 1.6;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}


checkbox,
radio {
	margin-right: 10upx;
}

button {
	margin-top: 20upx;
	margin-bottom: 20upx;
}

form {
	width: 100%;
}

/* page */

.container {
	display: flex;
	flex-direction: column;
	min-height: 100%;
	justify-content: space-between;
	font-size: 32upx;
	font-family: -apple-system-font, Helvetica Neue, Helvetica, sans-serif;
}

.page-head {
	padding: 60upx 50upx 80upx;
	text-align: center;
	line-height: initial;
	height: 60upx;
}

.page-head-title {
	display: inline-block;
	padding: 0 40upx;
	font-size: 30upx;
	height: 60upx;
	line-height: 60upx;
	color: #bebebe;
	box-sizing: border-box;
	border-bottom: 2upx solid #d8d8d8;
}

.page-head-desc {
	padding-top: 20upx;
	color: #9b9b9b;
	font-size: 32upx;
}

.page-body {
	width: 100%;
	flex-grow: 1;
	overflow-x: hidden;
}

.page-body-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.page-body-wording {
	text-align: center;
	padding: 200upx 100upx;
}

.page-body-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #fff;
	width: 100%;
	padding: 50upx 0 150upx 0;
}

.page-body-title {
	margin-bottom: 100upx;
	font-size: 32upx;
}

.page-body-text {
	font-size: 30upx;
	line-height: 52upx;
	color: #ccc;
}

.page-body-text-small {
	font-size: 24upx;
	color: #000;
	margin-bottom: 100upx;
}

.page-foot {
	margin: 100upx 0 30upx 0;
	text-align: center;
	color: #1aad19;
	font-size: 0;
}

.icon-foot {
	width: 152upx;
	height: 23upx;
}

.page-section {
	width: 100%;
	margin-bottom: 60upx;
}

.page-section_center {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.page-section:last-child {
	margin-bottom: 0;
}

.page-section-gap {
	box-sizing: border-box;
	padding: 0 30upx;
}

.page-section-spacing {
	box-sizing: border-box;
	padding: 0 80upx;
}

.page-section-title {
	font-size: 28upx;
	color: #999999;
	margin-top: 10upx;
	margin-bottom: 10upx;
	padding-left: 30upx;
	padding-right: 30upx;
}

.page-section-gap .page-section-title {
	padding-left: 0;
	padding-right: 0;
}

/* example */

.index-hd {
	padding: 90upx;
	text-align: center;
}

.index-logo {
	width: 140upx;
	height: 140upx;
}

.btn-area {
	margin-top: 60upx;
	box-sizing: border-box;
	width: 100%;
	padding: 0 30upx;
}

.image-plus {
	width: 150upx;
	height: 150upx;
	border: 2upx solid #d9d9d9;
	position: relative;
}

.image-plus-nb {
	border: 0;
}

.image-plus-text {
	color: #888888;
	font-size: 28upx;
}

.image-plus-horizontal {
	position: absolute;
	top: 50%;
	left: 50%;
	background-color: #d9d9d9;
	width: 4upx;
	height: 80upx;
	transform: translate(-50%, -50%);
	-webkit-transform: translate(-50%, -50%);
}

.image-plus-vertical {
	position: absolute;
	top: 50%;
	left: 50%;
	background-color: #d9d9d9;
	width: 80upx;
	height: 4upx;
	transform: translate(-50%, -50%);
	-webkit-transform: translate(-50%, -50%);
}

.color1 {
	background-color: #1aad19;
	color: #ffffff;
}

.color2 {
	background-color: #2782d7;
	color: #ffffff;
}

.color3 {
	background-color: #f1f1f1;
	color: #353535;
}

.circle-logo {
}

.circle-logo image {
	border-radius: 50%;
}


/* color-ui */

</style>
