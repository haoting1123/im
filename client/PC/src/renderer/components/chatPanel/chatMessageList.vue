<template>
  <div class="container" id="messageList" v-loading="loadingVisible">
    <right-key-menu-com :menu-items="menuItems" :mouse-position="mousePosition" @itemClickList="itemClickList" :busiObj="rightClickItem" ></right-key-menu-com>
    <image-viewer
      ref="imageViewer"
      :image-url="image.url"
      :image-width="image.width"
      :image-height="image.height"
      :download-url="image.downloadUrl"
    ></image-viewer>
    <div class="no-read-message-tip" :style="'right:'+(userChannel.channelType === 'G' ? '159' :  '10')+'px;'" v-if="isHaveNoReadMessage" @click="scrollToFirstNoReadMessage">查看更多未读</div>
    <div v-if="hasMoreMessage" class="load-more-message" :style="'width:'+(msgDlgContainerWidth - 2)+'px;'">
      <span @click="getMessageList(true)">加载更多消息</span>
    </div>
    <div :id="'message_' + item.createTime" v-for="(item, index) in this.messageList" :key="index" :style="'width:'+(msgDlgContainerWidth - 2)+'px;'">
      <div v-if="myId === item.senderId">
        <div class="message-container">
          <div
            class="status-wrapper"
            :class="{'sysuser-status-wrapper': item.senderId === '00000000000000000000000000000000'}"
            style="margin:20px 5px 0 0;float: right;"
          >
            <div v-if="userInfo.photo" style="width: 32px; height:32px;">
              <img class="status-wrapper-image" :src="userInfo.photo">
            </div>
            <template v-else>
              <div style="width: 32px; height:32px;">
                <img
                  v-if="userInfo.sex == '男'"
                  class="status-wrapper-image"
                  src="../../assets/images/boy.png"
                >
                <img v-else class="status-wrapper-image" src="../../assets/images/girl.png">
              </div>
            </template>
            <!--<div v-if="item.senderId != '00000000000000000000000000000000'" class="online-status-container">-->
            <!--<status-online-avatar v-if="item.senderOnlineStatus === 'online'"></status-online-avatar>-->
            <!--<status-away-avatar v-else-if="item.senderOnlineStatus === 'away'"></status-away-avatar>-->
            <!--<status-offline-avatar v-else-if="item.senderOnlineStatus === 'offline'"></status-offline-avatar>-->
            <!--<status-dnd-avatar v-else="item.senderOnlineStatus === 'dnd'"></status-dnd-avatar>-->
            <!--</div>-->
          </div>
          <div class="message" style="text-align: right;">
            <div
              class="message-content"
              :class="{ 'message-content-myself': myId == item.senderId }"
              style="padding: 0 10px 0 0; float: right"
            >
              <span class="createAt">{{ getCreateDateTime(item) }}</span>
              <!--<span class="sender">{{item.organization}}-{{item.department}}-{{ item.senderNickname ? item.senderNickname : item.senderName }}</span>-->
              <div @mousedown="operationMessage($event, item, index)">
                <div
                  v-if="!item.fileType || item.fileType === 'img' || item.fileType == 'vcard' || item.fileType == 'position' || item.fileType == 'aac'"
                  :class="[{'content-select': myId == item.senderId, 'content': myId !== item.senderId}, {'system-content': item.type}]"
                  style="background-color:#33aaff;color:#fff;float:right;text-align:left;"
                >
                  <span :style="'font-size:' + $store.state.message.msgFontSize + 'px; word-wrap:break-word;word-break:break-all;'"
                   @dblclick="viewImage(item)" class="message_content_panel"
                  v-html="item.content"
                  ></span>
                </div>
                <template v-else>
                  <!-- <div v-if="isImage(item.fileExtension)">
                    <img
                      class="image-file"
                      @click="viewImage(getFileUrl(item.filePath, item.fileName, item.fileMimeType), item.imageWidth, item.imageHeight, getDownloadFileUrl(item.filePath, item.fileName, item.fileMimeType))"
                      :width="item.imageThumbWidth"
                      :height="item.imageThumbHeight"
                      :src="getFileUrl(item.filePath + '/thumb', item.fileName, item.fileMimeType)"
                    >
                  </div>
                  <div v-else-if="isGif(item.fileExtension)">
                    <img
                      class="image-file"
                      @click="viewImage(getFileUrl(item.filePath, item.fileName, item.fileMimeType), item.imageWidth, item.imageHeight, getDownloadFileUrl(item.filePath, item.fileName, item.fileMimeType))"
                      :width="item.imageWidth > 220 ? 220 : item.imageWidth"
                      :height="item.imageHeight > 120 ? 120 : item.imageHeight"
                      :src="getFileUrl(item.filePath, item.fileName, item.fileMimeType)"
                    >
                  </div> -->
                  <div
                    class="attach-file"
                  >
                    <a
                      @dblclick="dblclickOpenFile(item._id, item.fileInfo.fileSize, item.fileInfo.fileName, item.createTime, item)"
                      target="_blank"
                    >
                    <img src="../../assets/images/file-message.png" width="35" height="38" class="attach-file-icon"/>
                      <div class="attach-desc" v-if="item.fileInfo.fileName">
                        <div
                          :title="item.fileInfo.fileName"
                        >{{ item.fileInfo.fileName.length > 24 ? item.fileInfo.fileName.substr(0, 24) + '...' : item.fileInfo.fileName }}</div>
                        <div>
                          <!-- <i class="el-icon-download"></i>&nbsp;&nbsp; -->
                          <span>{{ item.fileInfo.fileExtension ? item.fileInfo.fileExtension.toUpperCase() : '' }}</span>&nbsp;&nbsp;
                          <span>{{ formatFileSizeUnit(item.fileInfo.fileSize) }}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div class="attach-file-desc">文件只会在服务器中加密存储七天</div>
                </template>
              </div>
            </div>
            <div class="clear-float"></div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="message-container">
          <div class="message">
            <a :name="item.createTime" style="display:none;" >&nbsp;</a>
            <div
              class="status-wrapper"
              :class="{'sysuser-status-wrapper': item.senderId === '00000000000000000000000000000000'}"
            >
              <div v-if="getSenderHeadUrl(item.senderId)" style="width: 32px; height:32px;">
                <img class="status-wrapper-image" :src="getSenderHeadUrl(item.senderId)">
              </div>
              <template v-else>
                <div style="width: 32px; height:32px;">
                  <img
                    v-if="item.sex == '男'"
                    class="status-wrapper-image"
                    src="../../assets/images/boy.png"
                  >
                  <img v-else class="status-wrapper-image" src="../../assets/images/girl.png">
                </div>
              </template>
              <!--<div v-if="item.senderId != '00000000000000000000000000000000'" class="online-status-container">-->
              <!--<status-online-avatar v-if="item.senderOnlineStatus === 'online'"></status-online-avatar>-->
              <!--<status-away-avatar v-else-if="item.senderOnlineStatus === 'away'"></status-away-avatar>-->
              <!--<status-offline-avatar v-else-if="item.senderOnlineStatus === 'offline'"></status-offline-avatar>-->
              <!--<status-dnd-avatar v-else="item.senderOnlineStatus === 'dnd'"></status-dnd-avatar>-->
              <!--</div>-->
            </div>
            <div
              class="message-content"
              :class="{ 'message-content-myself': myId == item.senderId }"
              style="float: left; padding: 0"
              @mousedown="operationMessage($event, item, index)"
            >
              <span class="createAt"><span v-if="item.channelType === 'G'" class="group-chat-sender-id-small">{{ getSenderName(item.senderId) }}</span> {{ getCreateDateTime(item) }}</span>
              <div
                v-if="!item.fileType  || item.fileType === 'img' || item.fileType == 'vcard' || item.fileType == 'position' || item.fileType == 'aac'"
                :class="[{'content-select': myId != item.senderId, 'content': myId !== item.senderId}, {'system-content': item.type}]"
              >
                <span
                  v-if="item.fileType == 'vcard' || item.fileType == 'position' || item.fileType == 'aac'"
                >
                {{item.content}}
                </span>
                 <span v-else
                    :style="'font-size:' + $store.state.message.msgFontSize + 'px'"
                    @dblclick="viewImage(item)"
                    class="message_content_panel"
                    v-html="item.content"
                  ></span>
              </div>
              <template v-else>
                <!-- <div v-if="isImage(item.fileExtension)">
                  <img
                    class="image-file"
                    @click="viewImage(getFileUrl(item.filePath, item.fileName, item.fileMimeType), item.imageWidth, item.imageHeight, getDownloadFileUrl(item.filePath, item.fileName, item.fileMimeType))"
                    :width="item.imageThumbWidth"
                    :height="item.imageThumbHeight"
                    :src="getFileUrl(item.filePath + '/thumb', item.fileName, item.fileMimeType)"
                  >
                </div>
                <div v-else-if="isGif(item.fileExtension)">
                  <img
                    class="image-file"
                    @click="viewImage(getFileUrl(item.filePath, item.fileName, item.fileMimeType), item.imageWidth, item.imageHeight, getDownloadFileUrl(item.filePath, item.fileName, item.fileMimeType))"
                    :width="item.imageWidth > 220 ? 220 : item.imageWidth"
                    :height="item.imageHeight > 120 ? 120 : item.imageHeight"
                    :src="getFileUrl(item.filePath, item.fileName, item.fileMimeType)"
                  >
                </div> -->
                <div
                  class="attach-file"
                >
                  <a
                    @dblclick="dblclickOpenFile(item._id, item.fileInfo.fileSize, item.fileInfo.fileName, item.createTime, item)"
                    target="_blank"
                  >
                  <img src="../../assets/images/file-message.png" width="35" height="38" class="attach-file-icon"/>
                    <div class="attach-desc" v-if="item.fileInfo.fileName">
                      <div
                        :title="item.fileInfo.fileName"
                      >{{ item.fileInfo.fileName.length > 26 ? item.fileInfo.fileName.substr(0, 26) + '...' : item.fileInfo.fileName }}</div>
                      <div>
                        <!-- <i class="el-icon-download"></i>&nbsp;&nbsp; -->
                        <span>{{ item.fileInfo.fileExtension ? item.fileInfo.fileExtension.toUpperCase() : '' }}</span>&nbsp;&nbsp;
                        <span>{{ formatFileSizeUnit(item.fileInfo.fileSize)}}</span>
                      </div>
                    </div>

                  </a>
                </div>
                <div class="attach-file-desc">文件只会在服务器中加密存储七天，请及时下载保存</div>
              </template>
            </div>
            <div class="clear-float"></div>
          </div>
        </div>
      </div>
    </div>

     <!-- <div
      id="my_right_menu"
      class="rightMenu"
      v-bind:style="{display:rightMenuDisplay,top: rightMenuTop + 'px', left:rightMenuLeft + 'px'}"
    >
      <div unselectable="on" @click="fileSaveAs" class="rightMenuItem">另存为...</div>
    </div>
    <div
      id="my_right_menu_MASK"
      @click.stop="onRightMenuMask"
      @contextmenu.prevent="onRightMenuMask()"
      class="rightMenuMask"
      v-bind:style="{display:rightMenuDisplay}"
    ></div> -->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { outputError } from "@/utils/exception";
import * as myDate from "@/utils/date";
import { baseUrl, downloadUrl } from "@/utils/url";
import { downLoadFile } from "@/utils/downLoad";
import { appendYaml, readYamlInfoByKey } from "@/utils/yamlUtil";
import StatusOnlineAvatar from "@/components/svg/statusOnlineAvatar";
import StatusOfflineAvatar from "@/components/svg/statusOfflineAvatar";
import StatusDndAvatar from "@/components/svg/statusDndAvatar";
import StatusAwayAvatar from "@/components/svg/statusAwayAvatar";
import Cookie from "@/utils/cookie";
import rightKeyMenuCom from '@/components/common/rightKeyMenu'
import Clipboard from 'clipboard';
import { debug } from 'util';
let xss = require('xss')

const ipcRenderer = require("electron").ipcRenderer;
const fs = require("fs");
const moment = require('moment');
export default {
  name: "chat-message-list",
  props: ["channelId", "userChannel",'currentMemberList','noReadMessageNum'],
  data() {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return {
      myId: currentUser.jid,
      maxCreateAt: 0,
      loadingVisible: false,
      hasMoreMessage: true,
      isLoadMore: false,
      messageRemoved: false,
      image: {
        url: "",
        width: 0,
        height: 0,
        downloadUrl: ""
      },
      fileSaveAsUrl: "",
      fileSaveAsName: "",
      rightMenuLeft: 0,
      rightMenuTop: 0,
      rightMenuDisplay: "none",
      rightClickItem:'',
      // 右键菜单的位置
      mousePosition: [],
      menuItems: [
        {
          menuName: '复制',
          hide:true
        },
        {
          menuName: '转发',
          hide:true
        },
        {
          menuName: '删除',
          hide:false
        },
        {
          menuName: '撤回',
          hide:true
        },
        {
          menuName: '另存为',
          hide:true
        }
      ],
      messageListWidth:631,
      outDay: 7*24*60*60*1000,
      isHaveNoReadMessage:false,
      localNoReadMessageNum: 0
    };
  },
  mounted() {
    // this.showSaveDialogReply()
    if(this.userChannel.channelType === 'G'){
      this.messageListWidth = 474;
    }else{
      this.messageListWidth = 631;
    }
  },
  computed: {
    ...mapState({
      messageList: state => state.message.messageList,
      rightKeyMenu: state => state.home.rightKeyMenu,
      userInfo: state => state.home.userInfo,
      msgDlgContainerWidth: state => state.message.msgDlgContainerWidth,
      downloadingFileList: state => state.message.downloadingFileList
    })
  },
  methods: {
    ...mapMutations([
      'SET_RIGHTKEYMENU',
      'CLEAR_MESSAGE_LIST',
      'PUSH_DOWNLOADING_FILE_ITEM',
      'DEL_DOWNLOADING_FILE_ITEM'
    ]),
    ...mapActions(["readMessage", "removeMessageByDb", "getAllMessage", "sendOtherMessage"]),
    operationMessage (event, mess, index) {
      // event.preventDefault()
      if (event.button === 2) {
        let x = event.x
        let y = event.y
        this.mousePosition = [x, y]
      } else if (event.button === 0) {
        this.mousePosition = ['close']
      }
      // 暂时不做撤回功能
      // if(this.myId !== mess.senderId){
      //   this.menuItems[3].hide = true
      // }else{
      //   this.menuItems[3].hide = false
      // }
      if(mess.fileType){
        // this.menuItems[4].hide = false
        this.menuItems[0].hide = true
      }else{
        // this.menuItems[4].hide = true
        // this.menuItems[0].hide = false
      }

      this.rightClickItem = mess
      this.SET_RIGHTKEYMENU(true)
    },
    fileSaveAs() {
      console.log("savaFileAsFlag", this.fileSaveAsUrl, this.fileSaveAsName);
      // this.fileSaveAsUrl, {count:1, saveAs:true, showFolder:true}
      ipcRenderer.send("saveAsFile", {
        title: "另存为",
        defaultPath: this.fileSaveAsUrl,
        filters: [{ name: "All Files", extensions: ["*"] }]
      });
      // this.onRightMenuMask();
    },
    showSaveDialogReply() {
      const that = this;
      ipcRenderer.on("showSaveDialogReply", function(event, arg) {
        console.log("showSaveDialogReply:::", arg);
        if (!arg) {
          return;
        }

        var reg = /\\/g; // g,表示全部替换。
        arg = arg.replace(reg, "/");

        let dirPath = arg.substring(0, arg.lastIndexOf("/") + 1);
        let fileName = arg.substring(arg.lastIndexOf("/") + 1, arg.length);
        downLoadFile(that.fileSaveAsUrl, dirPath, fileName).then(
          response => {}
        );

        // if(arg != null){
        //     saveContent2Disk(arg, that.fileContent)
        // }
      });
    },
    fileSaveAsHandle(filePath, fileName, createTime) {
      // 文件大于7天不让下载  后台会删除文件
      let diffDay = new Date().getTime() - createTime
      if (diffDay > this.outDay) {
        this.$message({
          message: '文件存储超过7天，已失效',
          duration: 1000,
          type: 'warning'
        })
        return;
      }

      this.fileSaveAsUrl = filePath
      this.fileSaveAsName = fileName
      console.log(this.fileSaveAsUrl);
      this.fileSaveAs()
    },
    onRightMenuMask() {
      // console.log("onRightMenuMask")
      this.rightMenuDisplay = "none";
    },
    getMessageList(isLoadMore) {
      this.isLoadMore = isLoadMore;
      const limit = 20;
      this.getAllMessage({
        channelId: this.channelId,
        maxCreateAt: this.maxCreateAt,
        limit: limit
      })
        .then(response => {
          if (response) {
            this.hasMoreMessage = response.length === limit;
            if (response.length > 0) {
              this.maxCreateAt = this.messageList[0].createTime;
            }
          }else{
            this.hasMoreMessage = false;
          }
        })
        .catch(error => {
          outputError(this, error);
        });
    },
    // 用来查询未读消息和@我的消息列表用
    getMoreNoReadMessageList(beginTime) {
      const limit = 1000; // 默认1000，修改此处无用，需要修改数据库
      this.getAllMessage({
        channelId: this.channelId,
        maxCreateAt: this.maxCreateAt,
        maxStartAt: beginTime,
        limit: limit
      })
        .then(response => {
          console.log(response)
          if (response) {
            if (response.length > 0) {
              this.maxCreateAt = this.messageList[0].createTime;
            }
            //滚动到@我的位置
            let position = $('#message_' + beginTime).offset().top - $('#messageList').offset().top + $('#messageList').scrollTop()
            $('#messageList').scrollTop(position)
          }
        })
        .catch(error => {
          outputError(this, error);
        });
    },
    autoDownloadFile() {
      // console.log("showMessageListAutoDownloadFile");
      for (let message of this.messageList) {
        console.log("1111",message.senderId, this.myId)
        if (message.senderId == this.myId) {
          continue
        }
        if (!message.fileType || message.fileType !== 'file') {
          continue
        }
        // let extension = message.fileExtension.toLowerCase();
        // if (
        //   extension === "png" ||
        //   extension === "jpeg" ||
        //   extension === "jpg" ||
        //   extension === "gif"
        // ) {
        //   continue;
        // }
        this.downloadFileHandler(message)
        // downLoadFile(fullPath, path, message.fileName, function (fileName) {
        //     // 记录下载的文件名信息
        //     let value = fileName
        //     appendYaml(nowDate, key, value)
        //
        // })
      }
    },
    downloadFileHandler (message) {
       // 文件大于7天 不让下载  后台会删除文件
        let diffDay = new Date().getTime() - message.createTime
        console.log("auto diffDay::", diffDay)
        if (diffDay > this.outDay) {
          return;
        }
        let fullPath = message.fileInfo.filePath
        let path = Cookie.getDownloadPath();
        // ipcRenderer.send('downloadFile', fullPath, {count:1, directory:path, saveAs:false, showFolder:false})
        let nowDate =  this.myId + "_" + moment(message.createTime).format("YYYY-MM")
        let key = message._id + "_" + message.fileInfo.fileSize + "_" + message.fileInfo.fileName;
        let data = readYamlInfoByKey(nowDate, key);
        console.log("check::", key, data);
        if (data) {
          return
        }
        // 是否正在下载中
        let fileId = message._id
        let index = this.downloadingFileList.findIndex(item => item === fileId)
        if (index > -1) {
          return
        }

        this.PUSH_DOWNLOADING_FILE_ITEM(fileId)
        // 静默下载发送来的文件 返回存储后的文件名
        downLoadFile(fullPath, path, message.fileInfo.fileName).then(response => {
          // 记录下载的文件名信息
          appendYaml(nowDate, key, path + response);
          console.log('下载后的文件名------------------', path + response)
          this.DEL_DOWNLOADING_FILE_ITEM(fileId)
        }).catch(err => {
          console.log('下载错误------------------', err)
          this.DEL_DOWNLOADING_FILE_ITEM(fileId)
        });
    },
    getAvatarUrl(message) {
      if (
        "http://".startsWith(message.senderRealAvatarUrl.toLowerCase()) ||
        "https://".startsWith(message.senderRealAvatarUrl.toLowerCase())
      ) {
        return message.senderRealAvatarUrl;
      }
      return (
        baseUrl() + "/users/" + message.senderId + "/avatar?width=32&height=32"
      );
    },
    getCreateDateTime(message) {
      let currTime = new Date();
      currTime = new Date(
        currTime.getFullYear(),
        currTime.getMonth(),
        currTime.getDate()
      );
      let time = new Date(message.createTime);
      let date = new Date(time.getFullYear(), time.getMonth(), time.getDate());
      let xc = Number((date - currTime) / 1000 / 60 / 60 / 24).toFixed(0);

      let ret = "今天 " + myDate.formatDate(time, "hh:mm");
      if (xc == -1) {
        ret = "昨天 " + myDate.formatDate(time, "hh:mm");
      } else if (xc < -1) {
        ret = myDate.formatDate(time, "yyyy-MM-dd hh:mm");
      }

      return ret;
      // return new Date(message.createAt).toLocaleString()
    },
    formatFileSizeUnit(size) {
      return myDate.formatFileSizeUnit(size);
    },
    showSentMessage(message) {
      this.isLoadMore = false;
      this.messageList.push(message);
    },
    // 撤回
    removeMessage(messageId, index){

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
    getToUserId() {
      if (this.userChannel.channelType === "G") {
        return null;
      }
      return this.userChannel.toUserId;
    },
    onNewMessage(message) {
      this.isLoadMore = false;
      // console.log('new msg ', message)
      if (
        this.channelId === message.channelId &&
        this.myId !== message.senderId
      ) {
        // console.log('new msg list push ')
        this.messageList.push(message);
      }
    },
    onReconnected() {
      console.log("重连成功！！！");
    },
    onConnectionClosed() {
      console.log("连接被断开");
    },
    onUserOnlineStatusChanged(receiveMessage) {
      for (let message of this.messageList) {
        if (message.senderId === receiveMessage.userId) {
          message.senderOnlineStatus = receiveMessage.onlineStatus;
        }
      }
    },
    onMessageRemoved(receiveMessage) {
      if (this.messageList != null && this.messageList.length > 0) {
        let messageId = receiveMessage.messageId;
        let senderId = receiveMessage.senderId;
        if (senderId === this.myId) {
          return;
        }
        let index = 0;
        for (let message of this.messageList) {
          if (message.id === messageId) {
            this.messageList.splice(index, 1);
            return;
          }
          index++;
        }
      }
    },
    initPage(newVal, oldVal) {
      if (newVal == null || newVal === "") {
        return;
      }
      if(this.userChannel.channelType === 'G'){
        this.messageListWidth = 474;
      }else{
        this.messageListWidth = 631;
      }
      this.isHaveNoReadMessage = false
      this.maxCreateAt = 0;
      this.CLEAR_MESSAGE_LIST();
      this.getMessageList(false);
      this.localNoReadMessageNum = this.noReadMessageNum
    },
    isImage(fileExtension) {
      if (fileExtension) {
        let extension = fileExtension.toLowerCase();
        return (
          extension === "png" || extension === "jpeg" || extension === "jpg"
        );
      }
      return false;
    },
    isGif(fileExtension) {
      if (fileExtension) {
        let extension = fileExtension.toLowerCase();
        return extension === "gif";
      }
      return false;
    },
    getFileUrl(filePath, fileName, mimetype) {
      const fullPath = filePath + "/" + fileName;
      return (
        baseUrl() +
        "/messages/files?fileName=" +
        encodeURIComponent(fileName) +
        "&fullPath=" +
        encodeURIComponent(fullPath) +
        "&mimetype=" +
        encodeURIComponent(mimetype)
      );
    },
    getDownloadFileUrl(filePath, fileName, mimetype) {
      const fullPath = filePath + "/" + fileName;
      return downloadUrl() + "/filedownload/" + fullPath;
    },
    downloadFile(filePath, fileName, mimetype) {
      // let url = this.getDownloadFileUrl(filePath, fileName, mimetype)
      let path = Cookie.getDownloadPath();
      // console.log('messageFileDownloadFlag',url,path)
      let fullPath = path + fileName;
      console.log("openFile::", fullPath);
      fs.exists(fullPath, function(exists) {
        if (!exists) {
          // 文件不存在 打开下载的目录
          ipcRenderer.send("openFolder", fullPath);
          return;
        }
        // 文件存在 打开文件
        ipcRenderer.send("openFile", fullPath);
      });

      // console.log('download end')
    },

    dblclickOpenFile(id, fileSize, fileName, createAt, fileItem) {
      let myId = this.userInfo.jid
      if(fileItem.senderId === myId){
        if(fileItem.fileInfo && fileItem.fileInfo.fileLocalPath){
          ipcRenderer.send("openFolder", fileItem.fileInfo.fileLocalPath);
        }
        return;
      }
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
      let that = this
      fs.exists(fullPath, function(exists) {
        console.log('exists',exists)
        if(!exists){
          // 删除下载记录
          appendYaml(nowDate, key, null);
          // 重新下载
          that.downloadFileHandler(fileItem)
        }
        // if (!exists) {
          // 文件不存在 打开下载的目录
          ipcRenderer.send("openFolder", fullPath);
          // return;
        // }
        // 文件存在 打开文件
        // ipcRenderer.send("openFile", fullPath);
      });

      // console.log('download end')
    },
    viewImage(item) {
      if(item && item.fileType && item.fileType === 'img'){
        // 匹配src属性
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        let url = item.content.match(srcReg)
        this.image.url = url[1];
        this.image.downloadUrl = url[1];
        this.$refs.imageViewer.$emit("openDialog");
      }
    },
    copyText (item, index) {
      var html = xss(item.content, {
                  whiteList: [], // 白名单为空，表示过滤所有标签
                  stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
                  stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
                })
      var content = html;
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
    isPicture(item){
      // 匹配图片（g表示匹配所有结果i表示区分大小写）
      let imgReg = /<img.*?(?:>|\/>)/gi
      // 匹配src属性
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      // 匹配type属性
      let typeReg = /type=[\'\"]?([^\'\"]*)[\'\"]?/i;
      //获取所有图片
      let arr = html.match(imgReg)
      let uploadImgs = []
      if(arr){
        console.log(html.split(arr[0]))
        for (let i = 0; i < arr.length; i++) {
          // console.log(arr[i])
          let srcs = arr[i].match(srcReg)
          let types = arr[i].match(typeReg)
          // 获取图片地址
          if (types && types[1] === 'picture') {
            // console.log('已匹配的上传图片地址' + (i + 1) + '：' + srcs[1])
            uploadImgs.push(arr[i])
          }
        }
      }
    },
    itemClickList (index, item) {
      console.log(index, item)
      switch (index) {
        case 0:
          // 复制
          this.copyText(item, index)
          break
        case 1:
          // 转发
          break
        case 2:
          // 删除
          this.delMessage(item, index)
          break
        case 3:
          // 撤回
          break
        case 4:
          // 另存为
          this.fileSaveAsHandle(item.fileInfo.filePath, item.fileInfo.fileName, item.createTime)
          break
      }
      this.SET_RIGHTKEYMENU(false)
    },
    getSenderName(senderId){
      if(this.currentMemberList && this.currentMemberList.length > 0){
        let memeber = this.currentMemberList.find(element => {
          return element.jid.split('@')[0] === senderId.replace('-APP', '')
        })
        if(memeber){
          return memeber.name
        }
      }
      return senderId
    },
    getSenderHeadUrl(senderId){
      if(this.userChannel.channelType === 'G'){
        if(this.currentMemberList && this.currentMemberList.length > 0){
          let memeber = this.currentMemberList.find(element => {
            return element.jid.split('@')[0] === senderId
          })
          if(memeber){
            return memeber.photo
          }
        }
        return ''
      }else{
        return this.userChannel.headUrl
      }
    },
    // 滚动到第一条未读消息
    scrollToFirstNoReadMessage(){
      this.isHaveNoReadMessage = false
      this.localNoReadMessageNum = 0
      // 查询所有未读消息
      let atTime = localStorage.getItem('mes_noReadAt_' + this.userChannel.channelId)
      if(atTime && atTime > 0){
          this.getMoreNoReadMessageList(atTime)
      }
      localStorage.setItem('mes_noReadAt_' + this.userChannel.channelId,null)
    },
    // 消息回执
    messageReceipt () {
      let obj = {
        channelId: this.userInfo.jid,
        senderId: this.userChannel.channelId,
        readTime: Date.now()
      }
      this.sendOtherMessage({
        to: this.channelId,
        content: JSON.stringify(obj),
        type: 'MESSAGE_RECEIPT'
      })
    }
  },
  created() {
    this.getMessageList(false);
    // let imClient = this.$store.getters.imClient
    // imClient.bindNewMessage(this.onNewMessage)
    // imClient.bindReconnectSuccessed(this.onReconnected)
    // imClient.bindConnectionClosed(this.onConnectionClosed)
    // imClient.unbindUserOnlineStatusChanged()
    // imClient.bindUserOnlineStatusChanged(this.onUserOnlineStatusChanged)
    // imClient.bindMessageRemoved(this.onMessageRemoved)
  },

  watch: {
    channelId: "initPage",
    messageList: function(newVal, oldVal) {
      // console.log("dddd", newVal);
      if(newVal && newVal.length > 0){
        this.$nextTick(() => {
          const msgList = document.getElementById("messageList");
          if (!msgList) {
            return;
          }
          if (this.messageRemoved) {
            this.messageRemoved = false;
            return;
          }
          if (this.isLoadMore) {
            const msgContainer = document.getElementById('message_' + oldVal[0]._id)
            // msgList.scrollTop = msgContainer.offsetTop
            this.isLoadMore = false
          } else {
            msgList.scrollTop = msgList.scrollHeight
          }
          this.$nextTick(() => {
            let isAtMe = localStorage.getItem('mes_at_' + this.userChannel.channelId)
            if(isAtMe && isAtMe === 'yes'){
              let atMeTime = localStorage.getItem('mes_atTime_' + this.userChannel.channelId)
              // console.log('有人@我了', atMeTime)
              if(atMeTime && atMeTime > 0){
                if(this.maxCreateAt < atMeTime){
                  let position = $('#message_' + atMeTime).offset().top - $('#messageList').offset().top + $('#messageList').scrollTop()
                  $('#messageList').scrollTop(position)
                }else{
                  this.getMoreNoReadMessageList(atMeTime)
                }
              }
              localStorage.setItem('mes_at_' + this.userChannel.channelId,null)
            }
          })
          if(this.localNoReadMessageNum > 20){
            this.isHaveNoReadMessage = true
          }else{
            this.isHaveNoReadMessage = false
          }
          if (this.userChannel.channelType === 'P') {
            this.messageReceipt()
          }
        });
        this.autoDownloadFile()
      }
    },
    rightKeyMenu: function (val, oldval) {
      if (!val) {
        this.mousePosition = ['close']
      }
    }
  },
  components: {
    StatusOnlineAvatar,
    StatusOfflineAvatar,
    StatusAwayAvatar,
    StatusDndAvatar,
    rightKeyMenuCom,
    ImageViewer: resolve => require(["./imageViewer"], resolve)
  }
};
</script>

<style>
  .message_content_panel img{
    max-width: 234px;
  }
</style>


<style lang="scss" scoped>
.container {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  div {
    font-size: 12px;
  }
  .load-more-message {
    text-align: center;
    font-size: 12px;
    margin: 6px 0 3px 0;
    span {
      color: #909399;
      cursor: pointer;
    }
  }
  .message-container {
    max-width: 100%;
    width: 100%;
    word-wrap: break-word;
    .message {
      margin: 0 auto;
      padding: 10px 20px 5px 10px;
      width: 100%;
    }
  }
  .message-container:hover {
    background-color: transparent;
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
    margin: 10px 12px 0 0;
    cursor: pointer;
    .status-wrapper-image {
      border-radius: 100%;
      width: 100%;
      height: 100%;
      background-color: #dddee0;
    }
    .online-status-container {
      width: 12px;
      height: 12px;
      line-height: 12px;
      margin: -10px 0 0 21px;
    }
  }
  .sysuser-status-wrapper {
    background-color: #04549c;
  }
  .message-content {
    padding: 0 0 0 35px;
    .sender {
      text-overflow: ellipsis;
      cursor: pointer;
      font-size: 12px;
      //font-weight: bold;
      display: inline-block;
      color: #8d97a6;
    }
    .createAt {
      font-size: 10px;
      color: #909399;
      padding: 0 0 0 0px;
      .group-chat-sender-id-small{
        font-size: 12px;
        color: #606266;
        margin-right: 5px;
      }
    }
    .content {
      padding: 6px 26px 6px 3px;
      line-height: 25px;
      min-width: 38px;
    }

    .system-content {
      font-size: 12px;
      color: #908c87;
    }
    .content-select {
      position: relative;
      padding: 4px 10px;
      line-height: 20px;
      background-color: #fff;
      border-radius: 4px;
      width: fit-content;
      margin-top: 4px;
      word-wrap: break-word;
      max-width: 234px;
      border: 0px solid #dae6f2;
      min-width: 30px;
      .arrow {
        position: absolute;
        top: 5px;
        right: -12px;
        width: 0;
        height: 0;
        font-size: 0;
        border: solid 6px;
        border-color: transparent transparent transparent #33aaff;
      }
      .arrowLeft {
        position: absolute;
        top: 5px;
        left: -12px;
        width: 0;
        height: 0;
        font-size: 0;
        border: solid 6px;
        border-color: transparent #fff transparent transparent;
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
      // border: solid 1px #dcdad6;
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
      color: #1a6cde;
      cursor: pointer;
      margin-left: 10px;
      font-size: 10px;
      display: none;
    }
  }
  .message-content-myself:hover .delete-message {
    display: inline;
  }
  .clear-float {
    clear: both;
  }
  .rightMenu {
    color: rgb(51, 51, 51);
    width: 100px;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(187, 187, 187);
    box-shadow: darkgrey 1px 1px 30px 1px;
    position: fixed;
    z-index: 99999;
  }
  .rightMenuItem {
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-block-start: 0em;
    margin-block-end: 0em;
    user-select: none;
    color: rgb(51, 51, 51);
    line-height: 26px;
    font-size: 12px;
    cursor: pointer;
  }
  .rightMenuMask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99997;
  }
  .no-read-message-tip{
    position: fixed;
    top:70px;
    right:159px;
    width:80px;
    height:22px;
    line-height: 22px;
    padding-left: 12px;
    z-index: 10;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    background: #409EFF;
    border: 1px solid #DCDFE6;
    color:#fff;
    cursor: pointer;
  }
}
</style>


