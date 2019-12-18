/* global $, JitsiMeetJS */
import {
  onClickToVideo,
  initVideoStyle,
  initNormalAvatar
} from './video-help'
import store from '../../../src/renderer/store'
// import { Message } from 'element-ui'
import JitsiMeetJS from './lib-jitsi-meet'
const options = {
  hosts: {
    domain: 'im.cf.nm.cp',
    // domain: 'openfire',
    muc: 'conference.im.cf.nm.cp',
    // muc: 'conference.openfire',
  },
  bosh: 'http://im.cf.nm.cp:7070/http-bind',
  // bosh: 'http://openfire:7070/http-bind',
  // The name of client node advertised in XEP-0115 'c' stanza
  clientNode: 'http://im.cf.nm.cp/jitsimeet'
  // clientNode: 'http://openfire/jitsimeet'
}


const confOptions = {
  openBridgeChannel: true
}

let connection = null
let isJoined = false
let room = null

// 本地流
let localTracks = []
// 远端流
const remoteTracks = {}

/**
 * Handles local tracks.
 * @param tracks Array with JitsiTrack objects
 */


// 设备列表改变
export function onDeviceListChanged (devices) {
  console.info('current devices', devices)
}

let isVideo = true

// 切换视频
export function switchVideo () { // eslint-disable-line no-unused-vars
  isVideo = !isVideo
  if (localTracks[1]) {
    localTracks[1].dispose()
    localTracks.pop()
  }
  JitsiMeetJS.createLocalTracks({
    devices: [isVideo ? 'video' : 'desktop']
  })
    .then(tracks => {
      localTracks.push(tracks[0])
      localTracks[1].addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log('local track muted'))
      localTracks[1].addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.log('local track stoped'))
      localTracks[1].attach($('#localVideo1')[0])
      room.addTrack(localTracks[1])
    })
    .catch(error => console.log(error))
}

// 改变音频输出
export function changeAudioOutput (selected) { // eslint-disable-line no-unused-vars
  JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value)
}

const initOptions = {
  disableAudioLevels: true,

  // The ID of the jidesha extension for Chrome.
  desktopSharingChromeExtId: 'mbocklcggfhnbahlnepmldehdhpjfcjp',

  // Whether desktop sharing should be disabled on Chrome.
  desktopSharingChromeDisabled: false,

  // The media sources to use when using screen sharing with the Chrome
  // extension.
  desktopSharingChromeSources: ['screen', 'window'],

  // Required version of Chrome extension
  desktopSharingChromeMinExtVersion: '0.1',

  // Whether desktop sharing should be disabled on Firefox.
  desktopSharingFirefoxDisabled: true
}
$(window).bind('beforeunload', unload)
$(window).bind('unload', unload)
export const initVideo = function ({ roomName, id, password, type }) {
  return new Promise((resolve, reject) => {
    /* eslint-disable */
    // JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
    JitsiMeetJS.init(initOptions)

    // 实例化一个服务器连接
    connection = new JitsiMeetJS.JitsiConnection(null, null, options)
    // 监听连接成功（原型方法）
    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess)
    // 监听连接失败（原型方法）
    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed)
    // 监听连接断开（原型方法）
    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect)
    connection.addEventListener(JitsiMeetJS.events.connection.WRONG_STATE , err => {
      console.warn(1)
      console.warn(err)
    })

    // 附加处理程序
    JitsiMeetJS.mediaDevices.addEventListener(JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED, onDeviceListChanged)

    // 开始建立服务器连接
    connection.connect({
      id,
      password
    })
    // connection.connect()

    // 创建媒体轨道并返回promise对象
    JitsiMeetJS.createLocalTracks({
      // devices: ['audio', 'video']
      devices: type
    })
      .then(onLocalTracks)
      .catch(error => {
        throw error
      })

    // 如果支持更改输入（摄像机/麦克风）或输出（音频）设备，则返回true，否则返回false;
    if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
      // 返回可用设备的列表作为回调函数的参数
      JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
        const audioOutputDevices = devices.filter(d => d.kind === 'audiooutput')

        if (audioOutputDevices.length > 1) {
          $('#audioOutputSelect').html(
            audioOutputDevices
              .map(
                d =>
                  `<option value="${d.deviceId}">${d.label}</option>`)
              .join('\n'))

          $('#audioOutputSelectWrapper').show()
        }
      })
    }

    // 本地流
    function onLocalTracks (tracks) {
      // console.log(tracks)
      // debugger
      localTracks = tracks
      for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, audioLevel => console.log(`Audio Level local: ${audioLevel}`))
        // JitsiTrack被静音或取消静音
        localTracks[i].addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => console.log('local track muted'))
        // 提示音已经停止已停止
        localTracks[i].addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => console.log('local track stoped'))
        // 表示轨道的音频输出设备已更改（参数 - deviceId（字符串） - 新的音频输出设备ID）
        localTracks[i].addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, deviceId => console.log(`track audio output device was changed to ${deviceId}`))
        if (localTracks[i].getType() === 'video') {
          $('#media-container #localVideo1-parent').append(`
            <video autoplay='1' id='localVideo${i}' />
          `)
          initVideoStyle({ id: 'localVideo1' })
          localTracks[i].attach($(`#localVideo${i}`)[0])
        } else {
          $('body #media-container').append(`<audio autoplay='1' muted='true' id='localAudio${i}' />`)
          localTracks[i].attach($(`#localAudio${i}`)[0])
        }
        if (isJoined) {
          room.addTrack(localTracks[i])
        }
      }
    }

    // 连接成功
    function onConnectionSuccess () {
      console.warn('连接成功')
      room = connection.initJitsiConference(roomName, confOptions)
      // 收到轨道回调
      room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack)
      room.on(JitsiMeetJS.events.conference.CONFERENCE_FAILED, err => {
        console.warn(err)
        console.warn('进入房间失败')
        reject({
          errcode: 402,
          message: '加入会议失败!'
        })
      })
      // 加入会议成功
      room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined)
      // 新成员加入房间
      room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
        console.warn('user join')
        console.warn(id)
        console.warn(store)
        remoteTracks[id] = []
        // 单人会议
        if (store.state.channel.mediaMeetInfo.roomType === 'P' && !store.state.channel.acceptRequestFlag) {
          store.commit('SET_ACCEPT_REQUEST_FLAG', true)
          store.commit('SET_ACTIVE_MEDIA_MEMBER_ID', id)
        } else {
          store.commit('SET_ACCEPT_REQUEST_FLAG', true)
          store.commit('UPDATE_MEDIA_MEET_MEMBER_STATUS', `${id.split('-')[0]}${store.state.home.xmppDomain}`)
        }
      })
      // 成员离开房间
      room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft)
      // 收到轨道
      room.on(JitsiMeetJS.events.conference.TRACK_ADDED, (track) => {
        console.warn('收到的流')
        console.warn(track)
      })
      // 删除轨道
      room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, onRemoveTrack)
      room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
        console.warn(`${track.getType()} - ${track.isMuted()}`)
      })
      room.on(JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, (userID, displayName) => console.warn(`${userID} - ${displayName}`))
      room.on(JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED, (userID, audioLevel) => console.warn(`${userID} - ${audioLevel}`))
      room.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, () => console.warn(`${room.getPhoneNumber()} - ${room.getPhonePin()}`))
      room.on(JitsiMeetJS.events.conference.CONFERENCE_ERROR, (err) => {
        console.warn(`会议错误`)
        console.warn(err)
      })
      room.join()
    }

    // 收到远程流的处理函数
    function onRemoteTrack (track) {
      // 判断是否为本地轨道
      if (track.isLocal()) {
        return
      }
      // console.warn(track)
      console.warn(`流：${track}`)
      // 流id
      const participant = track.getParticipantId()
      // console.warn(`participant:${participant}`)

      // 是否已经存在该轨道
      if (!remoteTracks[participant]) {
        remoteTracks[participant] = []
      }
      const idx = remoteTracks[participant].push(track)

      track.addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        audioLevel => console.log(`Audio Level remote: ${audioLevel}`)
      )
      // 静音或取消静音
      track.addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log('remote track muted')
      )
      // 本地流停止传输
      track.addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.warn(`remote track stoped：本地流停止传输`)
      )
      // 表示轨道的音频输出设备已更改
      track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        deviceId =>
          console.log(`track audio output device was changed to ${deviceId}`)
      )
      const id = participant + track.getType() + idx

      // console.warn(participant)
      // 避免添加多余的DOM元素
      if (track.type === 'video' && $(`video[id ^= ${participant}video]`).length) {
        // $(`.media-speak-content div[id ^= ${participant}video]`).remove()
        $(`#media-container video[id ^= ${participant}video]`).remove()
        // 如果当前处于大屏显示的窗口，开关摄像头重新将其设置为大屏显示
        if (store.state.channel.activeMediaMemberId.indexOf(`${participant}video`) > -1) {
          store.commit('SET_ACTIVE_MEDIA_MEMBER_ID', id)
        }
      }
      if (track.type === 'audio' && $(`audio[id ^= ${participant}audio]`).length) {
        $(`#media-container audio[id ^= ${participant}audio]`).remove()
        $(`#media-container div[class *= ${participant}]`).remove()
      }

      if (track.getType() === 'video') {
        console.warn('添加video元素')
        console.warn(store.state.channel.mediaMeetInfo)
        let memberInfo = store.state.channel.mediaMeetInfo.memberInfo.filter(item => { return item.username === participant.split('-')[0] })[0]
        $(`#media-container #${memberInfo.username}-parent`).append(`
           <video autoplay='1' id='${participant}video${idx}' openFlag='0' />
        `)
        initVideoStyle({ id: id })
        onClickToVideo(`${participant}video${idx}`)
      } else {
        console.warn('添加audio元素')
        $('body #media-container').append(`<audio autoplay='1' id='${participant}audio${idx}' />`)

        if (store.state.channel.mediaMeetInfo.mediaType === 'audio') {
          // $('body #media-container').append(`
          //   <div class="${id} audio-normal-avatar">
          //     <img src="${store.state.channel.mediaMeetInfo.memberInfo.photo ? store.state.channel.mediaMeetInfo.memberInfo.photo : 'static/icon/boy.png'}" alt="默认头像" />
          //     <h3>${store.state.channel.mediaMeetInfo.memberInfo.name}</h3>
          //   </div>
          // `)
        }
      }
      track.attach($(`#${id}`)[0])
    }

    // 删除轨道监听
    function onRemoveTrack (track) {
      console.warn('已删除流')
      console.warn(track)
      if (track.containers.length && store.state.channel.mediaMeetInfo.roomType === 'P') {
        trackObj.onSoloRemoveTrack(track)
      } else {
        trackObj.onMoreRemoveTrack(track)
      }
    }

    let trackObj = {
      // 监听单人轨道删除
      onSoloRemoveTrack: function (track) {
        let className = track.containers[0].id
        let isMediaMinimize = store.state.channel.isMediaMinimize
        // let maxVideoId = store.state.channel.activeMediaMemberId
        let videoHeight = $(`#${className}`).css('height')
        $(`#${className}`).css({
          'opacity': 0
        })
        $(`#${className}`).attr({
          'openflag': '1'
        })
        if (videoHeight !== '100px') {
          $(`#media-container .${className}`).css({
            'right': 0,
            'top': 0,
            'display': 'flex',
            'height': '100%',
            'width': '100%',
            'z-index': 0
          })
          $(`#media-container .${className} img`).css({
            'width': isMediaMinimize ? '50px' :'100px',
            'height': isMediaMinimize ? '50px' :'100px',
            'margin-top': isMediaMinimize ? '-20px' :'0',
          })
        } else {
          $(`#media-container .${className}`).css({
            // 在最小化窗口下，如果不是大屏显示需要隐藏
            'display': isMediaMinimize ? 'none' : 'flex',
            'width': '100px',
            'height': '100px'
          })
        }
      },
      // 监听多人轨道删除
      onMoreRemoveTrack: function(track) {
        if (store.state.channel.acceptRequestFlag) {
          let className = track.containers[0].id
          $(`#${className}`).css({
            'opacity': 0
          })
          $(`#${className}`).attr({
            'openflag': '1'
          })
        }
      }
    }


    // 连接失败
    function onConnectionFailed () {
      console.error('Connection Failed!')
      reject({
        errcode: 401,
        message: '连接服务器失败!'
      })
    }

    // 加入会议
    function onConferenceJoined () {
      console.warn('conference joined!')
      resolve({
        errcode: 0,
        message: '加入会议成功!'
      })
      isJoined = true
      for (let i = 0; i < localTracks.length; i++) {
        room.addTrack(localTracks[i])
      }
      $('#localVideo1').attr({ 'openFlag': '0' })
      initNormalAvatar('localVideo1')
      onClickToVideo('localVideo1')
      store.commit('UPDATE_MEDIA_MEET_MEMBER_STATUS', store.state.home.userInfo.jid)
    }

    // 监听用户离开房间
    function onUserLeft (id) {
      console.warn(`成员离开房间：${id}`)
      let username = id.split('-')[0]
      if (store.state.channel.mediaMeetInfo.roomType === 'P') {
        // 单人会议，如果有人意外退出直接结束会议
        // unload()
        // Message({
        //   message: '意外挂断!'
        // })
      } else {
        // 用户退出，删除对应的媒体元素 start
        // $(`#media-container video[id ^= ${id}]`).remove()
        $(`body audio[id  ^= ${id}]`).remove()
        // 用户退出，删除对应的媒体元素 end
      }
      if (store.state.channel.acceptRequestFlag) {
        console.warn('user left')
        if (!remoteTracks[id]) {
          return
        }
        const tracks = remoteTracks[id]

        for (let i = 0; i < tracks.length; i++) {
          tracks[i].detach($(`#${id}${tracks[i].getType()}`))
        }
      }
    }

    // 断开连接回调
    function disconnect () {
      console.warn('disconnect：断开连接')
      connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess)
      connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed)
      connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect)
    }
  })
}

// 挂断
export function unload () {
  // 挂断后初始化store
  store.commit('SET_MEDIA_SPEAK_FLAG', false)
  store.commit('SET_ACCEPT_REQUEST_FLAG', false)
  store.commit('SET_MEDIA_SPEAK_ROLE', '')
  store.commit('INIT_MEDIA_MEET_INFO')
  store.commit('SET_IS_MEDIA_MINIMIZE', false)
  store.commit('SET_ACTIVE_MEDIA_MEMBER_ID', 'localVideo1')

  // 清空媒体容器
  // $('#media-container').empty()
  $('#media-container video, #media-container audio').remove()
  console.warn(localTracks)

  // 处理本地轨道
  for (let i = 0; i < localTracks.length; i++) {
    localTracks[i].dispose()
  }
  room.leave()
  connection.disconnect()
}

// 打开摄像头
export function openCameraRequest () {
  localTracks.forEach(item => {
    if (item.type === 'video') {
      item.attach($('#localVideo1')[0])
      room.addTrack(item)
    }
  })
  $('#localVideo1').attr({ 'openFlag': '0' })
}

// 关闭摄像头
export function closeCameraRequest () {
  localTracks.forEach(item => {
    if (item.type === 'video') {
      item.detach($('#localVideo1')[0])
      room.removeTrack(item)
    }
  })
  $('#localVideo1').attr({ 'openFlag': '1' })
}

// 静音
export function closeVoiceRequest () {
  localTracks.forEach(item => {
    if (item.type === 'audio') {
      item.mute()
    }
  })
}

// 取消静音
export function openVoiceRequest () {
  localTracks.forEach(item => {
    if (item.type === 'audio') {
      item.unmute()
      // console.warn($(`body #localVideo1`).css('top'))
      let top = $(`body #localVideo1`).css('top');
      $(`.video-main-component .normal-avatar`).css({
        'display': 'none'
      })
    }
  })
}
