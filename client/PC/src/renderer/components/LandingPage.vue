<template>
  <div id="wrapper">
    <el-input v-model="username" placeholder="请输入用户名"></el-input>
    <el-input v-model="password" placeholder="请输入密码"></el-input>
    <el-button type="primary" @click="doLogin">登录</el-button>
    <hr/>
    <el-input v-model="toUser" placeholder="请输入对方地址"></el-input>
    <el-input v-model="message" placeholder="请输入消息"></el-input>
    <el-button type="primary" @click="doSendMessage">发送</el-button>
    <hr/>
    收到的消息：<br/>
    <div v-for="(item, index) in messageList" :key="index">
      {{item}}<br/>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  // import { sendPrivateMessage, privateMessageListener, registerEventKey } from '@/api/message'
  import { sendPrivateMessage, privateMessageListener } from '@/api/message'
  const config = require('@/config')

  export default {
    name: 'landing-page',
    data () {
      return {
        username: 'admin',
        password: '123456',
        toUser: 'lis@192.168.1.110',
        message: '',
        messageList: ''
      }
    },
    methods: {
      doLogin () {
        console.log(process.env.NODE_ENV)
        console.log(config.env.WEBSOCKET_URL)
        const credentials = { service: config.env.WEBSOCKET_URL, username: this.username, password: this.password }
        ipcRenderer.send('registerXmppClient', credentials)
        ipcRenderer.on('setup-listener', (_, data) => {
          console.log('设置监听函数')
          this.listenerPrivateMessage()
        })
      },
      doSendMessage () {
        // registerEventKey('message:chat:' + this.toUser)
        sendPrivateMessage({message: this.message, to: this.toUser})
        // this.listenerPrivateMessage()
      },
      listenerPrivateMessage () {
        privateMessageListener(this.toUser, (message) => {
          console.log('listener::', message)
          this.messageList = [...this.messageList, message]
        })
      }
    }
  }
</script>

<style>

</style>
