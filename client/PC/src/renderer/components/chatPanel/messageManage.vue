<template>
  <el-dialog :visible.sync="dialogVisible" class="message-manage-dialog" :append-to-body="true" :modal="false" width="700px" @close="doCloseDialog" top="5vh">
    <h3 slot="title" class="message-manage-conponent-title">消息管理</h3>
    <el-container class="message-manage-conponent">
      <!--会话列表-->
      <el-aside class="aside-section">
        <div class="search">
          <input placeholder="搜索" @input="searchChannelList" v-model="channelSearchContent" />
        </div>
        <ul class="channel-list">
          <li
            class="channel-list-item"
            :style="{background: channelId === 'systemNotice' ? '#f7f7f7' : 'white'}"
            @click="showSystemNotice"
          >
            <img src="../../assets/images/horn-icon.png" alt="会话头像" class="channel-list-item-avatar" />
            <strong class="channel-list-item-name">系统公告</strong>
          </li>
          <li
            v-for="item in filterSessionList"
            :key="item.channelId"
            class="channel-list-item"
            @click="selectedChannel(item)"
            :style="{background: item.channelId === channelId ? '#f7f7f7' : 'white'}"
          >
            <img v-if="item.headUrl" :src="item.headUrl" alt="会话头像" class="channel-list-item-avatar" />
            <img v-else src="../../assets/images/qun.png" class="channel-list-item-avatar" alt="群组默认头像" />
            <strong class="channel-list-item-name ellipsis">{{ item.name }}</strong>
          </li>
        </ul>
      </el-aside>
      <el-main class="main-section">
        <div v-if="channelId === 'systemNotice'" class="system-notice-template">
          <template v-if="systemNoticeList.length">
            <div v-for="item in systemNoticeList" class="system-notice-item">
              <h4 class="notice-title">{{ item.title }}</h4>
              <p class="notice-content">{{ item.content }}</p>
              <p class="notice-time">{{ item.createTime }}</p>
            </div>
          </template>
          <template v-else>
            <h3 style="text-align: center">暂无系统公告!</h3>
          </template>
        </div>
        <div v-else>
          <right-key-menu-com :menu-items="menuItems" :mouse-position="mousePosition" @itemClickList="itemClickList" :busiObj="rightClickItem" ></right-key-menu-com>
          <div>
            <!--<div slot="title" class="dialog-header"><h3>{{ channelName }}</h3></div>-->
            <div class="body-container">
              <div class="channel-search-container">
                <div class="search"><input type="text" placeholder="搜索" v-model="searchMessage" @keyup.enter="onSearchMessage(false)"><i class="el-icon-search" @click="onSearchMessage(false)"></i></div>
                <el-button size="mini" type="primary" @click="doExportFile">导出</el-button>
                <el-button size="mini" type="warning" @click="doDeleteAll" icon="el-icon-delete">清空记录</el-button>
              </div>

              <div class="container" id="messageList">
                <image-viewer ref="imageViewer" :image-url="image.url" :image-width="image.width" :image-height="image.height"></image-viewer>
                <div v-if="hasMoreMessage" class="load-more-message"><span @click.stop="getMessageList(true)">加载更多消息</span></div>
                <div :id="'message_' + item._id" v-for="(item, index) in this.hisotryMessageList" :key="item.id">
                  <div class="message-container">
                    <div class="message">
                      <div class="message-content" style="float: left;max-width:450px;" @mousedown="operationMessage($event, item, index)">
                        <!--<span class="sender">{{item.groupName ? item.groupName + '-' : ''}}{{ item.senderId }}</span>-->
                        <span class="sender">{{ getMessageSenderName(item.senderId, item) }}</span>
                        <span class="createAt">{{ getCreateDateTime(item) }}</span>
                        <div v-if="!item.fileType || item.fileType === 'img' || item.fileType == 'vcard' || item.fileType == 'position' || item.fileType == 'aac'" style="margin-top: 5px;">
                          <span v-html="item.content" style="word-break:break-all;"></span>
                          <div class="arrowLeft"></div>
                        </div>
                        <template v-else>
                          <!-- <div v-if="isImage(item.fileExtension)"><img class="image-file" @click="viewImage(getFileUrl(item.filePath, item.fileName, item.fileMimeType), item.imageWidth, item.imageHeight)" :width="item.imageThumbWidth" :height="item.imageThumbHeight" :src="getFileUrl(item.filePath + '/thumb', item.fileName, item.fileMimeType)"></div>
                          <div v-else-if="isGif(item.fileExtension)"><img class="image-file" @click="viewImage(getFileUrl(item.filePath, item.fileName, item.fileMimeType), item.imageWidth, item.imageHeight)" :width="item.imageWidth" :height="item.imageHeight" :src="getFileUrl(item.filePath, item.fileName, item.fileMimeType)"></div> -->
                          <div class="attach-file" >
                            <a @click="downloadFile(item._id, item.fileInfo.filePath, item.fileInfo.fileName, item.fileInfo.fileSize, item.createTime)" target="_blank">
                              <img src="../../assets/images/file-message.png" width="35" height="38" class="attach-file-icon"/>
                              <div class="attach-desc" style="">
                                <div>{{ item.fileInfo.fileName.length > 26 ? item.fileInfo.fileName.substr(0, 26) + '...' : item.fileInfo.fileName }}</div>
                                <div><span>{{ item.fileInfo.fileExtension ? item.fileInfo.fileExtension.toUpperCase() : '' }}</span>&nbsp;&nbsp;<span>{{ formatFileSizeUnit(item.fileInfo.fileSize) }}</span></div>
                              </div>
                            </a>
                          </div>
                          <!-- <div class="attach-file-desc">文件只会在服务器中存储七天，请及时下载保存</div> -->
                        </template>
                      </div>
                      <div class="clear-float"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { outputError } from '@/utils/exception'
import * as myDate from '@/utils/date'
import { baseUrl } from '@/utils/url'
import Cookie from '@/utils/cookie'
import rightKeyMenuCom from '@/components/common/rightKeyMenu'
import Clipboard from 'clipboard';
const ipcRenderer = require('electron').ipcRenderer
const moment = require('moment');
import { appendYaml, readYamlInfoByKey } from "@/utils/yamlUtil";
const fs = require('fs')
const xss = require('xss')

export default {
  name: "message-history",
  // props: ['channelId', 'channelName','currentMemberList'],
  data() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
    return {
      dialogVisible: false,
      myId: JSON.parse(sessionStorage.getItem('currentUser')).id,
      maxCreateAt: 0,
      hasMoreMessage: true,
      isLoadMore: false,
      searchMessage: '',
      fileContent: '',
      image: {
        url: '',
        width: 0,
        height: 0
      },
      rightClickItem:'',
      mousePosition: [],
      menuItems: [
        {
          menuName: '复制',
          hide:true
        },
        {
          menuName: '删除',
          hide:false
        }
      ],
      channelId: '',
      channelName: '',
      channelSearchContent: '',
      currentMemberList: []
    }
  },
  computed: {
    ...mapState({
      hisotryMessageList: state => state.message.historyMessageList,
      rightKeyMenu: state => state.home.rightKeyMenu,
      userInfo: state => state.home.userInfo,
      sessionList: state => state.session.sessionList,
      systemNotice: state => state.home.systemNotice,
      systemNoticeList: state => state.home.systemNoticeList,
      groupList: state => state.group.groupList
    }),
    filterSessionList () {
      if (!this.channelSearchContent.replace(/\s/g, '')) {
        return this.sessionList
      }
      return this.sessionList.filter(item => {
        return item.name.indexOf(this.channelSearchContent) !== -1
      })
    }
  },
  methods: {
    ...mapMutations([
      'SET_RIGHTKEYMENU',
      'CLEAR_HISTORY_MESSAGE_LIST'
    ]),
    ...mapActions(['readMessage', 'removeMessageByDbSessionId','removeMessageByDb', 'getAllHistoryMessage','getAllMessageNoLimit']),
    // 选择会话
    selectedChannel (channel) {
      this.channelId = channel.channelId
      this.channelName = channel.name
      this.groupList.forEach(item => {
        if (item.jid === this.channelId) {
          this.currentMemberList = item.members
        }
      })
    },
    // 搜索会话
    searchChannelList (event) {
      this.channelSearchContent = event.target.value
    },
    // 显示系统公告
    showSystemNotice () {
      this.channelId = 'systemNotice'
    },
    operationMessage (event, mess, index) {
      // event.preventDefault()
      if (event.button === 2) {
        let x = event.x
        let y = event.y
        this.mousePosition = [x, y]
      } else if (event.button === 0) {
        this.mousePosition = ['close']
      }
      if(mess.fileType){
        this.menuItems[0].hide = true
      }else{
        if (mess.content.indexOf('type="emoji"') !== -1) {
          this.menuItems[0].hide = true
        } else {
          // this.menuItems[0].hide = false
        }
      }
      this.rightClickItem = mess
      this.SET_RIGHTKEYMENU(true)
    },
    itemClickList (index, item) {
      console.log(index, item)
      switch (index) {
        case 0:
          // 复制
          this.copyText(item, index)
          break
        case 1:
          // 删除
          this.delMessage(item, index)
          break
      }
      this.SET_RIGHTKEYMENU(false)
    },
    copyText (item, index) {
      var content = item.content;
      var clipboard = new Clipboard('.right-key-menu1', {
          text: function() {
              return content;
          }
      });
      clipboard.on('success', e => {
        // console.log('复制成功!', 'success');
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        // console.log('该浏览器不支持自动复制!', 'warning');
        // 释放内存
        clipboard.destroy()
      })
    },
    // 删除
    delMessage(message, index) {
      this.$confirm("确定删除消息吗？删除后不可恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(_ => {
          this.removeMessageByDb(message._id)
            .then(() => {
              console.log('删除成功')
            })
            .catch(error => {
              outputError(this, error);
            });
        })
        .catch(_ => {});
    },
    doCloseDialog() {
      this.dialogVisible = false
      this.searchMessage = ''
      this.channelSearchContent = ''
    },
    getMessageSenderName(senderId, channel){
      let myId = this.userInfo.jid
      let name = ''
      if(myId === senderId){
        name = '我'
      }else{
        if(channel.channelType === 'P'){
          name = this.channelName
        }else{
          name = this.getSenderName(senderId)
        }
      }
      return name
    },
    getMessageList(isLoadMore) {
      console.log('获取历史消息')
      this.isLoadMore = isLoadMore
      const limit = 20
      this.getAllHistoryMessage({
        channelId: this.channelId,
        maxCreateAt: this.maxCreateAt,
        limit: limit
      })
        .then(response => {
          if(response && response.length > 0){
            this.hasMoreMessage = response.length === limit;
             if (this.hisotryMessageList.length > 0) {
              this.maxCreateAt = this.hisotryMessageList[0].createTime;
              this.loadingVisible = false;
            }
          }else{
            this.hasMoreMessage = false
          }
        })
        .catch(error => {
          this.loadingVisible = false;
          outputError(this, error)
        })
    },
    getAvatarUrl(message) {
      if('http://'.startsWith(message.senderRealAvatarUrl.toLowerCase()) || 'https://'.startsWith(message.senderRealAvatarUrl.toLowerCase())) {
        return message.senderRealAvatarUrl
      }
      return baseUrl() + '/users/' + message.senderId + '/avatar?width=32&height=32'
    },
    getCreateDateTime(message) {
      let currTime = new Date()
      currTime = new Date(currTime.getFullYear(),currTime.getMonth(),currTime.getDate());
      let time = new Date(message.createTime)
      let date = new Date(time.getFullYear(),time.getMonth(),time.getDate());
      let xc = Number((date - currTime) /1000/60/60/24).toFixed(0);

      let ret = '今天 ' + myDate.formatDate(time, 'hh:mm:ss')
      if(xc == -1){
        ret = '昨天 ' + myDate.formatDate(time, 'hh:mm:ss')
      }else if(xc < -1){
        ret = myDate.formatDate(time, 'yyyy-MM-dd hh:mm:ss')
      }
      return ret
    },
    formatFileSizeUnit(size){
      return myDate.formatFileSizeUnit(size)
    },
    initPage(newVal, oldVal) {
      if(newVal == null || newVal === '') {
        return
      }
      if(!this.dialogVisible){
        return
      }
      this.maxCreateAt = 0
      this.CLEAR_HISTORY_MESSAGE_LIST();
      this.getMessageList(false)
    },
    isImage(fileExtension) {
      let extension = fileExtension.toLowerCase()
      return extension === 'png' || extension === 'jpeg' || extension === 'jpg'
    },
    isGif(fileExtension) {
      let extension = fileExtension.toLowerCase()
      return extension === 'gif'
    },
    getFileUrl(filePath, fileName, mimetype) {
      const fullPath = filePath + '/' + fileName
      return baseUrl() + '/messages/files?fileName=' + encodeURIComponent(fileName) + '&fullPath=' +
        encodeURIComponent(fullPath) + '&mimetype=' + encodeURIComponent(mimetype)
    },
    downloadFile(id, filePath, fileName, fileSize, createAt){
      let path = Cookie.getDownloadPath();
      let nowDate = this.myId + "_" +moment(createAt).format("YYYY-MM")
      let key = id + "_" + fileSize + "_" + fileName;
      let data = readYamlInfoByKey(nowDate, key);

      console.log("dblclickOpenFile::", key, data);
      if (data == undefined) {
        ipcRenderer.send("openFolder", path + fileName);
        return;
      }

      let fullPath = path + data;
      if (data.indexOf(":") > -1 || data.indexOf("/") > -1) {
        // 兼容处理
        fullPath = data;
      }

      console.log("openFile::", fullPath);
      fs.exists(fullPath, function(exists) {
        // if (!exists) {
          // 文件不存在 打开下载的目录
          ipcRenderer.send("openFolder", fullPath);
          // return;
        // }
        // 文件存在 打开文件
        // ipcRenderer.send("openFile", fullPath);
      });
    },
    viewImage(url, width, height) {
      this.image.url = url
      this.image.width = width
      this.image.height = height
      this.$refs.imageViewer.$emit('openDialog')
    },
    onSearchMessage(isLoadMore){
      if(!this.searchMessage){
        this.maxCreateAt = 0
        this.getMessageList(false)
        return ;
      }
      if(!isLoadMore){
        this.maxCreateAt = 0
      }
       let limit = 20
       this.getAllHistoryMessage({
        channelId: this.channelId,
        maxCreateAt: this.maxCreateAt,
        limit: limit,
        content: this.searchMessage
      })
        .then(response => {
          if(response){
            this.hasMoreMessage = response.length === limit;
            if (response.length > 0) {
              this.maxCreateAt = this.hisotryMessageList[0].createTime;
              this.loadingVisible = false;
            }
          }else{
            this.CLEAR_HISTORY_MESSAGE_LIST();
            this.maxCreateAt = 0
            this.hasMoreMessage = false
          }
        })
        .catch(error => {
          outputError(this, error)
        })
    },
    getSenderName(senderId){
      if(this.currentMemberList && this.currentMemberList.length > 0){
        let memeber = this.currentMemberList.find(element => {
          return element.jid.split('@')[0] === senderId.replace('-APP', '')
        })
        if(memeber){
          return (memeber.alias ? memeber.alias :memeber.name)
        }
      }
      return ''
    },
    doExportFile(){
      this.fileContent = ""
      this.getAllMessageNoLimit({channelId: this.channelId}).then(res => {
        if(!res || res.length <= 0){
          this.$message.info('暂时没有消息可以导出哟!')
          return
        }
        let myId = JSON.parse(sessionStorage.getItem("currentUser")).jid
        for(let item of res){
          let name = ''

          if(myId === item.senderId){
            name = '我'
          }else{
            if(item.channelType === 'P'){
              name = this.channelName
            }else{
              name = this.getSenderName(item.senderId)
            }
          }
          let time = this.getCreateDateTime(item)
          let content = ''
          if (item.fileType === 'img') {
            content = '[图片]'
            continue
          } else if (item.fileType === 'file'){
            content = '[文件]'
            continue
          } else if (!item.fileType) {
            var html = xss(item.content, {
                          whiteList: [], // 白名单为空，表示过滤所有标签
                          stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
                          stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
                        })
            content = html
          }else{
            content = '[其他]'
            continue
          }
          if (content == ''){
            continue
          }
          this.fileContent += name + " " + time + "\r\n  " + content + '\r\n'
        }
        let fileName = this.channelName + '_'+ myDate.formatDate(new Date(), 'yyyyMMddhhmmss') +'.txt'
        let exportPath =  Cookie.getExportPath() + fileName
        ipcRenderer.send('exportMessage', exportPath)
      })

    },
    exportMessageReply(){
        const that = this;
        ipcRenderer.on('exportMessageReply', function(event, arg) {
            console.log('exportMessageReply:::', arg)
            if(arg != null){
                fs.writeFile(arg, that.fileContent, { }, (err) => { })
            }
        })
    },
    doDeleteAll(){
      this.$confirm(`确定清除全部消息吗？清除后不可恢复！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeMessageByDbSessionId(this.channelId)
        this.dialogVisible = false
      }).catch(() => {})
    }
  },
  watch: {
    channelId: 'initPage',
    hisotryMessageList: function(newVal, oldVal) {
      this.$nextTick(() => {
        const msgList = document.getElementById('messageList')
        if(!msgList) {
          return
        }
        if(this.isLoadMore) {
          const msgContainer = document.getElementById('message_' + oldVal[0].id)
          msgList.scrollTop = msgContainer.offsetTop
          this.isLoadMore = false
        } else {
          msgList.scrollTop = msgList.scrollHeight
        }
      })
    },
    rightKeyMenu: function (val, oldval) {
      if (!val) {
        this.mousePosition = ['close']
      }
    }
  },
  mounted: function() {
    this.exportMessageReply();
    this.$nextTick(() => {
      this.$on('openDialog', function(action) {
        this.dialogVisible = true
        // this.messageList = []
        this.CLEAR_HISTORY_MESSAGE_LIST();
        this.maxCreateAt = 0
        this.getMessageList(false)
      })
    })
    console.log(2222, this.systemNotice)
  },
  components: {
    ImageViewer: resolve => require(['@/components/chatPanel/imageViewer'], resolve),
    rightKeyMenuCom
  }
}
</script>

<style lang="scss">
  .message-manage-conponent-title {
    font-weight: normal;
  }
  .message-manage-dialog {
    .el-dialog {
      box-shadow: 0 0 10px rgba(0,0,0,.3) !important;
    }
  }
  .message-manage-conponent {
    .aside-section {
      width: 200px !important;
      padding-right: 10px;
      border-right: 1px solid #F0EEEA;
      .search {
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        background-color: #e7f0f5;
        input {
          flex: 1;
          font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
          outline: none;
          border: none;
          background-color: transparent;
          color: #000;
          font-size: 13px;
        }
      }
      .channel-list {
        height: 400px;
        overflow: auto;
        .channel-list-item {
          display: flex;
          align-items: center;
          padding: 5px;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            background: #f7f7f7;
          }
          .channel-list-item-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
          .channel-list-item-name {
            margin-left: 5px;
            font-weight: normal;
            color: #000000;
          }
        }
      }
    }
    .main-section {
      padding: 0;
      .system-notice-template {
        height: 410px;
        padding: 10px;
        color: #000000;
        overflow: auto;
        .system-notice-item {
          padding: 10px;
          border: 1px solid #DFDFDF;
          border-radius: 5px;
          box-shadow: 0 0 10px #dfdfdf;
          .notice-content {
            margin-top: 5px;
          }
          .notice-time {
            margin-top: 10px;
            font-size: 10px;
            text-align: right;
            color: gray;
          }
        }
        .system-notice-item + .system-notice-item {
          margin-top: 10px;
        }
      }
    }
    .dialog-header{
      margin: -38px 0 20px 0;
      color: #000;
    }
    .body-container {
      font-family: "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
      -webkit-flex: 1 1 auto;
      flex: 1 1 auto;
      height: 430px;
      width: 100%;
      overflow: hidden;
      position: relative;
    }
    .container {
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      display: -webkit-flex;
      display: flex;
      -webkit-flex-direction: column;
      flex-direction: column;
      /*background: #fff;*/
      height: 380px;
      position: absolute;
      float: left;
      div {
        font-size: 13px;
      }
      .load-more-message {
        text-align: center;
        font-size: 13px;
        margin: 6px 0 3px 0;
        span {
          color: #909399;
          cursor: pointer;
        }
      }
      .message-container {
        max-width: 100%;
        word-wrap: break-word;
        padding: 10px 20px;
        border-bottom:1px solid #F0EEEA ;
        .message {
          margin: 0 auto;
        }
        &:hover {
          background-color: transparent;
        }
      }
      .status-wrapper {
        width: 32px;
        height: 32px;
        line-height: 32px;
        /*background-color: #DF016E;*/
        border-radius: 32px;
        text-align: center;
        color: #fff;
        font-weight: bold;
        float: left;
        margin-right: 12px;
        cursor: pointer;
        .status-wrapper-image {
          border-radius: 100%;
          width: 100%;
          height: 100%;
          background-color: #DDDEE0;
        }
        .online-status-container {
          width: 12px;
          height: 12px;
          line-height: 12px;
          margin: -10px 0 0 21px;
        }
      }
      .sysuser-status-wrapper {
        background-color: #04549C;
      }
      .message-content {
        font-size: 12px;
        color: #000;
        .sender {
          text-overflow: ellipsis;
          cursor: pointer;
          display: inline-block;
          color: #707070;
        }
        .createAt {
          color: #707070;
          padding: 0 0 0 10px;
        }
        .content {
          padding: 6px 26px 6px 3px;
          line-height: 25px;
        }
        .system-content {
          font-size: 14px;
          color: #908C87;
        }
        .content-select {
          position:relative;
          padding: 4px 10px;
          line-height: 20px;
          background-color: #fff;
          border-radius:6px;
          width:fit-content;
          margin-top: 4px;
          word-wrap:break-word;
          max-width:194px;
          border: 0px solid #dae6f2;
          .arrow {
            position:absolute;
            top:5px;
            right:-12px;
            width:0;
            height:0;
            font-size:0;
            border:solid 6px;
            border-color:transparent transparent transparent #33aaff;
          }
          .arrowLeft {
            position:absolute;
            top:5px;
            left:-12px;
            width:0;
            height:0;
            font-size:0;
            border:solid 6px;
            border-color:transparent #fff transparent transparent;
          }
        }
        .image-file {
          margin-top: 3px;
          cursor: pointer;
          border-radius: 6px;
        }
        .attach-file {
          margin-top: 4px;
          margin-left: 2px;
          width: 212px;
          height: 68px;
          line-height: 64px;
          vertical-align: middle;
          border: solid 1px #dcdad6;
          background-color: #fff;
          border-radius: 6px;
          a {
            cursor: pointer;
          }
          .attach-file-icon{
            float: left;
            margin:15px 0 0 10px;
            display:inline-block;
            vertical-align: middle;
          }
          .attach-desc {
            padding: 10px 0 10px 0;
            width: 150px;
            margin-left: 8px;
            line-height: 24px;
            color: #000;
            font-size: 23px;
            float: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            div {
              font-family: "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
              font-size: 13px;
            }
            span {
              font-size: 12px;
              color: #8d97a6;
            }
            i {
              color: #8d97a6;
            }
          }

        }
      }
      .attach-file-desc {
        line-height: 20px;
        font-size: 10px;
        // border-top: 1px solid #dcdad6;
        padding: 4px 4px 0 4px;
        color: #ff5959;
      }
      .message-content-myself {
        .delete-message {
          color: #1A6CDE;
          cursor: pointer;
          margin-left: 10px;
          font-size: 8px;
          display: none;
        }
      }
      .message-content-myself:hover .delete-message {
        display: inline;
      }
      .clear-float {
        clear: both;
      }
    }

    .channel-search-container {
      height: 30px;
      padding: 0 0 19px 10px;
      border-bottom: 1px solid #F0EEEA;
      text-align: center;
      .search {
        padding: 0 0 0 5px;
        background-color: #e7f0f5;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        border-radius: 3px;
        width: 260px;
        float: left;
        margin-right: 15px;
        i {
          color: #AFC9DA;
          cursor: pointer;
        }
        input {
          font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
          margin: 0 0 0 4px;
          width: 230px;
          outline: 0;
          border: none;
          background-color: transparent;
          -webkit-appearance: textfield;
          -webkit-rtl-ordering: logical;
          cursor: text;
          color: #000;
          font-size: 13px;
        }
        input::-webkit-input-placeholder {
          color: #999;
        }
        input::-moz-placeholder {   /* Mozilla Firefox 19+ */
          color: #999;
        }
        input:-moz-placeholder {    /* Mozilla Firefox 4 to 18 */
          color: #999;
        }
        input:-ms-input-placeholder {  /* Internet Explorer 10-11 */
          color: #999;
        }
      }
    }
  }
</style>
