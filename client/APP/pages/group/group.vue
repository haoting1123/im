<template>
    <view class="page">
    	<view class="uni-list">
    		<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in groupList" :key="key"  @click="goDetail(value)">
    			<view class="uni-media-list" v-if="value.channelType=='G'">
    				<view class="uni-media-list-logo">
    					<image src="../../static/img/qun.png"></image>
    				</view>
    				<view class="uni-media-list-body">
    					<view class="uni-group-list-text-top">{{value.channelDisplayName}}</view>
    				</view>
    			</view>
    		</view>
    	</view>
    </view>
</template>

<script>
	import service from '../../service.js';
	import app from "../../common/common.js"
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
		components: {
			
		},
		data() {
				return {
					currentUser:null,
					groupList:[],
				}
		},
		onLoad() {
			this.currentUser=uni.getStorageSync('currentUser');
			this.getList();
		},
		onPullDownRefresh() {
			this.getList();
		},
        methods: {
            getList(){
            	console.log("获取组列表");
            	console.log(this.$store.state.globalConfig.hostUrl+'/userChannels/'+this.currentUser.userId+'?limit=999');
            	var token=uni.getStorageSync('token');
            	uni.request({
            		url: this.$store.state.globalConfig.hostUrl+'/userChannels/'+this.currentUser.userId+'?limit=999',
            		dataType:"json",
            		header:{
            			"content-type":"application/x-www-form-urlencoded",
            			"Accept": "application/json, text/plain, */*",
            			"X-Token":token,
            		},
            		success: (data) => {
            			uni.stopPullDownRefresh();
            			console.log("获取组列表")
            			console.log(JSON.stringify(data))
            			this.groupList=data.data;
            			
            			console.log("获取token="+token);
            		},
            		fail: (data, code) => {
            			console.log('fail' + JSON.stringify(data)+'code='+code);
            		
            		},
            	})
            },
			goDetail: function(e) {
				console.log(JSON.stringify(e))
				this.$store.commit('setCurrentChannelId', e.channelId);
				setTimeout(function() {
					uni.navigateTo({
						url: "../im-chat/im-chat?channelId=" + e.channelId + "&channelDisplayName=" + e.channelDisplayName +
							"&channelType=" + e.channelType + "&toUserId=" + e.toUserId + "&creatorId=" + e.creatorId 
					})
				}, 100) 
			},
        }
    }
</script>

<style>
.uni-group-list-text-top {
	width: 100%;
	line-height: 80upx;
	height: 100%;
	font-size: 34upx;
}
</style>
