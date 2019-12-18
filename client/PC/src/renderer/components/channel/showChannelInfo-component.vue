<template>
  <el-dialog :visible.sync="showDialog" width="400px" :modal="false" >
    <h5 slot="title" style="color: black">会话详情</h5>
    <div class="show-channel-info-component">
      <img
        v-if="!isFriend && channelInfo.channelType !== 'G'"
        class="add-friend"
        src="../../assets/images/add-friend-icon.png"
        @click="addFriend" />
      <div class="top">
        <div class="nickname">
          <div>
            {{channelInfo.name ? channelInfo.name : channelInfo.name}}
            <template v-if="channelInfo.channelType === 'G'">
              <span style="font-size: 12px">(群组)</span>
            </template>
            <template v-else>
              <i v-if="channelInfo.sex === '男'" class="iconfont icon-nan nan"></i>
              <i v-else class="iconfont icon-nv nv"></i>
              <!-- <p v-if="channelInfo.friendJid" class="add-friend" style="color: gray;"><span>已添加好友</span></p> -->
            </template>
          </div>
        </div>
        <div v-if="channelInfo.photo || channelInfo.headUrl" class="imgage">
          <img :src="channelInfo.photo || channelInfo.headUrl" alt="用户头像" style="width: 50px; height: 50px" />
        </div>
        <template v-else>
          <div class="imgage" v-if="channelInfo.channelType === 'G'">
            <img class="status-wrapper-image" src="../../assets/images/qun.png" alt="">
          </div>
          <div class="imgage" v-else>
            <img class="status-wrapper-image" src="../../assets/images/boy.png"/>
          </div>
        </template>
      </div>
      <div class="infoItem">
        <el-row>
          <el-col :span="4"><span class="title">姓名</span></el-col>
          <el-col :span="20">{{channelInfo.name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><span class="title">账号</span></el-col>
          <el-col :span="20">{{channelInfo.jid}}</el-col>
        </el-row>
      </div>
      <!--<div class="btn">-->
      <!--<el-button type="success">发消息</el-button>-->
      <!--</div>-->
    </div>
  </el-dialog>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    data () {
      return {
        showDialog: false,
        channelInfo: {}
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.home.userInfo,
        localMemberData: state => state.home.localMemberData,
        friendList: state => state.home.friendList,
        activeMember: state => state.home.activeMember
      }),
      isFriend () {
        // console.log('this.activeMember', this.activeMember)
        if (this.channelInfo.jid === this.userInfo.jid) return true
        if (this.friendList.some(item => { return item.jid === this.channelInfo.jid })) {
          return true
        }
        return false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$on('openDialog', data => {
          this.showDialog = true
          if (data.channelType === 'P') {
            // this.channelInfo = data
            if (!this.localMemberData.some(item => { return item.jid === data.jid })) this.channelInfo = data
            this.localMemberData.forEach(item => {
              if (item.jid === data.jid) {
                this.channelInfo = item
              }
            })
          } else {
            this.channelInfo = data
          }
        })
      })
    },
    methods: {
      ...mapMutations([
        'ADD_FRIEND'
      ]),
      ...mapActions([
        'AddFriend'
      ]),
      // 添加好友
      addFriend () {
        this.$confirm('确定将其添加为常用联系人吗?', '提示', {
          type: 'success'
        })
          .then(() => {
            this.showDialog = false
            this.AddFriend({
              alias: this.channelInfo.name,
              friendJid: this.channelInfo.jid,
              userName: this.userInfo.jid.split('@')[0]
            })
              .then(data => {
                if (data.friendJid) {
                  let nodeInfo = {
                    ...this.channelInfo,
                    id: data.id,
                    username: this.userInfo.jid.split('@')[0],
                    friendJid: this.channelInfo.jid,
                    alias: this.channelInfo.name,
                    rightKeyMenu: false
                  }
                  this.ADD_FRIEND(nodeInfo)
                  // 如果当前用户详情展示的是当前添加的好友信息，更新其信息，避免重复添加
                  if (this.channelInfo.jid === this.activeMember.jid) this.SET_ACTIVE_MEMBER({ ...nodeInfo })
                } else {
                  this.$messgae({
                    type: 'error',
                    message: '添加常用联系人失败!',
                    duration: 500
                  })
                }
              })
              .catch(err => {
                console.log(err)
                this.$messgae({
                  type: 'error',
                  message: '添加常用联系人失败!',
                  duration: 500
                })
              })
          })
          .catch(() => {
            this.showDialog = false
          })
      }
    }
  }
</script>

<style lang="scss">
  .show-channel-info-component {
    position: relative;
    margin-top: -20px;
    .add-friend {
      position: absolute;
      bottom: 0;
      right: 10px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .top {
      display: flex;
      justify-content: space-between;
      padding-top: 5px;
      height: 75px;
      border-bottom: 1px solid #DBD9D6;
      .nickname {
        font-size: 16px;
        float: left;
        i{
          font-size: 14px;
          margin-left: 5px;
        }
        .nv{
          color: #F37E7D;
        }
        .nan{
          color: #46B6EF;
        }
      }
      .status-wrapper-image {
        border-radius: 100%;
        width: 100%;
        height: 100%;
        background-color: #DDDEE0;
      }
      .imgage {
        width: 64px;
        height: 64px;
        float: right;
        border-radius: 32px;
      }
    }
    .infoItem {
      padding-top: 15px;
      height: 80px;
      line-height: 35px;
      font-size: 14px;
      .title {
        color: #888;
      }
    }
    .btn {
      height: 30px;
      text-align: center;
      padding: 20px 0 0 0;
      button {
        padding: 12px 50px;
      }
    }
  }
</style>
