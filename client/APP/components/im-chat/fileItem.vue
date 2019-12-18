<template>
	<view>
		<view>
			<view class="message-file-icon">
				<image  style="width: 80px; height: 80px;" mode="scaleToFill" src="../../static/img/app-folder.png"></image>
			</view>
			<view class="message-file-content">
				<view @tap="toWebBrowserDownload(messageItem)">
					<view style="font-size: 27upx; overflow: hidden; height:40upx; margin-bottom: 5upx;" >{{(fileInfo ? fileInfo.fileName : '')}}</view>
					<text style="color: #909399; font-size: 25upx;" v-if="messageItem.user == 'customer'">{{(fileInfo ? fileInfo.fileSize : '')}}</text>
					<text style="color: #909399; font-size: 25upx;" v-if="messageItem.user == 'home'">{{(fileInfo ? fileInfo.fileSize : '')}}</text>
					<text style="color: #909399; font-size: 25upx; margin-left: 5upx;">{{downloaded ? '已下载' : '点击下载'}} </text>
				</view>
				<view class="progress-box" v-if="downloading">
					{{percent}}%
					<!-- <progress ref="downloadProcess" :percent="percent" color="#67C23A" active stroke-width="3" /> -->
					<icon class="progress-cancel" type="cancel" @tap.stop="cancelDownload"></icon>
				</view>
			</view>
		</view>
		<view class="file-secure-tip" v-if="messageItem.senderId === userInfo.jid">文件只会在服务器中存储七天</view>
		<view class="file-secure-tip" v-else>文件只会在服务器中存储七天,请及时下载保存</view>
	</view>
</template>

<script>
	import app from "../../common/common.js"
	import { mapState } from 'vuex';
	var music = null;
	var downloadTask = null;
	export default {
		data() {
			return {
				tempFilePath: '',
				downloading: false,
				downloaded: false,
				percent: 0,
				fileInfo: {},
				localFilePath:''
			}
		},
		onUnload: function() {
			this.end();
		},
		onLoad: function() {
			this.fileInfo = JSON.parse(this.messageItem.content)
			if(this.fileInfo.fileSize){
				this.fileInfo.fileSize = this.bytesToSize(this.fileInfo.fileSize)
			}
			// 判断文件是否下载过
			let userFileNameList = uni.getStorageSync("userFileNameList");
			if(userFileNameList){
				userFileNameList = JSON.parse(userFileNameList);
			}
			if(userFileNameList && userFileNameList.length > 0){
				let fileObj = userFileNameList.find(element => {
					return element.id === this.messageItem.id
				})
				if(fileObj){
					this.localFilePath = fileObj.path
					this.downloaded = true
				}else{
					this.downloaded = false
				}
			}else{
				this.downloaded = false
			}
		},
		computed: {
		    ...mapState({
		        userInfo: state => state.home.userInfo
		    })
		},
		props: ['messageItem'],
		methods: {
			toWebBrowserDownload(message) {
				if(this.downloading){
					return;
				}
				if (this.downloaded) {
					if(this.localFilePath){
						let path = this.localFilePath
						let lastIndex = path.lastIndexOf('.')
						let MIME_TYPE = path.substr(lastIndex + 1)
						switch (plus.os.name) {
							case "Android":
								let main = plus.android.runtimeMainActivity()
								path = plus.io.convertLocalFileSystemURL(path)
								plus.android.invoke('io.dcloud.UNID020879.voice.PageStartHelper', 'openFile',main , path, MIME_TYPE);
							break;
							case "iOS":
								uni.openDocument({
								  filePath: this.localFilePath,
								  success: function (res) {
									  console.log('打开文档' + JSON.stringify(res));
								  },
									fail: function (err) {
								  	uni.showModal({
											title: '打开失败!',
											content: JSON.stringify(err)
										})
									}
								});
							break;
						}
					}
					return;
				}
				if(message.senderId === this.userInfo.jid){
					return;
				}
				let fileInfo = JSON.parse(message.content)
				if (fileInfo.fileSize > 0) {
					this.downloading = true;
					downloadTask = uni.downloadFile({
						url: fileInfo.filePath,
						success: (res) => {
							if (res.statusCode === 200) {
								this.downloading = false;
								console.log('下载成功');
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (res1) => {
										this.downloaded = true;
										console.log(JSON.stringify(res1))
										let userFileNameList = uni.getStorageSync("userFileNameList");
										if(!userFileNameList){
											userFileNameList = [];
										}else{
											userFileNameList = JSON.parse(userFileNameList);
										}
										let fileName  = res.tempFilePath
										if(fileName){
											fileName = fileName.substring((fileName.lastIndexOf('/') + 1))
										}else{
											fileName = (fileInfo ? fileInfo.fileName : '')
										}
										let obj = {
											path: res1.savedFilePath,
											name: fileName,
											id: this.messageItem.id
										};
										this.localFilePath = res1.savedFilePath
										userFileNameList.push(obj);
										uni.setStorageSync("userFileNameList",JSON.stringify(userFileNameList));
// 										uni.openDocument({
// 											filePath: res1.savedFilePath,
// 											success: function(res2) {
// 												console.log('打开文档成功' + JSON.stringify(res2));
// 											}
// 										});
									}
								});
							}
							console.log(JSON.stringify(res))
						}
					});

					downloadTask.onProgressUpdate((res) => {
						// console.log(res.progress);
						this.percent = (res.progress);
						// console.log('已经下载的数据长度' + res.totalBytesWritten);
						// console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
					});
				}
			},
			bytesToSize(bytes) {
			    if (bytes === 0) return '-';
			    var k = 1024,
			        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			        i = Math.floor(Math.log(bytes) / Math.log(k));
			    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
			},
			cancelDownload() {
				if (downloadTask && this.downloading) {
					this.downloading = false;
					downloadTask.abort();
				}
			},
			end() {

			},

		}
	}
</script>

<style>
	progress {
		width: 100%;
	}

	.progress-box {
		display: flex;
		height: 50upx;
	}

	.progress-cancel {
		margin-left: 40upx;
		height: 50upx;
		margin-top: 8upx;
	}

	.file-secure-tip {
		font-size: 20upx;
		color:#F56C6C;
	}

	.message-file-icon{
		width: 80upx;
		height: 80upx;
		display: inline-block;
		margin-right: 20upx;
	}
	.message-file-content{
		width:300upx;
		height:100upx;
		display: inline-block;
	}
</style>
