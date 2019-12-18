<template>
	<view class="page">
		<!-- <view class="input-view">
			<uni-icon type="search" size="22" color="#666666"></uni-icon>
			<input confirm-type="search" @confirm="confirm" class="input" type="text" placeholder="搜索" />
		</view> -->
		<view class="uni-list margin-search">
			<radio-group @change="radioChange">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value, key) in fileList" :key="key">
					<view class="uni-media-list">
						<view><radio :value="value.fileStr" /></view>
						<view class="uni-media-list-logo"><image src="../../static/img/file.png"></image></view>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top" style="font-size: 30upx;">{{ value.fileName }}</view>
							<view class="uni-media-list-text-top" style="font-size: 30upx; color: #888888;">{{ value.sizeStr }}</view>
						</view>

						<view @tap="removeFile(value.filePath)">
							<image style="width: 40upx; height: 40upx; margin-top: 20upx;" src="../../static/img/delete-icon.png"></image>
						</view>
					</view>
				</view>
			</radio-group>
		</view>
	</view>
</template>

<script>
import service from '../../service.js';
import { uniIcon } from '@dcloudio/uni-ui';

import { mapState, mapActions, mapMutations } from 'vuex';
var app = require('../../common/common.js');
var formatAvatarUrl = app.formatAvatarUrl;
export default {
	components: {
		uniIcon
	},
	data() {
		return {
			currentUser: null,
			fileList: [],
			selectFilePath: '',
			selectFileSize: 0,
			selectFileName: ''
		};
	},
	onLoad() {
		this.currentUser = uni.getStorageSync('currentUser');
		this.getList();
	},
	onNavigationBarButtonTap(e) {
		this.sendFileMessage();
	},
	computed: {
		...mapState({
			userInfo: state => state.home.userInfo,
			currentChannelId: state => state.message.currentChannelId,
			hostUrl: state => state.globalConfig.hostUrl
		})
	},
	methods: {
		...mapMutations(['setCurrentChannelMessage']),
		...mapActions(['getRemoteAreaInfo']),
		radioChange(e) {
			let item = JSON.parse(e.detail.value);
			this.selectFilePath = item.filePath;
			this.selectFileSize = item.size;
			this.selectFileName = item.fileName;
			console.log(item);
		},
		getList() {
			let userFileNameList = uni.getStorageSync('userFileNameList');
			if (!userFileNameList) {
				userFileNameList = [];
			} else {
				userFileNameList = JSON.parse(userFileNameList);
			}
			console.log('获取文件列表userFileNameMap' + JSON.stringify(userFileNameList));
			let that = this;
			uni.getSavedFileList({
				success: function(res) {
					let fileTempList = res.fileList;
					console.log('获取文件列表' + JSON.stringify(fileTempList));
					fileTempList.forEach(function(item) {
						let index = userFileNameList.findIndex(item1 => item1.path == item.filePath);
						if (index > -1) {
							item.fileName = userFileNameList[index].name;
						}
						item.fileStr = JSON.stringify(item);
						item.sizeStr = that.bytesToSize(item.size);
					});
					that.fileList = fileTempList;
				}
			});
		},
		async checkServerArea() {
			// 获取占用大小
			let remoteAreaInfo = await this.getRemoteAreaInfo(this.userInfo.account);
			let remoteFileAreaInfo = remoteAreaInfo.storageFileUpSize;
			// 服务器文件大小
			let remoteTotalFileArea = uni.getStorageSync('global_file_remote_area');
			let returnVal = false;
			if (remoteTotalFileArea) {
				if (remoteFileAreaInfo > parseInt(remoteTotalFileArea)) {
					uni.showModal({
						title: '提示',
						content: '您在服务器端的文件空间不足，请您在设置中手动清除文件记录再发送文件',
						showCancel:false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return await new Promise((resolve, reject) => {
						resolve(true);
					});
				} else {
					// return false;
					return await new Promise((resolve, reject) => {
						resolve(false);
					});
				}
			} else {
				// return false;
				return await new Promise((resolve, reject) => {
					resolve(false);
				});
			}
		},
		sendFileMessage() {
			// console.log(this.selectFileName)
			console.log('检测文件存储大小');
			this.checkServerArea().then(response => {
				console.log('检测结果===================' + response);
				if (response) {
					return;
				} else {
					uni.showLoading({
						title: '发送中...'
					});
					uni.uploadFile({
						url: this.hostUrl + '/syntoim/rest/file/upload',
						header: {},
						formData: {
							channelId: this.currentChannelId,
							imageWidth: 0,
							imageHeight: 0,
							size: this.selectFileSize,
							targetFileName: this.selectFileName
						},
						name: 'file',
						filePath: this.selectFilePath,
						success: res => {
							console.log(res.data);
							let resultData = JSON.parse(res.data);
							resultData.action = 'file';
							resultData.fileName = this.selectFileName;
							this.setCurrentChannelMessage(resultData);
							uni.navigateBack({
								delta: 1
							});
						},
						fail: err => {
							console.log(JSON.stringify(err));
						},
						complete: () => {
							console.log('complate');
							setTimeout(function() {
								uni.hideLoading();
							}, 300);
						}
					});
				}
			});
		},
		removeFile(filePath) {
			let that = this;
			uni.removeSavedFile({
				filePath: filePath,
				complete: function(res) {
					that.getList();
				}
			});
			let userFileNameList = uni.getStorageSync('userFileNameList');
			if (userFileNameList) {
				userFileNameList = JSON.parse(userFileNameList);
				let index = userFileNameList.findIndex(item1 => item1.path == filePath);
				if (index > -1) {
					userFileNameList.splice(index, 1);
				}
			}
		},
		bytesToSize(bytes) {
			if (bytes === 0) return '-';
			var k = 1024,
				sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
				i = Math.floor(Math.log(bytes) / Math.log(k));
			return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
		}
	}
};
</script>

<style>
.input-view {
	position: absolute;
	width: 715upx;
	top: 35upx;
	transform: translateY(-50%);
	align-items: center;
	display: flex;
	background-color: #e7e7e7;
	height: 60upx;
	border-radius: 15px;
	padding: 0 10upx;
	margin: 10upx;
	display: none;
}

.input {
	flex: 1;
	padding: 0 5px;
	height: 40upx;
	line-height: 40upx;
	margin-top: 8upx;
}

.margin-search {
	/* margin-top: 85upx; */
}

.head {
	padding: 0 20upx;
	margin-top: 20upx;
	height: 100upx;
}

.content {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 300upx;
	text-align: center;
}
</style>
