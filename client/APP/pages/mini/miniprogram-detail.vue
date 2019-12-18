<template>
	<view>
		<view class="uni-card-content-inner">
			<text style="color: #323232;">{{ mini.title }}</text>
		</view>
		<web-view  v-if="mini.url" :src="mini.url"></web-view>
		<view  v-if="!mini.url" >小程序配置不正确， 请联系管理员</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mini: {},
		};
	},
	onLoad(option) {
		this.mini = JSON.parse(option.mini);
		console.info(this.mini)
		console.info(this.mini.url)
		console.info(!this.mini.url)
	},
	onShow() {},
	methods: {}
};
</script>

<style>
.webviewStyles{
	
}
</style>
