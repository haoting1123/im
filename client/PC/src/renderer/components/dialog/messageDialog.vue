<template>
  <div class="msgDialog" v-bind:style="{width: $store.state.message.msgDlgContainerAllWidth + 'px'}">
    <!-- <div class="container" style="width:610px" v-loading="loadingVisible"> -->
    <div class="container" v-bind:style="{width: $store.state.message.msgDlgContainerWidth + 'px'}" v-loading="loadingVisible">
      <!--头部显示区-->
      <div class="header">
        <div class="title-container">          <span>
            <div class="title">
              <span v-if="userChannel.channelType === 'P'" class="el-dropdown-link channel-title">
                <strong >{{ userChannel.alias ? userChannel.alias : userChannel.name }}</strong>
                <!--<el-popover-->
                  <!--placement="right-end"-->
                  <!--width="260"-->
                  <!--@show="showPopover"-->
                  <!--trigger="click">-->
                  <!--<user-info-popover ref="userInfoPopoverDlg"></user-info-popover>-->
                  <!--<strong slot="reference" style="cursor: pointer">{{ userChannel.alias ? userChannel.alias : userChannel.name }}</strong>-->
                <!--</el-popover>-->
              </span>
              <span v-else class="el-dropdown-link channel-title">
                <!--<strong>{{ userChannel.name }}</strong>-->
                <el-popover
                  placement="right-end"
                  width="260"
                  @show="showPopover"
                  trigger="click">
                  <user-info-popover ref="userInfoPopoverDlg"></user-info-popover>
                  <strong slot="reference" style="cursor: pointer">{{ userChannel.name }}</strong>
                </el-popover>
              </span>

            </div>
            <div style="position: fixed; right: 56px; top:27px;" class="elTabs" v-if="userChannel.channelType === 'G'">
              <el-row :gutter="10" style="font-size: 14px; color: #707070">
                <el-col :span="12">
                  <div ref="first" :class="[tabItem,isA?activeClass:'']" @click="onChange('first')">聊天</div>
                </el-col>
                <el-col :span="12">
                  <div ref="two" :class="[tabItem,isB?activeClass:'']"  @click="onChange('two')">公告</div>
                </el-col>
                <!-- <el-col :span="8">
                  <div ref="three" :class="[tabItem,isC?activeClass:'']" @click="onChange('three')">文件</div>
                </el-col> -->
              </el-row>

            </div>
            <div class="tools" v-if="userChannel.channelType === 'G' || (this.friendList.some(item => { return item.jid === userChannel.jid }))">
              <el-dropdown trigger="click" @command="handleCommand" class="el-dropdown-custom">
                <span class="">
                  <i class="el-icon-menu" style="font-size: 16px; cursor: pointer"></i>
                  <!-- <img src="../../assets/images/collection.png" title="功能设置"/> -->
                </span>
                <el-dropdown-menu slot="dropdown">
                  <template v-if="userChannel.channelType === 'G'">
                    <el-dropdown-item command="addMember">邀请成员</el-dropdown-item>
                    <el-dropdown-item command="groupinfo">群组设置</el-dropdown-item>
                    <el-dropdown-item command="leave">退出群组</el-dropdown-item>
                    <el-dropdown-item command="remove" v-if="userInfo.jid === memberList.filter(item => { return item.affiliation === 'owner' })[0].jid">解散群组</el-dropdown-item>
                  </template>
                  <template v-else>
                    <el-dropdown-item command="editTitle" v-if="this.friendList.some(item => { return item.jid === userChannel.jid })">编辑备注</el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </span>
          <group-set-component ref="groupInfoSetMessage"></group-set-component>
          <edit-channel-title ref="editChannelTitleDlg" @onEditTitleFinished="onEditTitleFinished"></edit-channel-title>
          <edit-channel-name ref="editChannelNameDlg" :channelId="channelId" @onEditNameFinished="onEditNameFinished"></edit-channel-name>
          <add-member ref="addChannelMemberDlg" @onAddMemberFinished="onAddMemberFinished" :channel-id="userChannel.channelId" :data="treeDataForMessage"></add-member>
          <member-list ref="memberListDlg" :channel-id="userChannel.channelId" :channel-name="userChannel.channelName"></member-list>
          <member-management ref="memberManagementDlg" :channel-id="userChannel.channelId" :channel-name="userChannel.channelName" @onOpenAddMemberDlg="doOpenAddMemberDlg"></member-management>
          <edit-notice ref="editNoticeDlg" @onRefreshNoticeContent="refreshNoticeContent"></edit-notice>
        </div>
      </div>
      <!--聊天内容区域-->
      <div class="body-container" v-show="isA">
        <div class="body">
          <message-list ref="messageList" :channel-id="channelId" :user-channel="userChannel" :current-member-list="this.memberList" :noReadMessageNum="noReadMessageNum"></message-list>
        </div>
      </div>
      <!--聊天内容发送区域-->
      <div class="footer" v-show="isA">
        <send-message :channel-id="channelId" :channel-type="$route.params.channelType" :channel-name="userChannel.name" :current-member-list="this.memberList"></send-message>
      </div>
    </div>

    <!--右侧群公告及群成员列表展示-->
    <div>
      <div class="right-header">
      </div>
      <div v-if="containerRightVisible && isA" class="containerRight">
      <div class="notice-header">群公告</div>
      <div class="notice" v-if="groupNoticeList && groupNoticeList.length > 0">
        <div class="content" v-for="(item, index) in groupNoticeList"  v-if="index < 5" :key="index">
          <span class="closeNotice-title" @click="noticeDetail(item)">{{'【公告】' + item.title }}</span>
          <i v-if="isAdmin" class="el-icon-circle-close closeNotice"  @click="deleteNotice(item)"></i>
        </div>
      </div>
      <div class="no-notice" v-else>
        <div class="no-notice-pic">
          <img src="../../assets/images/no-content.png" width="70" height="65"/>
        </div>
        <div class="no-notice-mess">暂时没有新公告</div>
      </div>
      <div class="member-header">成员（{{memberList ? memberList.length : 0}}）</div>
      <div class="member" v-bind:style="{height: $store.state.message.msgDlgMemberHeight + 'px'}">
        <div class="content">
          <!--群主-->
          <div class="status-wrapper" v-for="(item, index) in this.memberList" v-if="item.affiliation === 'owner'">
            <template v-if="item.photo">
              <img class="member-avatar" :src="item.photo" alt="用户头像" />
            </template>
            <template v-else>
              <img class="member-avatar" src="../../assets/images/boy.png"/>
            </template>
            <span class="member-name ellipsis">{{ item.name ? item.name : item.jid.split('@')[0] }}</span>
            <img src="../../../../static/icon/group-admin.png" alt="" style="width: 28px; height: 15px; margin-left: 5px" />
          </div>
          <!--群成员-->
          <div class="status-wrapper" v-for="(item, index) in this.memberList" :key="item.id" v-if="item.affiliation !== 'owner'" @click.right="operationMember($event, item)">
            <template v-if="item.photo">
              <img class="member-avatar" :src="item.photo" alt="用户头像" />
            </template>
            <template v-else>
              <img class="member-avatar" src="../../assets/images/boy.png"/>
            </template>
            <span class="member-name ellipsis">{{ item.name ? item.name : item.jid.split('@')[0] }}</span>

            <!--右键菜单-->
            <div v-if="item.rightKeyMenu" class="right-key-menu" :style="{ left: rightKeyMenuPosition.x, top: rightKeyMenuPosition.y }">
              <ul>
                <li v-if="userInfo.jid === memberList.filter(item => { return item.affiliation === 'owner' })[0].jid && userInfo.jid !== item.jid" @click="deleteGroupMember(item)">删除成员</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>


    <div v-show="isB" style="height:100%; position: fixed;" v-bind:style="{width: $store.state.message.msgDlgContainerAllWidth + 'px'}">
        <notice-list :roomJid="roomJid" :groupNoticeList="groupNoticeList" @getGroupNotice="getGroupNotice" :isAdmin="isAdmin"></notice-list>
    </div>

    <el-dialog
      width="400px" :modal="false"
      :visible.sync="noticeDialog" @close="closeNotice()">
      <div slot="title" class="dialog-header">{{lastGroupMessage.title}}</div>
      <div style="max-height: 320px;overflow-y:auto; margin-top:-20px;">
        <div style="padding-left: 15px;padding-right: 15px;overflow: auto;">
          <p style="line-height:1.5em;padding: 0px;font-size: 13px;">
            &nbsp;&nbsp;{{lastGroupMessage.content}}
          </p>
        </div>
        <div style="text-align: right; font-size: 12px; padding: 10px 15px 15px 0;border-bottom:1px solid #eee;margin-bottom:5px; ">
          {{lastGroupMessage.userName}} 发表于 {{lastGroupMessage.createTime | formatDate}}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disabled */
  import { mapMutations, mapActions, mapState } from 'vuex'
  import { outputError } from '@/utils/exception'
  import { baseUrl } from '@/utils/url'
  import * as myDate from '@/utils/date'
  import StatusOnlineIcon from '@/components/svg/statusOnlineIcon'
  import StatusOfflineIcon from '@/components/svg/statusOfflineIcon'
  import StatusAwayIcon from '@/components/svg/statusAwayIcon'
  import MessageList from '@/components/chatPanel/chatMessageList'
  import noticeList from '@/components/notice/noticeList'
  import SendMessage from '@/components/chatPanel/chatInput'
  import userInfoPopover from '@/components/user/userInfoPopover'
  import { appendYaml, readYamlInfoByKey } from '@/utils/yamlUtil'
  // import noticeList from '@/components/notice/noticeList'
  import {ipcRenderer} from 'electron'
  import globalEvent from '@/utils/globalEvent'

  export default {
    data() {
      return {
        isA: true,
        isB: false,
        isC: false,
        activeClass:["tab-item","active"],
        tabItem:["tab-item"],
        noticeDefault: '暂无公告',
        loadingVisible: false,
        channelId: '',
        userChannel: {},
        memberList: [],
        roomJid: '',
        noticeListInfo:[],
        sentMessage: null,
        isAdmin: false,
        noticeDialog: false,
        // containerWidth: '',
        // containerAllWidth: '',
        // containerSubPx: 0,
        // memberHeight: '',
        containerRightVisible: false,
        myId: JSON.parse(sessionStorage.getItem('currentUser')).id,
        channelName:'',
        rightKeyMenuPosition: {
          x: 0,
          y: 0
        },
        noReadMessageNum: 0,
        groupNoticeList: [],
        lastGroupMessage: {}
      }
    },
    computed: {
      ...mapState({
        sessionList: state => state.session.sessionList,
        groupList: state => state.group.groupList,
        userInfo: state => state.home.userInfo,
        rightKeyMenu: state => state.home.rightKeyMenu,
        friendList: state => state.home.friendList,
        treeDataForMessage: state => state.tree.treeDataForMessage,
        updateGroupFlag: state => state.group.updateGroupFlag,
        currentChannelId: state => state.message.currentChannelId,
        noticeNew: state => state.message.noticeNew,
        recallMessageMember: state => state.message.recallMessageMember,
        recallMessageType: state => state.message.recallMessageType,
        recallMessageSignid: state => state.message.recallMessageSignid,
        recallMessageGroup: state => state.message.recallMessageGroup
      })
    },
    mounted () {
      // 监听窗口改变事件
      globalEvent.$on('windowResizeEvent', () => {
        // console.log('子窗口重置大小')
        this.$nextTick(() => {
          this.setContentSize()
        })
      })
    },
    methods: {
    ...mapMutations([
      'SET_CURRENT_CHANNEL_ID',
      'SET_MSG_DLG_CONTAINER_SUB_PX',
      'SET_MSG_DLG_CONTAINER_WIDTH',
      'SET_MSG_DLG_CONTAINER_ALL_WIDTH',
      'SET_RIGHTKEYMENU',
      'SET_UPDATE_GROUP_FLAG',
      'SET_RECALL_MESSAGE_INFO',
      'DELETE_MESSAGE_BY_SIGNID'
      ]),
    ...mapActions([
      'getUserChannel',
      'isAdministrator',
      'leaveChannel',
      'removeChannel',
      'listMember',
      'unReadCountReset',
      'SetAliasToGroup',
      'DeleteGroupMember',
      'DestoryGroup',
      'atMeStatusReset',
      'ExitGroup',
      'GetGroupNotice',
      'getSessionByJid',
      'deleteSessionById',
      'DeleteGroupNotice'
    ]),
      // 成员操作
      operationMember (event, member) {
        this.rightKeyMenuPosition.x = event.x - 88 + 'px'
        this.rightKeyMenuPosition.y = event.y - 30 + 'px'
        this.SET_RIGHTKEYMENU(true)
        this.initMemberList(member)
      },
      closeNotice(){
        localStorage.removeItem('notice_'+this.roomJid)
      },
      noticeDetail (item) {
        this.lastGroupMessage = item
        this.noticeDialog = true;
      },
      deleteNotice(item){
        this.$confirm('确定要删除该公告吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.DeleteGroupNotice(item.id).then(() =>{
              this.getGroupNotice();
            })
          })
          .catch(error => {
            outputError(this, error)
          })
      },
      initMemberList (member) {
        this.memberList.forEach(item => {
          if (item.jid === member.jid) {
          item.rightKeyMenu = true
          return
        }
        item.rightKeyMenu = false
      })
      },
      // 删除成员(群主)
      deleteGroupMember (member) {
        this.DeleteGroupMember({
          groupJid: this.$route.params.channelId,
          memberJid: member.jid
        })
      },
      onChange(num){
        this.isA = false;
        this.isB = false;
        this.isC = false;
        if(num=='first'){
          this.isA = true;
        }
        if(num=='two'){
          this.isB = true;
        }
        if(num=='three'){
          this.isC = true;
        }
      },
      initPage() {
        if(this.$route.params.channelId === undefined) {
          return
        }
        this.onChange('first');
        this.channelId = this.$route.params.channelId
        // 获取群id
        this.roomJid = this.channelId
        console.log('获取群id', this.roomJid)
        this.channelName = this.$route.params.name
        this.SET_CURRENT_CHANNEL_ID(this.channelId) // 设置当前会话ID
        ipcRenderer.send('closeTrayFlicker') // 消除图标闪烁
        // 从好友列表获取当前频道信息
        this.userChannel = this.$route.params.channel
        if(this.userChannel){
          if(this.userChannel && this.userChannel.isAtMe === 'yes'){
            this.atMeStatusReset(this.channelId) // @状态去除
          }
          this.noReadMessageNum = this.userChannel.unreadMessageCount
          if(this.userChannel.unreadMessageCount > 0){
            this.unReadCountReset(this.channelId) // 未读数量清零
          }
        }
        // console.log('this.userChannel',this.userChannel)
        if (this.userChannel.channelType === 'G') {
          //显示群消息通知
          var noticeInfo=localStorage.getItem('notice_' + this.roomJid)
          console.log("显示群消息通知",noticeInfo)
          if(noticeInfo){
            this.noticeDialog = true;
            this.lastGroupMessage = noticeInfo;
          }
          //群组成员
          this.findQunzuMember(this.channelId)
          this.getGroupNotice()
        } else {
          this.loadingVisible = false
        }
        this.setContentSize()
      },
      setContentSize(){
        if(this.userChannel){
          if(this.userChannel.channelType != 'G'){
            // this.containerSubPx = 251;
            this.SET_MSG_DLG_CONTAINER_SUB_PX(273)
            this.SET_MSG_DLG_CONTAINER_WIDTH(document.body.clientWidth - this.$store.state.message.msgDlgContainerSubPx)
            this.SET_MSG_DLG_CONTAINER_ALL_WIDTH(document.body.clientWidth - this.$store.state.message.msgDlgContainerSubPx + 155)
            this.containerRightVisible = false;
          }else{
            // this.containerSubPx = 407;
            this.SET_MSG_DLG_CONTAINER_SUB_PX(430)
            this.SET_MSG_DLG_CONTAINER_WIDTH(document.body.clientWidth - this.$store.state.message.msgDlgContainerSubPx)
            this.SET_MSG_DLG_CONTAINER_ALL_WIDTH(document.body.clientWidth - this.$store.state.message.msgDlgContainerSubPx + 155)
            this.containerRightVisible = true;
          }
        }
      },
      doShowGroupNotice(userid){
        let key = this.myId + '_' + this.$route.params.channelId
        let noticeTime = readYamlInfoByKey('IM-GROUP-NOTICE-LOG', key)
        if(this.userChannel.noticeContent != this.noticeDefault && (noticeTime == undefined || noticeTime != this.userChannel.noticeTime)){
          if(this.myId != userid){
            this.noticeDialog = true;
          }
          appendYaml('IM-GROUP-NOTICE-LOG', key, this.userChannel.noticeTime)
        }
      },
      onGroupNoticeHandle(message){
        console.log('new group notice: ', message)
        // 当前频道不是该群不显示处理
        if(this.$route.params.channelId != message.channelId){
          return ;
        }
        this.userChannel.noticeTime = message.time
        this.userChannel.noticeContent = message.content

        this.doShowGroupNotice(message.userId)
      },
      onMembersCountChanged(message) {
        if(this.$route.params.channelId === message.channelId) {
          this.userChannel.memberCount += message.count
        }
      },
      handleCommand(command) {
        const group = this.groupList.filter(item => { return item.jid === this.channelId })[0]
        switch(command) {
          case 'addMember':
            this.$refs.addChannelMemberDlg.$emit('openDialog', group)
            break;
          case 'editTitle':
            this.$refs.editChannelTitleDlg.$emit('openDialog', this.userChannel)
            break;
          case 'editName':
            this.$refs.editChannelNameDlg.$emit('openDialog', this.userChannel)
            break;
          case 'manageMember':
            this.$refs.memberManagementDlg.$emit('openDialog', this.userChannel)
            break
          case 'leave':
            this.doLeaveChannel(this.userChannel)
            break
          case 'remove':
            this.doRemoveChannel(this.userChannel.channelId)
            break
          case 'groupinfo':
            this.$refs.groupInfoSetMessage.$emit('groupInfoSet-event', group)
        }
      },
      handleEditNotice(){
        this.$refs.editNoticeDlg.$emit('openDialog', this.userChannel)
      },
      doOpenAddMemberDlg() {
        this.$refs.addChannelMemberDlg.$emit('openDialog', this.userChannel)
      },
      // 退出群组
      doLeaveChannel() {
        this.$confirm('确定退出该群组吗？', '提示', {
          type: 'warning'
        })
          .then(_ => {
            this.ExitGroup({
              userJid: this.userInfo.jid,
              groupJid: this.channelId
            })
              .then(() => {
                this.$router.push('/noContent')
              })
          })
          .catch(error => {
              this.loadingVisible = false
              outputError(this, error)
          })
      },
      // 解散群组
      doRemoveChannel(channelId) {
        this.$confirm('确定解散该群组吗？', '解散群组', {
          type: 'warning'
        })
          .then(() => {
            this.DestoryGroup({
              jid: this.userInfo.jid,
              groupJid: channelId
            })
              .then(() => {
                this.$router.push('/noContent')
              })
          })
          .catch(() => {})
      },
      findQunzuMember(channelId){
        this.SET_UPDATE_GROUP_FLAG('')
        // 更新当前群组会话的群成员信息
        // 群组更新提醒如果不是当前会话则不进行更新
        if(channelId !== this.currentChannelId){
          return
        }
        if(this.groupList && this.groupList.length > 0){
          let group = this.groupList.find(element => {
            return element.jid === channelId
          })
          console.log(group, this.userInfo)
          if(group){
            // if(this.userChannel.name !== group.name){
            //   // TODO 更新数据库缓存
            //   this.userChannel.name = group.name
            // }
            this.memberList = group.members
            let memberArr = [];
            if(this.memberList){
              for(let item of this.memberList){
                if(item.jid !== this.userInfo.jid){
                  memberArr.push(item.name)
                }
              }
              sessionStorage.setItem('qunzu_member_list', JSON.stringify(memberArr))
            }

          }
        }
      },
      // 编辑备注
      onEditTitleFinished(newTitle) {
        this.userChannel.channelDisplayName = newTitle
        this.SetAliasToGroup({
          groupJid: this.$route.params.channelId ,
          alias: newTitle
        })
      },
      onEditNameFinished(newName) {
        this.userChannel.channelName = newName
      },
      onAddMemberFinished(){
        let channelId = this.$route.params.channelId
        this.findQunzuMember(channelId)
      },
      showMemberList() {
        this.$refs.memberListDlg.$emit('openDialog')
      },
      getAvatarUrl(message) {
        if('http://'.startsWith(message.avatarUrl.toLowerCase()) || 'https://'.startsWith(message.avatarUrl.toLowerCase())) {
          return message.avatarUrl
        }
        return baseUrl() + '/users/' + message.id + '/avatar?width=32&height=32'
      },
      formatDateNotice(time){
        if(time == undefined || time == '' || time == null){
          return ''
        }
        let d = new Date(time)
        return myDate.formatDate(d, 'yyyy-MM-dd')
      },
      handleNoticePromul(channel){
        if(this.lastGroupMessage || !this.lastGroupMessage.content){
          return ''
        }
        return this.lastGroupMessage.userName + "  " + this.formatDateNotice(this.lastGroupMessage.createTime)
      },
      refreshNoticeContent(val){
        this.userChannel.noticeContent = val
      },
      showPopover(){
        this.$refs.userInfoPopoverDlg.$emit('openDialog', this.userChannel)
      },
      getGroupNotice () {
        let dataParam = {
          roomJid: this.userChannel.channelId,
          page: '1',
          size: '100'
        }
        this.GetGroupNotice(dataParam).then(data => {
          console.log(`群组公告：${JSON.stringify(data.data.content)}`)
          this.groupNoticeList = data.data.content
          if(this.groupNoticeList && this.groupNoticeList.length > 0){
            this.lastGroupMessage = this.groupNoticeList[0]
          }
        }).catch(error => {
          console.log(error)
        })
        // 是否是管理员
        this.groupList.forEach(group => {
          if (group.jid === this.userChannel.channelId) {
            let isGroupOwner = false
            group.members.forEach(item => {
              if (item.affiliation === 'owner' && item.jid === this.userInfo.jid) {
                isGroupOwner = true
              }
            })
            this.isAdmin = isGroupOwner
          }
        })
      }
    },
    created() {
      this.initPage()
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return myDate.formatDate(date, 'yyyy-MM-dd');
      }
    },
    watch: {
      '$route': 'initPage',
      rightKeyMenu: function (val, oldval) {
        if (!val) {
          this.initMemberList({})
        }
      },
      updateGroupFlag: function (val, oldval) {
        if (!val) return
        this.findQunzuMember(val)
      },
      noticeNew: function (val, oldval) {
        console.log('有新公告了')
        var noticeInfo=localStorage.getItem('notice_' + this.roomJid)
          console.log("显示群消息通知",noticeInfo)
          if(noticeInfo){
            this.noticeDialog = true;
            this.lastGroupMessage = JSON.parse(noticeInfo);
            this.getGroupNotice()
          }
      },
      recallMessageMember: function(val, oldval) {
        // console.log(`撤回信息啦++++++++:${val}`)
        if (!val) return
        // console.log(`this.currentChannel:${JSON.stringify(this.currentChannel)}`)
        if (this.userChannel.channelType === 'P' && this.recallMessageType === 'P' && val === this.userChannel.channelId) {
          this.DELETE_MESSAGE_BY_SIGNID(this.recallMessageSignid)
          this.$message({
            message: `${this.userChannel.name}撤回了一条消息!`,
            duration: 700
          })
        } else if (this.userChannel.channelType === 'G' && this.recallMessageType === 'G' && this.recallMessageGroup === this.userChannel.channelId) {
          // console.log(`群组消息体: ${this.recallMessageSignid}`)
          this.DELETE_MESSAGE_BY_SIGNID(this.recallMessageSignid)
          let memberName = ''
          this.groupList.forEach(item => {
            if (item.jid === this.recallMessageGroup) {
              item.members.forEach(member => {
                if (member.jid === val) {
                  memberName = member.name
                }
              })
            }
          })
          this.$message({
            message: `${memberName}撤回了一条消息!`,
            duration: 700
          })
        }
        this.SET_RECALL_MESSAGE_INFO({
          memberJid: '',
          type: 'P',
          signid: '',
          groupJid: ''
        })
      }
    },
    components: { StatusOnlineIcon, StatusOfflineIcon, StatusAwayIcon, MessageList, SendMessage, userInfoPopover,noticeList,
      EditChannelTitle: resolve => require(['@/components/userChannel/editChannelTitle'], resolve),
      EditChannelName: resolve => require(['@/components/channel/editChannelName'], resolve),
      AddMember: resolve => require(['@/components/channel/addMember'], resolve),
      MemberList: resolve => require(['@/components/channel/memberList'], resolve),
      MemberManagement: resolve => require(['@/components/channel/manageMember'], resolve),
      EditNotice: resolve => require(['@/components/channel/editNotice'], resolve),
      groupSetComponent: resolve => require(['@/components/group/groupSet-component'], resolve)
    }
  }
</script>

<style lang="scss" scoped>
  .closeNotice-title{
    overflow: hidden;
    white-space: nowrap;
    width: 115px;
    text-overflow:ellipsis;
    float: left;
    &:hover {
      color: #000;
    }
  }
  .closeNotice{
    float: right;
    &:hover {
      color: #000;
    }
  }
  .msgDialog {
    height: 100%;
    position:relative;
  // background: url(../../assets/images/welcome.png)
  background: #F2F3F5;
  }
  .tools{
    position: fixed;
    top: 28px;
    right: 18px;
    z-index: 15;
  img{
    /*font-size: 22px;*/
    width: 21px;
    height: 21px;
    color: #999;
    cursor: pointer;
    margin-left: 14px;
  }
  }
  .right-header{
    width: 100%;
    height: 58px;
    right:0px;
    background: #ffffff;
    border-bottom: 1px solid #DCDEE0;
  }
  .containerRight{
    height: 100%;
    width: 155px;
    right: 0px;
    // top:58px;
    position:absolute;
    border-left: 1px solid #D4D6D9;
    background: #FFF;
  .header{

    height: 58px;
    background: #ffffff;
    border-bottom: 1px solid #DCDEE0;
  }
  // .currUserCart{
     //   border: 1px solid #30A2F2;
     //   height: 0px;
     //   border-radius: 6px;
     //   margin: 0 10px 0 10px;
     //   background-color: #30A2F2;
     // }
  .notice-header {
    margin: 10px 10px 8px 10px;
    border: 0;
    color: #000;
    font-size: 14px;
  }

  .notice {
    height: 122px;
    background-color: #fff;
    margin: 0 5px;
    /*overflow: hidden;*/
    padding: 3px 0 8px 3px;
    .content {
      text-overflow:ellipsis;
      display: inline-block;
      height: 20px;
      width: 130px;
      font-size: 13px;
      padding: 0 5px;
      line-height: 18px;
      color: #909399;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      /*&:hover {*/
        /*color: #000;*/
      /*}*/
    }
    .promulgator {
      margin: 4px 8px 0 0;
      color: #8d97a6;
      font-size: 12px;
      text-align: right;
    }
  }
  .no-notice{
    height: 122px;
    background-color: #fff;
    margin: 0 5px;
    overflow-y: auto;
    padding: 0 0 8px 0;
  .no-notice-pic{
    text-align: center;
    margin-top: 10px;
  }
  .no-notice-mess{
    font-size: 13px;
    text-align: center;
    color: #909399;
  }
  }
  .member-header{
    padding: 10px;
    font-size: 14px;
    border: 0;
    border-top:1px solid #DCDEE0;
  }
  .member {
    background-color: #fff;
    margin: 0 5px;
    padding-top: 4px;
    overflow-y: auto;
    .content{
      overflow-y: auto;
      overflow-x: hidden;
      line-height: 32px;
      height: 100%;
      .status-wrapper {
        display: flex;
        align-items: center;
        width: 125px;
        height: 32px;
        /*line-height: 32px;*/
        padding: 0 8px;
        font-size: 13px;
        color: #666;
        cursor: pointer;
        .member-avatar {
          width: 24px;
          height: 24px;
        }
        .member-name {
          margin-left: 5px;
        }
        &:hover {
           background-color: #E9E9E9;
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
  .container {
    // min-width: 476px;
    max-width: 100%;
  ::-webkit-scrollbar{display:none;}
  &:hover {
  ::-webkit-scrollbar{display:inline-block;}
  }
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  /*background: #fff;*/
  height: 100%;
  position: relative;
  float: left;
  .header {
    -webkit-flex: 0 0 58px;
    flex: 0 0 58px;
    font-size: 17px;
    position: relative;
    width: 100%;
    z-index: 2;
    background: #ffffff;
    border-bottom: 1px solid #DCDEE0;
  .title-container {
    min-width: 0px;
    flex: 1 1 0%;
    margin-top: 15px;
    padding-left: 8px;
    vertical-align: middle;
  span {
    background: transparent;
    border: none;
    padding: 0;
    text-align: left;
    /*cursor: pointer;*/
  }
  .title {
    flex: 1;
    min-width: 0;
    padding: 0 0 0 10px;
    float: left;
    margin-top: 7px;
  svg {
    margin: 0 0 0 3px;
    width: 13px;
    height: 13px;
  }
  #dropdown-icon-selected {
    display: none;
  }
  .channel-title{
  // color: #606266;
  strong{
    // cursor: pointer;
  }
  }
  .channel-title:hover {
    // color: #606266;
  #dropdown-icon {
    display: none;
  }
  #dropdown-icon-selected {
    display: inline;
  }
  }
  }
  .display-name {
    margin-top: 3px;
    font-size: 14px;
  }
  .members-container {
    float: right;
    padding: 0 50px 0 0;
  .members {
    border-radius: 20px;
    margin-top: 5px;
    padding: 6px 23px;
    border: 1px solid #dcdfe6;
    vertical-align: middle;
  div {
    float: left;
    margin-right: 6px;
    font-weight: bold;
    color: #B7B3AD;
  }
  svg {
    width: 16px;
    height: 16px;
    margin-top: 1px;
    fill: #B7B3AD;
  }
  }
  .members:hover {
    cursor: pointer;
    border: 1px solid #319EDD;
  div {
    color: #319EDD;
  }
  svg {
    fill: rgb(35, 137, 215);
  }
  }
  }
  }
  }

  .body-container {
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    height: 100%;
    min-height: 428px;
    width: 100%;
    overflow: hidden;
    position: relative;
  .body {
    -webkit-overflow-scrolling: touch;
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    position: absolute;
  }
  }

  .footer {
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
    height: 150px;
    z-index: 1;
    margin: 3px 0px 0px 0px;
    border-top: 1px solid #DCDEE0;
    border-right: 1px solid #DCDEE0;
  // border-radius: 6px;
    background-color: #fff;
  }
  }

  .el-dropdown-custom{
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    font-size: 13px;
    font-weight: bold;
  }
  .active{
    color: #242729;
    border-bottom: 3px #409eff solid;
  }
  .tab-item {
    cursor: pointer; padding-bottom: 11px;
  }
</style>

