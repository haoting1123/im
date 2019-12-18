<template>
  <div class="container" v-loading="loadingVisible">
    <div class="fontTool" v-show="fontToolDisplay">
      <el-row>
        <el-col :span="3" style="width:70px;">
          <div class="fontLabel">字体大小</div>
        </el-col>
        <el-col :span="21" style="width: 200px;">
          <div class="security fontSize">
            <!--<el-select v-model="msgFontSize" size="mini" @change="onFontSizeHandle">-->
              <!--<el-option v-for="item in fontSizeOptions" :key="item" :label="item" :value="item"></el-option>-->
            <!--</el-select>-->
            <!--<select v-model="msgFontSize" @change="onFontSizeHandle" style="width: 50px; height: 26px; line-height: 30px; outline: none; font-size: 13px; background: #fff;">-->
              <!--<option style="background: #fff;" v-for="item in fontSizeOptions" :key="item" :value="item">{{ item }}</option>-->
            <!--</select>-->
            <select-component :selectList="fontSizeOptions" normalContent="13" @selectListener="onFontSizeHandle"></select-component>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="toolbar">
      <transition name="fade" mode="">
        <div class="emoji-box" v-if="showEmoji" >
          <el-button
            class="pop-close"
            :plain="true"
            type="danger"
            size="mini"
            icon="close"
            @click="showEmoji = false"></el-button>
            <vue-emoji
              @select="selectEmoji">
            </vue-emoji>
          <span class="pop-arrow arrow"></span>
        </div>
      </transition>
      <a class="face" title="表情" @click.stop="displayEmojiPanel"></a>
      <div style="float:left;">
        <i
          class="iconfont icon-wenzi chatRecord"
          title="字体设置"
          @click="onFontDisplay"
        ></i>
      </div>
      <div style="float:left;">
        <img src="../../assets/images/cut.png" width="19" height="19" class="chatRecord" @click="onShortcutCapture" title="截图"/>
      </div>
      <el-upload
        class="upload"
        ref="fileUploadImage"
        :accept="'image/*'"
        :action="uploadFileUrl"
        :data="postFileData"
        :auto-upload="false"
        :headers="uploadRequestHeaders"
        :show-file-list="false"
        :with-credentials="true"
        :on-change="handleFileOnChangeImage"
        :before-upload="beforeFileUploadImage"
      >
        <i class="iconfont icon-tupian chatRecord" style="font-size:19px;" title="发送图片"></i>
      </el-upload>
      <el-upload
        class="upload"
        ref="fileUpload"
        :accept="fileSuffixAccept"
        :action="uploadFileUrl"
        :data="postFileData"
        :auto-upload="false"
        :headers="uploadRequestHeaders"
        :show-file-list="false"
        :with-credentials="true"
        :on-change="handleFileOnChange"
        :on-error="handleFileOnError"
        :before-upload="beforeFileUpload"
        :on-success="fileUploadSuccess"
      >
        <a class="folder" title="发送文件">
          <img src="../../assets/images/folder.png" width="19" height="19" class="chatRecord" title="发送文件"/>
        </a>
      </el-upload>
      <div class="security" title="文件密级">
        <!--<el-select v-model="selectGrade" size="mini">-->
          <!--<el-option-->
            <!--v-for="item in gradeOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.name"-->
            <!--:value="item.value"-->
          <!--&gt;</el-option>-->
        <!--</el-select>-->
        <!--<select v-model="selectGrade" @change="getSecretSelected" style="width: 60px; height: 26px; line-height: 30px; outline: none; font-size: 13px; background: #fff;">-->
          <!--<option style="background: #fff;" v-for="item in gradeOptions" :key="item.value" :value="item.value">{{ item.name }}</option>-->
        <!--</select>-->
        <select-component :selectList="gradeOptions" normalContent="秘密" @selectListener="getSecretSelected"></select-component>
      </div>
      <message-history ref="messageHistoryDlg" :channelId="channelId" :channelName="channelName" :currentMemberList="currentMemberList"></message-history>

      <div style="float:left; margin-left: 5px">
        <i class="iconfont icon-liaotian1 chatRecord" title="聊天记录" @click="showMessageHistory"></i>
      </div>

      <!--语音/视频-->
      <!--v-if="channelType === 'P'"-->
      <div class="media-server" >
        <i class="el-icon-phone" @click="startVoiceMeet" title="语音通话"></i>
        <i class="el-icon-arrow-down" style="font-size: 12px;" @click.stop="SET_SHOWMEDIASERVER(true)"></i>
        <div v-if="showMediaServer" class="media-server-type">
          <div class="media-server-type-item" @click="startVoiceMeet">语音会议</div>
          <!--<div class="media-server-type-item" @click="startVideoMeet">视频会议</div>-->
        </div>
      </div>
      <el-button
        type="primary"
        size="small"
        @click="doSendMessage()"
        :disabled="sendButtonDisabled"
      >
        <img src="../../assets/images/setmsg.png">
      </el-button>
      <send-group-message ref="sendGroupMessageDlg" :channelId="channelId" :channelName="channelName" :currentMemberList="currentMemberList"></send-group-message>
      <div style="float: right;margin-right: 10px;" v-if="channelType === 'G'">
        <i
          class="iconfont icon-qunfaxiaoxi chatRecord qunfaxiaoxi"
          title="群发消息"
          @click="showSendGroupMessage"
        ></i>
      </div>
    </div>
    <div class="content-container">
      <!-- <textarea
        class="custom-textarea custom-textarea--emoji-picker"
        id="post_textbox"
        ref="message_content"
        autocomplete="off"
        spellcheck="true"
        v-model="message"
        @keydown="onMessageContentEnterKeyDown"
        @keyup="ctrlButtonDown=false"
      ></textarea> -->
      <div id="hiddenEditorHead"></div>
      <div ref="message_content"
      style="text-align:left"
      @click="fontToolDisplay = false"
      @keydown.enter.stop="onMessageContentEnterKeyDown"
      class="custom-textarea custom-textarea--emoji-picker"
      id="post_textbox"></div>


      <div id="div" ref="hiddenObj" contenteditable="true"></div>
    </div>
    <div class="info">
      <ul id="info" ref="infos"></ul>
    </div>
    <input id="cursor" type="hidden" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

// import { setSystemLog } from '@/api/system'
import messageHistory from '@/components/chatPanel/messageHistory'
import sendGroupMessage from '@/components/chatPanel/sendGroupMessage'
import { appendYaml } from '@/utils/yamlUtil'
import * as myDate from '@/utils/date'
import { outputError } from '@/utils/exception'
import { baseUrl } from '@/utils/url'
import wEditor from 'wangeditor'
import vueEmoji from '@/components/chatPanel/emoji.vue'
import Cookie from '@/utils/cookie'
import { initVideo } from '../../../../static/js/media/example'

const ipcRenderer = require("electron").ipcRenderer;
// 引入@群成员功能
require('../../../../static/js/at/jquery.caret.js')
require('../../../../static/js/at/jquery.atwho.js')
// 防止XSS攻击
let xss = require('xss')
// 声明编辑器
let editor = null

export default {
  name: 'chatInput',
  props: ['channelId', 'channelType', 'channelName','currentMemberList'],
  data () {
    return {
      message: '',
      fontToolDisplay: false,
      emojiPanelVisible: false,
      loadingVisible: false,
      sendButtonDisabled: true,
      ctrlButtonDown: false,
      postFileData: {
        grade: '秘密',
        channelId: this.channelId,
        imageWidth: 0,
        imageHeight: 0,
        size: 0
      },
      fileSuffixAccept: '.ofd',
      fileSuffix: 'ofd',
      fileSize: '50',
      uploadFileUrl: baseUrl() + '/syntoim/rest/file/upload',
      // uploadFileUrl: '../messages/files',
      uploadRequestHeaders: {
        'X-Token': sessionStorage.getItem('token')
      },
      selectGrade: '秘密',
      gradeOptions: [
        { name: '无', value: '' },
        { name: '秘密', value: '秘密' },
        { name: '机密', value: '机密' }
      ],
      msgFontSize: 13,
      fontSizeOptions: [11, 12, 13, 14, 15, 16],
      showEmoji: false
    }
  },
  mounted () {
    let sendFileSuffix =  localStorage.getItem('sendFileSuffix')
    let sendFileSize = localStorage.getItem('sendFileSize')
    if(sendFileSuffix){
      this.fileSuffix = localStorage.getItem('sendFileSuffix')
      var reg = new RegExp(',', 'g')
      this.fileSuffixAccept = '.' + this.fileSuffix.replace(reg, ',.')
    }
    if(sendFileSize){
      this.fileSize = localStorage.getItem('sendFileSize')
    }
    // this.onDragenterFile()
    this.initEditor()
    this.$refs.message_content.addEventListener("paste", function (e){
        // if ( !(e.clipboardData && e.clipboardData.items) ) {
        //     return;
        // }
        console.log(e.clipboardData )
    })
    ipcRenderer.on('shortcutCaptureReply', (event, path) => {
        console.log(path);
        this.addEditImageMessage(path)
    })
    this.onDragenterFile()
    this.initAtList()

    // 测试
    // setTimeout(() => {
    //   setInterval(() => {
    //     this.message = new Date().getTime() + ''
    //     this.doSendMessage()
    //   },100)
    // },5000)
  },
  beforeDestroy (){
    // 销毁时移除监听
    ipcRenderer.removeAllListeners('shortcutCaptureReply')
  },
  computed: {
    ...mapState({
      friendRequestList: state => {
        return state.home.friendRequestList
      },
      rightKeyMenu: state => state.home.rightKeyMenu,
      userInfo:  state => state.home.userInfo,
      sendHotKey: state => state.message.sendHotKey,
      showMediaServer: state => state.channel.showMediaServer,
      groupList: state => state.group.groupList
    })
  },
  methods: {
    ...mapMutations([
      'SET_MSG_FONT_SIZE',
      'SET_RIGHTKEYMENU',
      'SET_SHOWMEDIASERVER',
      'SET_MEDIA_SPEAK_FLAG',
      'SET_ACCEPT_REQUEST_FLAG',
      'SET_MEDIA_SPEAK_ROLE',
      'SET_MEDIA_MEET_INFO'
    ]),
    ...mapActions([
      'saveMessage',
      'uploadFileMessage',
      'getRemoteAreaInfo',
      'sendOtherMessage',
      'GetMemberInfo',
      'sendGroupOtherMessage'
    ]),
    // 设置秘密等级
    getSecretSelected (value) {
      this.selectGrade = value
      console.log(this.selectGrade)
    },
    // 开始语音会议
    startVoiceMeet() {
      // console.log(`channelType:${this.channelType}`)
      // console.log(`channelName:${this.channelName}`)
      // console.log(`channelId:${this.channelId}`)
      console.warn(this.userInfo)
      if (this.channelType === 'P') {
        this.soloVoiceMeet()
      } else {
        this.moreVoiceMeet()
      }
    },
    // 单人语音会议
    soloVoiceMeet() {
      this.GetMemberInfo(this.channelId.split('@')[0])
        .then(data => {
          let roomName = `room${Date.now()}${parseInt((Math.random() + 1) * 10000)}`
          // let roomName = `test`
          // let account = JSON.parse(localStorage.getItem('account'))
          this.SET_MEDIA_MEET_INFO({
            roomName: roomName,
            roomType: 'P',
            memberInfo: [data],
            mediaType: 'audio'
          })
          // 初始化会议
          initVideo({
            roomName,
            id: this.userInfo.jid,
            password: '123456',
            type: ['audio']
          })
            .then(data => {
              this.SET_MEDIA_SPEAK_FLAG(true)
              this.SET_MEDIA_SPEAK_ROLE('initiator')
              this.sendOtherMessage({
                to: this.channelId,
                content: JSON.stringify({
                  senderId: this.userInfo.jid,
                  senderName: this.userInfo.name,
                  roomName: roomName,
                  channelName: roomName,
                  roomType: 'P',
                  channelType: 'P',
                  mediaType: 'audio',
                  type: 'AUDIO_CONNECT'
                }),
                type: 'AUDIO_CONNECT'
              })
            })
        })
    },
    // 多人语音会议
    moreVoiceMeet() {
      let memberInfo = []
      // let roomName = ''
      this.groupList.forEach(item => {
        if (item.jid === this.channelId) {
          memberInfo = JSON.parse(JSON.stringify(item.members))
        }
      })
      let roomName = `room${Date.now()}${parseInt((Math.random() + 1) * 10000)}`
      // let roomName = this.channelId.split('@')[0]
      this.SET_MEDIA_MEET_INFO({
        senderId: this.userInfo.jid,
        channelId: this.channelId,
        roomName: roomName,
        channelName: roomName,
        roomType: 'G',
        channelType: 'G',
        memberInfo: memberInfo,
        mediaType: 'audio',
        type: 'AUDIO_CONNECT'
      })
      // 初始化会议
      initVideo({
        roomName,
        id: this.userInfo.jid,
        password: '123456',
        type: ['audio']
      })
        .then(data => {
          this.SET_MEDIA_SPEAK_FLAG(true)
          this.SET_MEDIA_SPEAK_ROLE('initiator')
          this.sendGroupOtherMessage({
            to: this.channelId,
            content: JSON.stringify({
              senderId: this.userInfo.jid,
              senderName: this.channelName,
              channelId: this.channelId,
              roomName: roomName,
              channelName: roomName,
              roomType: 'G',
              channelType: 'G',
              mediaType: 'audio',
              type: 'AUDIO_CONNECT'
            }),
            type: 'AUDIO_CONNECT'
          })
        })
    },
    // 开始视频会议
    startVideoMeet() {
      // this.moreVideoMeet()
      // this.soloVideoMeet()
      if (this.channelType === 'P') {
        this.soloVideoMeet()
      } else {
        this.moreVideoMeet()
      }
    },
    // 单人视频会议
    soloVideoMeet() {
      this.GetMemberInfo(this.channelId.split('@')[0])
        .then(data => {
          let roomName = `room${Date.now()}${parseInt((Math.random() + 1) * 10000)}`
          // let account = JSON.parse(localStorage.getItem('account'))
          this.SET_MEDIA_MEET_INFO({
            roomName: roomName,
            roomType: 'P',
            memberInfo: [data, {
              jid: this.userInfo.jid,
              name: this.userInfo.name,
              username: this.userInfo.username,
              photo: this.userInfo.photo
            }],
            mediaType: 'video'
          })
          // 初始化会议
          initVideo({
            roomName,
            id: this.userInfo.jid,
            password: '123456',
            type: ['audio', 'video']
          })
            .then(data => {
              this.SET_MEDIA_SPEAK_FLAG(true)
              this.SET_MEDIA_SPEAK_ROLE('initiator')
              this.sendOtherMessage({
                to: this.channelId,
                content: JSON.stringify({
                  senderId: this.userInfo.jid,
                  senderName: this.userInfo.name,
                  roomName: roomName,
                  channelName: roomName,
                  roomType: 'P',
                  channelType: 'P',
                  mediaType: 'video',
                  type: 'video'
                }),
                type: 'VIDEO_CONNECT'
              })
            })
        })
    },
    // 多人视频会议
    moreVideoMeet() {
      let memberInfo = [
        {
          "id": 163784934301312,
          "name": "田建伟",
          "username": "tjw",
          "sex": "男",
          "photo": "http://im.cf.nm.cp:8000/syntoimphoto/20190516/133e3b9035c34253adfd5b9d05c6ff12/p.jpg",
          "jid": "tjw@im.cf.nm.cp",
          "join": false,
        },
        {
          "id": 163784975810176,
          "name": "贾曙瑞",
          "username": "jsr",
          "sex": "男",
          "jid": "jsr@im.cf.nm.cp",
          "join": "jsr@im.cf.nm.cp" === this.userInfo.jid ? true : false,
        },
        {
          "id": 163785035638400,
          "name": "耿少斌",
          "username": "gsb",
          "sex": "男",
          "photo": "http://im.cf.nm.cp:8000/syntoimphoto/20190620/e84df40913e94c51bae2f14e63eebca6/p.jpg",
          "jid": "gsb@im.cf.nm.cp",
          "join": "gsb@im.cf.nm.cp" === this.userInfo.jid ? true : false
        }
      ]
      let roomName = `room${Date.now()}${parseInt((Math.random() + 1) * 10000)}`
      // let account = JSON.parse(localStorage.getItem('account'))
      this.SET_MEDIA_MEET_INFO({
        roomName: roomName,
        roomType: 'G',
        memberInfo: memberInfo,
        mediaType: 'video'
      })
      // 初始化会议
      initVideo({
        roomName,
        id: this.userInfo.jid,
        password: '123456',
        type: ['audio', 'video']
      })
        .then(data => {
          this.SET_MEDIA_SPEAK_FLAG(true)
          this.SET_MEDIA_SPEAK_ROLE('initiator')
          memberInfo.forEach(item => {
            if (item.jid !== this.userInfo.jid) {
              this.sendOtherMessage({
                to: item.jid,
                content: JSON.stringify({
                  senderId: this.userInfo.jid,
                  roomName: roomName,
                  channelName: roomName,
                  roomType: 'G',
                  channelType: 'G',
                  mediaType: 'video',
                  type: 'video',
                  // memberInfo: memberInfo.filter(item => { return item.jid !== this.userInfo.jid })
                  memberInfo: memberInfo
                }),
                type: 'VIDEO_CONNECT'
              })
            }
          })
        })
    },
    initEditor(){
      // 初始化输入框
      editor = new wEditor('hiddenEditorHead',this.$refs.message_content)
      // 监听富文本框的内容变化
      editor.customConfig.onchange = (html) => {
        // console.log(html)
        let msg = this.filterMsgHtml(html)
        // console.log(msg)
        this.message = msg
      }

      // editor.customConfig.pasteTextHandle = function (content) {
      //   // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      //   console.log(content)
      //   return content + '<p>在粘贴内容后面追加一行</p>'
      // }
      // editor.customConfig.debug = true

      // 设置字体
      editor.customConfig.fontNames = [
          '微软雅黑',
          '宋体',
          'Arial',
          'Tahoma',
          'Verdana'
      ]
      // 设置事件
      // editor.customConfig.onfocus = function () {
      //   console.log("onfocus")
      // }
      // editor.customConfig.onblur = function (html) {
      //   // html 即编辑器中的内容
      //   console.log('onblur', html)
      // }
      editor.create();
    },
    filterMsgHtml(html){
      if(html === '<p><br></p>'){
        return ''
      }
      html = html.replace(/<p>/g, "")
      // html = html.replace(/<br>/g, "")
      html = html.replace(/<\/p>/g, "\n")
      return html
    },
    parseImgHtml(html){
      // 匹配图片（g表示匹配所有结果i表示区分大小写）
      let imgReg = /<img.*?(?:>|\/>)/gi
      // 匹配src属性
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      // 匹配type属性
      let typeReg = /type=[\'\"]?([^\'\"]*)[\'\"]?/i;
      //获取所有图片
      let arr = html.match(imgReg)
      console.log(arr)
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

      if(uploadImgs.length > 0){
        let msgArr = [] // 分割的消息列表
        this.splitMessage(html, uploadImgs, msgArr)
        if(msgArr.length > 0){
          // 顺序发送，图片先存本地，后发消息

          msgArr.forEach(element => {
            if(element.type === 'text'){
              let removeBrHtml = element.content.replace(/<br>?<br \/>?/g, "")
              if(removeBrHtml){
                this.message = element.content
                this.doSendMessage()
              }
            }else{
              let src = element.content.match(srcReg)
              let fileObj = {
                filePath: src[1]
              }
              this.doSendMessage(fileObj, 'img',true)
            }

          })
        }
      }
      return uploadImgs
    },
    splitMessage(html, uploadImgs, msgArr){
      let arrTemp = []
      for (let i = 0; i < uploadImgs.length; i++) {
        arrTemp = html.split(uploadImgs[i])
        if(arrTemp && arrTemp.length === 2){
          if(arrTemp[0]){
            let obj = {type:'text',content:arrTemp[0]}
            msgArr.push(obj)
          }
          let obj1 = {type:'img',content:uploadImgs[i]}
          msgArr.push(obj1)
          if(i === (uploadImgs.length - 1)){

            if(arrTemp[1]){
              // 只存在<br>标签不允许发送,过滤掉<br>标签还存在则发送
              let removeBrHtml = arrTemp[1].replace(/<br>?<br \/>?/g, "")
              if(removeBrHtml){
                let obj = {type:'text',content:arrTemp[1]}
                msgArr.push(obj)
              }
            }
          }
          html = arrTemp[1]
        }
      }
    },
    doSendMessage (file,fileType,isParse) {
      if(!file){
        if (this.message.trim() === '') {
          editor.change && editor.change()
          return
        }
      }

      let senderJid = this.userInfo.jid
      if (!senderJid) {
        this.$message.error('您不在线哟，请重新登录后发送!')
        return
      }
      let messageTemp = this.message;
      // 发送图片不需要解析
      if(!isParse){
        messageTemp = messageTemp.replace(new RegExp('\\n', 'gm'), '<br />')
        let uploadImgs = this.parseImgHtml(messageTemp)
        if(uploadImgs && uploadImgs.length > 0){
          // 图文混杂的走复杂逻辑，请移步parseImgHtml内部
          return;
        }
      }
      // 去除最后一个换行
      let lastBrIndex = messageTemp.lastIndexOf('<br />')
      if(lastBrIndex > -1){
        messageTemp = messageTemp.replace(/(.*)<br \/>/, '$1')
        // messageTemp = messageTemp.replace(/<br \/>/, '')
      }
      const newMessage = {
        channelId: this.channelId,
        channelType: this.channelType,
        content: messageTemp,
        senderId: senderJid,
        to:this.channelId,
        createTime: new Date().getTime()
      }
      if(file){
        newMessage.fileType = fileType
        newMessage.fileInfo = file
        if(fileType === 'img'){
          newMessage.content = `<img src="` + file.filePath + `" height="80" type="picture" />`
        }else{
          newMessage.content = JSON.stringify(file)
        }
      }
      console.log(newMessage);
      this.saveMessage(newMessage)
        .then(response => {
          this.message = ''
          editor.txt.clear()
          // 刷新消息列表
          this.loadingVisible = false
        })
        .catch(error => {
          editor.txt.clear()
          this.loadingVisible = false
          outputError(this, error)
        })
    },
    // 选择emoji表情
    selectEmoji (code) {
      this.showEmoji = false
      this.SET_RIGHTKEYMENU(false)
      let html = this.emoji(code)
      // editor.txt.append(html)
      editor.cmd.do('insertHTML', html)
      editor.change && editor.change()
    },
    onShortcutCapture(){
      ipcRenderer.send('openShortcutCapture');
    },
    displayEmojiPanel () {
      this.SET_RIGHTKEYMENU(true)
      this.showEmoji = true
    },
    selectEmoticon (emoticon) {
      let textarea = this.$refs.message_content
      let pos = textarea.selectionStart
      let leftStr = this.message.substring(0, pos)
      let rightStr = this.message.substring(pos, this.message.length)
      this.message = leftStr + emoticon + rightStr
    },
    // 回车键发送消息
    onMessageContentEnterKeyDown (e) {
      if (e.keyCode === 13) {
        let hotkey = Cookie.getCookies('im_shortcut_send_msg_key')
        if (hotkey && hotkey === '2') {
          // Ctrl + Enter
          if(e.ctrlKey){ // enter发送消息
            setTimeout(() => {
              this.doSendMessage()
            },300)
          }else{ // ctrl + enter 换行
            editor.cmd.do('insertHTML', '<p><br></p>')
            editor.change && editor.change()
            // editor.txt.append('<p><br></p>');
          }
        } else {
          // 不存在或者等于1 为Enter
          if(!e.ctrlKey){ // enter发送消息
            setTimeout(() => {
              this.doSendMessage()
            },300)
          }else{ // ctrl + enter 换行
            editor.cmd.do('insertHTML', '<p><br></p>')
            editor.change && editor.change()
            // editor.txt.append('<p><br></p>');
          }
        }
        e.preventDefault()
      }
    },
    async checkServerArea () {
      // 获取占用大小
      let remoteAreaInfo = await this.getRemoteAreaInfo(this.userInfo.account)

      let remoteFileAreaInfo = remoteAreaInfo.storageFileUpSize
      // 服务器文件大小
      let remoteTotalFileArea = localStorage.getItem('global_file_remote_area')
      let returnVal = false
      if (remoteTotalFileArea) {
        if (remoteFileAreaInfo > parseInt(remoteTotalFileArea)) {
          this.$notify({
            title: '空间已满提示',
            message: '您在服务器端的文件空间不足，请您手动清除以往的文件记录再发送文件',
            type: 'warning',
            duration: 10000
          })
          return await new Promise((resolve, reject) => { resolve(true) })
        }else{
          return await new Promise((resolve, reject) => { resolve(false) })
        }
      }else{
          return await new Promise((resolve, reject) => { resolve(false) })
      }
    },
    async beforeFileUpload (file, target) {
      if (file.name.replace(/[\u0391-\uFFE5]/g, 'aa').length > 200) {
        this.$message.error('文件名长度不能超过200!')
        if(!target){
          return new Promise((resolve, reject) => { reject(false) })
        }else{
          return false
        }
      }
      let lastIndex = file.name.lastIndexOf('.')
      let suff = file.name.substr(lastIndex + 1)

      if (this.fileSuffix.toLowerCase().indexOf(suff.toLowerCase()) == -1) {
        this.$message.error('文件类型不正确，请发送' + this.fileSuffix + '格式文件!')
        if(!target){
          return new Promise((resolve, reject) => { reject(false) })
        }else{
          return false
        }
      }
      const isLt2M = file.size / 1024 / 1024 <= this.fileSize
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 ' + this.fileSize + 'MB!')
        if(!target){
          return new Promise((resolve, reject) => { reject(false) })
        }else{
          return false
        }
      }
      if (file.size == 0) {
        this.$message.error('文件内容为空!')
        if(!target){
          return new Promise((resolve, reject) => { reject(false) })
        }else{
          return false
        }
      }

      let fileArea  = await this.checkServerArea()
      console.log(11, fileArea)
      if (fileArea) {
        console.log('文件大小超了')
        if(!target){
          return new Promise((resolve, reject) => { reject(false) })
        }else{
          return false
        }
      }
      let gradeStr = this.selectGrade ? this.selectGrade : '无'
      this.$message({
        message: '发送的文件密级为' + gradeStr + '，默认7天后删除',
        duration: 5000,
        showClose: true,
        type: 'warning'
      })

      this.postFileData.grade = this.selectGrade
      this.postFileData.channelId = this.channelId
      this.postFileData.size = file.size

      // let html = `<p><div style="width:250px; height:60px; border:1.5px solid #DCDFE6; border-radius:5px; display:inline-block;">
      //   <div style="width:250px; height:60px; position:absolute;"></div>
      //   <img src="../../assets/images/file-message.png" width="35" height="38" style="margin:11px 0 0 10px; display:inline-block; vertical-align: middle;"/>
      //   <div style="display:inline-block; height:38px; width:190px; font-size:13px; margin:6px 0 0 3px; vertical-align: middle;">
      //     <span  style="display:inline-block; width:190px; line-height:23px; overflow:hidden;">王爷府大鹏数据.geojson</span>
      //     <span style="display:inline-block; width:190px;">20.4KB</span>
      //   </div>
      // </div></p>`
      // editor.txt.append(html)
      // editor.cmd.do('insertHTML', html)
      // editor.change && editor.change()


      // if (isLt2M) {
      //   this.loadingVisible = true
      // }
      return isLt2M
    },
    beforeFileUploadImage (file) {
      if (file.name.replace(/[\u0391-\uFFE5]/g, 'aa').length > 64) {
        this.$message.error('文件名长度不能超过64!')
        return false
      }

      const isLt2M = file.size / 1024 / 1024 <= this.fileSize
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 ' + this.fileSize + 'MB!')
        return false
      }
      if (file.size == 0) {
        this.$message.error('文件内容为空!')
        return false
      }
      if(file.path.indexOf('&') > -1){
        this.$message.error('文件名称包含特殊字符，请删除后再发送！')
        return false
      }

      this.postFileData.grade = this.selectGrade
      this.postFileData.channelId = this.channelId
      this.postFileData.size = file.size

      this.addEditImageMessage(file.path)

      // if (isLt2M) {
      //   this.loadingVisible = true
      // }
      return false
    },
    addEditImageMessage(path){
      let random = Math.random()
      let html = `<img src="` + path + `" height="80" type="picture" id="`+ random +`"/>`
      // editor.txt.append(html)
      this.$nextTick(() => {
        editor.cmd.do('insertHTML', html)
        editor.change && editor.change()
      })
    },
    fileUploadSuccess (response, file, fileList) {
      console.log('上传成功----', file, fileList)
      // this.loadingVisible = false
      let currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
      let grade = this.selectGrade ? this.selectGrade : '无'
      let fileName = file.name
      let fileNameExtension = fileName.substring((fileName.lastIndexOf('.') + 1))
      fileName = fileName.substring(0,(fileName.lastIndexOf('.'))) + '【' + grade + '】.' + fileNameExtension
      let fileLocalPath = ''
      if(fileList){
        fileLocalPath = (file.raw ? file.raw.path : '')
      }else{
        fileLocalPath = file.path
      }
      let fileObj = {
        fileExtension: fileNameExtension,
        fileSize: response.size,
        fileName: fileName,
        filePath: response.url,
        fileLocalPath: fileLocalPath,
        grade: grade
      }
      console.log(fileObj)
      this.doSendMessage(fileObj, 'file')
      // setSystemLog(currentUser.jid, currentUser.name, currentUser.alias + '向' + this.channelName + '发送文件[' + fileName + ']，密级[' + grade + ']')
      //   .then(_ => {})
      //   .catch(error => {})
      this.sendFileLogsYaml(fileObj, file)
    },
    sendFileLogsYaml (message, file) {
      console.log(message)
      // 记录下载的文件名信息
      let nowDate = this.userInfo.jid + '_' + myDate.formatDate(new Date(), 'yyyy-MM')
      let key = file.uid + '_' + message.fileSize + '_' + message.fileName
      let value = message.filePath
      appendYaml(nowDate, key, value)
    },
    handleFileOnError(file){
      console.log(file)
      this.$message.error("文件上传出错！")
    },
    handleFileOnChange (file) {
      const fileName = file.name.toLowerCase()
      if (fileName.endsWith('png') || fileName.endsWith('jpeg') || fileName.endsWith('jpg') || fileName.endsWith('gif')) {
        let img = new Image()
        img.src = file.url
        let self = this
        img.onload = function () {
          self.postFileData.imageWidth = img.width
          self.postFileData.imageHeight = img.height
          self.$refs.fileUpload.submit()
        }
      } else {
        this.$refs.fileUpload.submit()
      }
    },
    handleFileOnChangeImage (file) {
      const fileName = file.name.toLowerCase()
      if (fileName.endsWith('png') || fileName.endsWith('jpeg') || fileName.endsWith('jpg') || fileName.endsWith('gif')) {
        let img = new Image()
        let _URL = window.URL || window.webkitURL
        img.src = _URL.createObjectURL(file.raw)
        // img.src = file.url
        let self = this
        img.onload = function () {
          self.postFileData.imageWidth = img.width
          self.postFileData.imageHeight = img.height
          self.$refs.fileUploadImage.submit()
        }
      } else {
        this.$refs.fileUploadImage.submit()
      }
    },
    onDragenterFile () {

      this.$refs.message_content.ondragleave = (e) => {
        e.preventDefault() // 阻止离开时的浏览器默认行为
      }
      this.$refs.message_content.ondrop = async (e) => {
        e.preventDefault() // 阻止拖放后的浏览器默认行为
        let files = e.dataTransfer.files // 获取文件对象
        if (files.length < 1) {
          return // 检测是否有文件拖拽到页面
        }

        for (let i = 0; i < files.length; i++) {
          let file = files[i]
          console.log(file)

          // file = new File(["First Line Text","Second Line Text"], "test.txt", {type: "text/plain", lastModified: new Date()});
          // console.log(file)
          if(file.type.indexOf("image") > -1){
            this.beforeFileUploadImage(file)
            ipcRenderer.send('setWindowFocus')
            return
          }
          editor.txt.clear()
          this.message = ''
          let res = await this.beforeFileUpload(file, 'DRAG')
          console.log('验证：', res)
          if (!res) {
            continue
          }
          console.log('验证1：', res)
          let formData = new FormData()
          formData.append('file', file)
          formData.append('name', file.name)
          formData.append('grade', this.selectGrade)
          formData.append('channelId', this.channelId)
          formData.append('imageWidth', 0)
          formData.append('imageHeight', 0)
          formData.append('size', file.size)
          let header = {}
          header['Content-Type'] = 'multipart/form-data'
          this.uploadFileMessage(formData, header)
            .then(response => {
              this.fileUploadSuccess(response.data, file)
            })
            .catch(error => {
              this.loadingVisible = false
              outputError(this, error)
              this.$message.error("文件上传出错！")
            })
        }
      }
      this.$refs.message_content.ondragenter = (e) => {
        e.preventDefault() // 阻止拖入时的浏览器默认行为
      }
      this.$refs.message_content.ondragover = (e) => {
        e.preventDefault() // 阻止拖来拖去的浏览器默认行为
      }
    },
    showMessageHistory () {
      this.$refs.messageHistoryDlg.$emit('openDialog', '')
    },
    showSendGroupMessage () {
      this.$refs.sendGroupMessageDlg.$emit('openDialog')
    },
    onFontDisplay () {
      this.fontToolDisplay = !this.fontToolDisplay
    },
    onFontSizeHandle (value) {
      this.msgFontSize = value
      this.SET_MSG_FONT_SIZE(value)
    },
    initAtList(){
      if (this.channelType === 'G') {
        let memberList = JSON.parse(sessionStorage.getItem('qunzu_member_list'))
        // console.log(memberList)
        if(memberList && memberList.length > 0){
          $('#'+editor.textElemId).atwho({
            at: "@",
            data: memberList
          })
        }
      }else{
        $('#'+editor.textElemId).atwho('destroy')
      }
    }
  },
  updated () {
    // this.$nextTick(() => {
    //   this.sendButtonDisabled = (this.message.trim() === '')
    // })
  },
  watch :{
    message(){
      this.sendButtonDisabled = (this.message.trim() === '')
      console.log("this.message.length=======",this.message.length)
      $('#'+editor.textElemId).focus()
    },
    channelId(val){
      if(val){
        this.initAtList()
      }
    },
    rightKeyMenu (val, oldval) {
      if (!val) {
        this.showEmoji = false
      }
    }
  },
  components: {
    messageHistory,
    vueEmoji,
    sendGroupMessage,
    selectComponent: require('@/components/home/select-component.vue').default
  }
}
</script>

<style lang="scss" scoped>
.container {
  -webkit-flex: 0 0 auto;
  flex: 0 0 auto;
  width: 100%;
  z-index: 7;
  .toolbar {
    height: 25px;
    padding: 10px 18px;
    display: inline-block;
    /*display: flex;*/
    /*border-top: solid 1px #DFDAD3;*/
    .media-server {
      position: relative;
      float: left;
      display: flex;
      align-items: center;
      margin-left: 10px;
      font-size: 20px;
      color: #8a8a8a;
      .el-icon-phone, .el-icon-arrow-down {
        cursor: pointer;
      }
      .el-icon-arrow-down:hover {
        color: #1e9fff;
      }
      .media-server-type {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 80px;
        padding: 5px 0;
        border: 1px solid #b7b7b7;
        font-size: 12px;
        text-align: center;
        border-radius: 2px;
        z-index: 99999;
        .media-server-type-item {
          height: 24px;
          line-height: 24px;
          cursor: pointer;
        }
        .media-server-type-item:hover {
          background: #F7F7F7;
        }
      }
    }
    .emoji-box {
      position: absolute;
      z-index: 1000;
      left: -40px;
      top: -210px;
      box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
      background: white;
      .el-button {
        position: absolute;
        border: none;
        color: #FF4949;
        right: 12px;
        top: 12px;
        z-index: 10;
      }
      .arrow {
        left: 10px;
      }
    }
    .face {
      width: 24px;
      height: 24px;
      background: url(../../assets/images/emoji.png) no-repeat;
      vertical-align: middle;
      float: left;
      cursor: pointer;
    }
    .upload {
      float: left;
    }
    .file-invisible {
      position: absolute;
      clip: rect(1px,1px,1px,1px);

    }
    .folder {
      margin: 0 5px 0 2px;
      width: 23px;
      height: 23px;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }
    .chatRecord {
      margin: -2px 5px 0 10px;
      width: 24px;
      height: 24px;
      color: #8a8a8a;
      font-size: 19px;
      cursor: pointer;
    }
    .qunfaxiaoxi{
      color: #33A7FF;
    }
    button {
      background-color: #fff;
      border: 0px;
      padding: 0px;
      float: right;
      img {
        width: 24px;
      }
    }
    .security {
      width: 74px;
      float: left;
      margin-left: 8px;
      margin-top: -3px;
    }
  }
  .content-container {
    overflow: hidden;
    display: inline-block;
    *zoom:1;
    *display: inline;
    padding: 0 0 0 7px;
  }
  .send-button-container {
    height: 40px;
    line-height: 40px;
    text-align: right;
    padding: 0 18px 0 0;
    span {
      color: #888;
      font-size: 12px;
      margin-left: 10px;
      margin-right: 7px;
    }
  }
  .fontTool{
    position: absolute;
    background-color: #fff;
    border: 1px solid #dae6f2;
    border-bottom: 0px;
    top: -36px;
    left: -1px;
    height: 38px;
    width: 100%;
    border-radius: 6px 6px 0 0;
    font-size: 12px;
    color: #606266;
    .fontLabel{
      margin-top: 10px;
      text-align: right;
    }
    .fontSize{
      padding: 5px;
      width: 60px;
    }
  }
}
.custom-textarea {
  font-family: "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
  bottom: 0;
  width: 98%;
  height: 97px;
  overflow: scroll;
  resize: none;
  font-size: 13px;
  border:none ;
  outline:none;
  margin-left: 11px;
}

  /*@功能样式*/
  .same {
    display: inline-block;
    position: absolute;
    overflow-x: hidden;
    overflow-y: auto;
    outline: none;
    resize: none;
    white-space: pre-wrap;
    cursor: auto;
    color: rgb(128, 128, 128);
    width: 600px;
    height: 100px;
    top: 20px;
    padding: 4px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 18px;
    border: 1px solid #fa7d3c;
    font-family: Arial, 'Microsoft YaHei';
  }

  #div {
    z-index: 9999;
    visibility: hidden;
  }

  #post_textbox {
    z-index: 10000;
  }

  #info {
    position: absolute;
    z-index: 10001;
    // display: none;
    // overflow: auto;
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    padding:10px;
    min-width: 45px;
    border: 1px solid #E4E7ED;
    font-size: 12px;
    color: #303133;
    background: white;
    border-radius: 2px;
    box-shadow: 2px 2px 3px #e4e7ed;
    li {
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      &:hover {
        cursor: pointer;
        background: #f2f2f2;
      }
    }

  }


  .list-title1{
    font-family: Arial, 'Microsoft YaHei';
    font-size: 12px;
    padding: 6px 10px;
    cursor: pointer;
    list-style: none;
    color: #0A78D8;
  }

</style>
