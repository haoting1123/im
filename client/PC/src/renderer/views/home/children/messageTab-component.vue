<template>
  <el-container class="body-container">
    <div class="sidebar">
      <message-play ref="messagePlayDlg"></message-play>
      <search @onsearch="onSearchSession"></search>
      <div
        class="channel-container"
        :style="'height:' + (dialogContainerHeight-3) + 'px'"
      >
       <!-- //置顶会话队列 -->
      <session-list-item :sessionList="filterSessionList" isTop="top"></session-list-item>
      <!-- //普通会话队列 -->
      <session-list-item :sessionList="filterSessionList" isTop="no" @cancelSearch="cancelSearchSession"></session-list-item>
        <!-- <create-group-channel ref="createGroupChanneDlg" @onChannelCreated="onGroupChannelCreated"></create-group-channel> -->
      </div>
    </div>
    <div class="content">
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </el-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { outputError } from '@/utils/exception'
import { baseUrl } from '@/utils/url'
import GroupIcon from '@/components/svg/groupIcon'
import StatusOnlineIcon from '@/components/svg/statusOnlineIcon'
import StatusOfflineIcon from '@/components/svg/statusOfflineIcon'
import StatusAwayIcon from '@/components/svg/statusAwayIcon'
import StatusDndIcon from '@/components/svg/statusDndIcon'
import StatusOnlineAvatar from '@/components/svg/statusOnlineAvatar'
import StatusOfflineAvatar from '@/components/svg/statusOfflineAvatar'
import StatusDndAvatar from '@/components/svg/statusDndAvatar'
import StatusAwayAvatar from '@/components/svg/statusAwayAvatar'
import rightKeyMenuCom from '@/components/common/rightKeyMenu'
import sessionListItem from '@/components/dialog/sessionListItem'
import messagePlay from '@/components/chatPanel/messageAudioPlay'

export default {
  data () {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
    return {
      userInfo: {
        id: currentUser.id,
        firstLetterOfName: currentUser.firstLetterOfName,
        nickname: currentUser.nickname,
        avatarUrl: currentUser.avatarUrl,
        sex: currentUser.sex
      },
      onlineStatus: 'online',
      userChannelList: [],
      selectedChannelId: '',
      searchKey: '',
      unreadMessageChannelList: [],
      searchValue: ''
      // channelListHeight: ''
    }
  },
  mounted () {
    // this.getAllSession()
  },
  methods: {
    ...mapMutations([
      'SET_RIGHTKEYMENU'
    ]),
    ...mapActions(['getAllSession', 'getUserChannel', 'searchUserChannel']),
    // 搜索当前会话
    onSearchSession (value) {
      this.searchValue = value
    },
    // 取消搜索
    cancelSearchSession () {
      this.searchValue = ''
    },
    openCreatePrivateChannelDlg () {
      this.$refs.createPrivateChanneDlg.$emit('openDialog', 'add')
    },
    openCreateGroupChannelDlg () {
      this.$refs.createGroupChanneDlg.$emit('openDialog', 'add')
    },
    selectChannel (channel, index) {
      this.selectedChannelId = channel.channelId
    },
    onOnlineStatusChanged (message) {
      // console.log('33', sessionStorage.getItem('currentUser'))
      if (
        sessionStorage.getItem('currentUser') == null ||
        message.userId === JSON.parse(sessionStorage.getItem('currentUser')).id
      ) {
        return
      }
      for (let userChannel of this.userChannelList) {
        if (userChannel.toUserId == null) {
          continue
        }
        if (userChannel.toUserId === message.userId) {
          userChannel.toUserOnlineStatus = message.onlineStatus
          break
        }
      }
    },
    onNicknameChanged (message) {
      if (message.userId === this.userInfo.jid) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
        currentUser.nickname = this.userInfo.nickname = message.nickname
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser))
        return
      }
      for (let userChannel of this.userChannelList) {
        if (userChannel.toUserId === message.userId) {
          if (
            userChannel.channelDisplayName == null ||
            userChannel.channelDisplayName === ''
          ) {
            userChannel.channelDisplayName = message.nickname
          }
          return
        }
      }
    },
    onAvatarChanged (message) {
      if (message.userId === this.userInfo.jid) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
        currentUser.avatarUrl = this.userInfo.avatarUrl = ''
        currentUser.avatarUrl = this.userInfo.avatarUrl = message.avatar
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
    },
    onUserOnline () {
      this.onlineStatus = 'online'
      // updateOnlineStatus(JSON.parse(sessionStorage.getItem('currentUser')).id, this.onlineStatus)
      // .catch(error => {
      //   outputError(this, error)
      // })
    },
    onUserOffline () {
      this.onlineStatus = 'offline'
      // updateOnlineStatus(JSON.parse(sessionStorage.getItem('currentUser')).id, this.onlineStatus)
      // .catch(error => {
      //   outputError(this, error)
      // })
    },
    doSearchChannel () {
      if (!this.searchKey.trim()) {
        return
      }
      this.userChannelList = []
      this.searchUserChannel(this.userInfo.jid, this.searchKey)
        .then(response => {
          this.userChannelList = response.data
        })
        .catch(error => {
          outputError(this, error)
        })
    },
    onSearchInputKeyUp (event) {
      if (!this.searchKey.trim()) {
        return
      }
      if (event.keyCode === 13) {
        this.doSearchChannel()
      }
    },
    getAvatarUrl (message) {
      if (
        'http://'.startsWith(message.toUserAvatarUrl.toLowerCase()) ||
        'https://'.startsWith(message.toUserAvatarUrl.toLowerCase())
      ) {
        return message.toUserAvatarUrl
      }
      return (
        baseUrl() + '/users/' + message.toUserId + '/avatar?width=32&height=32'
      )
    },
    subFirstLetter (value) {
      if (!value) {
        return ''
      }
      return value.substr(0, 1).toUpperCase()
    }
  },
  computed: {
    ...mapState({
      sessionList: state => state.session.sessionList,
      rightKeyMenu: state => state.home.rightKeyMenu,
      selectedChannel: state => state.session.selectedChannel,
      dialogContainerHeight: state => state.drag.dialogContainerHeight
    }),
    realAvatarUrl () {
      if (
        this.userInfo.avatarUrl == null ||
        this.userInfo.avatarUrl.trim() === ''
      ) {
        return null
      }
      if (
        !this.userInfo.avatarUrl.startsWith('http:') &&
        !this.userInfo.avatarUrl.startsWith('https:')
      ) {
        return (
          baseUrl() +
          '/users/' +
          this.userInfo.jid +
          '/avatar?width=36&height=36&rdm=' +
          Math.random()
        )
      }
      return (
        this.userInfo.avatarUrl +
        (this.userInfo.avatarUrl.indexOf('?') > -1 ? '&' : '?') +
        'rdm=' +
        Math.random()
      )
    },
    filterSessionList () {
      return this.sessionList.filter(item => {
        switch (item.channelType) {
          case 'G':
            if (item.name.indexOf(this.searchValue) !== -1) return true
            break
          // P
          default:
            if (item.alias.indexOf(this.searchValue) !== -1 || item.name.indexOf(this.searchValue) !== -1) return true
        }
      })
    }
  },
  created () {
    this.$router.push({name: 'noContent'})
    // this.getClientSetting()
    // if (this.$route.params.channelId) {
    //   this.selectedChannelId = this.$route.params.channelId
    // } else {
    //   this.$router.push({ name: 'welcome' })
    // }
  },
  watch: {
    // sessionList: function (newVal, oldVal) {
    // console.log(newVal)
    // },
    rightKeyMenu: function (val, oldval) {
      if (!val) {
        this.mousePosition = ['close']
      }
    },
    selectedChannel: {
      handler: function (val, oldVal) {
        if (val) {
          this.$nextTick(() => {
            console.log('val', val)
            this.$router.push({name: 'messageDialog', params: { channelId: val.channelId, channelType: val.channelType, name: val.name, channel: val }})
          })
        } else {
          this.$router.push({name: 'noContent'})
        }
      },
      deep: true
    }
  },
  components: {
    GroupIcon,
    StatusOnlineIcon,
    StatusOfflineIcon,
    StatusAwayIcon,
    StatusDndIcon,
    StatusOnlineAvatar,
    StatusOfflineAvatar,
    StatusDndAvatar,
    StatusAwayAvatar,
    rightKeyMenuCom,
    sessionListItem,
    search: require('@/components/common/search').default,
    messagePlay
    // EditPersonalInfo: resolve =>
    //   require(['@/components/user/editPersonalInfo'], resolve),
    // CreateGroupChannel: resolve =>
    //   require(['@/components/channel/createGroupChannel'], resolve),
    // ChangePassword: resolve =>
    //   require(['@/components/user/changePassword'], resolve),
    // AboutInfo: resolve => require(['@/components/system/aboutInfo'], resolve),
    // SystemSetting: resolve =>
    //   require(['@/components/system/sysSetting'], resolve),
    // CheckUpdate: resolve =>
    //   require(['@/components/system/checkUpdate'], resolve)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.menuIcon {
  padding: 20px 10px;
  i {
    font-size: 26px;
    color: #ffffff;
  }
}
.body-container {
  height: 100%;
  min-height: 300px;
  background-color: #e7f0f5;
  overflow: hidden;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
}
.sidebar {
  width: 220px;
  float: left;
  background-color: #fff;
  border-right: 1px solid #DCDEE0;
  .header {
    background-color: #edeae8;
    height: 70px;
    width: 100%;
    position: relative;
    .avatar {
      width: 36px;
      height: 36px;
      margin: 19px 0px auto 5px;
      /*background-color: #DF016E;*/
      border-radius: 36px;
      text-align: center;
      line-height: 36px;
      color: #fff;
      font-weight: bold;
      float: left;
      img {
        width: 36px;
        height: 36px;
        display: block;
        border-radius: 36px;
      }
    }
    #status-dropdown {
      cursor: pointer;
    }
    .status {
      border-radius: 15px;
      bottom: -4px;
      height: 15px;
      line-height: 0;
      margin: 0;
      position: absolute;
      left: 32px;
      top: 41px;
      width: 15px;
      svg {
        max-height: 11px;
        position: relative;
        top: 2px;
      }
      .icon-container {
        :after {
          border-radius: 20px;
          height: 10px;
          left: 4px;
          position: absolute;
          top: 4px;
          width: 10px;
        }
      }
    }
    .status-edit {
      border-radius: 15px;
      background-color: #fff;
      width: 15px;
      height: 15px;
      left: 32px;
      top: 41px;
      position: absolute;
      text-align: center;
      svg {
        position: relative;
        top: -8px;
        padding: 0;
        margin: 0;
      }
    }
    .status-selector:hover > .status {
      display: none;
    }
    .status-selector > .status {
      display: inherit;
    }
    .status-selector > .status-edit {
      display: none;
    }
    .status-selector:hover > .status-edit {
      display: inherit;
    }
    .nickname {
      color: #fff;
      padding-top: 4px;
      margin-left: 6px;
      float: left;
    }
    .dropdown-icon {
      border-radius: 36px;
      fill: #d0ddec;
      float: right;
      height: 36px;
      line-height: 36px;
      position: relative;
      text-align: center;
      width: 36px;
      margin-top: 18px;
      cursor: pointer;
      &:hover {
        fill: #fff;
      }
    }
  }

  .channel-search-container {
    margin-top: 18px;
    height: 32px;
    padding: 8px;
    .search {
      padding: 0 0 0 5px;
      background-color: #e6e6e6;
      height: 26px;
      line-height: 26px;
      vertical-align: middle;
      border-radius: 3px;
      width: 160px;
      float: left;
      i {
        color: #515151;
        cursor: pointer;
      }
      input {
        font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
        margin: 0 0 0 5px;
        width: 125px;
        line-height: 20px;
        outline: 0;
        border: none;
        background-color: transparent;
        -webkit-appearance: textfield;
        -webkit-rtl-ordering: logical;
        cursor: text;
        color: #515151;
        font-size: 13px;
      }
      input::-webkit-input-placeholder {
        color: #999;
      }
      input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #999;
      }
      input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #999;
      }
      input:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #999;
      }
    }
    button {
      width: 28px;
      padding: 0px;
      margin-left: 6px;
      background: #fff;
      border: 0px;
      color: #8fb3cc;
      margin-top: 4px;
      font-size: 20px;
    }
  }

  .channel-container {
    // border: 1px solid #000;
    width: 220px;
    overflow: scroll;
    min-height: 572px;
  }

  .nav-channel {
    margin: 0;
    padding: 0;
    color: #999;
    list-style: none;
    .channel-item {
      padding: 3px 0px 0px 3px;
      border: 1px solid rgba(1, 1, 1, 0);
      height: 58px;
      &:hover {
        background-color: #EBEBEC;
        // border: 1px solid #EBEBEC;
        // border-right: 1px solid #dae6f2;
      }
      a {
        display: block;
        -webkit-transition: none 1s;
        transition-delay: 0s;
        -moz-transition: none 1s;
        -o-transition: none 1s;
        transition: none false false 1s;
        text-align: left;
        width: 100%;
        border-radius: 0;
        line-height: 20px;
        height: 52px;
        outline: none;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13px;
        color: #000;
        white-space: nowrap;
        position: relative;
        svg {
          height: 14px;
          width: 14px;
          left: 10px;
          top: 0px;
          max-height: initial;
          position: relative;
          z-index: 1;
        }
      }
      .status {
        display: inline-block;
        position: relative;
        padding: 0 0 0 5px;
        margin-top: 4px;
      }
      .channel-item-name {
        display: inline-block;
        width: 131px;
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
        padding: 8px 0 0 5px;
        color: #000;
        font-size: 15px;
      }
      .channel-item-name-selected {
        font-weight: normal;
      }
      .unread-message-count {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-color: red;
        border-radius: 18px;
        text-align: center;
        line-height: 18px;
        color: #fff;
        vertical-align: middle;
        font-size: 12px;
        position: absolute;
        right: 10px;
        top:28px;
      }
      .unread-message-count-hide {
        display: inline-block;
        width: 20px;
      }
      .has-close {
        &:hover {
          .btn-close {
            opacity: 0.8;
            display: inline-block;
            text-decoration: none;
            position: absolute;
            right: 6px;
            top: -2px;
          }
          .channel-item-name {
            max-width: 130px;
            min-width: 130px;
          }
        }
      }
      .btn-close {
        opacity: 0;
        display: none;
        font-size: 18px;
        right: 29px;
        height: 16px;
        line-height: 16px;
        margin: 5px 0 0 -26px;
        padding-bottom: 2px;
        vertical-align: middle;
        color: #606266;
        &:hover {
          opacity: 1;
          color: #f23724;
        }
      }
      .channelListSubInfo {
        font-size: 12px;
        color: #858585;
      }
      .channelListSubTimeInfo{
        font-size: 12px;
        color: #858585;
        position:absolute;
        top:5px;
        right: 3px;;
      }
    }
    .channel-item-active {
      background-color: #EBEBEC;
      // border: solid 1px #dae6f2;
      // border-right: solid 1px #e7f0f5;
    }
  }
}
.content {
  position: relative;
  flex: 1;
  // background: url("../../../assets/images/welcome.png");
  background: #FFF;
}
.status-tooltip {
  font-size: 8px;
  color: #7c7a74;
  margin-top: -15px;
}

.status-wrapper {
  width: 40px;
  height: 40px;
  line-height: 36px;
  /*background-color: #DF016E;*/
  border-radius: 32px;
  text-align: center;
  color: #fff;
  font-weight: bold;
  float: left;
  margin: 5px 5px 0 6px;
  cursor: pointer;
  .status-wrapper-image {
    border-radius: 100%;
    width: 100%;
    height: 100%;
    background-color: #e7f0f5;
  }
  .online-status-container {
    width: 12px;
    height: 12px;
    line-height: 12px;
    margin: -14px 0 0 14px;
  }
}
.sysuser-status-wrapper {
  background-color: #04549c;
}

</style>
