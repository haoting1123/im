<template>
	<view class="page">
		<!-- <view class="input-view">
			<uni-icon type="search" size="22" color="#666666"></uni-icon>
			<input confirm-type="search" @confirm="confirm" class="input" type="text" placeholder="搜索" />
		</view> -->
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in memberList" :key="key" @tap="getPeopleName(value)"
			 @longpress="showActionSheet(value)">
				<view class="uni-media-list">

					<view class="uni-media-list-logo" v-if="value.photo">
						<image :src="value.photo"></image>
					</view>
					<view class="uni-media-list-logo" v-else>
						<image src="../../static/img/normal-avatar.png"></image>
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{value.nickName}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{value.account}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'

	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			uniIcon,
		},
		data() {
			return {
				currentUser: null,
				memberList: [],
				channelId:''
			}
		},
		onLoad(option) {
			this.channelId=option.channelId;
			this.getGroupMembers(this.channelId)
		},
		computed: {
			...mapState({
				userInfo: state => state.home.userInfo,
				// groupList: state => state.group.groupList,
				activeGroup: state => state.group.activeGroup
			})
		},
		methods: {
			getPeopleName:function(item){
				uni.setStorageSync('nickValue',item.name);
				uni.navigateBack({delta:1});
			},
			getGroupMembers(sessionId) {
				if(this.activeGroup && this.activeGroup.members){
					this.memberList = this.activeGroup.members.filter(item => {
						return item.jid !== this.userInfo.jid
					})
				}else{
					this.memberList = []
				}
				if(this.debug){
					console.log(JSON.stringify(this.memberList))
				}
			}
			

		}
	}
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
