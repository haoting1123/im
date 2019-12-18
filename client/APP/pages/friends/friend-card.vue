<template>
	<view>
			<!-- 搜索框 -->
		<view class="cu-bar bg-white search" :style="[{top:0 + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" v-model="searchKeyword" @tap="filterNode()" confirm-type="search"></input>
			</view>
		</view>
		<SortPickerList ref="sortPickerList" @clickData="clickData"></SortPickerList>
		<view class="cu-modal" :class="modalName=='DialogModalCard'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content" style="text-align: left;">确定要发送该名片吗？</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="cu-list menu-avatar no-padding">
					<view class="cu-item">
						<view class="cu-avatar round lg">{{childUser.name}}</view>
						<view class="content">
							<view class="text-grey">{{childUser.name}}</view>
							<view class="text-gray text-sm" style="text-align: left;">
								{{childUser.groupName}}
							</view>
						</view>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="sendCard">确定</button>

					</view>
				</view>
			</view>
		</view>
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
				dataArr: [],
				modalName: '',
				childUser:'',
				searchKeyword:''
			}
		},
		onShow() {
			var that = this
			uni.setNavigationBarTitle({
					title: '选择联系人'
			});
		},
		watch: {
			searchKeyword(curval, oldval) {
				this.filterNode(curval)
			}
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
			}),
			sendMessage() {
				return this.$store.state.socketStore.sendChannelMessage;
			}
		},
		methods: {
			...mapMutations(['setCurrentChannelMessage']),
			...mapActions(['GetAllUser']),
			clickData(data) {
				this.modalName = 'DialogModalCard';
				this.childUser = data;
				if(this.debug){
					console.log('获取名片：' + JSON.stringify(data))
				}	
			},
			hideModal(e) {
				this.modalName = null
			},
			sendCard(){
				// let resultData = JSON.parse(this.childUser);
				let resultData = this.childUser;
				resultData.action = "vcard";
				if(this.debug){
					console.log('sendCard======================',JSON.stringify(this.childUser))
				}
				this.setCurrentChannelMessage(resultData)
				//隐藏模态窗口
				this.modalName = null
				uni.navigateBack({
					delta: 1
				});
			},
			getAllUserInfo(){
				let groupCode = this.userInfo.groupCode;
				// console.log('获取用户信息============'+JSON.stringify(groupCode))
				if(groupCode){
					this.GetAllUser(groupCode).then(response => {
						// console.log('获取用户信息============',JSON.stringify(this.dataArr))
						this.dataArr = response;
						this.$refs["sortPickerList"].initPage(this.dataArr)
						// console.log('获取用户信息============',JSON.stringify(this.dataArr))
					}).catch(error =>{ console.log("获取用户信息失败======"+JSON.stringify(error))})
				}
			},
			filterNode(searchKeyword) {
			// console.log('进来了'+searchKeyword)
			  if(this.dataArr){
				let filterUser = [];
				if(searchKeyword!=""&&searchKeyword != undefined){
					this.dataArr.forEach(item => {
						// console.log('开始找========='+item.name)
						if(item.name.indexOf(searchKeyword) !==-1){
							// console.log('找到了========='+item.name)
							filterUser.push(item)
						}
					})
					// console.log('查找完毕============='+JSON.stringify(filterUser))
					this.$refs["sortPickerList"].initPage(filterUser)
				}else{
					// console.log('查询所有')
					this.getAllUserInfo();
				}
			  }
			},
		}
	}
</script>

<style>
	
</style>