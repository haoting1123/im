<template>
  <el-dialog :visible.sync="dialogProps.visible" :append-to-body="true" top="5.1vh" width="530px" v-loading="showLoading" :modal="false" custom-class="system-setting-style">
    <div slot="title" class="dialog-header">{{ dialogProps.title }}</div>
    <el-form class="form" :model="channelModel"
      ref="channelForm" label-width="30px" label-position="right" size="small" @submit.native.prevent>
      <el-form-item label="">
        <el-col :span="22">
          <div class="user-list-container left-list">
            <div class="title">选择发送人员</div>
            <div class="search-container">
              <i class="el-icon-search"></i>
              <input placeholder="搜索" v-model="searchName" @input="searchMemberList($event)"/>
            </div>
            <ul>
              <li v-for="(item, index) in this.userList" :key="index" @click="selectUser(item, index)" v-if="item.jid !== userInfo.jid">{{ item.name }}<span>+</span></li>
            </ul>
          </div>
          <div class="user-list-container right-list">
            <div class="title">已选人员</div>
            <ul>
              <li v-for="(item, index) in this.channelModel.members" :key="index" @click="unselectUser(item, index)">{{ item.name }}<span>x</span></li>
            </ul>
          </div>
        </el-col>
      </el-form-item>
      <el-form-item label="" prop="purpose">
        <el-col :span="22">
          <el-input type="textarea" :rows="2" v-model="channelModel.message" placeholder="请输入消息内容...">
          </el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="doCloseDialog()">取 消</el-button>
      <el-button type="primary" size="small" @click="doSaveChannel()" :disabled="sendButtonDisabled" :loading="sending">发 送</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { outputError } from '@/utils/exception'
import { mapState, mapActions, mapMutations } from 'vuex'
let xss = require('xss')

export default {
  name: "send-group-message",
  props:['currentMemberList'],
  data() {
    return {
      showLoading: false,
      sendButtonDisabled: true,
      dialogProps: {
        visible: false,
        title: '群发消息'
      },
      channelModel : {
        members: [],
        message: ''
      },
      searchName:'',
      userList: [],
      userTotal: 0,
      sending: false,
      
    }
  },
  computed: {
    ...mapState({
      userInfo:  state => state.home.userInfo
    })
  },
  methods: {
    ...mapActions(['saveMessage']),
    doCloseDialog() {
      Object.assign(this.$data, this.$options.data())
      this.dialogProps.visible = false
    },
    selectUser(user, index) {
      let member = {
                jid: user.jid,
                alias: user.alias,
                name: user.name,
                index: index
              }
      // 列表为空则直接放入
      if(this.channelModel.members.length <= 0){
        this.channelModel.members.push(member)
      }
      // 判断是否已经存在
      let isExistsMember = this.channelModel.members.find(item => {
        return item.jid === user.jid
      })
      if (!isExistsMember) {
        this.channelModel.members.push(member)
      }
      this.userList.splice(index, 1)
    },
    unselectUser(user, index) {
        this.userList.splice(user.index, 0, {
          jid: user.jid,
          alias: user.alias,
          name: user.name
        })
        this.channelModel.members.splice(index, 1)
    },
    doSaveChannel() {
      let senderJid = this.userInfo.jid
      if (!senderJid) {
        this.$message.error('您不在线哟，请重新登录后发送!')
        return
      }
      
      // 循环调用发送接口
      let sendMessage = this.channelModel.message
      if(this.channelModel.members && this.channelModel.members.length > 0){
        // 判断会话是否存在
        this.channelModel.members.forEach(member => {
          if(senderJid !== member.jid){
            this.doBatchSendMessage(senderJid, sendMessage, member)
          }
        })
        this.dialogProps.visible = false
      }
    },
    doBatchSendMessage(senderJid, sendMessage, member){
      this.sending = true
      const newMessage = {
        channelId: member.jid,
        channelType: 'P',
        content: xss(sendMessage),
        senderId: senderJid,
        to: member.jid,
        createTime: new Date().getTime(),
        isBatch: 'yes'
      }
      this.saveMessage(newMessage)
        .then(response => {
          this.sending = false
          // 刷新消息列表
        })
        .catch(error => {
          this.sending = false
          console.log(error)
        })
        this.searchName = ''
    },
    doSearchUser() {
      // this.userList = []
      this.getUserList()
    },
    searchMemberList(event){
      let val = event.target.value
      if(!val){
        this.userList = JSON.parse(JSON.stringify(this.currentMemberList))
        return;
      }
      this.userList = this.currentMemberList.filter(element => {
        let reg = new RegExp(val)
        return reg.test(element.name)
      })
    }
  },
  updated() {
    this.$nextTick(() => {
      this.sendButtonDisabled = (this.channelModel.message.trim() === '' || this.channelModel.members.length == 0)
    })
  },
  watch: {
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openDialog', () => {
        this.userList = JSON.parse(JSON.stringify(this.currentMemberList))
        this.channelModel.members = []
        this.channelModel.message = ''
        // this.getUserList()
        this.dialogProps.visible = true
        this.sendButtonDisabled = true
        console.log(this.currentMemberList)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  .myheader{
    background-color: transparent;
    border-bottom: 1px solid #F0EEEA;
    color: #999;
    height: 60px;
    line-height: 60px;
    h3{
      padding-left: 20px;
    }
  }
.form {
  margin-top: -10px;
  padding: 2px 0 0 16px;
  border-bottom: solid 1px #F0EEEA;
}
.user-list-container {
  border: solid 1px #dcdfe6;
  width: 48%;
  border-radius: 4px;
  font-size: 13px;
  .title {
    height: 32px;
    text-align: center;
    /*font-weight: bold;*/
    background-color: #F0F0F0;
    border-bottom: solid 1px #dcdfe6;
    border-radius: 4px 4px 0 0;
  }
  .search-container {
    text-align: center;
    padding: 0;
    margin: 0;
    border-bottom: solid 1px #F0F0F0;
    input {
      margin: 0 0 0 4px;
      height: 22px;
      line-height: 22px;
      width: 155px;
      outline: 0;
      border: none;
      background-color: transparent;
      -webkit-appearance: textfield;
      -webkit-rtl-ordering: logical;
      cursor: text;
    }
    i {
      cursor: pointer;
      height: 22px;
      line-height: 22px;
    }
    input::-webkit-input-placeholder {
      color: #DDDBD7;
    }
    input::-moz-placeholder {   /* Mozilla Firefox 19+ */
      color: #DDDBD7;
    }
    input:-moz-placeholder {    /* Mozilla Firefox 4 to 18 */
      color: #DDDBD7;
    }
    input:-ms-input-placeholder {  /* Internet Explorer 10-11 */
      color: #DDDBD7;
    }
  }
  ul {
    padding: 0;
    margin: 0;
    overflow-y: auto;
    list-style-type: none;
    .load-more {
      text-align: center;
      font-size: 11px;
    }
    li {
      display: list-item;
      padding: 0 5px;
      margin: 0;
      span {
        font-weight: bold;
        float: right;
        display: none;
      }
    }
    li:hover {
      background-color: #F1EFEE;
      cursor: pointer;
    }
    li:hover span {
      display: block;
    }
  }
}
.left-list {
  float: left;
  ul {
    height: 200px;
  }
}
.right-list {
  float: right;
  ul {
    height: 232px;
  }
}

  .system-setting-style{
    border:1px solid #E4E7ED;
    -webkit-box-shadow: 0 0 10px #000;
    box-shadow: 0 0 8px rgba(0,0,0,.3) !important;
  }
</style>
