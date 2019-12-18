<template>
	<view class="page1">
		<view class="uni-list">
			<checkbox-group @change="checkboxChange">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in personList" :key="key">
					<view class="uni-media-list">
						<view class="uni-media-list-logo" v-if="value.avatarUrl">
							<image :src="value.avatarUrl"></image>
						</view>
						<view class="uni-media-list-logo" v-else>
							<image v-if="value.sex=='男'" src="../../static/img/boy.png"></image>
							<image v-else src="../../static/img/girl.png"></image>
						</view>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{value.nickname}}</view>
							<view class="uni-media-list-text-bottom uni-ellipsis">{{value.name}}</view>
						</view>
						<view @tap="delMember(value)" v-if="!value.admin">
							<image style="width: 40upx; height: 40upx; margin-top: 20upx;" src="../../static/img/delete-icon.png"></image>
						</view>
					</view>
				</view>
			</checkbox-group>
		</view>
	</view>
</template>
<script>
	import {uniIcon} from '@dcloudio/uni-ui'
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
				containMember: [],
			};
		},
		onLoad(option) {
			this.channelId = option.channelId;
			this.currentUser = uni.getStorageSync('currentUser');
			this.getGroupMembers();

		},
		components: {
			uniIcon,
		},
		onPullDownRefresh() {
			this.getGroupMembers();
		},
		methods: {
			getGroupMembers() {
				let token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/channels/' + this.channelId + '/members',
					dataType: "json",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Token": token,
					},
					data: {
						username: "",
						limit: 999,
						offset: 0
					},
					success: (data) => {
						console.log(JSON.stringify(data)) 
						if (data.data && data.data.rows) {
							let resultData = data.data.rows;
							let that = this;
							resultData.forEach(function(item) {
								item.avatarUrl = formatAvatarUrl(that.$store.state.globalConfig.hostUrl, item.avatarUrl, item.id)
							});
							
							this.personList = resultData;
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);
					},
				})
			},
			delMember(item) {

				var token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/channels/' + this.channelId + '/members/' + item.id,
					dataType: "json",
					method: "DELETE",
					header: {
						"content-type": "application/json;charset=UTF-8",
						"Accept": "application/json, text/plain, */*",
						"X-Token": token,
					},
					success: (data) => {
						console.log(JSON.stringify(data))
						this.getGroupMembers();
						console.log("移除成员成功")
						console.log(data.statusCode);
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
