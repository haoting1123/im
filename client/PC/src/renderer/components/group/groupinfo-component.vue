<template>
  <div class="group-info-component">
    <!--头部-->
    <header v-if="group.jid" class="header-box">
      <el-dropdown
        trigger="click"
        @command="distributeEvent"
      >
        <span class="el-dropdown-link">
          <i class="el-icon-menu" style="font-size: 16px;"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">邀请成员</el-dropdown-item>
          <!--<el-dropdown-item command="set">设置权限</el-dropdown-item>-->
          <el-dropdown-item command="info">群组设置</el-dropdown-item>
          <el-dropdown-item command="exit">退出群组</el-dropdown-item>
          <el-dropdown-item v-if="group.members && userInfo.jid === group.members.find(item => { return item.affiliation === 'owner' }).jid" command="dissolve">解散群组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </header>
    <!--body-->
    <div v-if="group.jid" class="main-section">
      <section class="content-box">
        <div>
          <h3>{{ group.name }}</h3>
          <p>{{ group.members.length }}人</p>
          <el-button type="primary" @click="startSendMessage">发送消息</el-button>
        </div>
      </section>
      <section class="aside-box">
        <h3 class="title"><span>群成员</span>{{ group.members.length }}人</h3>
        <ul class="member-list">
          <li
            v-for="(member, index) in filterGroupMembers"
            :key="member.jid"
            class="member-list-item"
            @click.right="operatioMember($event, member)"
          >
            <img v-if="member.photo" :src="member.photo" alt="成员头像" style="width: 20px; height: 20px" />
            <img v-else src="../../assets/images/boy.png" alt="默认用户头像" style="width: 20px; height: 20px" />
            <span class="member-name ellipsis">{{ member.name }}</span>
            <img v-if="member.affiliation === 'owner'" src="../../../../static/icon/group-admin.png" alt="" style="width: 28px; height: 15px; margin-left: 5px" />
            <!--右键菜单-->
            <div
              :style="{ left: rightKeyMenuPosition.x, top: rightKeyMenuPosition.y }"
              class="right-key-menu"
              v-if="member.rightKeyMenu"
            >
              <ul>
                <li
                  v-if="group.members.length && userInfo.jid === group.members.filter(item => { return item.affiliation === 'owner' })[0].jid && userInfo.jid !== member.jid"
                  @click="deleteMember(member)"
                >
                  删除成员
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </section>
    </div>
    <!--添加成员-->
    <add-member ref="addMemberGroup" :channelId="group.jid" :data="treeDataForGroup"></add-member>
    <!--群组信息-->
    <group-set ref="groupSetGroup"></group-set>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    props: ['group'],
    data () {
      return {
        // 右键菜单位置
        rightKeyMenuPosition: {
          x: 0,
          y: 0
        }
      }
    },
    components: {
      addMember: require('@/components/channel/addMember.vue').default,
      groupSet: require('@/components/group/groupSet-component.vue').default
    },
    computed: {
      ...mapState({
        sessionList: state => state.session.sessionList,
        treeDataForGroup: state => state.tree.treeDataForGroup,
        userInfo: state => state.home.userInfo,
        rightKeyMenu: state => state.home.rightKeyMenu
      }),
      filterGroupMembers () {
        let result = JSON.parse(JSON.stringify(this.group.members))
        let groupOwner = null
        result.forEach((item, index) => {
          if (item.affiliation === 'owner') {
            groupOwner = item
            result.splice(index, 1)
          }
        })
        result.unshift(groupOwner)
        return result
      }
    },
    watch: {
      rightKeyMenu: function (val, oldval) {
        if (!val) {
          this.initMemberList({})
        }
      },
      group: function (val, oldval) {
      }
    },
    methods: {
      ...mapMutations([
        'SET_RIGHTKEYMENU',
        'SET_SELECTED_CHANNEL_BY_JID',
        'SET_ACTIVETAB'
      ]),
      ...mapActions([
        'DeleteGroupMember',
        'ExitGroup',
        'DestoryGroup',
        'getSessionByJid',
        'addNewSession'
      ]),
      // 发消息
      startSendMessage () {
        console.log(this.group)
        // 更新会话列表
        this.getSessionByJid({ jid: this.group.jid })
          .then(resp => {
            if (resp) {
              // console.log('存在会话', resp)
              this.SET_SELECTED_CHANNEL_BY_JID(this.group.jid)
            } else {
              // 新增
              this.addNewSession({
                jid: this.group.jid,
                lastMessage: '',
                createTime: Date.now(),
                unreadMessageCount: 0,
                channelType: 'G'
              }).then(() => {
                this.SET_SELECTED_CHANNEL_BY_JID(this.group.jid)
              })
            }
            this.SET_ACTIVETAB('message')
          })
      },
      // 右键操作
      operatioMember (event, group) {
        this.rightKeyMenuPosition.x = `${event.x - 100}px`
        this.rightKeyMenuPosition.y = `${event.y}px`
        // this.activeGroupId = group.jid
        this.SET_RIGHTKEYMENU(true)
        this.initMemberList(group)
      },
      initMemberList (group) {
        if (!this.group.members || !this.group.members.length) return
        this.group.members.forEach(item => {
          if (item.jid === group.jid) {
            item.rightKeyMenu = true
            return
          }
          item.rightKeyMenu = false
        })
      },
      // 分发事件
      distributeEvent (value) {
        switch (value) {
          case 'add':
            this.$refs.addMemberGroup.$emit('openDialog', this.group)
            break
          case 'exit':
            this.exitGroup()
            break
          case 'dissolve':
            this.destoryGroup()
            break
          case 'info':
            this.$refs.groupSetGroup.$emit('groupInfoSet-event', this.group)
        }
      },
      // 删除成员
      deleteMember (member) {
        this.$confirm('确定删除成员吗', '删除群成员!', {
          type: 'warning'
        })
          .then(() => {
            this.DeleteGroupMember({
              groupJid: this.group.jid,
              memberJid: member.jid
            })
          })
          .catch(() => {})
      },
      // 解散群组
      destoryGroup () {
        this.$confirm('确定解散群组吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.DestoryGroup({
              jid: this.userInfo.jid,
              groupJid: this.group.jid
            })
              .then(() => {
                this.$router.push('/noContent')
              })
          })
      },
      // 群出群组
      exitGroup () {
        this.$confirm('确定退出群组吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.ExitGroup({
              userJid: this.userInfo.jid,
              groupJid: this.group.jid
            })
              .then(() => {
                this.$router.push('/noContent')
              })
          })
      }
    }
  }
</script>

<style lang="scss">
  .group-info-component {
    .header-box {
      height: 39px;
      line-height: 39px;
      padding: 0 20px;
      margin-top: 20px;
      border-bottom: 1px solid #ececec;
      text-align: right;
      .el-dropdown-link {
        cursor: pointer;
      }
    }
    .main-section {
      display: flex;
      height: calc(100vh - 60px);
      .content-box {
        position: relative;
        flex: 1;
        border-right: 1px solid #ececec;
        &>div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-80%);
          text-align: center;
          h3 {
            font-size: 18px;
            font-weight: normal;
          }
          p {
            margin-top: 5px;
            font-size: 12px;
          }
          .el-button {
            width: 195px;
            height: 30px;
            margin-top: 100px;
            padding: 0;
            font-family: '微软雅黑', "Microsoft YaHei","黑体","宋体";
          }
        }
      }
      .aside-box {
        width: 160px;
        .title {
          padding: 10px 0 0 10px;
          font-weight: normal;
          font-size: 12px;
          color: gray;
          span {
            margin-right: 10px;
          }
        }
        .member-list {
          max-height: calc(100vh - 96px);
          margin-top: 10px;
          overflow: auto;
          .member-list-item {
            display: flex;
            align-items: center;
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
            &:hover {
              background: #f7f7f7;
            }
            img {
              margin-right: 5px;
            }
            .member-name {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .right-key-menu {
              position: fixed;
              border: 1px solid #E4E7ED;
              box-shadow: 0px 0px 3px #e4e7ed;
              font-size: 12px;
              font-weight: 500;
              color: #000000;
              background: white;
              border-radius: 2px;
              z-index: 9999;
              li {
                height: 30px;
                line-height: 30px;
                padding: 0 20px;
                cursor: pointer;
                &:hover {
                  background: #f2f2f2;
                }
              }
              li +li {
                /*border-top: 1px solid #adadad;*/
              }
            }
          }
        }
      }
    }
  }
</style>
