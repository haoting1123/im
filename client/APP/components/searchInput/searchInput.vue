<template>

		<view class="input-view">
			<uni-icon type="search" size="22" color="#666666"></uni-icon>
			<input confirm-type="search" @confirm="confirm" class="input" type="text" placeholder="输入搜索关键词" />
		</view>

</template>

<script>
	export default {
		
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
		margin:10upx;
	}

	.input {
		flex: 1;
		padding: 0 5px;
		height: 40upx;
		line-height:40upx;
		margin-top:8upx;
	}
	
	.margin-search{
		margin-top: 85upx;
	}
</style>
