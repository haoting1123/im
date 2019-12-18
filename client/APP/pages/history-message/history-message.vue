<template>
	<view class="page">
		<!-- <view class="mask1" v-show="showMask" @click="hide"></view> -->
		<!-- <view class="input-view">
			<uni-icon type="search" size="22" color="#666666"></uni-icon>
			<input confirm-type="search" class="input" v-model="searchKeyword" type="text" placeholder="搜索聊天记录" />
		</view> -->
		
		
		<!-- 搜索框 -->
		<view class="cu-bar bg-white search" >
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="搜索聊天记录" v-model="searchKeyword"></input>
			</view>
		</view>
		<view class="uni-list">
			<block v-for="(message, index) in historyMessageList" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-triplex-row">
						<view class="uni-triplex-left">
							<text class="uni-h4" style="font-size: 28upx; color:#333333;" v-if="message.channelType === 'G'">{{ message.senderId === userInfo.jid ? '我' : message.groupUserName }}</text>
							<text class="uni-h4" style="font-size: 28upx; color:#333333;" v-if="message.channelType === 'P'">{{ message.senderId === userInfo.jid ? '我' : channelName }}</text>
							<view class="uni-h5" style="width: 100%;word-break:break-all;">
								<view v-if="!message.fileType || message.fileType === 'undefined'">
									<rich-text :nodes="message.content"></rich-text>
								</view>
								<view v-else>
									<view class="message-image-panel" v-if="message.fileType === 'img'">
										<rich-text :nodes="message.content" style="height: 100px;"></rich-text>
									</view>
									<view class="message-voice-panel" v-else-if="message.fileType === 'aac'">[语音]</view>
									<view v-else-if="message.fileType === 'file'">
										[文件]:{{ message.fileInfo ? message.fileInfo.fileName: ''}}
									</view>
									<view v-else-if="message.fileType === 'vcard'">
										[个人名片]
									</view>
									<view v-else-if="message.fileType === 'position'">
										[位置共享]
									</view>
								</view>
							</view>
						</view>
						<view class="uni-triplex-right message-create-at">
							<text class="uni-h5">{{ message.createTime }}</text>
						</view>
					</view>
				</view>
			</block>
			<view class="load-more" v-if="hasMore" @tap="initFirstMessage(true)">点击加载更多</view>
		</view>
	</view>
</template>
<script>
import {uniBadge, uniIcon} from '@dcloudio/uni-ui'
import app from '../../common/common.js';
import { mapState, mapActions, mapMutations } from 'vuex';
var moment = require('../../common/moment.js');
export default {
	data() {
		return {
			messages: [],
			maxCreateAt: 0,
			channelId: null,
			channelName: null,
			currentUser: null,
			channelType: null,
			toUserId: null,
			hasMore: false,
			searchKeyword: ''
		};
	},
	onLoad(option) {
		this.currentUser = uni.getStorageSync('currentUser');
		this.channelId = option.channelId;
		this.channelName = option.channelDisplayName;
		this.channelType = option.channelType;
		this.initFirstMessage();
	},
	components: {
		uniIcon,
		uniBadge
	},
	computed: {
		...mapState({
			userInfo: state => state.home.userInfo,
			historyMessageList: state => state.message.historyMessageList,
			currentChannel: state => state.message.currentChannel,
			currentChannelId: state => state.message.currentChannelId,
			currentChannelMessage: state => state.socketStore.currentChannelMessage,
			hostUrl: state => state.globalConfig.hostUrl,
			activeGroup: state => state.group.activeGroup
		})
	},
			// onPullDownRefresh() {
	// 			this.maxCreateAt = 0;
	// 			this.initFirstMessage();
			// },
	watch: {
		searchKeyword(curval, oldval) {
			this.maxCreateAt = 0;
			this.CLEAR_HISTORY_MESSAGE_LIST();
			this.initFirstMessage();
		}
	},
	onUnload() {
		this.CLEAR_HISTORY_MESSAGE_LIST();
	},
	methods: {
		...mapMutations(['CLEAR_HISTORY_MESSAGE_LIST']),
		...mapActions(['getAllHistoryMessage']),
		initFirstMessage(isLoadMore) {
			let limit = 20;
			let data = {
				channelId: this.channelId,
				maxCreateAt: this.maxCreateAt,
				limit: limit,
				content: this.searchKeyword
			};
			this.getAllHistoryMessage(data).then(resp => {
				// console.log("请求成功")
				console.log(JSON.stringify(resp));
				if (resp && resp.length > 0) {
					if (resp.length == limit) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
					let resultData = resp;
					this.maxCreateAt = resultData[resultData.length -1].createTime;
					resultData.forEach(item => {
						item.content = item.content.replace(new RegExp('<br />', 'g'), '\n');
						item.createTime = this.getFriendlyTime(item.createTime);
						if (item.fileSize > 0) {
							item.filePath =
								this.hostUrl +
								'/messages/files?fileName=' +
								encodeURIComponent(item.fileName) +
								'&fullPath=' +
								encodeURIComponent(item.filePath + '/' + item.fileName) +
								'&mimetype=' +
								encodeURIComponent(item.fileMimeType);
							item.fileSize = this.bytesToSize(item.fileSize);
						}
						let lastMessage = item.content
                        if (item.fileType) {
                            if (item.fileType === 'file') {
                                item.fileInfo = JSON.parse(item.content)
                            } else if (item.fileType === 'aac') {
                                lastMessage = '[语音]'
                            } else if (item.fileType === 'position') {
                                lastMessage = '[位置共享]'
                            } else if (item.fileType === 'vcard') {
                                lastMessage = '[个人名片]'
                            }
                            item.content = lastMessage
                        }
						
						// 解析群组成员名称
						if(item.channelType === 'G' && item.user=='home' && this.activeGroup && this.activeGroup.members && this.activeGroup.members.length > 0){
							let member = this.activeGroup.members.find(item1 => {
								return item1.jid.split('@')[0] === item.senderId.replace('-APP','')
							})
							if(member){
								item.groupUserName = member.nickName
							}
						}
					});
				} else {
					this.hasMore = false;
				}
			});
		},
		getFriendlyTime(str) {
			let userTime = new Date(parseInt(str));
			if (userTime) {
				return moment(userTime).format('YYYY-MM-DD HH:mm:ss');
			}
			return '';
		},
		 bytesToSize(bytes) {
		    if (bytes === 0) return '-';
		    var k = 1024,
		        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		        i = Math.floor(Math.log(bytes) / Math.log(k));
		    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
		},
	}
};
</script>

<style>
.page {
	background: #efeff4;
	width: 100%;
}

.mask1 {
	position: fixed;
	z-index: 998;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.3);
}

.popup {
	position: absolute;
	z-index: 999;
	background-color: #ffffff;
	-webkit-box-shadow: 0 0 30upx rgba(0, 0, 0, 0.1);
	box-shadow: 0 0 30upx rgba(0, 0, 0, 0.1);
	border-radius: 8upx;
}

.popup::before {
	content: '';
	width: 20upx;
	height: 20upx;
	background-color: inherit;
	top: -4upx;
	/*向左侧外部延伸箭头box的一半宽度*/
	position: absolute;
	transform: rotate(45deg);
	/*旋转45度*/
	right: 20upx;
	/*箭头在数值方向上居中*/
	margin-top: -5upx;
	border-top: solid 1px rgba(0, 0, 0, 0.1);
	border-left: solid 1px rgba(0, 0, 0, 0.1);
}

.popup-top {
	top: 20upx;
	right: 10upx;
	width: 300upx;
	height: 200upx;
	text-align: center;
}

.popup-top text {
	line-height: 100upx;
	margin-left: 20upx;
	font-size: 32upx;
	color: #303133;
}

.title {
	padding: 20upx;
}

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
}

.input {
	flex: 1;
	padding: 0 5px;
	height: 40upx;
	line-height: 40upx;
	margin-top: 8upx;
}

.margin-search {
	margin-top: 85upx;
}

.message-image-panel {
	width: 100upx;
	/* height: 100upx; */
}

.message-image {
	width: 100%;
	height: 100%;
}

.message-create-at {
	display: inline-block;
	position: absolute;
	top: 30upx;
	right: 25upx;
	font-size: 23upx;
	color: #909399;
	width: 50%;
}

.margin-search {
	margin-top: 85upx;
}

.load-more {
	width: 100%;
	text-align: center;
	margin-top: 10upx;
	font-size: 25upx;
	color: #888888;
}
</style>
