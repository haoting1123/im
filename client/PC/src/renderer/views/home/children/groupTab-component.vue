<template>
  <el-container class="group-main-container">
    <el-aside class="aside-section">
      <search @onsearch="onSearchGroup"></search>
      <div class="group-list-box">
        <ul>
          <li
            v-for="group in filterGroupList"
            :key="group.jid"
            :style="{ 'background-color': activeGroup.jid === group.jid ? '#EBEBEC' : 'white' }"
            @click="selectGroup(group)"
            @click.right="operationGroup($event, group)"
            class="group-list-item"
          >
            <div class="group">
              <!--群组头像-->
              <!--<div class="group-avatar">-->
                <!--<template v-if="group.members && group.members.length">-->
                  <!--<div-->
                    <!--:style="{ height: group.members.length >= 4 ? '16px' : '24px', lineHeight: group.members.length >= 4 ? '16px' : '24px' }"-->
                    <!--v-for="item in group.members"-->
                    <!--:key="item.jid"-->
                  <!--&gt;-->
                    <!--<img-->
                      <!--v-if="item.photo"-->
                      <!--:src="item.photo"-->
                      <!--:style="{ width: group.members.length >= 4 ? '14px' : '22px', height: group.members.length >= 4 ? '14px' : '22px'}" alt="群头像"-->
                    <!--/>-->
                    <!--<img-->
                      <!--v-else-->
                      <!--src="../../../assets/images/boy.png"-->
                      <!--alt="默认用户头像"-->
                      <!--:style="{ width: group.members.length >= 4 ? '14px' : '22px', height: group.members.length >= 4 ? '14px' : '22px'}"/>-->
                  <!--</div>-->
                <!--</template>-->
              <!--</div>-->
              <img src="../../../assets/images/qun.png" style="width: 40px; height: 40px;" alt="群默认头像" />
              <div class="group-name ellipsis" :title="group.name">
                <strong>{{ group.name }}</strong>
              </div>
            </div>
            <!--右键菜单-->
            <div
              :style="{ left: rightKeyMenuPosition.x, top: rightKeyMenuPosition.y }"
              class="right-key-menu"
              v-if="group.rightKeyMenu"
            >
              <ul>
                <!--<li v-if="userInfo.jid === group.members.filter(item => { return item.affiliation === 'owner'  })[0].jid" @click.stop="startSetGroupName(group)">修改群名称</li>-->
                <li v-if="userInfo.jid === group.members.filter(item => { return item.affiliation === 'owner'  })[0].jid" @click.stop="destoryGroup">解散群组</li>
                <li v-if="userInfo.jid !== group.members.filter(item => { return item.affiliation === 'owner'  })[0].jid" @click.stop="exitGroup">退出群聊</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </el-aside>
    <el-main class="main-section">
      <!--默认同意添加到群组-->
      <!--<group-invite v-if="!activeGroup.jid"></group-invite>-->
      <groupinfo-component v-show="activeGroup.members && activeGroup.members.length" :group="activeGroup"></groupinfo-component>
    </el-main>
    <!--修改群名，临时使用-->
    <el-dialog :visible.sync="showSetGroupNameDialog" title="修改群名">
      <el-input v-model="groupName"></el-input>
      <div style="margin-top: 20px">
        <el-button @click="setGroupName" type="primary" size="mini">提交</el-button>
      </div>
    </el-dialog>
    <!--群组信息-->
    <group-set-component ref="groupInfoSet"></group-set-component>
  </el-container>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    data () {
      return {
        activeGroupId: '',
        activeGroup: {},
        // 右键菜单位置
        rightKeyMenuPosition: {
          x: 0,
          y: 0
        },
        showAddMemberDialog: false,
        showDelteMemberDialog: false,
        memberName: '',
        groupName: '',
        showSetGroupNameDialog: false,
        searchValue: ''
      }
    },
    components: {
      search: require('@/components/common/search').default,
      groupSetComponent: require('@/components/group/groupSet-component').default,
      groupinfoComponent: require('@/components/group/groupinfo-component').default
    },
    computed: {
      ...mapState({
        groupList: state => state.group.groupList,
        userInfo: state => state.home.userInfo,
        rightKeyMenu: state => state.home.rightKeyMenu
      }),
      filterGroupList () {
        return this.groupList.filter(item => {
          if (item.name.indexOf(this.searchValue) !== -1) return true
        })
      }
    },
    watch: {
      rightKeyMenu: function (val, oldval) {
        if (!val) {
          this.initGroupList({ jid: '' })
        }
      },
      // 监听群组变化，更新当前选定群组数据
      groupList: function (val, oldval) {
        if (!val.some(item => { return item.jid === this.activeGroup.jid })) {
          this.activeGroup = {}
          return
        }
        val.forEach(item => {
          if (item.jid === this.activeGroup.jid) {
            this.activeGroup = item
          }
        })
      }
    },
    mounted () {
      this.initData()
    },
    methods: {
      ...mapActions([
        'CreateGroup',
        'AddGroupMember',
        'EnterGroup',
        'ExitGroup',
        'SetAliasToGroup',
        'SetGroupName',
        'DestoryGroup',
        'PutForwardGroupListener',
        'GetGroupList'
      ]),
      ...mapMutations([
        'SET_RIGHTKEYMENU',
        'SET_SELECTED_CHANNEL_BY_JID'
      ]),
      initData () {
        // this.GetGroupList()
        this.PutForwardGroupListener()
      },
      // 搜索群组
      onSearchGroup (value) {
        this.searchValue = value
      },
      // 解散群组
      destoryGroup () {
        this.initGroupList({})
        const data = {
          jid: this.userInfo.jid,
          groupJid: this.activeGroupId
        }
        this.DestoryGroup(data)
      },
      startSetGroupName (group) {
        this.showSetGroupNameDialog = true
        // 修改群名称前必须进入一次群组
        this.selectGroup(group)
        this.initGroupList({})
      },
      // 设置群名称
      setGroupName () {
        this.showSetGroupNameDialog = false
        const data = {
          jid: this.userInfo.jid,
          groupJid: this.activeGroupId,
          groupName: this.groupName
        }
        this.SetGroupName(data)
      },
      // 右键操作
      operationGroup (event, group) {
        this.rightKeyMenuPosition.x = `${event.x}px`
        this.rightKeyMenuPosition.y = `${event.y}px`
        this.activeGroupId = group.jid
        this.SET_RIGHTKEYMENU(true)
        this.initGroupList(group)
      },
      initGroupList (group) {
        this.groupList.forEach(item => {
          if (item.jid === group.jid) {
            item.rightKeyMenu = true
            return
          }
          item.rightKeyMenu = false
        })
      },
      // 选择群组
      selectGroup (group) {
        console.log(`当前群聊：${JSON.stringify(group)}`)
        this.activeGroupId = group.jid
        this.activeGroup = group
        this.enterGroup()
        this.searchValue = ''
      },
      // 进入房间
      enterGroup () {
        const data = {
          userJid: this.userInfo.jid,
          groupJid: this.activeGroup.jid
        }
        this.EnterGroup(data)
      },
      // 退出群组
      exitGroup () {
        this.initGroupList({})
        const data = {
          userJid: this.userInfo.jid,
          groupJid: this.activeGroupId
        }
        console.log(data)
        this.ExitGroup(data)
      }
      // 显示群组邀请模块
      // showGroupInvite () {
      //   this.activeGroup = {}
      // }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .group-main-container {
    height: 100%;
    background-color: #e7f0f5;
    overflow: hidden;
    .aside-section {
      position: relative;
      width: 220px !important;
      border-right: 1px solid #ececec;
      background: white;
      overflow: visible;
      .group-list-box {
        max-height: calc(100vh - 68px);
        padding-right: 6px;
        overflow: auto;
        .group-list-item{
          .group {
            display: flex;
            padding: 10px;
            border-bottom: 2px solid #FFFFFF;
            /*line-height: 50px;*/
            line-height: 40px;
            cursor: pointer;
            &:hover {
              background: #EBEBEC;
            }
            .group-avatar {
              display: flex;
              flex-wrap: wrap-reverse;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 48px;
              background: #eaeaea;
              text-align: center;
              overflow: hidden;
              div {
                flex: 1;
                line-height: 16px;
                font-size: 0;
                text-align: center;
                img {
                  vertical-align: middle;
                }
              }
            }
            .group-name {
              margin-left: 10px;
              strong {
                font-weight: normal;
              }
            }
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
    .main-section {
      padding: 0;
      background: white;
    }
  }
</style>
