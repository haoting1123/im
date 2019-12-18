<template>
  <view class="group-notice-main-component">
    <!--新增公告-->
    <view v-if="isAdmin" class="add-group-notice-section">
      <button @tap="goAddGroupNotice">发布公告</button>
    </view>
    <!--公告-->
    <view v-if="groupNoticeList.length" class="group-notice-list">
      <view v-for="item in groupNoticeList" class="group-notice-list-item" :key="item.id">
				<view v-if="isAdmin"  @tap="deleteNotice(item)" class="closeNotice">x</view>
        <view class="title">
          <view>{{ item.title }}</view>
        </view>
        <view class="content">
          <view>{{ item.content }}</view>
        </view>
        <view class="create-time"><text>{{ item.userName }} 发表于 {{ item.createTime }}</text></view>
      </view>
    </view>
    <!--暂无群公告-->
    <view v-else class="no-group-notice-section">
      <image src="../../static/img/no_message.png"></image>
      <view>暂无群公告!</view>
    </view>
  </view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState({
        userInfo: state => state.home.userInfo,
        activeGroup: state => state.group.activeGroup,
        groupNoticeList: state => state.group.groupNoticeList
      }),
      // 是否为群主
      isAdmin () {
        if (this.activeGroup.members.some(item => { return item.jid === this.userInfo.jid && item.affiliation === 'owner' })) {
          return true
        }
        return false
      }
    },
    onShow () {
      this.init()
    },
    methods: {
      ...mapActions([
        'GetGroupNotice',
				'DeleteGroupNotice'
      ]),
      init () {
        this.GetGroupNotice(this.activeGroup.jid)
      },
      // 发布公告
      goAddGroupNotice () {
        uni.navigateTo({
          url: '../group/add-group-notice'
        })
      },
			deleteNotice(groupNotice){
				// console.log(JSON.stringify(groupNotice))
				let that = this
				uni.showModal({
						title: '提示',
						content: '确定要删除该公告吗？',
						success: function (res) {
								if (res.confirm) {
									that.DeleteGroupNotice(groupNotice.id).then(() =>{
									   that.GetGroupNotice(that.activeGroup.jid)
									})
								} else if (res.cancel) {
								}
						}
				});
			}
    }
  }
</script>

<style lang="scss">
  .group-notice-main-component {
    .group-notice-list {
      padding: 40upx 20upx 0 20upx;
      .group-notice-list-item {
				position: relative;
        padding: 20upx;
				margin-bottom:20upx;
        border-radius: 10upx;
        background: white;
        .title, .content {
					width: 100%;
					word-wrap:break-word;
          display: flex;
          text {
            color: gray;
          }
          view {
            flex: 1;
            margin-left: 10upx;
          }
        }
				.title {
					font-size: 35upx;
				}
				.content {
					display: inline-block;
					font-size: 32upx;
					color: #606266;
				}
        .owner {
          margin-top: 20upx;
        }
        .owner, .create-time {
          font-size: 24upx;
          text-align: right;
          color: #909399;
					margin-top: 10upx;
        }
      }
    }
    .add-group-notice-section {
			z-index: 333;
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      padding: 20px 0;
      button {
        width: 400upx;
        height: 60upx;
        line-height: 60upx;
        margin: 0 auto;
        font-size: 24upx;
        background-color: #3D89C3;
        border-radius: 40upx;
        color: #FFFFFF;
      }
    }
    .no-group-notice-section {
      padding-top: 40upx;
      text-align: center;
      image {
        width: 100upx;
        height: 100upx;
      }
      view {
        font-size: 24upx;
        color: gray;
      }
    }
		.closeNotice {
			position: absolute;
			right: 30upx;
			top: 10upx;
		}
  }
</style>
