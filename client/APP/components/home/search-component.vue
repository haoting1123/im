<template>
	<view class="search-main-component" :style="{ width: widthCalculate }">
		<view class="cu-bar bg-white search search-input-section-box">
			<view class="search-form round" style="padding-right: 20upx; margin: 0; height: 70upx; line-height: 70upx">
				<text class="cuIcon-search"></text>
				<input
					confirm-type="search"
					@input="searchContent"
					@focus="searchContent"
					v-model="searchKeyword"
					class="input"
					type="text"
					placeholder="搜索"
					placeholder-class="search-palceholder-style"
					style="height: 70upx; line-height: 70upx"
					:key="type"
				/>
				<icon v-show="searchKeyword" type="clear" style="margin-top: 30upx;" size="16" @tap="cancelSearch" ></icon>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: ['searchWidth', 'type'],
	data() {
		return {
			searchKeyword: ''
		};
	},
	computed: {
		widthCalculate() {
			return uni.upx2px(this.searchWidth) + 'px';
		}
	},
	methods: {
		// 搜索内容
		searchContent() {
			this.$emit('onsearch', this.searchKeyword);
		},
		// 取消搜索
		cancelSearch() {
			this.searchKeyword = '';
			this.$emit('onsearch', this.searchKeyword);
		}
	}
};
</script>

<style lang="scss">
.search-main-component {
	align-items: center;
	background-color: #e7e7e7;
	border-radius: 10px;
	.search-input-section-box {
		min-height: 90upx;
		align-items: flex-start;
		-webkit-align-items: flex-start;
		-webkit-box-align: flex-start;
		input {
			flex: 1;
			margin-left: 10upx;
			font-size: 30upx;
		}
		.search-palceholder-style {
			font-size: 30upx;
		}
	}
}
</style>
