<template>
	<view>
		<view class="column-panel" @tap="toPassword">
			修改密码
			<view class="right-arrow">&nbsp;</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import app from '../../common/common.js';

export default {
	data() {
		return {		
		};
	},
	methods: {
		toPassword() {
			uni.navigateTo({
				url: './modify-password'
			});
		},
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
