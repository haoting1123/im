<template>
	<view class="page" @touchstart="onTouchStart" @touchend="onTouchEnd">
		<view class="head">
			<segmented-control :current="current" :values="items" v-on:clickItem="onClickItem" :styleType="styleType" :activeColor="activeColor"></segmented-control>
		</view>
		<view class="content">
			<view v-show="current === 0"><friend-list></friend-list></view>
			<view v-show="current === 1"><group-list></group-list></view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import segmentedControl from '../../components/segmented-control.vue';
import friendList from '../friends/friend';
import groupList from '../group/group-list';
export default {
	components: {
		segmentedControl,
		friendList,
		groupList
	},
	data() {
		return {
			items: ['常用联系人', '群组'],
			current: 0,
			activeColor: '#387FB5',
			styleType: 'button',
			coordinate: {
				x: '',
				y: ''
			}
		};
	},
	// 监听原生标题栏按钮点击事件
	onNavigationBarButtonTap() {
		console.log(123);
	},
	methods: {
		onTouchStart (event) {
			// console.log(`onTouchStart:${JSON.stringify(event)}`)
			this.coordinate.x = event.clientX
			this.coordinate.y = event.clientY
		},
		onTouchEnd (event) {
			let newX = event.mp.changedTouches[0].clientX
			if (Math.abs(Number(newX) - Number(this.coordinate.x)) < 90) return
			// 右滑
			if (Number(newX) > Number(this.coordinate.x)) {
				// console.log('右滑')
				this.current = 0
			} else {
				// 左滑
				// console.log('左滑')
				this.current = 1
			}
		},
		onTouchMove (event) {
			// console.log(`onTouchMove:${JSON.stringify(event)}`)
		},
		// 切换选项卡
		onClickItem(index) {
			this.current = index;
			switch (index) {
				case 0:
					uni.setNavigationBarTitle({
						title: '联系人'
					});
					break;
				default:
					uni.setNavigationBarTitle({
						title: '群组'
					});
			}
		}
	}
};
</script>

<style>
body {
	background-color: #ffffff;
}
.page {
	background-color: #ffffff;
}
.head {
	padding: 20upx;
	/*height: 80upx;*/
}

.content {
}
</style>
