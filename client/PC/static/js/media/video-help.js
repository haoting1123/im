import store from '../../../src/renderer/store'

// 监听点击事件
export function onClickToVideo (id) {
  $(`#${id}`).click(function (event) {
    let videoHeight = $(this).css('height')
    let containerHeight = $('.media-speak-content').css('height')
    // 单人会议
    if (store.state.channel.mediaMeetInfo.roomType === 'P') {
      // 如果小于容器高度，则切换为大屏显示
      if (videoHeight !== containerHeight) {
        store.commit('SET_ACTIVE_MEDIA_MEMBER_ID', id)
        // videoPositionObj.soloNormalAvatarSwitch(id)
      }
    } else if (store.state.channel.mediaMeetInfo.roomType === 'G') {
      store.commit('SET_ACTIVE_MEDIA_MEMBER_ID', id)
      // videoPositionObj.moreNormalAvatarSwitch(id)
    }
  })
}

// 初始化显示视频默认位置
export function initVideoStyle ({id}) {
  if (store.state.channel.mediaMeetInfo.roomType === 'P') {
    videoPositionObj.initSoloVideoStyle({ id })
  } else if (store.state.channel.mediaMeetInfo.roomType === 'G') {
    // videoPositionObj.initMoreVideoStyle({ id })
  }
}

let videoPositionObj = {
  // 单人会话视频窗口默认样式
  initSoloVideoStyle: function ({ id }) {
    let activeMaxVideoId = store.state.channel.activeMediaMemberId
    // 本机
    if (activeMaxVideoId === 'localVideo1') {} else {
      // 对端
      store.commit('SET_ACTIVE_MEDIA_MEMBER_ID', `${id}`)
    }
  },
  // 多人会话视频窗口默认样式
  initMoreVideoStyle: function({ id }) {},
  // 单人会议/大小屏切换
  soloNormalAvatarSwitch: function (id) {},
  // 多人会议/大小屏切换
  moreNormalAvatarSwitch: function (id) {}
}

// 初始化默认背景头像
export function initNormalAvatar (id) {
  $('.video-main-component').append(`
      <div class="normal-avatar ${id}">
        <img src="../static/img/boy.png" alt="默认头像" />
      </div>
    `)
}

