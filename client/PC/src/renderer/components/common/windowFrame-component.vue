<template>
  <div :class="isLogin?'global-drag-window-nologin':'global-drag-window'">
    <div class="global-top-btn-close" @click="windowClose" alt="关闭窗口" title="关闭窗口">&nbsp;</div>
    <div class="global-top-btn" v-if="!isLogin" @click="windowMax"><img src="../../assets/images/top-max.png" title="最大化" width="20" height="21"></div>
    <div class="global-top-btn"  @click="windowMin"><img v-if="!isLogin" src="../../assets/images/top-min.png" title="最小化" width="25" height="23"><img v-else src="../../assets/images/top-min-white.png" title="最小化" width="14" height="14"></div>
    <div class="global-top-btn set-top-btn" v-if="isLogin" @click="openSetup"><img src="../../assets/images/top-setup-white.png" width="12" height="12" title="设置"></div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'window-frame-component',
    props: ['isLogin', 'openSetup'],
    data () {
      return {}
    },
    methods: {
      windowMax () {
        ipcRenderer.send('topWinMax')
      },
      // 最小化
      windowMin () {
        ipcRenderer.send('topWinMin')
      },
      // 关闭
      windowClose () {
        let qt = localStorage.getItem('global_quit_type')
        if (!qt || qt === 'close') {
          ipcRenderer.send('topWinClose')
        } else {
          ipcRenderer.send('real_close')
        }
      }
    }
  }
</script>

<style lang="scss">
  .global-drag-window{
    text-align: center;
    position:fixed;
    width: 100%;
    height: 23px;
    z-index: 999;
    -webkit-app-region: drag;
    // opacity:0.5;
    .global-top-btn {
      z-index: 999;
      float:right;
      height:23px;
      width:35px;
      line-height: 23px;
      padding-top:1px;
      background: #fff;
      -webkit-app-region: no-drag;
      &:hover {
        background: #DCDFE6;
        cursor: pointer;
      }
    }
    .set-top-btn {
      background:#00000000;
      &:hover {
        background: #DCDFE6;
        cursor: pointer;
      }
    }
    .global-top-btn-close {
      z-index: 999;
      float:right;
      height:24px;
      width:35px;
      line-height: 24px;
      background: #fff url('../../assets/images/top-close-black.png') no-repeat 13px;
      -webkit-app-region: no-drag;
      &:hover {
        background: #FB1A2C  url('../../assets/images/top-close-white.png') no-repeat 13px;
        cursor: pointer;
      }
    }
  }
  .global-drag-window-nologin{
    text-align: center;
    position:fixed;
    width: 100%;
    height: 23px;
    z-index: 999;
    -webkit-app-region: drag;
    // opacity:0.5;
    .global-top-btn {
      z-index: 999;
      float:right;
      height:23px;
      width:35px;
      line-height: 23px;
      padding-top:1px;
      background: #387FB5;
      -webkit-app-region: no-drag;
      &:hover {
        background: rgb(3, 84, 146);
        cursor: pointer;
      }
    }
    .set-top-btn {
      background:#00000000;
      &:hover {
        background: rgb(3, 84, 146);
        cursor: pointer;
      }
    }
    .global-top-btn-close {
      z-index: 999;
      float:right;
      height:24px;
      width:35px;
      line-height: 24px;
      background: #387FB5 url('../../assets/images/top-close-white.png') no-repeat 13px;
      -webkit-app-region: no-drag;
      &:hover {
        background: #FB1A2C  url('../../assets/images/top-close-white.png') no-repeat 13px;
        cursor: pointer;
      }
    }
  }
</style>
