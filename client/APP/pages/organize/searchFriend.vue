<template>
	<view class="page1">
		<!-- 搜索框 -->
		<view class="cu-bar bg-white search" :style="[{top:0 + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="查找联系人" focus @confirm="confirm" v-model="searchKeyword" confirm-type="search"></input>
			</view>
		</view>
		<view class="uni-list margin-search">
			<checkbox-group @change="checkboxChange">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in personList" :key="key" >
					<view class="uni-media-list" @tap="clickData(value)">
						<view class="uni-media-list-logo" v-if="value.photo">
							<image :src="value.photo"></image>
						</view>
						<view class="uni-media-list-logo" v-else>
							<image  src="../../static/img/normal-avatar.png"></image>
						</view>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{value.name}}</view>
							<view class="uni-media-list-text-bottom uni-ellipsis" v-if="value.groupName">{{value.groupName}}</view>
						</view>
					</view>
				</view>
			</checkbox-group>
			<!--<load-more :loadingType="loadingType" :contentText="contentText"></load-more>-->
		</view>
	</view>
</template>
<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import loadMore from '../../components/load-more.vue'
	import { mapState, mapActions,mapMutations } from 'vuex'
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
					contentdown: "下拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				offsetNum: 0,
			};
		},
		computed:{
			...mapState(
				{
					userInfo: state => state.home.userInfo,
					xmppDomain: state => state.home.xmppDomain
				}
			),
		},
		onLoad() {
			// this.currentUser = uni.getStorageSync('currentUser');
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;

			// setTimeout(() => {
			// 	var length = this.personList.length;
			// 	this.getList(length);
			// }, 800);

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

		},
		onNavigationBarButtonTap(e) {
			// this.createGroup();
		},
		methods: {
			...mapMutations([
				'SET_ACTIVE_MEMBER'
			]),
			...mapActions(['SearchTreeMember','GetUserByName','GetGroupInfo']),

			//点击人员跳转到好友信息页
			clickData(user) {
				this.SET_ACTIVE_MEMBER({
					...user,
					jid: `${user.username}${this.xmppDomain}`,
					account: user.username
				})
				//跳转个人信息
				uni.navigateTo({
					url: "../friends/friend-info?type=personList"
				})
			},
			searchChannel(key) {
				if (!key.trim()) {
					this.personList= [];
					return;
				}
				var token = uni.getStorageSync('token');
				let data = {
					key: key,
					groupRootCode:this.userInfo.groupRootCode
				}
				this.SearchTreeMember(data).then(response => {
					this.personList = response;
				}).catch(error => { console.log(error)} )
			},
			checkboxChange: function(e) {
				this.members = e.detail.value;
			},
		}
	};
</script>

<style>
	.margin-search {
		/* margin-top: 85upx; */
	}

	/***checkbox****/
	.checkbox-flex {
		flex-direction: row;
		align-items: center;
	}

	.uni-btn {
		height: 90upx;
		right: 5upx;
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
