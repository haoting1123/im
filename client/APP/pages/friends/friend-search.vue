<template>
	<view>
			<!-- 搜索框 -->
		<view class="cu-bar bg-white search" :style="[{top:0 + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" disabled placeholder="查找联系人"  @tap="searchFriend"></input>
			</view>
		</view>
		<SortPickerList ref="sortPickerList" @clickData="clickData"></SortPickerList>
	</view>
</template>
<script>
	import { mapState,mapActions,mapMutations } from 'vuex'
	import SortPickerList from "@/components/index/nickro-sortPickerList.vue"
	export default {
		name:"contury",
		components: {SortPickerList},
		data() {
			return {
				CustomBar: this.CustomBar,
				dataArr: []
			}
		},
		onShow() {
			var that = this
// 			uni.setNavigationBarTitle({
// 					title: '自动处理索引列表'
// 			});
		},
		onLoad(){
			this.getAllUserInfo();
		},
		onReady() {
			var that = this
			// that.$refs["sortPickerList"].initPage(that.dataArr)
		},
		computed: { //同步了store中state内的sendMessage值
			...mapState({
				userInfo: state => state.home.userInfo,
				xmppDomain: state => state.home.xmppDomain
			}),
			// sendMessage() {
			// 	return this.$store.state.socketStore.sendChannelMessage;
			// }
		},
		methods: {
			...mapMutations([
				'SET_ACTIVE_MEMBER'
			]),
			...mapActions(['GetAllUser']),
			searchFriend(){
				// console.log("通过机构查询联系人")
				uni.navigateTo({
					url:"../organize/searchFriend"
				})
			},
			//点击人员跳转到好友信息页
			clickData(user) {
				if(this.debug){
					console.log('跳转个人信息=============',JSON.stringify(user))
				}
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
			getAllUserInfo(){
				let groupCode = this.userInfo.groupCode;
				console.log('获取用户信息============'+JSON.stringify(groupCode))
				if(groupCode){
					this.GetAllUser(groupCode).then(response => {
						console.log('获取用户信息============',JSON.stringify(this.dataArr))
						this.dataArr = response;
						this.$refs["sortPickerList"].initPage(this.dataArr)
						console.log('获取用户信息============',JSON.stringify(this.dataArr))
					}).catch(error =>{ console.log("获取用户信息失败======"+JSON.stringify(error))})
				}	
			},
			
		}
	}
</script>

<style>
	
</style>