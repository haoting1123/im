<template>
	<view class="page">

		<view class="mask1" v-show="showMask" @click="hide"></view>
	<!-- 	<view class="input-view">
			<uni-icon type="search" size="22" color="#666666"></uni-icon>
			<input confirm-type="search" class="input" v-model="searchKeyword" type="text" placeholder="搜索" />
		</view> -->
		<!-- 搜索框 -->
		<view class="cu-bar bg-white search" :style="[{top:0 + 'px'}]">
			<view class="search-form round" style="">
				<text class="cuIcon-search"></text>
				<input type="text" confirm-type="search" focus="true" placeholder="搜索" v-model="searchKeyword"></input>
			</view>
			<text style="margin-right:30upx; color:#409EFF;" @tap="goBack">取消</text>
		</view>
		<view class="infoAll" style="background: #F0EFF4;">
			
			<view class="uni-list-cell my-uni-ul"  hover-class="uni-list-cell-hover" v-for="(value, index) in sessionList" :key="index" @tap="goDetail(value)">
				<view
					class="uni-media-list my-uni-li"
					v-bind:class="{ 'my-uni-li-show': value.type, 'my-uni-li-hide': !value.type }"
				>
				<!-- circle-logo -->
					<view v-if="value.channelType == 'P'">
						<view class="uni-media-list-logo " v-if="value.headUrl"><image :src="value.headUrl"></image></view>
						<view class="uni-media-list-logo" v-else>
							<image src="../../static/img/normal-avatar.png"></image>
						</view>
					</view>
					<view v-if="value.channelType == 'G'">
						<view class="uni-media-list-logo"><image src="../../static/img/qun.png"></image></view>
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{ value.alias ? value.alias :value.name }}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">
							{{ value.msgNum }}条相关聊天记录
						</view>
						<view class="message-create-at">{{ value.createTimeStr }}</view>
					</view>
				</view>
			</view>
			<view v-if="!sessionList || sessionList.length <= 0" style="text-align: center; background: #F0EFF4; padding-top: 200upx;">
				<image src="../../static/img/message-search.png" style="width:228upx; height: 228upx;"></image>
			</view>
		</view>
	</view>
</template>
<script>
import { uniIcon} from '@dcloudio/uni-ui'
import uniBadge from '@/components/uni-badge/uni-badge.vue'
import app from "../../common/common.js"
import { mapState, mapActions, mapMutations} from 'vuex'
export default {
	data() {
		return {
			title: 'media-list',
			currentUser: "",
			searchKeyword: '',
			channelIds: [],
			curIndex: null,
			modalName:'',
			sessionList: []
		}
	},
	onLoad() {
		// 建立会话连接
		this.currentUser = uni.getStorageSync('currentUser');
		this.getSystemInfo()
	},
	onHide() {
		
	},
	onUnload() {
        
	},
	components: {
		uniIcon,
		uniBadge
	},
	onShow() {
		
	},
	computed: { //同步了store中state内的sendMessage值
		...mapState({
			userInfo: state => state.home.userInfo,
			groupList: state => state.group.groupList,
		})
	},
	watch: {
		searchKeyword(curval, oldval) {
			this.searchChannel(curval);
		},
	},
	methods: {
		...mapMutations([
			'SET_CURRENT_CHANNEL_ID',
			'SET_CURRENT_CHANNEL',
			'FILTER_SESSION_LIST_BY_KEY',
			'SET_IS_PLAY_AUDIO',
			'CLEAR_MESSAGE_LIST',
			'SET_SYSTEM_INFO',
			'SET_ACTIVE_GROUP',
			'SET_TREEDATA',
			'SET_SEARCH_CURRENT_CHANNEL',
			'SET_CURRENT_VIDEO_CHANNELID','setTitleList','SET_NODE_MEMBER_INFO']),
		...mapActions([
			'getSessionListByContentLike'
		]),
		hideModal(){
			this.modalName = ''
		},
		// 获取系统信息
		getSystemInfo () {
			let system = uni.getSystemInfoSync()
			this.SET_SYSTEM_INFO({
				width: system.windowWidth,
				height: system.windowHeight
			})
		},
		goBack(){
			uni.navigateBack({
				delta: 1
			});
		},
		goDetail(e) {
			if(e.channelType === 'G'){
				if(this.groupList && this.groupList.length > 0){
					let group = this.groupList.find(item => {
						return item.jid === e.channelId
					})
					if(group){
						this.SET_ACTIVE_GROUP(group)
					}else{
						// TODO 群组不存在不可以跳转
					}
				}
			}
			this.SET_SEARCH_CURRENT_CHANNEL(e)
			uni.navigateTo({
				url: "./message-search-detail?channelId=" + e.channelId + "&channelName=" + e.name +
					"&channelType=" + e.channelType + "&searchKeyword=" + this.searchKeyword,
                animationType: 'slide-in-right',
                animationDuration: 200
			})
		},
		getList() {
			console.log("获取消息列表");

		},
		searchChannel(key) {
			if (!key.trim()) {
				this.sessionList = []
				return;
			}
			this.getSessionListByContentLike(key).then(data => {
				console.log('查询成功')
				this.sessionList = data
			})
		},
	},
}
</script>

<style lang="scss" scoped>
body{
	background: #ffffff;
}
.page {
	// background: #efeff4;
	background: #ffffff;
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
	/*.dropdown-menu-list-item {*/
		/*display: flex;*/
		/*align-items: center;*/
		/*text-align: center;*/
	/*}*/
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

.uni-ellipsis {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
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
	padding: 0 12upx;
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
	padding-top: 85upx;
}

.message-create-at {
	display: inline-block;
	position: absolute;
	top: -30upx;
	right: 25upx;
	font-size: 23upx;
	color: #909399;
}

.top {
	width: 15%;
	height: 150rpx;
	background-color: #c4c7cd;
	color: #fff;
	font-size: 34rpx;
	text-align: center;
}

.delect {
	width: 15%;
	height: 150rpx;
	background-color: #ff3b32;
	color: #fff;
	font-size: 34rpx;
	text-align: center;
}

.my-uni-li-hide {
	transform: translate3d(0, 0, 0);
}

.my-uni-li-show {
	transform: translate3d(-30%, 0, 0);
}

.infoAll {
	width: 100%;
}

.infoAll .my-uni-ul {
	width: 100%;
	overflow: hidden;
}

.infoAll .my-uni-li {
	transition: all 0.2s;
	width: 100%;
	height: 120upx;
	line-height: 120upx;
	// border-bottom: 1px solid #e0eef1;
	display: flex;
	align-items: center;
}

</style>
