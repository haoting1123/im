<template>
    <view class="group-list-main-component">
		<!--群组搜索-->
		<search-component @onsearch="searchGroup" searchWidth="710" type="group"></search-component>
		<!--群组列表-->
    	<view class="group-list" :style="{height: calculateListHeight}">
			<view
				class="group-list-item"
				hover-class="uni-list-cell-hover"
				v-for="group in filterGroupList"
				:key="group.jid"
				@tap="goGroupInfo(group)"
				@longpress="showActionSheetForGroup(group)"
			>
				<image class="group-avatar" src="../../static/img/qun.png"></image>
				<view class="group-name">{{group.name}}</view>
			</view>
    	</view>
    </view>
</template>

<script>
	// import service from '../../service.js';
	// import app from "../../common/common.js"
	import searchComponent from '../../components/home/search-component'
	import { mapState, mapMutations, mapActions } from 'vuex'

	export default {
		components: {
			searchComponent
		},
		data() {
			return {
				currentUser: null,
				searchContent: '',
				// 当前操作群组
				activeGroup: {},
				allGroup: []
			}
		},
		computed: {
			...mapState({
				groupList: state => state.group.groupList,
				userInfo: state => state.home.userInfo,
				systemInfo: state => state.home.systemInfo
			}),
			filterGroupList () {
				return this.groupList.filter(item => {
					return item.name.indexOf(this.searchContent) !== -1
				})
			},
			// 计算列表的高度
			calculateListHeight () {
				console.log(`系统信息:${JSON.stringify(this.systemInfo)}`)
				return uni.upx2px(750 / this.systemInfo.width * this.systemInfo.height - 188) + 'px'
			}
		},
		onLoad() {},
		onShow() {},
		watch: {},
		methods: {
			...mapMutations([
				'SET_SELECTED_CHANNEL_BY_JID',
				'SET_ACTIVE_GROUP',
				'DELETE_GROUP'
			]),
			...mapActions([
				'DestoryGroup',
				'ExitGroup',
				'getSessionByJid',
				'addNewSession'
			]),
			// 获取群组列表
			searchGroup (value) {
				this.searchContent = value
			},
			// 显示操作菜单
			showActionSheetForGroup (group) {
				this.activeGroup = JSON.parse(JSON.stringify(group))
				let permissionsList = ['退出群组']
				// TODO:判断是否为群主
				if (group.members.some(item => { return item.jid === this.userInfo.jid && item.affiliation === 'owner' })) {
					permissionsList.push('解散群组')
				}
				// console.log('啦啦啦')
				uni.showActionSheet({
					itemList: permissionsList,
					success: (res) => {
						console.log(JSON.stringify(res))
						switch (res.tapIndex) {
							case 0:
								this.exitGroup()
								break
							case 1:
								this.destoryGroup()
						}
					},
					fail: (res) => {
						console.log(`---${JSON.stringify(res)}`)
					}
				})
			},
			// 解散群组
			destoryGroup () {
				uni.showModal({
					title: '提示',
					content: '确定解散群组吗?',
					success: (res) => {
						if (res.confirm) {
							this.DestoryGroup({
								jid: this.userInfo.jid,
								groupJid: this.activeGroup.jid
							})
						}
					}
				})
			},
			// 退出群组
			exitGroup () {
				uni.showModal({
					title: '提示',
					content: '确定退出群组吗?',
					success: (res) => {
						if (res.confirm) {
							this.ExitGroup({
								userJid: this.userInfo.jid,
								groupJid: this.activeGroup.jid
							})
						}
					}
				})
			},
			// 前往群组详情
			goGroupInfo (group) {
				this.SET_ACTIVE_GROUP(group)
				uni.navigateTo({
					url: '../group/group-info?type=groupList'
				})
			}
		}
	}
</script>

<style lang="scss">
	.group-list-main-component {
		padding: 0 20upx;
		.group-list {
			/*margin-top: 20upx;*/
			overflow: auto;
			.group-list-item {
				display: flex;
				align-items: center;
				padding: 20upx 0;
				border-bottom: 1px solid #F4F3F3;
				.group-avatar {
					width: 80upx;
					height: 80upx;
				}
				.group-name {
					margin-left: 20upx;
					font-size: 32upx;
				}
			}
		}
	}
</style>
