<template>
  <div class="group-info-set-component">
    <el-dialog
      :visible.sync="showGroupInfoDialog"
      :append-to-body="false"
      :modal="false"
      width="400px"
      custom-class="group-set-setting-style"
    >
      <div slot="title" class="dialog-header">群组设置</div>
      <div class="group-name group-info-item">
        <span>群组名称</span>
        <span v-if="!isEditGroupName" class="content">{{ groupNewName }}</span>
        <input v-else ref="groupName" class="content" v-model="groupNewName" type="text" @blur="editGroupName" />
        <strong v-show="!isEditGroupName" class="change-btn"  @click="startEditGroupName">修改</strong>
      </div>
      <!--<div class="group-name group-info-item">-->
        <!--<span>群中昵称</span>-->
        <!--<span v-if="!isEditAliasToGroup" class="content">耿少斌</span>-->
        <!--<input v-else ref="setAliasToGroup" class="content" v-model="groupNewName" type="text" @blur="isEditAliasToGroup = false" />-->
        <!--<strong class="change-btn" @click="startSetAliasToGroup">修改</strong>-->
      <!--</div>-->
      <div class="group-member group-info-item">
        <span>群组成员</span>
        <ul class="member-list">
          <li v-for="(item, index) in groupInfo.members" class="member-list-item" :key="index">
            <!--用户头像-->
            <img v-if="item.photo" :src="item.photo" style="width: 30px; height: 30px;" alt="成员头像" />
            <img v-else src="../../assets/images/boy.png" style="width: 30px; height: 30px;" alt="成员默认头像" />
            <span>{{ item.name }}</span>
          </li>
        </ul>
        <!--<div style="margin-top: 10px">-->
        <!--<template v-for="item in groupInfo.members">-->
        <!--<img v-if="item.photo" :src="item.photo" style="width: 50px; height: 50px;" alt="成员头像" />-->
        <!--<img v-else src="../../assets/images/boy.png" style="width: 50px; height: 50px;" alt="成员默认头像" />-->
        <!--</template>-->
        <!--</div>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    data () {
      return {
        showGroupInfoDialog: false,
        isEditGroupName: false,
        isEditAliasToGroup: false,
        groupInfo: {},
        // 新的群名
        groupNewName: '',
        // 在群中的昵称
        aliasToGroup: ''
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.home.userInfo
      })
    },
    mounted () {
      this.$nextTick(() => {
        this.$on('groupInfoSet-event', (data) => {
          this.groupInfo = JSON.parse(JSON.stringify(data))
          this.showGroupInfoDialog = true
          this.groupNewName = data.name
        })
      })
    },
    methods: {
      ...mapActions([
        'SetAliasToGroup',
        'SetGroupName',
        'UpdateGroupInfoByRoomId',
        'sendOtherMessage'
      ]),
      // 开始设置
      startSetAliasToGroup () {
        this.isEditAliasToGroup = true
        this.$nextTick(() => {
          this.$refs.setAliasToGroup.focus()
        })
      },
      // 设置群中备注
      setAliasToGroup () {
        this.isEditAliasToGroup = false
        if (!this.aliasToGroup.replace(/\s/g, '')) return
        this.SetAliasToGroup({
          groupJid: this.groupInfo.jid,
          alias: this.aliasToGroup
        })
      },
      // 开始编辑群名
      startEditGroupName () {
        // 群主判定
        // if (this.userInfo.jid !== this.groupInfo.members.filter(item => { return item.affiliation === 'owner' })[0].jid)
        this.isEditGroupName = true
        this.$nextTick(() => {
          this.$refs.groupName.focus()
        })
      },
      // 编辑群名
      editGroupName () {
        this.UpdateGroupInfoByRoomId({
          roomJid: this.groupInfo.jid,
          naturalName: this.groupNewName
        })
          .then(data => {
            if (data.data === 1) {
              // 多端消息同步 => 创建群聊
              this.sendOtherMessage({
                to: `${this.userInfo.jid}/SyntoIM-APP`,
                content: JSON.stringify({
                  type: 'updateGroupInfo',
                  roomId: this.groupInfo.jid
                }),
                type: 'PORT_SYNC'
              })
            } else {
              this.$message({
                title: '群组名称修改失败!',
                icon: 'none'
              })
              this.groupNewName = this.groupInfo.name
            }
            this.isEditGroupName = false
          })
          .catch(() => {
            this.groupNewName = this.groupInfo.name
            this.isEditGroupName = false
          })
        // this.SetGroupName({
        //   jid: this.userInfo.jid,
        //   groupJid: this.groupInfo.jid,
        //   groupName: this.groupNewName
        // })
      }
    }
  }
</script>

<style lang="scss">
  .group-info-set-component {
    color: #000000;
    font-size: 14px;
    .group-set-setting-style {
      border: 1px solid #e4e7ed;
      -webkit-box-shadow: 0 0 10px #000;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.3) !important;
    }
    .dialog-header{
      font-size: 16px;
      color: #000;
    }
    .el-dialog__body {
      padding: 20px;
    }
    .group-info-item {
      display: flex;
      span:nth-child(1) {
        margin-right: 10px;
        color: gray;
      }
      .content {
        flex: 1;
        color: #000;
      }
      .change-btn {
        margin-left: 20px;
        font-weight: normal;
        cursor: pointer;
      }
      input{
        width: 200px;
        height: 30px;
        padding: 0 10px;
        border: none;
        outline: none;
        background: #f7f7f7;
        color:#000;
      }
    }
    .group-name {
      align-items: center;
      line-height: 40px;
      margin-top: -10px;
      margin-bottom: 10px;
    }
    .group-member {
      color: gray;
      .member-list {
        color:#000;
        flex: 1;
        max-height: 200px;
        overflow: auto;
        font-size: 13px;
        .member-list-item {
          display: flex;
          align-items: center;
          span {
            margin-left: 8px;
          }
        }
        li + li {
          margin-top: 5px;
        }
      }
      span { color: #000; }
    }
    .group-member-name {
      display: flex;
      align-items: center;
      line-height: 40px;
    }
    .group-nickname {
      display: flex;
      align-items: center;
      line-height: 40px;
      span {
        margin-right: 10px;
        color: gray;
      }
      .alias {
        cursor: pointer;
      }
      input {
        width: 200px;
        height: 30px;
        padding: 0 10px;
        border: none;
        background: #f7f7f7;
        outline: none;
      }
    }
    .group-member {
      &>div {
        display: flex;
        flex-wrap: wrap;
        img {
          margin: 0 5px;
          margin-top: 5px;
        }
      }
      /*img + img {*/
      /*margin-left: 10px;*/
      /*}*/
    }
    .checkbox {
      line-height: 30px;
    }
  }
</style>
