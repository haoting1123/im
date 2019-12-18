<template>
	<view class="page1">
		<view class="input-view">
			<uni-icon type="search" size="22" color="#666666"></uni-icon>
			<input confirm-type="search" @confirm="confirm" class="input" v-model="searchKeyword" type="text" placeholder="搜索" />
		</view>
		<view class="uni-list margin-search"> 
			<radio-group @change="checkboxChange">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in personList" :key="key">
					<view class="uni-media-list">
						<view>
							<radio class="checkbox-3" :value="value.member"></radio>
						</view>
						<view class="uni-media-list-logo" v-if="value.avatarUrl">
							<image :src="value.avatarUrl"></image>
						</view>
						<view class="uni-media-list-logo" v-else>
							<image v-if="value.sex=='男'" src="../../static/img/boy.png"></image>
							<image v-else src="../../static/img/girl.png"></image>
						</view>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{value.name}}</view>
							<view class="uni-media-list-text-bottom uni-ellipsis" v-if="value.organization">{{value.department}}</view>
						</view>
					</view>
				</view>
			</radio-group>
			<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
		</view>
	</view>
</template>
<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import loadMore from '../../components/load-more.vue'
	var app = require("../../common/common.js");

	var formatAvatarUrl = app.formatAvatarUrl;
	export default {
		data() {
			return {
				currentUser: null,
				personList: '',
				members: '',
				memberList: [],
				group: '',
				searchKeyword: '',
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				offsetNum: 0,
				channelId: '',
				channelType:'',
				containMember: [],
				addType: null,
			};
		},
		onLoad(option) {
			this.currentUser = uni.getStorageSync('currentUser');
			this.channelId = option.channelId;
			this.channelType = option.channelType;
			this.getList();
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;

			setTimeout(() => {
				var length = this.personList.length;
				this.getList(length);
			}, 800);

		},
		watch: {
			searchKeyword(curval, oldval) {
				this.searchChannel(curval);
			}
		},
		components: {
			uniIcon,
			loadMore
		},
		onPullDownRefresh() {
			this.offsetNum = 0;
			this.getList(this.offsetNum);
		},
		onNavigationBarButtonTap(e) {
			this.sendVisitingCard();
		},
		methods: {
			searchChannel(key) {
				if (!key.trim()) {
					this.getList();
					return;
				}
				var token = uni.getStorageSync('token');
				console.log(this.$store.state.globalConfig.hostUrl + '/users?name=' + key + '&limit=20&offset=0&groupCode=')
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/users?name=' + key + '&limit=20&offset=0&groupCode=',
					dataType: "json",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"Accept": "application/json, text/plain, */*",
						"X-Token": token,
					},
					success: (data) => {
						console.log("条件查询用户列表成功")
						console.log(JSON.stringify(data.statusCode));
						let resultData = data.data.rows;
						if (data.statusCode == 200) {
							let that = this;
							if (resultData) {
								resultData.forEach(function(item) {
									item.member = JSON.stringify(item);
									item.avatarUrl = formatAvatarUrl(that.$store.state.globalConfig.hostUrl, item.avatarUrl, item.id)
								})
							}

							this.personList = resultData;
							console.log(JSON.stringify(this.personList));
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);

					},
				})
			},
			checkboxChange: function(e) {
				this.members = e.detail.value;
			},
			sendVisitingCard() {
				if (!this.members) {
					return;
				}
				console.log(this.members)
				var token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/messages',
					method: 'POST',
					dataType: "json",
					header: {
						"Content-type": "application/json;charset=UTF-8",
						"X-Token": token,
					},
					data: {
						channelId: this.channelId,
						channelType: this.channelType,
						content: this.members,
						type:'friend_card'
					},
					success: (data) => {
						console.log("发送名片"+JSON.stringify(data))
						let resultData = data.data;
						resultData.action = "NEW_MESSAGE";
						this.$store.commit('setCurrentChannelMessage', resultData);
						uni.navigateBack({
							delta: 1
						}); 
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);
					},

				})
			},
			getList(offsetNum) {
				console.log("获取人员列表");
				console.log(this.$store.state.globalConfig.hostUrl + '/users');
				var token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/users?name=&limit=20&offset=' + offsetNum + '&groupCode=',
					dataType: "json",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"Accept": "application/json, text/plain, */*",
						"X-Token": token,
					},
					success: (data) => {
						uni.stopPullDownRefresh();
						console.log("获取用户列表成功")
						console.log(JSON.stringify(data))
						let resultData = data.data.rows;

						if (data.statusCode == 200) {
							let that = this;
							if (resultData) {
								resultData.forEach(function(item) {
									item.member = JSON.stringify(item);
									item.avatarUrl = formatAvatarUrl(that.$store.state.globalConfig.hostUrl, item.avatarUrl, item.id)
									item.disable = false;
								});
								if (this.personList.length != 0) {
									this.personList = [...this.personList, ...resultData];
									this.loadingType = 0;
								} else {
									this.personList = resultData;
								}
							} else {
								this.loadingType = 2;
							}

						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);
					},
				})
			},
		}
	};
</script>

<style>
	.margin-search {
		margin-top: 85upx;
	}

	/***checkbox****/
	.checkbox-flex {
		flex-direction: row;
		align-items: center;
	}

	.checkbox {
		width: 44px;
		height: 44px;
		display: inline-flex;
		position: relative;
	}

	.checkbox-3 {
		display: block;
		margin: 30upx 0;
	}

	.uni-btn {
		height: 90upx;
		right: 5upx;
	}

	.uni-checkbox {
		margin-top: 15upx;
	}

	.page1 {
		background: #ffffff;
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

	.product-list {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		flex-direction: row;
	}

	.product {
		padding: 20upx 20upx 20upx;
		display: inline;
		flex-direction: column;

	}

	.image-view {
		height: 84upx;
		width: 84upx;
	}

	.product-image {
		height: 33upx;
		width: 33upx;
	}

	.product-title {

		font-size: 32upx;
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.product-price {
		font-size: 28upx;
		position: relative;
	}

	.product-price-original {
		color: #e80080;
	}

	.product-price-favour {
		color: #888888;
		text-decoration: line-through;
		margin-left: 10upx;
	}

	.product-tip {
		position: absolute;
		right: 10upx;
		background-color: #ff3333;
		color: #ffffff;
		padding: 0 10upx;
		border-radius: 5upx;
	}
</style>
