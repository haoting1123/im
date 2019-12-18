<template>
	<view class="emoji">
	<!-- 	<view class="emoji-controller">
			<view class="view-li" v-for="(pannel, index) in pannels" @tap.stop="changeActive(index)" :key="index" :class="{ active: index === activeIndex }">{{ pannel }}</view>
		</view> -->
		<view class="emoji-container">
			<view class="view-li2" v-for="(emojiGroup, index) in emojis" style="padding: 0" :key="index" v-if="index === activeIndex">
				<view class="icon-navigator" href="javascript:;" v-for="(emoji, index1) in emojiGroup" :key="index1" @tap.stop="selectItem(emoji)" v-if="index1 <= 30">
					<text class="icon-text" :title="emoji" :class="emoji"></text>
					<!-- <text :title="emoji" :class="emoji-item" class="sprite-bowtie"></text> -->
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import data from '../../common/emoji-data.js';
import {
		mapState,
		mapActions,
		mapMutations
	} from 'vuex'
    
export default {
	name: 'emoji',
	data() {
		return {
			emojiData: data,
			pannels: ['表情'],
			activeIndex: 0
		};
	},
	methods: {
        ...mapMutations(['setCurrentChannelMessage']),
		changeActive(index) {
			this.activeIndex = index;
		},
		getPureName(name) {
			console.log();
			return name.replace(/:/g, '');
		},
		selectItem(emoji) {
			emoji = emoji.replace(/bg-/g, '');
			// this.$emit('select', emoji)
            // 发送表情
            let emojiPath = './static/emoji/'
            let resultData = {content: `<img src="${emojiPath}${emoji}.png" width="35px" height="35px" type="emoji">`}  
            resultData.action = "emoji";
            console.log(JSON.stringify(resultData));
            this.setCurrentChannelMessage(resultData);
		}
	},
	computed: {
		emojis() {
			return this.pannels.map(item => {
				let emojs = Object.keys(this.emojiData[item]);
				let emojsArr = [];
				emojs.forEach(data =>{
					let emoA ='bg-'+ data.replace(/:/g, '');
					emojsArr.push(emoA)
				})
				return emojsArr;
			});
		},
	}
};
</script>

<style lang="scss" scoped>
@import '../../static/css/emoji-sprite.scss';

.emoji {
	width: 740upx;
	// height: 345upx;
	bottom: 30upx;
	background: #fff;
	z-index: 10;
	padding: 5px 5px 10px 25px;
	.emoji-controller {
		height: 50upx;
		overflow: hidden;
		margin-bottom: 0;
		.view-li {
			float: left;
			width: 76upx;
			font-size: 24upx;
			line-height: 40upx;
			cursor: pointer;
			text-align: center;
			position: relative;
			&.active::after {
				content: '';
				width: 100%;
				height: 1px;
				background: #0689dd;
				left: 0;
				bottom: 4upx;
				position: absolute;
			}
		}
	}
	.emoji-container {
		height: 345upx;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		.view-li2 {
			font-size: 0;
			padding: 35upx;
			.icon-navigator {
				width: 100upx;
				float: left;
				overflow: hidden;
				height: 100upx;
				transition: all ease-out 0.2s;
				border-radius: 4upx;
				&:hover {
					background-color: #d8d8d8;
					border-color: #d8d8d8;
				}
				.icon-text {
					width: 70upx;
					height: 70upx;
					display: inline-block;
					border: 1upx solid transparent;
					cursor: pointer;
				}
			}
		}
	}
}
</style>
