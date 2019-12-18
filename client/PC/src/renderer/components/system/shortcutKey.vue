<template>
    <div>
        <el-form class="about" label-width="90px" label-position="right" size="small"  @submit.native.prevent>
            <el-form-item label="发送消息" style="color: #333;">
                <!--<el-button size="mini">{{sendMessageKey}}</el-button>-->
                <el-radio-group v-model="sendMessageKey" @change="sendMessageKeyChange">
                  <el-radio :label="1">Enter</el-radio>
                  <el-radio :label="2">Ctrl + Enter</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="提取新消息" style="color: #333;">
                <!--<el-button size="mini">{{openIMWindow}}</el-button>-->
                {{openIMWindow}}
            </el-form-item>
            <el-form-item label="截图" style="color: #333;">
                <!--<el-button size="mini">{{sendMessageKey}}</el-button>-->
                {{captureKey}}
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import Cookie from '@/utils/cookie'
    const ipcRenderer = require('electron').ipcRenderer

    export default {
      name: 'shortcut-key',
      data () {
        return {
          sendMessageKey: 1,
          openIMWindow: 'Ctrl + Alt + M',
          captureKey: 'Ctrl + Alt + Q'
        }
      },
      methods: {
        handleDialogOpen () {
          let hotkey = Cookie.getCookies('im_shortcut_send_msg_key')
          if (hotkey) {
            this.sendMessageKey = parseInt(hotkey)
          }
          if (Cookie.getCookies('im_shortcut_open_win_key')) {
            this.openIMWindow = Cookie.getCookies('im_shortcut_open_win_key')
          }
          if (Cookie.getCookies('im_shortcut_capture_key')) {
            this.captureKey = Cookie.getCookies('im_shortcut_capture_key')
          }
          // ipcRenderer.send('hotKey', this.openIMWindow, '');
        },
        hotKeyReply () {
          var that = this
          ipcRenderer.on('hotKeyReply', function (event, arg) {
            console.log('hotKeyReply:::', arg)
            if (arg) {
              that.$message.error('热键与其他应用冲突，请重新设置')
            }
          })
        },
        sendMessageKeyChange (val) {
          console.log(val)
          Cookie.setCookie('im_shortcut_send_msg_key', val)
        }
      },
      mounted: function () {
        this.$nextTick(() => {
          this.handleDialogOpen()
          // this.hotKeyReply()
        })
      }
    }
</script>

<style lang="scss" scoped>
    .about {
        padding-top: 50px;
        padding-left: 80px;
    }

</style>

