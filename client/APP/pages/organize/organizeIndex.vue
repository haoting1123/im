<template>
	<view class="page">
		<!-- 搜索框 -->
		<view class="cu-bar bg-white search" >
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" disabled placeholder="查找联系人" @tap="searchFriend"></input>
			</view>
		</view>
		<!-- 机构导航 -->
		<scroll-view id="tab-bar" class="swiper-tab" scroll-x>
			<block v-for="(value,key) in titleList" :key="key">
				<img v-if="key==0" src="../../static/img/organize2.png" style="height: 40upx; line-height: 40upx; vertical-align:middle; width: 40upx; display:inline-block; margin: 0 20upx 0 20upx;" alt="icon" />
				<img v-if="key!=0"  src="../../static/img/jiantou-right.png" style="height: 40upx; line-height: 40upx; vertical-align:middle; width: 44upx; display:inline-block;" alt="icon" />
				<view v-if="key<titleList.length-1" class="swiper-tab-list1"  @tap="loadChildren(value,key)">{{value}}</view>
				<view v-else class="swiper-tab-list"  @tap="loadChildren(value,key)">{{value}}</view>
			</block>
		</scroll-view>
		<!-- 人员列表 -->
		<person-list v-if="personOrganize.length>0" :personList="personOrganize"></person-list>
		<!-- 机构列表 -->
		<organize-list ref="info"></organize-list>
		<!-- 点击图标跳转到联系人查询页 -->
		<img src="../../static/img/contact.png" @tap="searchContact" class="contact-icon" alt="icon" />
	</view>
</template>
<script>
	import app from "../../common/common.js"
	import organizeList from "../../components/organize/organizeList"
	import searchInput from "../../components/searchInput/searchInput"
	import personList from "../person-list/person-list.vue"
	import {uniIcon} from '@dcloudio/uni-ui'
	import { mapState, mapActions, mapMutations } from 'vuex';

	export default {
		data() {
			return {
				title: '组织机构列表',
				showImg: false,
				organize:[],
				currentUser:'',
				searchKeyword:'',
				CustomBar: this.CustomBar,
			}
		},
		computed:{
			...mapState(
				{
					userInfo: state => state.home.userInfo,
					treeData: state => state.tree.treeData,
					titleList: state => {
						var titleList = state.titleList.titleList;
						if(titleList.length == 0)
						{
							titleList=["组织机构"];
						}
						return titleList;
					},
					// personOrganize: state => state.personList.personList,
					personOrganize: state => state.tree.nodeMemberData,
				}
			),
		},
		watch:{
			nodeMemberData(val,oldVal){
				if(val.length==0){
					this.SET_NODE_MEMBER_INFO('');
				}
			}
		},
		onLoad() {
			this.currentUser = uni.getStorageSync('currentUser');
			this.getTreeDataInfo();
		},
		components:{
			organizeList,personList,searchInput,uniIcon
		},
		methods:{
			...mapMutations(['SET_TREEDATA','setTitleList','SET_NODE_MEMBER_INFO']),
			...mapActions(['GetTreeData','GetNodeMember']),
			//获取机构人员信息
			getNodeMemberInfo(id,organizeName) {
				// console.log('获取人员组织机构==============================='+JSON.stringify(organizeName));
				this.GetNodeMember({id,organizeName})
			},
			getTreeDataInfo(){
				let groupCode = this.userInfo.groupCode;
				this.GetTreeData(groupCode).then(response =>{
					this.organize = response;
				})
			},
			searchContact(){
				// console.log("通过列表查询联系人")
				uni.navigateTo({
					url:"../friends/friend-search"
				})
			},
			searchFriend(){
				// console.log("通过机构查询联系人")
				uni.navigateTo({
					url:"../organize/searchFriend"
				})
			},
			loadChildren(value,key){
// 				console.log('当前Key==================',key)
// 				console.log('this.titleList.length-1=========',this.titleList.length-1)
				if(key==this.titleList.length-1)
				{					
					return;
				}
				this.SET_NODE_MEMBER_INFO('');
				if(value=="组织机构")
				{
					//更新机构及导航
					this.SET_TREEDATA(this.organize)
					var titleList=['组织机构'];
					this.setTitleList(titleList)
				}else{
					for(var item of this.titleList)
					{
						if(item==value)
						{
							var titleList= this.titleList
							var index=titleList.indexOf(value);
							var num=index+1;
							//删除该节点之后的导航节点
							for(var i=num;i<=titleList.length;i++)
							{
								console.log("删除title=="+i)
								titleList.splice(i,1);
							}
							this.setTitleList(titleList)
						}
					}
					
					this.getChildren(this.organize,value);	
				}
			},
			getChildren(organize,value){
				for(var item of organize)
				{
					if(item.label==value)
					{
						//获取人员信息
						this.getNodeMemberInfo(item.id,item.label);
						if(item.children)
						{
							console.log("获取到了点击的组织机构====="+item.label)
							this.SET_TREEDATA(item.children)
						}
					}	
					if(item.label!=value)
					{
						if(item.children)
						{
							this.getChildren(item.children,value);
						}
					}
				}
			},
			//此方法，如果好友列表为空，则请求一次，用来判断是否已经是好友使用
			getFriendList(){
				var token = uni.getStorageSync('token');
				uni.request({
					url: this.$store.state.globalConfig.hostUrl + '/immc/rest/friends/' + this.currentUser.userId + '/list',
					dataType: "json",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"X-Token": token,
					},
					success: (data) => {
						if(data.data && data.data.length > 0){
							this.$store.commit('setFriendList', data.data);
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data) + 'code=' + code);
					},
				})
			},
		},
	}
</script>

<style>
	.page {
		background: #FFFFFF;
		width: 100%;
		height: 100%;
	}

	.title {
		padding: 20upx;
	}
	.uni-organize-list-text-top {
		width: 100%;
		line-height: 80upx;
		font-size: 34upx;
		text-align:left;
	}
	.uni-bread{
		/* display: flex; */
		flex-direction: row;
		line-height: 80upx;
		font-size: 34upx;
	}
	.swiper-tab {
		width: 100%;
		white-space: nowrap;
		line-height: 100upx;
		height: 100upx;
		padding-left:10upx;
	}
	.swiper-tab-list {
		font-size: 35upx;
		display: inline-block;
		text-align: center;
		color: #676262;
	}
	.swiper-tab-list1 {
		font-size: 35upx;
		display: inline-block;
		text-align: center;
		color: #0781F9;
	}
	.margin-search {
		margin-top: 85upx;
	}
	.contact-icon {
		height: 80upx; width: 80upx; margin-bottom:120upx; right:20upx; opacity:0.6; position: fixed; top:85%;
	}
</style>
