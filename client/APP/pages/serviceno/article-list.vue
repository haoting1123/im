<template>
	<view>
		<view class="example-title">服务号&nbsp;&nbsp;{{ servno.name }}</view>
		<uni-list >
			<block v-if="articleList && articleList.length > 0" v-for="(value, key) in articleList" :key="key" >
				<uni-list-item :title="value.title" @click="toArticalDetail(value)"></uni-list-item>
			</block>
		</uni-list>
	</view>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import searchComponent from '../../components/home/search-component'
import {uniList, uniListItem} from '@dcloudio/uni-ui'
export default {
	components: {
		searchComponent,uniList,uniListItem
	}, 
	data() {
		return {
			servno: {},
			articleList: [],
		};
	},
	onPullDownRefresh() {
		this.getArticles();
	},
	onLoad(option) {
		this.servno = JSON.parse(option.servno)
		
		this.getArticles()
	},
	onShow() {
	},
	methods: {
		...mapActions([
			'GetArticleList'
		]),
		getArticles(){
			console.info(" this.servno.code " + this.servno.code)
			this.GetArticleList(this.servno.code)
			.then((res)=>{
				console.log(res);
				this.articleList = res
			})
		},
		toArticalDetail(article){
			uni.navigateTo({
					url:"./article-detail?article="+JSON.stringify(article)
			})
		},
	}
};
</script>

<style>
body {
	background: #f0eff4;
}

.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position: relative
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 0 40upx
	}

.setting-up {
	font-size: 28upx;
}

.voice-panel {
	display: inline-block;
	line-height: 30upx;
}

.person-info-panel {
	background: #ffffff;
	padding: 20upx;
	margin-top: 40upx;
	border-top: 1px solid #d8d8d8;
	border-bottom: 1px solid #d8d8d8;
}

.person-info-panel .image-panel {
	display: inline-block;
	width: 90upx;
	height: 90upx;
}

.person-info-panel .image-panel image {
	width: 90upx;
	height: 90upx;
	display: inline-block;
}

.person-info-panel .user-info {
	width: 500upx;
	height: 40upx;
	display: inline-block;
	margin-left: 30upx;
}

.person-info-panel .user-info .user-name {
	width: 500upx;
	margin-bottom: 10upx;
}

.person-info-panel .user-info .account {
	width: 500upx;
	font-size: 25upx;
	color: #9b9b9b;
}

.column-panel {
	background: #ffffff;
	padding: 20upx;
	border-bottom: 1px solid #d8d8d8;
}

.logout-btn {
	margin-top: 100upx;
	width: 700upx;
	margin-left: 25upx;
}

.right-arrow-top {
	width: 18upx;
	height: 18upx;
	border-top: 3upx solid #c0c4cc;
	border-right: 3upx solid #c0c4cc;
	transform: rotate(45deg);
	float: right;
	margin-top: 40upx;
	margin-right: 10upx;
}

.right-arrow {
	width: 18upx;
	height: 18upx;
	border-top: 3upx solid #c0c4cc;
	border-right: 3upx solid #c0c4cc;
	transform: rotate(45deg);
	float: right;
	margin-top: 10upx;
	margin-right: 10upx;
}

.version-label {
	float: right;
	display: inline-block;
	width: 80upx;
	color: #8f8f94;
}

.message-tip-label {
	float: right;
	display: inline-block;
	width: 70upx;
	margin-right: 30upx;
	color: #8f8f94;
	margin-top: -10upx;
}
</style>
