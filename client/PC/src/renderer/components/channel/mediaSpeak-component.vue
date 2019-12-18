<template>
  <!--v-show="mediaSpeakFlag"-->
  <div
    class="media-speak-main-component"
    v-show="mediaSpeakFlag"
    :style="{
      top: isMediaMinimize ? '59px' : '0',
      width: isMediaMinimize ? '150px' : '100%',
      height: isMediaMinimize ? '150px' : '100vh'
    }">
    <div
      class="media-speak-content"
      :style="{
        width: isMediaMinimize ? '100%' : '80%',
        height: isMediaMinimize ? '100%' : '80%'
      }">
      <!--放大/缩小-->
      <div>
        <img
          v-if="isMediaMinimize"
          @click="onRestore"
          class="minimize-icon zoom-btn"
          src="../../../../static/icon/fangda-icon.png"
          :style="{
          width: isMediaMinimize ? '24px' : '30px',
          height: isMediaMinimize ? '24px' : '30px'
        }"
          alt="还原"
          title="还原" />
        <img
          v-else
          @click="onMinimize"
          class="minimize-icon zoom-btn"
          src="../../../../static/icon/suoxiao-icon.png"
          :style="{
          width: isMediaMinimize ? '24px' : '30px',
          height: isMediaMinimize ? '24px' : '30px'
        }"
          alt="最小化"
          title="最小化" />
      </div>

      <!--等待接听容器-->
      <div v-if="mediaMeetInfo.roomType === 'P'" class="await-container" :style="{marginTop: isMediaMinimize ? '30px' : '40px'}">
        <template v-if="!acceptRequestFlag || mediaMeetInfo.mediaType === 'audio'">
          <img
            v-if="mediaMeetInfo.memberInfo[0].photo"
            class="member-avatar"
            :src="mediaMeetInfo.memberInfo[0].photo"
            :style="{
              'width': isMediaMinimize ? '50px' : '100px',
              'height': isMediaMinimize ? '50px' : '100px'
            }"
            alt="默认头像" />
          <img
            v-else
            class="member-avatar"
            src="../../../../static/icon/boy.png"
            :style="{
              'width': isMediaMinimize ? '50px' : '100px',
              'height': isMediaMinimize ? '50px' : '100px'
            }"
            alt="默认头像" />
          <h3
            class="member-name"
            :style="{
              fontSize: isMediaMinimize ? '14px' : '18px',
              fontWeight: isMediaMinimize ? 'normal' : 'bold'}"
          >{{ this.mediaMeetInfo.memberInfo[0].name }}</h3>
          <p v-if="!acceptRequestFlag" class="member-describe" :style="{fontSize: isMediaMinimize ? '10px' : '14px'}">正在呼叫...</p>
        </template>
      </div>

      <!--媒体容器-->
      <div
        id="media-container"
        :style="{
          'width': isMediaMinimize ? '100%' : '160px',
          'padding': isMediaMinimize ? '0' : '0 10px'
        }">
        <template v-if="mediaMeetInfo.memberInfo.length && mediaMeetInfo.mediaType === 'video'">
          <template v-if="mediaMeetInfo.roomType === 'G'">
            <div
                v-for="item in mediaMeetInfo.memberInfo"
                :class="[activeMediaMemberId === 'localVideo1' ? (item.jid === userInfo.jid ? 'max-container' : 'container') : (activeMediaMemberId.indexOf(item.username) > -1 ? 'max-container' : 'container')]"
                :key="item.jid"
                :id="userInfo.jid === item.jid ? 'localVideo1-parent' : item.username + '-parent'"
              >
                <!--v-show="isMediaMinimize ? item.mediaId === activeMediaMemberId : true"-->
                <div class="shade" v-if="!item.join"><p>等待接听...</p></div>
                <div class="normal-avatar" :class="userInfo.jid === item.jid ? 'localVideo1-parent' : item.username + '-parent'">
                  <img
                    :src="item.photo ? item.photo : 'static/icon/boy.png'"
                    :style="{
                      width: isMediaMinimize ? '50px' : '100px',
                      height: isMediaMinimize ? '50px' : '100px',
                      marginTop: isMediaMinimize ? '-20px' : '0'
                    }"
                    alt="默认头像" />
                </div>
              </div>
          </template>
          <template v-else>
            <div
              v-for="item in mediaMeetInfo.memberInfo"
              :class="[activeMediaMemberId === 'localVideo1' ? (item.jid === userInfo.jid ? 'max-container' : 'container') : (activeMediaMemberId.indexOf(item.username) > -1 ? 'max-container' : 'container')]"
              v-show="isMediaMinimize ? (activeMediaMemberId === 'localVideo1' ? (item.jid === userInfo.jid ? true : false) : (activeMediaMemberId.indexOf(item.username) > -1 ? true : false)) : (acceptRequestFlag || (mediaSpeakRole === 'initiator' && item.jid === userInfo.jid))"
              :id="userInfo.jid === item.jid ? 'localVideo1-parent' : item.username + '-parent'">
              <!--v-show="acceptRequestFlag || (mediaSpeakRole === 'initiator' && item.jid === userInfo.jid)"-->
              <div class="normal-avatar" :class="userInfo.jid === item.jid ? 'localVideo1-parent' : item.username + '-parent'">
                <img
                  :src="item.photo ? item.photo : 'static/icon/boy.png'"
                  :style="{
                      width: isMediaMinimize ? '50px' : '100px',
                      height: isMediaMinimize ? '50px' : '100px',
                      marginTop: isMediaMinimize ? '-20px' : '0'
                    }"
                  alt="默认头像" />
              </div>
            </div>
          </template>
        </template>
        <template v-else-if="mediaMeetInfo.memberInfo.length && mediaMeetInfo.mediaType === 'audio'">
          <!--v-show="acceptRequestFlag || mediaMeetInfo.roomType !== 'P' || userInfo.jid === item.jid"-->
          <!--多人语音会话显示默认头衔-->
          <template v-if="mediaMeetInfo.roomType === 'G'">
            <div
              v-for="item in mediaMeetInfo.memberInfo"
              :class="[activeMediaMemberId === 'localVideo1' ? (item.jid === userInfo.jid ? 'max-container' : 'container') : (activeMediaMemberId.indexOf(item.username) > -1 ? 'max-container' : 'container')]"
              :id="userInfo.jid === item.jid ? 'localVideo1-parent' : item.username + '-parent'"
            >
              <div class="shade" v-if="!item.join"><p>等待接听...</p></div>
              <div class="normal-avatar" :class="userInfo.jid === item.jid ? 'localVideo1-parent' : item.username + '-parent'">
                <img
                  :src="item.photo ? item.photo : 'static/icon/boy.png'"
                  :style="{
                    width: isMediaMinimize ? '50px' : '100px',
                    height: isMediaMinimize ? '50px' : '100px',
                    marginTop: isMediaMinimize ? '-20px' : '0'
                  }"
                  alt="默认头像" />
              </div>
            </div>
          </template>
        </template>
      </div>

      <!--计时器容器-->
      <div v-if="acceptRequestFlag" class="all-duration" :style="{bottom: isMediaMinimize ? '10px' : '50px'}">
        <p>{{ callDuration }}</p>
      </div>

      <!--操作按钮-->
      <div class="media-btn-group" :style="{display: isMediaMinimize ? 'none' : 'flex'}">
        <!--静音-->
        <img v-if="openVoiceFlag && mediaSpeakFlag && acceptRequestFlag" @click="closeVoice" class="btn" src="../../../../static/icon/unmute.png" title="静音" alt="close-voice-iocn" />
        <img v-else-if="!openVoiceFlag && mediaSpeakFlag && acceptRequestFlag" @click="openVoice" class="btn" src="../../../../static/icon/mute.png" title="取消静音" alt="close-voice-iocn" />

        <!--通话-->
        <img v-if="mediaSpeakRole === 'acceptor' && !acceptRequestFlag && mediaMeetInfo.mediaType === 'video'" class="open-btn btn" src="../../../../static/icon/connected.png" @click="joinVideoMediaSpeakInvite" title="接听" alt="open" />
        <img v-if="mediaSpeakRole === 'acceptor' && !acceptRequestFlag && mediaMeetInfo.mediaType === 'audio'" class="open-btn btn" src="../../../../static/icon/connected.png" @click="joinVoiceMediaSpeakInvite" title="接听" alt="open" />
        <img class="close-btn btn" src="../../../../static/icon/closed.png" @click="closeVideo" title="挂断" alt="close" />

        <!--摄像头-->
        <img v-if="openVideoFlag && mediaSpeakFlag && acceptRequestFlag && mediaMeetInfo.mediaType === 'video'" @click="closeCamera" class="btn" src="../../../../static/icon/cameraoff copy.png" title="关闭摄像机" alt="open-video-icon" />
        <img v-else-if="!openVideoFlag && mediaSpeakFlag && acceptRequestFlag && mediaMeetInfo.mediaType === 'video'" class="btn" @click="openCamera" src="../../../../static/icon/cameraoff.png" title="打开摄像机" alt="close-video-icon" />
      </div>
      <div class="media-btn-group-background" :style="{display: isMediaMinimize ? 'none' : 'block'}"></div>
    </div>
  </div>
</template>

<script>
  let mediaTimer = null
  import { mapState, mapMutations, mapActions } from 'vuex'
  import {
    initVideo,
    unload,
    openCameraRequest,
    closeCameraRequest,
    openVoiceRequest,
    closeVoiceRequest
  } from '../../../../static/js/media/example'
  export default {
    data() {
      return {
        // 打开摄像头
        openVideoFlag: true,
        // 打开声音
        openVoiceFlag: true,
        callDuration: '00 : 00 : 00'
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.home.userInfo,
        mediaSpeakFlag: state => state.channel.mediaSpeakFlag,
        acceptRequestFlag: state => state.channel.acceptRequestFlag,
        mediaSpeakRole: state => state.channel.mediaSpeakRole,
        mediaMeetInfo: state => state.channel.mediaMeetInfo,
        isMediaMinimize: state => state.channel.isMediaMinimize,
        activeMediaMemberId: state => state.channel.activeMediaMemberId
      })
    },
    watch: {
      mediaSpeakFlag: function (val, oldVal) {
        this.openVideoFlag = true
        this.openVoiceFlag = true
      },
      acceptRequestFlag: function (val ,oldVal) {
        if (val) {
          this.startTime()
        } else {
          clearInterval(mediaTimer)
          this.callDuration = '00 : 00 : 00'
        }
      }
    },
    methods: {
      ...mapMutations([
        'SET_MEDIA_SPEAK_FLAG',
        'SET_ACCEPT_REQUEST_FLAG',
        'SET_IS_MEDIA_MINIMIZE',
        'SET_MEDIA_SPEAK_ROLE',
        'INIT_MEDIA_MEET_INFO',
        'SET_ACTIVE_MEDIA_MEMBER_ID'
      ]),
      ...mapActions([
        'sendOtherMessage',
        'sendGroupOtherMessage'
      ]),
      // 最小化
      onMinimize () {
        console.warn('最小化')
        this.SET_IS_MEDIA_MINIMIZE(true)
        let activeMediaMemberId = this.activeMediaMemberId
        if (activeMediaMemberId === 'localVideo1') {
          $(`#media-container>div[id != 'localVideo1-parent']`).css({ 'display': 'none' })
        } else {
          $(`#media-container>div[id != ${activeMediaMemberId.split('-')[0]}-parent]`).css({ 'display': 'none' })
        }
      },
      // 还原窗口
      onRestore () {
        console.warn('最大化')
        this.SET_IS_MEDIA_MINIMIZE(false)
        if (this.mediaMeetInfo.roomType === 'G') {
          $(`#media-container .container`).css({
            'display': 'block'
          })
        } else {
          if (this.acceptRequestFlag) {
            $(`#media-container .container`).css({
              'display': 'block'
            })
          }
        }
      },
      // 通话开始计时
      startTime () {
        let time = 0
        let remainder = 0
        let hours = 0
        let minutes = 0
        let seconds = 0
        mediaTimer = setInterval(() => {
          ++time;
          if (time >= 3600) {
            hours = Math.floor(time / 3600)
            remainder = time % 3600
            if (remainder >= 60) {
              minutes = Math.floor(remainder / 60)
              remainder = time % 60
              seconds = remainder
            } else {
              minutes = 0
              seconds = remainder
            }
          } else if (time > 60) {
            minutes = Math.floor(time / 60)
            remainder = time % 60
            seconds = remainder
          } else {
            seconds = time
          }
          this.callDuration = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
        }, 1000)
      },
      // 接受视频会议
      joinVideoMediaSpeakInvite() {
        console.warn(this.mediaMeetInfo)
        initVideo({
          roomName: this.mediaMeetInfo.roomName,
          id: this.userInfo.jid,
          password: '123456',
          type: ['audio', 'video']
        })
          .then(data => {
            this.SET_MEDIA_SPEAK_FLAG(true)
            this.SET_ACCEPT_REQUEST_FLAG(true)
          })
      },
      // 接受语音会议
      joinVoiceMediaSpeakInvite() {
        initVideo({
          roomName: this.mediaMeetInfo.roomName,
          id: this.userInfo.jid,
          password: '123456',
          type: ['audio']
        })
          .then(data => {
            this.SET_MEDIA_SPEAK_FLAG(true)
            this.SET_ACCEPT_REQUEST_FLAG(true)
          })
      },
      // 挂断视频
      closeVideo () {
        if (this.mediaMeetInfo.roomType === 'P') {
          this.soloCloseVideo()
        } else {
          this.moreCloseVideo()
        }
      },
      // 单人会议挂断
      soloCloseVideo () {
        this.sendOtherMessage({
          to: this.mediaMeetInfo.memberInfo[0].jid,
          content: JSON.stringify({
            roomType: 'P',
            roomName: this.mediaMeetInfo.roomName
          }),
          type: 'MEMBER_QUIT_MEIDA_MEET'
        })
        if (this.acceptRequestFlag || this.mediaSpeakRole === 'initiator') {
          unload()
        } else {
          this.SET_MEDIA_SPEAK_FLAG(false)
          this.SET_ACCEPT_REQUEST_FLAG(false)
          this.SET_MEDIA_SPEAK_ROLE('')
          this.INIT_MEDIA_MEET_INFO()
          this.SET_IS_MEDIA_MINIMIZE(false)
          this.SET_ACTIVE_MEDIA_MEMBER_ID('localVideo1')
        }
      },
      // 多人会议挂断
      moreCloseVideo () {
        // 尚未有任何成员加入会议，通知成员会议结束（发起者）
        if (!this.acceptRequestFlag && this.mediaSpeakRole === 'initiator') {
          this.sendGroupOtherMessage({
            to: this.mediaMeetInfo.channelId,
            content: JSON.stringify({
              roomType: 'G',
              messageType: 'meetEnd'
            }),
            type: 'MEMBER_QUIT_MEIDA_MEET'
          })
        } else {
          // 已有成员加入群聊
          this.sendGroupOtherMessage({
            to: this.mediaMeetInfo.channelId,
            content: JSON.stringify({
              roomType: 'G',
              messageType: 'meetEnd'
            }),
            type: 'MEMBER_QUIT_MEIDA_MEET'
          })
        }
        if (this.acceptRequestFlag || this.mediaSpeakRole === 'initiator') {
          unload()
        } else {
          this.SET_MEDIA_SPEAK_FLAG(false)
          this.SET_ACCEPT_REQUEST_FLAG(false)
          this.SET_MEDIA_SPEAK_ROLE('')
          this.INIT_MEDIA_MEET_INFO()
          this.SET_IS_MEDIA_MINIMIZE(false)
          this.SET_ACTIVE_MEDIA_MEMBER_ID('localVideo1')
        }
      },
      // 打开摄像头
      openCamera () {
        this.openVideoFlag = true
        openCameraRequest()
      },
      // 关闭摄像头
      closeCamera () {
        this.openVideoFlag = false
        closeCameraRequest()
      },
      // 取消静音
      openVoice () {
        this.openVoiceFlag = true
        openVoiceRequest()
      },
      // 静音
      closeVoice () {
        this.openVoiceFlag = false
        closeVoiceRequest()
      }
    }
  }
</script>

<style lang="scss">
  .media-speak-main-component {
    position: fixed;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.1);
    z-index: 998;
    .media-speak-content {
      position: relative;
      /*top: 10%;*/
      /*left: 10%;*/
      width: 80%;
      height: 80%;
      background: #464646;
      box-shadow: 0 0 10px #333333;
      overflow: hidden;
      .zoom-btn {
        position: absolute;
        left: 5px;
        top: 5px;
        width: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 999;
      }
      .await-container {
        position: absolute;
        width: 100%;
        text-align: center;
        margin-top: 40px;
        text-align: center;
        color: white;
        z-index: 2;
        .member-avatar {
          width: 100px;
          height: 100px;
          border-radius: 4px;
        }
        .member-name {
          letter-spacing: 4px;
          font-size: 18px;
          font-family: "Microsoft YaHei","Arial","\9ED1\4F53","\5B8B\4F53",sans-serif;
        }
        .member-describe {
          font-size: 12px;
          letter-spacing: 4px;
        }
      }
      #media-container {
        float: right;
        width: 160px;
        height: 100%;
        padding: 0 10px;
        .container {
          position: relative;
          height: 100px;
          margin-top: 10px;
          z-index: 999;
          .shade {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: white;
            background: rgba(0, 0, 0, 0.2);
            z-index: 2
          }
        }
        .max-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          z-index: 0;
        }
        /*视频*/
        video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          z-index: 1;
        }
        /*视频默认头像*/
        .normal-avatar {
          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.1);
          img {
            width: 100px;
            height: 100px;
            border-radius: 4px;
          }
        }
        /*语音默认头像*/
        .audio-normal-avatar {
          position: relative;
          text-align: center;
          z-index: 999;
          img {
            width: 100px;
            height: 100px;
            border-radius: 4px;
          }
          h3 {
            font-size: 18px;
            letter-spacing: 4px;
            color: white;
          }
        }
      }
      .all-duration {
        position: absolute;
        bottom: 50px;
        width: 100%;
        text-align: center;
        z-index: 9999;
        p {
          line-height: 30px;
          color: white;
        }
      }
      .media-btn-group {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        font-size: 0;
        z-index: 9999;
        .btn {
          width: 34px;
          height: 34px;
          cursor: pointer;
        }
        .btn + .btn {
          margin-left: 20px;
        }
      }
      .media-btn-group-background {
        background-image: linear-gradient(to top,rgba(51,51,51,1),rgba(51,51,51,0.4));
        transition: bottom .3s ease-in;
        height: 50px;
        width: 100%;
        bottom: 0;
        position: absolute;
        z-index: 0;
      }
      .media-btn-group-background:after {
        content: "";
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        background: inherit;
        filter: blur(15px);/*为了模糊更明显，调高模糊度*/
        z-index: 0;
      }
    }
  }
</style>
