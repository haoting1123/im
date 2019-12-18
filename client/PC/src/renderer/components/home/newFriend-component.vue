<template>
  <div class="new-friend-component">
    <div class="title-section">
      <h2>新的朋友</h2>
    </div>
    <div class="content-section">
      <ul class="new-friend-list">
        <li
          v-for="item in friendRequestList"
          :key="item.fromUser"
        >
          <div class="user-avatar">
            <div class="img"></div>
          </div>
          <div class="user-info">
            <div class="user-name">
              <h4>{{ item.name }}</h4>
              <p>{{ item.message }}</p>
            </div>
            <div class="button-group">
              <el-button class="aggree-button" @click="aggreeQuest(item)">接受</el-button>
              <el-button class="reject-button" @click="rejectQuest(item)">拒绝</el-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      friendRequestList: state => state.home.friendRequestList,
      userInfo: state => state.home.userInfo
    })
  },
  methods: {
    ...mapActions([
      'RejectFriendRequest',
      'AggreeFriendRequest',
      'GetFriendList',
      'GetFriendInfo'
    ]),
    // 拒绝好友请求
    rejectQuest (data) {
      console.log('拒绝常用联系人请求!')
      this.RejectFriendRequest(data)
    },
    // 同意好友请求
    aggreeQuest (data) {
      this.AggreeFriendRequest(data)
      // 刷新好友列表
      this.GetFriendList(this.userInfo.jid)
        .then(allFriend => {
          console.log('常用联系人列表', allFriend)
          allFriend.forEach(item => {
            this.GetFriendInfo(item.name)
          })
        })
    }
  }
}
</script>

<style lang="scss">
.new-friend-component {
  .title-section {
    h2 {
      height: 55px;
      line-height: 55px;
      margin: 0;
      padding-left: 20px;
      border-bottom: 1px solid #dfdfdf;
      font-size: 16px;
    }
  }
  .content-section {
    .new-friend-list {
      padding-left: 40px;
      li {
        display: flex;
        .user-avatar {
          width: 40px;
          height: 40px;
          padding: 10px;
          .img {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .1);
          }
        }
        .user-info {
          flex: 1;
          height: 40px;
          padding: 10px;
          border-bottom: 1px solid #dfdfdf;
          display: flex;
          .user-name {
            flex: 1;
            line-height: 20px;
            h4 {
              font-size: 14px;
            }
            p { font-size: 12px; }
          }
          .button-group {
            line-height: 40px;
            .el-button {
              width: 52px;
              height: 24px;
              line-height: 24px;
              padding: 0;
              border: none;
              font-size: 12px;
              border-radius: 20px;
              color: white;
            }
            .aggree-button {
              background: #45AE26;
            }
            .reject-button {
              background: #E9293B;
            }
          }
        }
      }
    }
  }
}
</style>
