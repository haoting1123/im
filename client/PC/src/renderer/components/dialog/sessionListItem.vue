<template>
        <ul class="nav-channel">
          <right-key-menu-com :menu-items="menuItems" :mouse-position="mousePosition" @itemClickList="itemClickList" :busiObj="rightClickItem"></right-key-menu-com>
          <li
            class="channel-item"
            v-for="(item, index) in topSessionList"
            :key="index"
            :class="{'channel-item channel-item-active' : selectedChannelId === item.channelId}"
            @click="selectChannel(item)"
            @mousedown="operationSession($event, item)"
          >
            <router-link
              v-if="item.channelType == 'P'"
              :to="{ name: 'messageDialog', params: { channelId: item.channelId, channelType: item.channelType,name: (item.alias ? item.alias : item.name), channel:item }}"
            >
              <div class="has-close">
                <div
                  class="status-wrapper"
                  :class="{'sysuser-status-wrapper': item.toUserId === '00000000000000000000000000000000'}"
                >
                  <div v-if="item.headUrl" style="width: 40px; height:40px;">
                    <img class="status-wrapper-image" :src="item.headUrl">
                  </div>
                  <template v-else>
                    <div style="width: 40px; height:40px;">
                      <img
                        v-if="item.toUserSex == '男'"
                        class="status-wrapper-image"
                        src="../../assets/images/boy.png"
                      >
                      <img v-else class="status-wrapper-image" src="../../assets/images/girl.png">
                    </div>
                  </template>
                  <div class="online-status-container">
                    <status-online-avatar v-if="item.toUserOnlineStatus === 'online'"></status-online-avatar>
                    <status-offline-avatar v-else-if="item.toUserOnlineStatus === 'offline'"></status-offline-avatar>
                    <!--<status-away-avatar v-else-if="item.toUserOnlineStatus === 'away'"></status-away-avatar>-->
                    <!--<status-dnd-avatar v-else="item.toUserOnlineStatus === 'dnd'"></status-dnd-avatar>-->
                  </div>
                </div>
                <div
                  :class="{'channel-item-name channel-item-name-selected' : selectedChannelId === item.channelId, 'channel-item-name': selectedChannelId !== item.channelId}"
                >
                  {{  item.alias ? item.alias : item.name}}
                  <span
                    class="channelListSubInfo"
                  >{{item.toUserGroupName}}</span>
                  <br>
                  <span class="channelListSubInfo">{{item.lastMessage}}</span>
                </div>
                <div class="channelListSubTimeInfo">{{getCreateDateTime(item.createTime)}}</div>
                <div
                v-if="item.unreadMessageCount && item.unreadMessageCount > 0"
                  :class="{'unread-message-count': item.unreadMessageCount > 0, 'unread-message-count-hide': item.unreadMessageCount == 0}"
                >{{ item.unreadMessageCount > 0 ? item.unreadMessageCount : "" }}</div>
                <img v-if="item.top === 'top'" src="../../assets/images/set-top.png" width="20" height="20" style="vertical-align: middle; margin-top:5px;"/>
                <img v-if="item.isTip === 'no'" src="../../assets/images/no-voice.png" width="16" height="16" style="vertical-align: middle; margin-top:5px;" />
              </div>
              <!--右键菜单-->

            </router-link>
            <router-link
              v-else-if="item.channelType == 'G'"
              :to="{ name: 'messageDialog', params: { channelId: item.channelId, channelType: item.channelType,name: item.name, channel:item }}"
            >
              <a href="#">
                <div class="status-wrapper">
                  <!--<group-icon :selected="selectedChannelId === item.channelId"></group-icon>-->
                  <img class="status-wrapper-image" src="../../assets/images/qun.png">
                </div>
                <div
                  :class="{'channel-item-name channel-item-name-selected' : selectedChannelId === item.channelId, 'channel-item-name': selectedChannelId !== item.channelId}"
                >
                  {{ item.name }}
                  <br>
                  <!--<span-->
                    <!--class="channelListSubInfo"-->
                  <!--&gt;-->
                  <!--<span class="at-me-style" v-if="item.isAtMe === 'yes'">[有人@我]</span>-->
                  <!--{{ item.lastName ? item.lastName + ':' + item.lastMessage : item.lastMessage }}</span>-->
                  <span
                    class="channelListSubInfo"
                  >
                  <span class="at-me-style" v-if="item.isAtMe === 'yes'">[有人@我]</span>
                  {{ item.lastMessage }}</span>
                </div>
                <div class="channelListSubTimeInfo">{{getCreateDateTime(item.createTime)}}</div>
                <div
                  v-if="item.unreadMessageCount && item.unreadMessageCount > 0"
                  :class="{'unread-message-count': item.unreadMessageCount > 0, 'unread-message-count-hide': item.unreadMessageCount == 0}"
                >{{ item.unreadMessageCount > 0 ? item.unreadMessageCount : "" }}</div>
                 <img v-if="item.top === 'top'" src="../../assets/images/set-top.png" width="20" height="20" style="vertical-align: middle; margin-top:5px;"/>
                <img v-if="item.isTip === 'no'" src="../../assets/images/no-voice.png" width="16" height="16" style="vertical-align: middle; margin-top:5px;" />
              </a>
            </router-link>
          </li>
          <show-channel-info ref="showChannelInfoDialog"></show-channel-info>
        </ul>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import * as myDate from '@/utils/date'
import { outputError } from '@/utils/exception'
import { baseUrl, downloadUrl } from '@/utils/url'
import { appendYaml } from '@/utils/yamlUtil'
import { downLoadFile } from '@/utils/downLoad'
import Cookie from '@/utils/cookie'
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
import showChannelInfo from '@/components/channel/showChannelInfo-component.vue'
import { setTimeout } from 'timers';

// import messagePlay from '@/components/message/messagePlay'
const { ipcRenderer, remote } = require('electron')
const USER_CHANNEL_LIST_SIZE = 16

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
      searchKey: '',
      unreadMessageChannelList: [],
      // 右键菜单的位置
      mousePosition: [],
      selectedChannelId:'',
      menuItems: [
        {
          menuName: '置顶'
        },
        {
          menuName: '消息免打扰'
        },
        {
          menuName: '移除'
        },
        {
          menuName: '查看资料'
        }
      ],
      rightClickItem: null
      // channelListHeight: ''
    }
  },
  props:['sessionList','isTop'],
  mounted () {

  },
  methods: {
    ...mapMutations([
      'SET_RIGHTKEYMENU',
      'SET_SELECTEDCHANNEL',
      'SET_CURRENT_CHANNEL_ID'
    ]),
    ...mapActions(['deleteSessionById', 'changeTopStatus','changeTipStatus', 'GetMemberInfo']),
    operationSession (event, sess) {
      event.preventDefault()
      if (event.button === 2) {
        let x = event.x
        let y = event.y
        this.mousePosition = [x, y]
        // 进行状态判断
        if(sess.top && sess.top === 'top'){
          this.menuItems[0].menuName = '取消置顶'
        }else{
          this.menuItems[0].menuName = '置顶'
        }
        if(sess.isTip && sess.isTip === 'yes'){
          this.menuItems[1].menuName = '消息免打扰'
        }else{
          this.menuItems[1].menuName = '新消息提醒'
        }


      } else if (event.button === 0) {
        this.mousePosition = ['close']
      }
      this.rightClickItem = sess
      this.SET_RIGHTKEYMENU(true)
    },
    itemClickList (index, item) {
      // console.log(index, item)
      switch (index) {
        case 0:
          // 置顶
          this.doChangeTopStatus(item)
          break
        case 1:
          // 消息免打扰
          this.doSessionNoTip(item)
          break
        case 2:
          // 移除会话
          this.doDeleteSession(item)
          break
        case 3:
          // 查看会话资料
          this.showChannel(item)
      }
      this.SET_RIGHTKEYMENU(false)
    },
    // 查看会话资料
    showChannel (item) {
      if (item.channelType === 'P') {
        this.GetMemberInfo(item.jid.split('@')[0])
          .then(data => {
            item.name = data.name
            item.sex = data.sex
            item.headUrl = data.photo
            this.$refs.showChannelInfoDialog.$emit('openDialog', item)
          })
          .catch(err => {
            this.$refs.showChannelInfoDialog.$emit('openDialog', item)
          })
        return
      }

      this.$refs.showChannelInfoDialog.$emit('openDialog', item)
    },
    // 消息提醒
    doSessionNoTip(item){
      // 根据状态判断是否需要消息免打扰
      this.changeTipStatus(item)
    },
    // 置顶
    doChangeTopStatus(item){
      this.changeTopStatus(item)
    },
    openCreatePrivateChannelDlg () {
      this.$refs.createPrivateChanneDlg.$emit('openDialog', 'add')
    },
    openCreateGroupChannelDlg () {
      this.$refs.createGroupChanneDlg.$emit('openDialog', 'add')
    },
    selectChannel (channel) {
      this.SET_SELECTEDCHANNEL(channel)
      this.$emit('cancelSearch')
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
    onUnreadMessage (message) {
      let index = this.userChannelList.findIndex(
        item => item.channelId === message.channelId
      )
      // console.log('tag111111111111::', message)
      if (message.senderId !== this.userInfo.jid) {
        const browserWindow = remote.getCurrentWindow()
        ipcRenderer.send('taskbarIconFlashFrame')
        if (!browserWindow.isFocused()) {
          // this.$refs.messagePlayDlg.$emit('musicPlay')
        }
      }

      if (message.channelId !== this.selectedChannelId) {
        if (index === -1) {
          let unreadMsgChannelIndex = this.unreadMessageChannelList.findIndex(
            item => item === message.channelId
          )
          if (unreadMsgChannelIndex === -1) {
            this.unreadMessageChannelList.push(message.channelId)
            this.getUserChannel(this.userInfo.jid, message.channelId)
              .then(response => {
                let exists = this.userChannelList.findIndex(
                  item => item.channelId === message.channelId
                )
                if (exists === -1) {
                  this.userChannelList.unshift(response.data)
                }
                let existingUnreadMsgChannelIndex = this.unreadMessageChannelList.findIndex(
                  item => item === message.channelId
                )
                if (existingUnreadMsgChannelIndex > -1) {
                  this.unreadMessageChannelList.splice(
                    existingUnreadMsgChannelIndex,
                    1
                  )
                }
              })
              .catch(error => {
                outputError(this, error)
              })
          }
        } else {
          this.userChannelList[index].unreadMessageCount += 1
        }
      }
      this.userChannelList[index].lastMessage = message.fileSize
        ? '[文件]'
        : message.content
      this.userChannelList[index].lastName = message.senderNickname
        ? message.senderNickname
        : message.senderName
      this.reOrderUserChannelList(message)
      this.autoDownloadFile(message)
    },
    onReadMessage (message) {
      for (let userChannel of this.userChannelList) {
        if (userChannel.channelId === message.channelId) {
          if (message.readAll) {
            userChannel.unreadMessageCount = 0
          } else {
            userChannel.unreadMessageCount -= message.total
          }
          return
        }
      }
    },
    reOrderUserChannelList (message) {
      let index = this.userChannelList.findIndex(
        item => item.channelId === message.channelId
      )
      let temp = this.userChannelList[index]
      this.userChannelList.splice(index, 1)
      this.userChannelList.unshift(temp)
    },
    onChannelNameChanged (message) {
      for (let channel of this.userChannelList) {
        if (channel.channelId === message.channelId) {
          channel.channelName = message.channelName
          return
        }
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
    onPrivateChannelCreated (channel) {
      this.SET_SELECTEDCHANNEL(channel)
      this.$router.push({
        name: 'messageDialog',
        params: { channelId: channel.channelId, channelType: 'P' }
      })
      for (let userChannel of this.userChannelList) {
        if (userChannel.channelId === channel.channelId) {
          return
        }
      }
      this.userChannelList.unshift(channel)
      if (this.userChannelList.length > USER_CHANNEL_LIST_SIZE) {
        this.userChannelList.pop()
      }
    },
    onGroupChannelCreated (channel) {
     this.SET_SELECTEDCHANNEL(channel)
      this.$router.push({
        name: 'messageDialog',
        params: { channelId: channel.channelId, channelType: 'G' }
      })
    },
    doDeleteSession (channel) {
      this.deleteSessionById(channel)
        .then(response => {
          this.$router.push({name: 'noContent'})
            // if (this.sessionList && this.sessionList.length > 0) {
              // console.log(this.sessionList)
              // let channelItem = this.sessionList[0]
              // if(channelItem){
                // this.$router.push({name: 'messageDialog', params: { channelId: channelItem.channelId, channelType: channelItem.channelType, name: channelItem.name, channel: channelItem }})
              // }
            // }
        })
        .catch(error => {
          outputError(this, error)
        })
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
    },
    handleHeight () {
      // this.channelListHeight = (document.body.clientHeight - 48) + 'px'
      // window.onresize = () => {
      //   return (() => {
      //     this.channelListHeight = (document.body.clientHeight - 48) + 'px'
      //   })()
      // }
    },
    getClientSetting () {
      // this.getClientSetting()
      //   .then(response => {
      //     let data = response.data.content
      //     if (data.length > 0) {
      //       let item = data[0]
      //       this.$store.dispatch('setSendFileSuffix', item.sendFileSuffix)
      //       this.$store.dispatch('setSendFileSize', item.sendFileSize)
      //     }
      //   })
      //   .catch(error => {
      //     outputError(this, error)
      //   })
    },
    getCreateDateTime (createTime) {
      let currTime = new Date()
      currTime = new Date(
        currTime.getFullYear(),
        currTime.getMonth(),
        currTime.getDate()
      )
      let time = new Date(createTime)
      let date = new Date(time.getFullYear(), time.getMonth(), time.getDate())
      let xc = Number((date - currTime) / 1000 / 60 / 60 / 24).toFixed(0)
      let ret = '' + myDate.formatDate(time, 'hh:mm')
      if (xc === -1) {
        ret = '昨天'
      } else if (xc < -1) {
        ret = myDate.formatDate(time, 'MM-dd')
      }
      return ret
      // return new Date(message.createAt).toLocaleString()
    }
  },
  computed: {
    ...mapState({
      rightKeyMenu: state => state.home.rightKeyMenu,
      selectedChannel: state => state.session.selectedChannel
    }),
    topSessionList () {
      return this.sessionList.filter((sess) => {
        if(!sess.top){
          sess.top = 'no'
        }
        return sess.top === this.isTop
      })
    },
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
    }
  },
  created () {
    // this.getClientSetting()
    // if (this.$route.params.channelId) {
    //   this.selectedChannelId = this.$route.params.channelId
    // } else {
    //   this.$router.push({ name: 'welcome' })
    // }
  },
  watch: {
    rightKeyMenu: function (val, oldval) {
      if (!val) {
        this.mousePosition = ['close']
      }
    },
    selectedChannel: {
      handler: function (val, oldVal) {
        if(val){
          // console.log(val)
          this.$nextTick(() => {
            this.selectedChannelId = val.channelId
            // this.$router.push({name: 'messageDialog', params: { channelId: val.channelId, channelType: val.channelType, name: val.name, channel: val,timestamp: new Date().getTime() }})
          })
        }else{
          this.selectedChannelId = ''
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
    showChannelInfo
    // messagePlay
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
    height: 572px;
  }

  .nav-channel {
    margin: 0;
    padding: 0;
    color: #999;
    list-style: none;
    .channel-item {
      padding: 3px 0px 0px 3px;
      border: 1px solid #fff;
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
        height: 60px;
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
        &:hover {
          text-decoration: none;
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
        font-size: 14px;
      }
      .channel-item-name-selected {
        font-weight: normal;
      }
      .unread-message-count {
        display: inline-block;
        // width: 16px;
        height: 16px;
        min-width: 16px;
        background-color: red;
        border-radius: 16px;
        text-align: center;
        line-height: 16px;
        color: #fff;
        vertical-align: middle;
        font-size: 11px;
        position: absolute;
        left: 36px;
      }
      .unread-message-count-hide {
        display: inline-block;
        width: 20px;
      }
      // .has-close {
      //   &:hover {
      //     .btn-close {
      //       opacity: 0.8;
      //       display: inline-block;
      //       text-decoration: none;
      //       position: absolute;
      //       right: 6px;
      //       top: -2px;
      //     }
      //     .channel-item-name {
      //       max-width: 130px;
      //       min-width: 130px;
      //     }
      //   }
      // }
      // .btn-close {
      //   opacity: 0;
      //   display: none;
      //   font-size: 18px;
      //   right: 29px;
      //   height: 16px;
      //   line-height: 16px;
      //   margin: 5px 0 0 -26px;
      //   padding-bottom: 2px;
      //   vertical-align: middle;
      //   color: #606266;
      //   &:hover {
      //     opacity: 1;
      //     color: #f23724;
      //   }
      // }
      .channelListSubInfo {
        font-size: 12px;
        color: #858585;
        .at-me-style {
          color: #f23724;
          font-size: 10px;
        }
      }
      .channelListSubTimeInfo{
        font-size: 12px;
        color: #858585;
        position:absolute;
        top: 28px;
        right: 3px;
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
