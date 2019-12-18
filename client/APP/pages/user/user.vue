<template>
	<view class="setting-up">
		<view class="cu-list menu-avatar">
			<view class="cu-item" @tap="toUserInfo">
				<image class="cu-avatar lg" style="padding: 0; background-color: #FFFFFF;" v-if="userInfo.photo" :src="userInfo.photo"></image>
				<image class="cu-avatar lg" v-else style="padding: 0; background-color: #FFFFFF;" src="../../static/img/normal-avatar.png"></image>
				<view class="content">
					<view class="text-grey">{{userInfo.name}}</view>
					<view class="text-gray text-sm flex">
						<text class="text-cut">
							<text class="cuIcon-infofill text-green  margin-right-xs"></text>
							帐号：{{userInfo.account}}
						</text> </view>
				</view>
			</view>
		</view>
		
		<uni-list>
			<uni-list-item show-extra-icon="true"
				:extra-icon="{color: '#B7C0F4',size: '28',type: 'compose'}"  title="修改密码" @click="toEditPassword(value)"></uni-list-item>
			<uni-list-item show-extra-icon="true"
				:extra-icon="{color: '#B7C0F4',size: '26',type: 'settings'}" title="声音设置" @click="toSound(value)"></uni-list-item>
      <uni-list-item title="聊天设置"
				show-extra-icon="true"
				:extra-icon="{color: '#ACC6D4',size: '28',type: 'chat'}" @click="toAreaSetting">
			</uni-list-item>
			<uni-list-item title="服务号"
				show-extra-icon="true"
				:extra-icon="{color: '#B7C0F4',size: '26',type: 'pengyouquan'}" @click="toServNo">
			</uni-list-item>
			<uni-list-item title="小程序"
				show-extra-icon="true"
				:extra-icon="{color: '#8BDF4F',size: '28',type: 'navigate'}" @click="toMini">
			</uni-list-item>
			<uni-list-item title="公告"
				show-extra-icon="true"
				:extra-icon="{color: '#ACC6D4',size: '28',type: 'help'}" @click="toNotice">
			</uni-list-item>
			<uni-list-item title="关于"
				show-extra-icon="true"
				:extra-icon="{color: '#74AAF8',size: '28',type: 'info-filled'}" @click="toAbout">
			</uni-list-item>
		</uni-list>
		<view class="btn-row logout-btn"><button type="warn" @tap="bindLogout">退出登录</button></view>
		
		<!-- 系统公告 -->
		<!-- <view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view style="text-align: left; align-items: left; display: flex; padding-left: 30upx;">{{ systemNotice.title }}</view>
					<view class="action justify-end" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					{{systemNotice.content}}
				</view>
				<view class="cu-bar bg-white justify-end">
					<view style="font-size: 26upx; color: grey; padding-right: 20upx;">
						{{systemNotice.createTime}}
					</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import app from '../../common/common.js';
import setting from './setting.vue';
import {uniList, uniListItem} from '@dcloudio/uni-ui'
export default {
 	components: {
		setting,uniList, uniListItem
	},
	data() {
		return {
			currentUser: {
				nickname: '',
				avatarUrl: ''
			},
			modalName:''
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.home.userInfo,
			systemNotice: state => state.home.systemNotice,
		})
	},
	onShow() {
		this.refreshUserInfo();
	},
	methods: {
		...mapMutations(['logout']),
		...mapActions(['Logon']),
		toNotice(){
			uni.navigateTo({
				url: './sys-notice'
			});
		},
		hideModal(){
			this.modalName = ''
		},
		toEditPassword(){
			uni.navigateTo({
				url: './modify-password'
			});
		},
		toAbout(){
			uni.navigateTo({
				url: '../user/about'
			});
		},
		toSound() {
			uni.navigateTo({
				url: './sound-setting'
			});
		},
		toServNo() {
			uni.navigateTo({
				url: '../serviceno/serviceno-list'
			});
		},
    toAreaSetting(){
      uni.navigateTo({
				url: './area-setting'
			});
    },
		toMini() {
			uni.navigateTo({
				url: '../mini/miniprogram-list'
			});
		},
		toSetting() {
			uni.navigateTo({
				url: './setting'
			});
		},
		bindLogout() {
			// uni.setStorageSync('token', null);
			// uni.setStorageSync('currentUser', null);
			// uni.clearStorage();
			// this.logout();
			/**
			 * 如果需要强制登录跳转回登录页面
			 */
			uni.showModal({
				title: '提示',
				content: '确定退出登录吗?',
				success: (res) => {
					if (res.confirm) {
						this.Logon()
							.then(data => {
								uni.reLaunch({
									url: '../login/login'
								});
							})
							.catch(() => {})
					}
				}
			})
			// if (this.forcedLogin) {
			//   uni.reLaunch({
			//     url: '../login/login',
			//   });
			// }
			//TODO 清理缓存数据、断开Websocket
		},

		refreshUserInfo() {
			this.currentUser = uni.getStorageSync('currentUser');
			if (this.currentUser) {
				if (this.currentUser.avatarUrl != undefined && this.currentUser.avatarUrl != null)
					this.currentUser.avatarUrl = app.formatAvatarUrl(this.$store.state.globalConfig.hostUrl, this.currentUser.avatarUrl, this.currentUser.userId);
				console.log(JSON.stringify(this.currentUser));
				// 					if (this.currentUser.onlineStatus == 'online') {
				// 						this.onlineStatus = '在线';
				// 					} else {
				// 						this.onlineStatus = '离线';
				// 					}
			}
		},

		toUserInfo() {
			uni.navigateTo({
				url: './user-detail'
			});
		},
		// 			toModifyStatus() {
		// 				uni.showActionSheet({
		// 					itemList: ['在线', '离线'],
		// 					success: (e) => {
		// 						console.log(JSON.stringify(e))
		// 						if (e.tapIndex == 0) {
		// 							this.changeStatus('online');
		// 						} else if (e.tapIndex == 1) {
		// 							this.changeStatus('offline');
		// 						}
		// 					}
		// 				})
		// 			},
// 		changeStatus(status) {
// 			var token = uni.getStorageSync('token');
// 			uni.request({
// 				url: this.$store.state.globalConfig.hostUrl + '/users/' + this.currentUser.userId,
// 				method: 'POST',
// 				header: {
// 					'Content-type': 'application/json;charset=UTF-8',
// 					'X-Token': token
// 				},
// 				data: {
// 					onlineStatus: status
// 				},
// 				success: data => {
// 					console.log('请求成功');
// 					console.log(JSON.stringify(data));
// 					if (data && data.data.id) {
// 						this.currentUser.organization = data.data.organization;
// 						this.currentUser.nickname = data.data.nickname;
// 						this.currentUser.avatarUrl = data.data.avatarUrl;
// 						this.currentUser.department = data.data.department;
// 						this.currentUser.onlineStatus = data.data.onlineStatus;
// 						uni.setStorageSync('currentUser', this.currentUser);
// 						this.refreshUserInfo();
// 					}
// 				},
// 				fail: (data, code) => {
// 					console.log('fail' + JSON.stringify(data) + 'code=' + code);
// 				}
// 			});
// 		}
	}
};
</script>

<style lang="scss">
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}
	view {
		font-size: 28upx;
		line-height: inherit
	}

// .setting-up {
// 	font-size: 28upx;
// }

.person-info-panel {
	background: #ffffff;
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
	// margin-bottom: 10upx;
}

.person-info-panel .user-info .account {
	width: 500upx;
	font-size: 25upx;
	color: #9b9b9b;
}

.logout-btn {
	margin-top: 130upx;
	button {
		width: 500upx;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		border-radius: 40upx;
		color: #FFFFFF;
		background-color: #D92B04;
	}
}
</style>
