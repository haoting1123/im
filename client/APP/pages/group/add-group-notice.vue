<template>
  <view class="add-group-notice-main-component">
    <form class="notice-form" @submit="addGroupNotice">
      <label class="notice-form-item notice-title">
        标题
        <input
          v-model="notice.title"
          class="notice-title-content"
          type="text" />
      </label>
      <label class="notice-form-item notice-content">
        内容
        <textarea
          v-model="notice.content"
          class="notice-content-content"
          auto-height="true">
        </textarea>
      </label>
      <view class="add-group-notice-section">
        <button formType="submit">发布</button>
      </view>
    </form>
  </view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    data () {
      return {
        notice: {
          title: '',
          content: ''
        }
      }
    },
    computed: {
      ...mapState({
        activeGroup: state => state.group.activeGroup,
        userInfo: state => state.home.userInfo
      })
    },
    methods: {
      ...mapActions([
        'AddGroupNotice',
        'sendGroupOtherMessage'
      ]),
      // 群主发布群公告
      addGroupNotice () {
        let createTime = new Date()
        this.AddGroupNotice({
          ...this.notice,
          createTime: createTime,
          roomJid: this.activeGroup.jid,
          userName: this.userInfo.name
        })
          .then(data => {
            // console.log(`群公告发布成功:${JSON.stringify(data)}`)
            uni.setStorageSync(this.activeGroup.jid, data.id)
            let obj = {
              title: this.notice.title,
              content: this.notice.content,
              createTime: createTime,
              id: data.id,
              roomJid: this.activeGroup.jid
            }
            if (obj.content.length > 100) {
              obj.content = obj.content.substr(0, 99) + '...'
            }
            this.sendGroupOtherMessage({
              to: this.activeGroup.jid,
              content: JSON.stringify(obj),
              type: 'GROUP_NOTICE'
            })
            this.notice.title = ''
            this.notice.content = ''
            uni.navigateBack()
          })
      }
    }
  }
</script>

<style lang="scss">
  body {
    background: white;
  }
  .add-group-notice-main-component {
    padding: 40upx 40upx 0 40upx;
    .notice-form {
      .notice-form-item {
        display: flex;
        align-items: flex-start;
        .notice-title-content, .notice-content-content {
          flex: 1;
          margin-left: 20upx;
        }
      }
      label + label {
        margin-top: 30upx;
      }
      .notice-title {
        height: 70upx;
        line-height: 70upx;
        .notice-title-content {
          height: 70upx;
          line-height: 70upx;
          border: 1px solid #dedede;
          padding: 0 10upx;
          border-radius: 10upx;
        }
      }
      .notice-content {
        line-height: 70upx;
        .notice-content-content {
          min-height: 400upx;
          line-height: 70upx;
          border: 1px solid #dedede;
          padding: 0 10upx;
          border-radius: 10upx;
          overflow: auto;
        }
      }
    }
    .add-group-notice-section {
      margin-top: 40upx;
      text-align: center;
      button {
        width: 400upx;
        height: 60upx;
        line-height: 60upx;
        font-size: 24upx;
        background-color: #3D89C3;
        border-radius: 40upx;
        color: #FFFFFF;
      }
    }
  }
</style>
