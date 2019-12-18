<template>
  <div class="create-group-component">
    <el-dialog
      :visible.sync="showCreateGroupDialog"
      title="创建群聊"
      width="400px"
    >
      <div class="create-group-main-section">
        <div class="group-name">
          <span>群组名称:</span>
          <input type="text" v-model="groupName" placeholder="请输入群组名称!" />
        </div>
        <div class="group-members">
          <span>群组成员:</span>
          <el-checkbox-group v-model="selectMembers">
            <el-checkbox v-for="member in friendList" :key="member.jid" :label="member.friendJid">
              <img v-if="member.photo" :src="member.photo" style="width: 20px; height: 20px" alt="成员头像" />
              <img v-else src="../../assets/images/boy.png" alt="成员默认头像" style="width: 20px; height: 20px" />
              {{ member.name ? member.name : member.jid.split('@')[0] }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="group-button">
          <el-button type="primary" @click="createGroup">创建</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    data () {
      return {
        showCreateGroupDialog: false,
        selectMembers: [],
        groupName: '',
        groupJid: ''
      }
    },
    computed: {
      ...mapState({
        friendList: state => state.home.friendList,
        userInfo: state => state.home.userInfo
      })
    },
    mounted () {
      this.$on('createEvent-event', (data) => {
        this.showCreateGroupDialog = true
      })
    },
    methods: {
      ...mapMutations([
        'SET_SELECTED_CHANNEL_BY_JID',
        'SET_ACTIVETAB'
      ]),
      ...mapActions([
        'AddGroupMember',
        'CreateGroup',
        'SaveGroup',
        'getSessionByJid',
        'addNewSession',
        'sendOtherMessage'
      ]),
      // 创建群聊
      createGroup () {
        if (!this.groupName.replace(/\s/g, '')) {
          this.$message({
            type: 'warning',
            message: '请输入有效群组名称!',
            duration: 500
          })
          return
        }
        const formData = {
          userName: this.userInfo.jid.split('@')[0],
          groupName: this.groupName
        }
        this.CreateGroup(formData)
          .then(data => {
            this.showCreateGroupDialog = false
            this.groupJid = data.groupJid
            data = {
              ...data,
              ...formData
            }
            this.saveGroup(data)
          })
      },
      // 保存为永久群聊
      saveGroup (data) {
        // console.log(this.groupJid)
        this.SaveGroup(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '群组创建成功!',
              duration: 500
            })
            this.groupName = ''
            // 多端消息同步 => 创建群聊
            this.sendOtherMessage({
              to: `${this.userInfo.jid}/SyntoIM-APP`,
              content: JSON.stringify({
                type: 'createGroup',
                roomId: this.groupJid
              }),
              type: 'PORT_SYNC'
            })
            this.startSendMessage(this.groupJid)
            // console.log(this.selectMembers)
            // 添加群成员
            this.AddGroupMember({
              groupJid: this.groupJid,
              addList: this.selectMembers
            })
            this.selectMembers = []
            this.groupJid = ''
          })
      },
      // 创建群聊成功，默认打开会话窗口
      startSendMessage (jid) {
        console.log(`+++${jid}`)
        // 更新会话列表
        this.getSessionByJid({ jid: jid })
          .then(resp => {
            if (resp) {
              // console.log('存在会话', resp)
              this.SET_SELECTED_CHANNEL_BY_JID(jid)
            } else {
              // 新增
              this.addNewSession({
                jid: jid,
                lastMessage: '',
                createTime: Date.now(),
                unreadMessageCount: 0,
                channelType: 'G'
              }).then(() => {
                this.SET_SELECTED_CHANNEL_BY_JID(jid)
              })
            }
            this.SET_ACTIVETAB('message')
          })
      }
    }
  }
</script>

<style lang="scss">
  .create-group-component {
    .create-group-main-section {
      .group-name {
        display: flex;
        align-items: center;
        span {
          margin-right: 10px;
        }
        input {
          height: 30px;
          padding: 0 10px;
          border: none;
          background: #f7f7f7;
          outline: none;
          border-radius: 4px;
        }
      }
      .group-members {
        .el-checkbox-group {
          height: 150px;
          margin-top: 10px;
          overflow: auto;
          .el-checkbox {
            display: flex;
            align-items: center;
            /*margin-top: 5px;*/
            padding: 5px 0;
            &:hover {
              background: #f7f7f7;
            }
            .el-checkbox__label {
              display: flex;
              align-items: center;
              img {
                margin-right: 10px;
              }
            }
          }
        }
      }
      .group-button {
        margin-top: 20px;
        text-align: center;
        .el-button {
          width: 150px;
          height: 30px;
          padding: 0;
        }
      }
    }
  }
</style>
