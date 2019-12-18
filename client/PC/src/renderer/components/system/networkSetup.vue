<template>
  <div style="padding:10px;">
    <el-form size="small" label-width="70px" label-position="top"  @submit.native.prevent>
      <el-form-item label="消息服务地址">
        <input class="custom-input" v-model="wsServerAddress"/>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button size="mini" type="primary" @click="modifyWsServerAddr">修改</el-button>
    </div>
    <el-form size="small" label-width="70px" label-position="top"  @submit.native.prevent>
      <el-form-item label="其他服务地址">
        <input  class="custom-input" v-model="serverAddress"/>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button size="mini" type="primary" @click="modifyServerAddr">修改</el-button>
    </div>
    <div class="network-setup-tip"><span style="color:red;">*</span>修改服务地址，重启应用后生效</div>
  </div>
</template>

<script>
import { baseUrl, webSocketUrl } from '@/utils/url'

export default {
  name: 'change-password',
  data () {
    return {
      dialogVisible: false,
      serverAddress: '',
      wsServerAddress: ''
    }
  },
  props: ['isLogin'],
  methods: {
    onClose () {
      // this.$emit('update:changePasswordDialog', false)
    },
    // 修改服务地址
    modifyServerAddr () {
      // 写入存储位置，登录时从存储位置读取
      localStorage.setItem('global_server_address_db', this.serverAddress)
      if (this.isLogin && this.isLogin === 'yes') {
        localStorage.setItem('global_server_address_run', this.serverAddress)
      }

      // this.$message({
      //   message: '修改成功',
      //   type: 'info',
      //   customClass: 'network-message-tip'
      // })
    },
    // 修改消息服务地址
    modifyWsServerAddr () {
      localStorage.setItem('global_ws_server_address_db', this.wsServerAddress)
      if (this.isLogin && this.isLogin === 'yes') {
        localStorage.setItem('global_ws_server_address_run', this.wsServerAddress)
      }
      // this.$message({
      //   message: '修改成功',
      //   type: 'info',
      //   customClass: 'network-message-tip'
      // })
    }
  },
  mounted () {
    let serverAddr = localStorage.getItem('global_server_address_db')
    let wsServerAddr = localStorage.getItem('global_ws_server_address_db')
    // 先使用数据的配置
    // 再采用默认的配置
    if (serverAddr) {
      this.serverAddress = serverAddr
    } else {
      this.serverAddress = baseUrl()
    }
    if (wsServerAddr) {
      this.wsServerAddress = wsServerAddr
    } else {
      this.wsServerAddress = webSocketUrl()
    }
  }
}
</script>

<style lang="scss" scoped>
.vc-input {
  float: left;
  width: 190px;
}
.vc {
  width: 70px;
  height: 30px;
  line-height: 30px;
  float: right;
  border: solid 1px #CECECE;
  background-color: #F0F0F0;
  text-align: center;
  color: #007ACC;
}
.vc:hover {
  cursor: pointer;
}
.network-message-tip{
  width:100px;
}
.network-setup-tip{
  float: left;
  height: 25px;
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 16px;
}
.custom-input{
  height:30px;
  line-height: 30px;
  border:1px solid #EBEEF5;
  padding:2px 5px;
  width: 96%;
  border-radius: 5px;
}
</style>

