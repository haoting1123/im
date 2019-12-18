<template>
	<view>
		<!-- <view style="padding: 25upx 15upx 10upx 25upx; color: #606266;">音频设置</view> -->
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-blue margin-right-xs"></text>
						服务器端聊天记录占用大小
					</view>
				</view>
			</view>
            <view class="cu-item">
				<view class="action" style="margin-left: 80upx;">
                    {{ useMessageArea }} 条 / {{ totalMessageArea }} 万条
                    <button type="warn" @tap="onDelRemoteMessage" size="mini"  style="position: absolute; right: 40upx; top:0;">清空</button>
                </view>
			</view>
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-blue margin-right-xs"></text>
						服务器端文件空间占用大小
					</view>
				</view>
			</view>
            <view class="cu-item">
				<view class="action" style="margin-left: 80upx;">
                   {{ useFileArea }} / {{ totalFileArea }}
                   <button type="warn" @tap="onDelRemoteFile" size="mini" style="position: absolute; right: 40upx; top:0;">清空</button>
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
            totalFileArea: '0MB',
            totalMessageArea: '0',
            useFileArea: '0MB',
            useMessageArea: '0',
		};
	},
	computed: {
        ...mapState({
          userInfo: state => state.home.userInfo,
          remoteUseArea: state => state.message.remoteUseArea // 服务端文件占用情况
        })
    },
	onLoad() {
		this.initGetRemoteAreaInfo()
	},
	methods: {
		...mapActions([
          'getRemoteAreaInfo',
          'resetRemoteMessageArea',
          'resetRemoteFileArea'
        ]),
		// 获取远端服务端的占用情况
        initGetRemoteAreaInfo () {
          this.getRemoteAreaInfo(this.userInfo.account).then(() => {
            let remoteAreaInfo = this.remoteUseArea
            let remoteMessageCount = (remoteAreaInfo.storageMsgCount ? remoteAreaInfo.storageMsgCount : 0)
            let remoteFileAreaInfo = (remoteAreaInfo.storageFileUpSize ? remoteAreaInfo.storageFileUpSize : 0)
            let remoteMessageUnit = uni.getStorageSync('global_remote_area_unit')
            if (!remoteMessageUnit) {
              remoteMessageUnit = 10000
            }
            let remoteTotalFileArea = uni.getStorageSync('global_file_remote_area')
            if (remoteTotalFileArea) {
              this.totalFileArea = remoteTotalFileArea + 'MB'
            } else {
              this.totalFileArea = '0MB'
              remoteTotalFileArea = 0
            }
            let remoteTotalMessageArea = uni.getStorageSync('global_message_remote_area')
            if (remoteTotalMessageArea) {
              this.totalMessageArea = remoteTotalMessageArea
            } else {
              this.totalMessageArea = '0'
              remoteTotalMessageArea = 0
            }
            let useMessageAreaTemp = remoteMessageCount
            if (remoteTotalMessageArea && useMessageAreaTemp && useMessageAreaTemp > (remoteTotalMessageArea * remoteMessageUnit)) {
              useMessageAreaTemp = (remoteTotalMessageArea * remoteMessageUnit)
            }
            if (remoteTotalFileArea && remoteFileAreaInfo > remoteTotalFileArea) {
              remoteFileAreaInfo = remoteTotalFileArea
            }
            this.useMessageArea = useMessageAreaTemp
            this.useFileArea = remoteFileAreaInfo + 'MB'
          })
        },
        // 删除远端消息记录
        onDelRemoteMessage () {
			let that = this
          uni.showModal({
                title: '提示',
                content: '此操作将从服务器永久删除消息记录, 是否继续?',
                success: function (res) {
                    if (res.confirm) {
                       that.resetRemoteMessageArea(that.userInfo.account).then(data => {
                          that.useMessageArea = '0'
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        },
        // 删除远端文件记录
        onDelRemoteFile () {
			let that = this
            uni.showModal({
                title: '提示',
                content: '此操作将从服务器永久删除文件记录, 是否继续?',
                success: function (res) {
                    if (res.confirm) {
                        that.resetRemoteFileArea(that.userInfo.account).then(data => {
                          that.useFileArea = '0MB'
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
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
