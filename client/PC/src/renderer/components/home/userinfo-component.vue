<template>
  <div class="userinfo-component" v-if="activeMember.jid">
    <div style="padding: 0 20%">
      <header class="title-section">
        <div class="username-box">
          <h3>{{activeMember.name ? activeMember.name : activeMember.jid.split('@')[0]}}</h3>
          <span v-if="activeMember.alias && activeTab !== 'tree'">{{activeMember.alias ? activeMember.alias : activeMember.jid.split('@')[0]}}</span>
        </div>
        <div class="avatar-box">
          <img v-if="activeMember.photo" :src="activeMember.photo" alt="用户头像" />
          <img v-else src="../../assets/images/boy.png" alt="用户头像" />
        </div>
      </header>
      <section class="content-section">
        <div class="userinfo-box">
          <div class="note" v-if="activeTab !== 'tree'">
            <span>备注</span>
            <input
              ref="aliasInput"
              v-if="isEditAlias"
              v-model="alias"
              @blur="setFriendAlias"
              type="text" />
            <p v-else @click="startSetAlias" style="cursor: pointer">{{ activeMember.alias ? activeMember.alias : '点击设置常用联系人备注' }}</p>
            <img src="../../assets/images/fanhui@2x.png" alt="icon" />
          </div>
          <div class="department">
            <span>部门</span>
            <strong>{{ activeMember.groupName }}</strong>
            <!--添加好友-->
            <img
              v-if="!isFriend"
              class="add-friend"
              src="../../assets/images/add-friend-icon.png"
              alt="add-friend-icon"
              @click="addFriend"
            />
          </div>
        </div>
        <div class="submit-box">
          <el-button type="primary" @click="startSendMessage" :disabled="userInfo.jid === activeMember.jid">发消息</el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    // props: ['friendInfo'],
    data () {
      return {
        isEditAlias: false,
        alias: ''
      }
    },
    mounted () {
      this.alias = this.activeMember.alias
    },
    computed: {
      ...mapState({
        userInfo: state => state.home.userInfo,
        activeTab: state => state.home.activeTab,
        activeMember: state => state.home.activeMember,
        friendList: state => state.home.friendList
      }),
      isFriend () {
        console.log('this.activeMember', this.activeMember)
        // console.log('this.userInfo.jid', this.userInfo.jid)
        if (this.activeMember.jid === this.userInfo.jid) return true
        if (this.friendList.some(item => { return item.jid === this.activeMember.jid })) {
          return true
        }
        return false
      }
    },
    watch: {
      activeMember: function (val, oldval) {
        console.log(`activeMember:`, JSON.stringify(val))
        this.alias = val.alias
      }
    },
    methods: {
      ...mapActions([
        'getSessionByJid',
        'addNewSession',
        'AddFriend',
        'SetFriendAlias'
        // 'GetFriendList',
      ]),
      ...mapMutations([
        'SET_ACTIVETAB',
        'SET_SELECTED_CHANNEL_BY_JID',
        'ADD_FRIEND',
        'UPDATE_FRIENDINFO',
        'SET_ACTIVE_MEMBER'
      ]),
      // 发消息
      startSendMessage () {
        // console.log(this.activeMember)
        // 更新会话列表
        this.getSessionByJid({ jid: this.activeMember.jid })
          .then(resp => {
            if (resp) {
              // console.log('存在会话', resp)
              this.SET_SELECTED_CHANNEL_BY_JID(this.activeMember.jid)
              this.SET_ACTIVETAB('message')
            } else {
              // 新增
              this.addNewSession({
                jid: this.activeMember.jid,
                lastMessage: '',
                createTime: Date.now(),
                unreadMessageCount: 0,
                channelType: 'P'
              }).then(() => {
                this.SET_SELECTED_CHANNEL_BY_JID(this.activeMember.jid)
                this.SET_ACTIVETAB('message')
              })
            }
          })
      },
      // 添加常用联系人
      addFriend () {
        this.$confirm('确定添加至通讯录吗？', '添加常用联系人', {
          type: 'success'
        })
          .then(() => {
            this.AddFriend({
              alias: this.activeMember.name,
              friendJid: this.activeMember.jid,
              userName: this.userInfo.jid.split('@')[0]
            })
              .then(data => {
                if (data.friendJid) {
                  let nodeInfo = {
                    ...this.activeMember,
                    id: data.id,
                    friendJid: this.activeMember.jid,
                    alias: this.activeMember.name,
                    username: this.userInfo.jid.split('@')[0],
                    rightKeyMenu: false
                  }
                  this.ADD_FRIEND(nodeInfo)
                  // 将要删除 start
                  // this.$emit('updateNodeInfo', nodeInfo)
                  // 将要删除 end
                  this.SET_ACTIVE_MEMBER({
                    ...nodeInfo
                  })
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
          .catch(() => {})
      },
      // 开始设置备注
      startSetAlias () {
        this.isEditAlias = true
        this.$nextTick(() => {
          this.$refs.aliasInput.focus()
        })
      },
      // 设置备注
      setFriendAlias (event) {
        this.isEditAlias = false
        let alias = event.target.value
        const formData = {
          id: this.activeMember.id,
          userName: this.activeMember.username,
          friendJid: this.activeMember.friendJid,
          alias: alias
        }
        this.SetFriendAlias(formData)
          .then(data => {
            this.SET_ACTIVE_MEMBER({
              ...this.activeMember,
              alias: alias
            })
          })
          .catch(err => {
            this.alias = this.activeMember.alias
            this.$message({
              type: 'error',
              message: '设置备注失败!',
              duration: 500
            })
            console.log(err)
          })
      }
    }
  }
</script>

<style lang="scss">
  .userinfo-component {
    width: 100%;
    margin-top: 20%;
    .add-friend {
      /*position: fixed;*/
      /*top:40px;*/
      /*right: 20px;*/
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .title-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      /*line-height: 60px;*/
      padding-bottom: 10px;
      border-bottom: 1px solid #dfdfdf;
      h3 {
        font-size: 16px;
      }
      img {
        width: 60px;
        height: 60px;
      }
    }
    .content-section {
      margin-top: 10px;
      .userinfo-box {
        font-size: 14px;
        &>div {
          height: 30px;
          line-height: 30px;
        }
        span {
          margin-right: 10px;
          color: gray;
        }
        .note {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: gray;
          input {
            flex: 1;
            height: 29px;
            border: none;
            outline: none;
          }
          p {
            flex: 1;
          }
          img {
            width: 7px;
            height: 11px;
          }
        }
        .department {
          display: flex;
          align-items: center;
          margin-top: 10px;
          padding-right: 10px;
          strong {
            flex: 1;
            font-weight: normal;
          }
        }
      }
      .submit-box {
        margin-top: 70px;
        text-align: center;
        .el-button {
          width: 195px;
          height: 30px;
          padding: 0;
          font-family: '微软雅黑';
          background: #1C91F3;
        }
      }
    }
  }
</style>
