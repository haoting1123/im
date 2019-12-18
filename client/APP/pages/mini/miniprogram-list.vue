<template>
	<view class="setting-up">
		<!-- <view class="uni-card" v-if="minis && minis.length > 0" v-for="(value, key) in minis" :key="key">
			<view class="uni-card-header"  @tap="toMiniProgram(value)">{{ value.name }}</view>
			<view class="uni-card-content"  @tap="toMiniProgram(value)">
				<view class="uni-card-content-inner">
					<text style="color: #323232;">{{ value.remark}}</text>
				</view>
			</view>
		</view> -->
		<uni-list >
			<block v-if="minis && minis.length > 0" v-for="(value, key) in minis" :key="key" >
				<uni-list-item :title="value.name" :note="value.remark" @click="toMiniProgram(value)"></uni-list-item>
			</block>
		</uni-list>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import {miniList} from '../../api/miniprogram.js'
import {uniList, uniListItem} from '@dcloudio/uni-ui'

export default {
	components: {
		uniList,uniListItem
	}, 
	data() {
		return {
			minis:[],
		}
	},
	computed: {
		... mapState({
			rootGroupCode: state => state.home.userInfo.groupRootCode,
		}),
	},
// 	onPullDownRefresh() {
// 		this.getMinis();
// 	},
	onLoad() {
 		this.getMinis();
	},
	onShow() {},
	methods: {
// 		...mapActions([
// 			'GetMiniList',
// 		]),
		getMinis(){
			miniList(this.rootGroupCode)
			.then((res)=>{
				this.minis = res
			})
		},
		toMiniProgram(data){
			uni.navigateTo({
					url:"./miniprogram-detail?mini="+JSON.stringify(data)
			})
		},
	}
};
</script>

<style>

</style>
