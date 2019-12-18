<template>
  <el-container
    class="home-body-container"
    @click.native="closeRightKeyMenu"
  >
    <!--window窗口-->
    <window-frame></window-frame>
    <el-aside class="home_col_left drag" v-bind:style="{width: leftMenuWidth + 'px'}">
      <div class="menuLeft" v-bind:style="{height: $store.state.drag.homeWindowHeight - 28 + 'px'}">
        <div class="menu-avatar no-drag">
          <div class="avatar">
            <el-popover
              placement="right-end"
              width="260"
              @show="showPopover"
              trigger="click">
              <user-info-popover ref="userInfoPopoverDlg"></user-info-popover>
              <!--<strong slot="reference" style="cursor: pointer">{{ userChannel.alias ? userChannel.alias : userChannel.name }}</strong>-->
              <img v-if="userInfo.photo" slot="reference" :src="userInfo.photo" style="width: 40px; height: 40px; border-radius: 0" alt="用户头像" />
              <img v-else style="width: 40px; height: 40px;" slot="reference" src="../../assets/images/boy.png" alt="默认头像" />
            </el-popover>
          </div>
        </div>
        <div class="menuIcon no-drag" title="聊天">
          <el-badge :value="0" :max="9" :is-dot="true" :hidden="true">
            <div
              class="menu-message menu-message-slt"
              name="menuIconButton"
              id="menuIcon-message"
              @click="tabVisible('message')">
            </div>
          </el-badge>
        </div>
        <div class="menuIcon no-drag" title="通讯录">
          <el-badge :value="0" :max="9" :is-dot="true" :hidden="true">
            <div
              class="menu-friend"
              name="menuIconButton"
              id="menuIcon-friend"
              @click="tabVisible('friend')">
            </div>
          </el-badge>
        </div>
        <div class="menuIcon no-drag" title="群组">
          <div
            class="menu-group"
            name="menuIconButton"
            id="menuIcon-group"
            @click="tabVisible('group')">
          </div>
        </div>
        <div class="menuIcon no-drag" title="组织机构">
          <div
            class="menu-tree"
            name="menuIconButton"
            id="menuIcon-tree"
            @click="tabVisible('tree')">
          </div>
        </div>
        <div class="menuIcon menuMain no-drag">
          <!--<a class="dropdown-icon" title="主菜单"></a>-->
          <el-dropdown trigger="click" @command="handleCommand">
            <img class="img" :src="menuIcon"/>
            <el-dropdown-menu slot="dropdown" class="home-main-menu no-drag">
              <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="messageManage">消息管理</el-dropdown-item>
              <el-dropdown-item command="systemSetting">系统设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-aside>
    <el-main class="home_col_right" v-bind:style="{height: $store.state.drag.homeWindowHeight + 'px', width: $store.state.drag.homeContentWidth + 'px'}">
      <message-tab ref="messageTabPage" v-show="activeTab === 'message'"></message-tab>
      <friend-tab ref="friendsTabPage" v-show="activeTab === 'friend'"></friend-tab>
      <group-tab ref="groupTabPage" v-show="activeTab === 'group'"></group-tab>
      <tree-tab ref="treeTabPage" v-show="activeTab === 'tree'"></tree-tab>
      <!--<keep-alive></keep-alive>-->
    </el-main>

    <!--系统配置-->
    <system-setting
      :showUserInfoDialog.sync="showUserInfoDialog"
      ref="systemSettingDlg"
      v-if="showUserInfoDialog"
    > </system-setting>
    <!-- 修改密码 -->
    <change-password :changePasswordDialog.sync="changePasswordDialog" v-if="changePasswordDialog" ref="changePasswordDlg"></change-password>
    <!--系统公告-->
    <system-notice-component ref="systemNoticeDialog"></system-notice-component>
    <!--消息管理-->
    <message-manage ref="messageManageDialog"></message-manage>
    <!--单人媒体通话-->
    <media-speak-component></media-speak-component>
  </el-container>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import Cookie from '@/utils/cookie'
  import globalEvent from '@/utils/globalEvent'
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    data () {
      return {
        newUserInfo: {
          name: '',
          sex: 'man',
          faceBase64: ''
        },
        avatarUrl: require('@/assets/images/girl.png'),
        menuIcon: require('@/assets/images/menu.png'),
        leftMenuWidth: 52,
        showUserInfoDialog: false,
        changePasswordDialog: false,
        systemOSType: 'Linux',
        imDownloadPathLinux: '/home/chifeng/桌面/即时通文件/',
        imBackupPathLinux: '/opt/starway/imbackup/',
        imDownloadPathWindows: 'C:\\ProgramData\\starwayim\\download\\',
        imBackupPathWindows: 'C:\\ProgramData\\starwayim\\backups\\',
        shortcutSendMessageKey: 1,
        shortcutOpenIMWindow: 'Ctrl + Alt + M',
        heartbeatTimer: null,
        areaCheckTimer: null // 服务器空间占用检测
      }
    },
    components: {
      messageTab: require('@/views/home/children/messageTab-component').default,
      friendTab: require('@/views/home/children/friendTab-component').default,
      groupTab: require('@/views/home/children/groupTab-component').default,
      treeTab: require('@/views/home/children/treeTab-component').default,
      systemSetting: require('@/components/home/systemSetting-component').default,
      changePassword: require('@/components/user/changePassword').default,
      windowFrame: require('@/components/common/windowFrame-component.vue').default,
      userInfoPopover: require('@/components/user/userInfoPopover.vue').default,
      systemNoticeComponent: require('@/components/home/systemNotice-component.vue').default,
      messageManage: require('@/components/chatPanel/messageManage.vue').default,
      mediaSpeakComponent: require('@/components/channel/mediaSpeak-component.vue').default
    },
    computed: {
      ...mapState({
        userInfo: state => state.home.userInfo,
        friendList: state => state.home.friendList,
        activeTab: state => state.home.activeTab,
        systemNotice: state => state.home.systemNotice,
        groupCode: state => state.home.groupCode,
        remoteUseArea: state => state.message.remoteUseArea // 服务端文件占用情况
      })
    },
    beforeMount () {
      this.initHeightWidth()
    },
    watch: {
      activeTab () {
        this.tabVisible(this.activeTab)
      },
      systemNotice (val, oldval) {
        let localStorageNotice = JSON.parse(window.localStorage.getItem('system-notice'))
        if (window.localStorage.getItem('system-notice') && window.localStorage.getItem('system-notice') !== 'null') {
          if (val.id === localStorageNotice.id) {
            window.localStorage.setItem('system-notice', JSON.stringify(localStorageNotice))
            return
          }
        }
        window.localStorage.setItem('system-notice', JSON.stringify(val))
        this.$refs.systemNoticeDialog.$emit('openDialog')
      },
      userInfo: {
        handler (val) {
          this.UPDATE_LOCAL_OWNER(val)
          this.UPDATE_GROUP_LIST_OWNER(val)
        },
        deep: true
      }
    },
    mounted () {
      this.initData()
      this.windowOnresize()
      this.shortcutKeyHandle() // 初始化热键
      ipcRenderer.on('globalSoundSetUp', (event, soundChecked) => {
        console.log(soundChecked)
        this.SET_IS_PLAY_SOUND(soundChecked)
        localStorage.setItem('global_is_notice_message', soundChecked)
      })
      ipcRenderer.on('setWindowIsShow', (event, isShow) => {
        console.log(isShow)
        this.SET_WINDOW_IS_SHOW(isShow)
      })
      let soundSetup = localStorage.getItem('global_is_notice_message')
      if (soundSetup === 'false') {
        this.SET_IS_PLAY_SOUND(true)
      } else {
        this.SET_IS_PLAY_SOUND(false)
      }
      setTimeout(() => {
        ipcRenderer.send('winShow') // 显示内容窗口
      }, 600)
      // 监听网络状态
      // const alertOnlineStatus = () => {
      //   window.alert(navigator.onLine ? 'online' : 'offline')
      // }
      // window.addEventListener('online', alertOnlineStatus)
      // window.addEventListener('offline', alertOnlineStatus)
      // 5分钟维持心跳
      this.heartbeatTimer = setInterval(() => {
        this.sendHeartbeat()
      }, 300000)
      // 10分钟检测服务器空间占用大小
      this.areaCheckTimer = setInterval(() => {
        this.checkServerArea()
      }, 600000)
      this.checkServerArea()
    },
    beforeDestroy () {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer)
      }
      if (this.areaCheckTimer) {
        clearInterval(this.areaCheckTimer)
      }
    },
    methods: {
      ...mapMutations([
        'SET_RIGHTKEYMENU',
        'CLEAR_SEARCHFRIENDLIST',
        'SET_ACTIVETAB',
        'SET_IS_PLAY_SOUND',
        'UPDATE_LOCAL_OWNER',
        'UPDATE_GROUP_LIST_OWNER',
        'SET_CURRENT_CHANNEL_ID',
        'SET_SELECTED_CHANNEL_BY_JID',
        'SET_SELECTLIST_STATUS',
        'SET_WINDOW_IS_SHOW',
        'SET_SHOWMEDIASERVER'
      ]),
      ...mapActions([
        'Logon',
        'UpdateUserInfo',
        'GetFriendInfo',
        'GroupInviteListener',
        'DestoryGroupListener',
        'EnterGroup',
        'GetTreeData',
        'GetSystemNotice',
        'SystemNoticeListener',
        'FriendStatusListener',
        'LoginAbnormalListener',
        'sendHeartbeat',
        'getRemoteAreaInfo'
      ]),
      initData () {
        this.GroupInviteListener()
        this.DestoryGroupListener()
        this.GetTreeData(this.groupCode)
        this.getSystemNotice()
        this.SystemNoticeListener()
        this.FriendStatusListener()
        this.loginAbnormalListener()
      },
      // 别处登录监听(被挤掉)
      loginAbnormalListener () {
        this.LoginAbnormalListener()
          .then(() => {
            this.$message({
              type: 'warning',
              message: '账号已在其他地方登录!',
              duration: 500
            })
            setTimeout(() => {
              this.logon('abnormal')
            }, 1000)
          })
      },
      checkServerArea () {
        // 获取占用大小
        this.getRemoteAreaInfo(this.userInfo.account).then(() => {
          let remoteAreaInfo = this.remoteUseArea
          let remoteMessageCount = remoteAreaInfo.storageMsgCount
          let remoteFileAreaInfo = remoteAreaInfo.storageFileUpSize
          // 每条消息大小
          let remoteMessageUnit = localStorage.getItem('global_remote_area_unit')
          if (!remoteMessageUnit) {
            remoteMessageUnit = 10000
          }
          // 服务器文件大小
          let remoteTotalFileArea = localStorage.getItem('global_file_remote_area')
          if (remoteTotalFileArea) {
            if (remoteFileAreaInfo > remoteTotalFileArea) {
              this.$notify({
                title: '空间已满提示',
                message: '您在服务器端的文件空间不足，请您手动清除以往的文件记录',
                type: 'warning',
                duration: 10000
              })
            }
          }
          let isNoticeMessage = localStorage.getItem('global_message_remote_save')
          if (isNoticeMessage === '0') {
            return
          } else {
          }
          // 服务器消息大小
          let remoteTotalMessageArea = localStorage.getItem('global_message_remote_area')
          if (remoteTotalMessageArea) {
            let useMessageArea = remoteMessageCount
            if (useMessageArea && useMessageArea > (remoteTotalMessageArea * remoteMessageUnit)) {
              setTimeout(() => {
                this.$notify({
                  title: '空间已满提示',
                  message: '您在服务器端的聊天记录空间不足，请您清除以往的聊天记录，如不清除则无法将当前的聊天记录保存在服务器端',
                  type: 'warning',
                  duration: 10000
                })
              }, 100)
            }
          }
        })
      },
      showPopover () {
        this.$refs.userInfoPopoverDlg.$emit('openDialog', this.userInfo)
      },
      shortcutKeyHandle () {
        let sendMessageKey = this.shortcutSendMessageKey
        let openIMWindow = this.shortcutOpenIMWindow
        if (Cookie.getCookies('im_shortcut_send_msg_key')) {
          sendMessageKey = Cookie.getCookies('im_shortcut_send_msg_key')
        }
        if (Cookie.getCookies('im_shortcut_open_win_key')) {
          openIMWindow = Cookie.getCookies('im_shortcut_open_win_key')
        }
        // 将初始化的热键保存到Cookie中
        Cookie.setCookie('im_shortcut_send_msg_key', sendMessageKey)
        Cookie.setCookie('im_shortcut_open_win_key', openIMWindow)
        ipcRenderer.send('hotKey', openIMWindow, '')
      },
      // 关闭右键菜单
      closeRightKeyMenu () {
        this.SET_RIGHTKEYMENU(false)
        this.CLEAR_SEARCHFRIENDLIST()
        this.SET_SELECTLIST_STATUS(false)

        this.SET_SHOWMEDIASERVER(false)
      },
      // 获取最新系统公告
      getSystemNotice () {
        this.GetSystemNotice()
      },
      handleCommand (command) {
        switch (command) {
          case 'logout':
            this.$confirm('您确定要注销吗？', '提示', {
              type: 'warning'
            })
              .then(_ => {
                this.logon()
              })
              .catch(error => {
                console.log(error)
              })
            break
          case 'messageManage':
            console.log(command)
            this.$refs.messageManageDialog.$emit('openDialog')
            break
          case 'changePassword':
            console.log(command)
            this.changePasswordDialog = true
            break
          case 'systemSetting':
            console.log(command)
            this.showUserInfoDialog = true
            break
          // default:
          //   this.showUserInfoDialog = true
        }
        // console.log(command)
      },
      // 注销登录
      logon (type) {
        this.Logon(type)
          .then(() => {
            ipcRenderer.send('winHide') // 隐藏内容窗口
            ipcRenderer.send('setLoginWindowSize') // 设置登录框大小
            this.SET_ACTIVETAB('message')
            this.SET_CURRENT_CHANNEL_ID('')
            this.SET_SELECTED_CHANNEL_BY_JID('')
            localStorage.setItem('global_is_auto_login', false)
            ipcRenderer.send('clearDbMessage') // 清除数据库垃圾数据
            setTimeout(() => {
              this.$router.push('/login')
            }, 1500)
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '系统错误!',
              duration: 500
            })
            setTimeout(() => {
              ipcRenderer.send('winHide') // 隐藏内容窗口
              this.$router.push('/login')
              ipcRenderer.send('setLoginWindowSize') // 设置登录框大小
              ipcRenderer.send('clearDbMessage') // 清除数据库垃圾数据
            }, 1500)
          })
      },
      tabVisible (tab) {
        this.menuSelectColor(tab)
        this.SET_ACTIVETAB(tab)
      },
      // 切換菜单选中图标
      menuSelectColor (id) {
        let menuIcons = document.getElementsByName('menuIconButton')
        for (let i = 0; i < menuIcons.length; i++) {
          if (menuIcons[i].id === 'menuIcon-' + id) {
            menuIcons[i].classList.add('menu-' + menuIcons[i].id.split('-')[1] + '-slt')
          } else {
            menuIcons[i].classList.remove('menu-' + menuIcons[i].id.split('-')[1] + '-slt')
          }
        }
      },
      // 初始化高和宽
      initHeightWidth () {
        this.$store.dispatch('setHomeWindowHeight', (document.body.clientHeight - 0))
        this.$store.dispatch('setHomeContentWidth', (document.body.clientWidth - this.leftMenuWidth - 3))
        this.$store.dispatch('setMsgChannelListHeight', (document.body.clientHeight - 66))
        this.$store.dispatch('setMsgDialogWidth', (document.body.clientWidth - 275 - 3))
        this.$store.dispatch('setDialogMessageListHeight', (document.body.clientHeight - 62 - 94))
        this.$store.dispatch('setDialogContainerHeight', (document.body.clientHeight - 62))
        this.$store.dispatch('setDialogContainerWidth', (document.body.clientWidth - 275 - 162))
      },
      // 拖拽窗口计算高和宽
      windowOnresize () {
        let that = this
        window.onresize = () => {
          that.initHeightWidth()
          globalEvent.$emit('windowResizeEvent')
          return (() => {})()
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .home-main-menu {
    overflow: visible !important;
    font-family: "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
  }
  .home-body-container {
    height: 100%;
    /*min-height: 300px;*/
    background-color: #e7f0f5;
    overflow: hidden;
    .home_col_left{
      width: 52px;
      /*background: -moz-linear-gradient(0deg, #1687D9, #1CA5E3);*/
      /*background: linear-gradient(0deg, #1687D9, #1CA5E3);*/
      background: #366CB3;
      .menuLeft{
        margin-top: 20px;
        padding: 0 5px;
        text-align: center;
        .menu-avatar{
          /*margin-top: 28px;*/
          height: 46px;
          width: 100%;
          .avatar{
            display: table-cell;
            width: 36px;
            height: 55px;
            line-height: 55px;
            font-weight: bold;
            margin: 0 0 0 4px;
            vertical-align: middle;
            img {
              width: 36px;
              height: 36px;
              display: block;
              border-radius: 36px;
              cursor: pointer;
            }
          }
        }
        .menuMain{
          position:fixed;
          bottom:0px;
          left:15px;
        }
        .menuIcon{
          cursor: pointer;
          margin: 12px auto;
          .menu-message {
            width: 42px;
            height: 43px;
            background-size: 23px;
            background-repeat: no-repeat;
            background-position: center center;
            background-image: url(../../assets/images/chat.png);
          }
          .menu-message-slt {
            margin-top: 8px;
            height: 35px;
            background-size: 37px;
            background-image: url(../../assets/images/chat-1.png);
          }
          .menu-friend {
            width: 42px;
            height: 43px;
            background-size: 23px;
            background-repeat: no-repeat;
            background-position: center center;
            background-image: url(../../assets/images/friends.png);
          }
          .menu-friend-slt {
            margin-top: 8px;
            height: 35px;
            background-size: 37px;
            background-image: url(../../assets/images/friends-1.png);
          }
          .menu-group {
            width: 42px;
            height: 43px;
            background-size: 25px;
            background-repeat: no-repeat;
            background-position: center center;
            background-image: url(../../assets/images/group.png);
          }
          .menu-group-slt {
            margin-top: 19px;
            height: 36px;
            background-size: 37px;
            background-image: url(../../assets/images/group-1.png);
          }
          .menu-tree {
            width: 42px;
            height: 43px;
            background-size: 25px;
            background-repeat: no-repeat;
            background-position: center center;
            background-image: url(../../assets/images/system.png);
          }
          .menu-tree-slt {
            margin-top: 20px;
            height: 35px;
            background-size: 38px;
            background-image: url(../../assets/images/system-1.png);
          }
        }
      }
    }
    .home_col_right{
      padding: 0;
    }
  }
</style>
