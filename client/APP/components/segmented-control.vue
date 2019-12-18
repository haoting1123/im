<template>
	<view class="segmented-control" :class="styleType" :style="wrapStyle">
		<view
			v-for="(item, index) in values"
			class="segmented-control-item"
			:class="styleType"
			:key="index"
			:style="index === current ? activeStyle : itemStyle"
			@click="onClick(index)"
		>
			{{item}}
		</view>
	</view>
</template>

<script>
	export default {
		name: 'segmented-control',
		props: {
			current: {
				type: Number,
				default: 0
			},
			values: {
				type: Array,
				default () {
					return [];
				}
			},
			activeColor: {
				type: String,
				default: '#387FB5'
			},
			styleType: {
				type: String,
				default: 'button'
			}
		},
		computed: {
			wrapStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `border:0;`;
						break;
					default:
						styleString = `border-color: ${this.activeColor}`;
						break;
				}
				return styleString;
			},
			itemStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `color:#000;border-left:0;`;
						break;
					default:
						styleString = `color:${this.activeColor};border-color:${this.activeColor};`;
						break;
				}
				return styleString;
			},
			activeStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `color: ${this.activeColor}; border-left: 0; border-bottom-style: solid;`;
						break;
					default:
						styleString = `color:#fff;border-color: ${this.activeColor}; background-color: ${this.activeColor}`;
						break;
				}
				return styleString;
			}
		},
		methods: {
			onClick(index) {
				if (this.current !== index) {
					this.$emit('clickItem', index)
				}
			}
		},
	}
</script>

<style lang="scss">
	.segmented-control {
		display: flex;
		flex-direction: row;
		justify-content: center;
		height: 58upx;
		border: 1upx solid rgb(56, 127, 181);
		font-size: 30upx;
		border-radius: 12upx;
		margin: 0 auto;
		overflow: hidden;
		.segmented-control-item {
			flex: 1;
			text-align: center;
			line-height: 58upx;
			font-size: 28upx;
			box-sizing: border-box;
		}
	}
</style>
