<template>
	<view class="uni-list">
		<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value, key) in treeData" :key="key" @click="getChildren(value)">
			<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
				<img
					src="../../static/img/class-tree1.png"
					style="height: 40upx; margin-right: 10upx; line-height: 40upx; vertical-align:middle; width: 44upx; display:inline-block;"
					alt="icon"
				/>
				<view class="uni-media-list-body">
					<view class="uni-organize-list-text-top">{{ value.label }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import app from '../../common/common.js';
export default {
	data() {
		return {
			titleList: ['组织机构'],
			organize: [],
			personList: [],
		
		};
	},
	watch:{
		nodeMemberData(val,oldVal){
			if(val.length==0){
				this.SET_NODE_MEMBER_INFO('');
			}
			console.log('nodeMemberData==============',val)
		}
	},
	computed: {
		...mapState({
			treeData: state => state.tree.treeData,
			organizeTitle: state => state.titleList.titleList,
			nodeMemberData: state => state.tree.nodeMemberData,
		})
		// 			OrganizeList: function() {
		// 				var organizeData = this.$store.state.organizeList.organizeList;
		// 				return organizeData;
		// 			}
	},
	onLoad() {
		console.log('organizeInfo============', this.treeData);
	},
	methods: {
		...mapMutations(['SET_TREEDATA','setTitleList','SET_NODE_MEMBER_INFO']),
		...mapActions(['GetNodeMember']),
		//获取机构人员信息
		getNodeMemberInfo(id,organizeName) {
			return new Promise((resolve, reject) =>{
				if(this.debug){
			
				}
				this.GetNodeMember({id,organizeName}).then(()=>{
					resolve()
				}).catch(error =>{reject(error)});
					
			})
		},

		getChildren(item) {
			
			console.log('获取TitleList======' + JSON.stringify(this.titleList));
			let that = this;
			this.getNodeMemberInfo(item.id,item.label).then((response)=>{
				if (that.organizeTitle.length > 0) {
					that.titleList = that.organizeTitle;
				}
				if (item.children.length > 0) {
					//加载子节点数据
					that.SET_TREEDATA(item.children)
					// this.$store.commit('setOrganizeList', item.children);
					for (var value of that.titleList) {
						if (value == item.label) {
							return;
						}
					}
					that.titleList.push(item.label);
					that.setTitleList(that.titleList)
					// this.$store.commit('setTitleList', this.titleList);
				} else {
					//获取人员
					
					that.personList = that.nodeMemberData;
					console.log('this.personList==========='+that.personList)
					// if (that.personList.length > 0) {
						that.titleList.push(item.label);
						this.setTitleList(that.titleList);
						that.SET_NODE_MEMBER_INFO(that.personList);
						that.SET_TREEDATA('')
					// }
				}
			}).catch(error=>{
				console.log('进来了'+error)
			});
			
		},
// 		getPersonList(item) {
// 			console.log('获取组织机构人员');
// 			console.log(this.$store.state.globalConfig.hostUrl + '/users?name=&limit=20&offset=0&groupCode=' + item.id);
// 			var token = uni.getStorageSync('token');
// 			uni.request({
// 				url: this.$store.state.globalConfig.hostUrl + '/users?name=&limit=20&offset=0&groupCode=' + item.id,
// 				dataType: 'json',
// 				header: {
// 					'content-type': 'application/x-www-form-urlencoded',
// 					Accept: 'application/json, text/plain, */*',
// 					'X-Token': token
// 				},
// 				success: data => {
// 					//获取好友列表，如果不存在需要获取
// 					let friendList = this.$store.state.personList.friendList;
// 					let resultData = data.data.rows;
// 					if (resultData.length > 0) {
// 						if (friendList && friendList.length > 0) {
// 							resultData.forEach(function(item) {
// 								let index = friendList.findIndex(item1 => item1.id == item.id);
// 								if (index > -1) {
// 									item.isAdd = true;
// 								} else {
// 									item.isAdd = false;
// 								}
// 							});
// 						} else {
// 							resultData.forEach(function(item) {
// 								item.isAdd = false;
// 							});
// 						}
// 					}
// 
// 					this.personList = resultData;
// 
// 					if (this.personList.length > 0) {
// 						this.titleList.push(item.label);
// 						this.$store.commit('setTitleList', this.titleList);
// 						this.$store.commit('setPersonList', this.personList);
// 					}
// 				},
// 				fail: (data, code) => {
// 					console.log('fail' + JSON.stringify(data) + 'code=' + code);
// 					setTimeout(function() {
// 						uni.hideLoading();
// 					}, 500);
// 				}
// 			});
// 		}
	}
};
</script>

<style>
.page {
	background: #efeff4;
}

.title {
	padding: 20upx;
}

.uni-organize-list-text-top {
	width: 100%;
	line-height: 80upx;
	font-size: 34upx;
	text-align: left;
}
</style>
