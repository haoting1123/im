<template>
  <el-container class="login-components">
    <el-main class="login-content-section">
      <div class="login-title">即时通</div>
      <div class="login-content-box">
        <div class="user-photo-box">
          <span
            style="display: inline-block; width: 75px; height: 75px; background: #fff; border-radius: 50%"
          >
            <img
              src="../../assets/images/login-head.png"
              style="height: 52px; width: 52px; margin-top:15px;"
              alt="icon"
            />
          </span>
        </div>
        <!--登录框-->
        <div class="form-box">
          <div @click="showAccountList" class="el-form-item">
            <img
              class="el-form-item-icon"
              src="../../assets/images/login-username-icon.png"
              style="height: 20px; width: 22px; display:inline-block;"
              alt="icon"
            />
            <el-popover placement="bottom" width="160" v-model="accountListVisible">
              <input
                slot="reference"
                placeholder="用户名"
                v-model="loginForm.username"
                class="input-list-item"
                type="text"
              />
              <ul v-if="accountList && accountList.length" class="account-list">
                <li
                  v-for="item in accountList"
                  :key="item.username"
                  class="account-list-item"
                  @click="useAccount(item)"
                >
                  <span>{{ item.username }}</span>
                  <i class="el-icon-circle-close" @click.stop="deleteLocalAccount(item)"></i>
                </li>
              </ul>
            </el-popover>
          </div>
          <div class="el-form-item">
            <img
              class="el-form-item-icon"
              src="../../assets/images/login-password-icon.png"
              style="height: 20px; width: 20px;"
              alt="icon"
            />
            <input
              class="input-list-item"
              type="password"
              placeholder="密码"
              @keyup.enter.native="login"
              v-model="loginForm.password"
            />
          </div>
        </div>
        <div class="button-box">
          <div class="password-opreation-box">
            <el-checkbox
              class="no-drag"
              v-model="savePasswordCheckbox"
              @change="savePasswordChange"
            >记住密码</el-checkbox>
            <el-checkbox class="no-drag" v-model="autoLoginCheckbox" @change="autoLoginChange">自动登录</el-checkbox>
            <!--<el-checkbox class="no-drag" v-model="savePasswordCheckbox">记住密码</el-checkbox>-->
            <!--<el-checkbox class="no-drag" v-model="autoLoginCheckbox">自动登录</el-checkbox>-->
          </div>
          <div class="login-box">
            <div>
              <el-button
                class="login-button"
                type="primary"
                :loading="loadingVisible"
                @click.native.prevent="startLogin"
              >登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
            </div>
            <!-- <div class="register-button">立即注册 >></div> -->
            <div class="reset-pass-button">
              <span @click="startForgetPassword">忘记密码</span>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <!--window窗口-->
    <window-frame :isLogin="true" :openSetup="openSetup"></window-frame>

    <!--忘记密码-->
    <el-dialog :visible.sync="forgetDialogFlag" :append-to-body="true" :modal="false" width="300px">
      <h3 slot="title" style="font-size: 14px;">忘记密码</h3>
      <el-form @submit.native.prevent>
        <el-form-item>
          <input v-model="accountNum" type="text" class="custom-input" placeholder="请输入账户号" />
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button
          type="primary"
          @click="forgetPassword"
          style="width: 100px; background: #77B3D7; border: none; border-radius: 20px"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="forgetNoticeDialogFlag"
      :append-to-body="true"
      :modal="false"
      width="300px"
    >
      <h3 slot="title" style="font-size: 14px;">联系管理员恢复使用</h3>
      <p v-if="adminTell">请联系: {{ adminTell }}</p>
      <p v-else style="text-indent: 2em">管理员尚未配置联系方式，请通过其他途径联系管理员恢复使用!</p>
    </el-dialog>

    <!--登录失败通知-->
    <div class="login-fail-notice-bg" v-if="showLoginFailFlag">
      <div class="login-fail-notice">
        <img
          src="../../assets/images/login-fail.png"
          alt="登录失败"
          style="width: 70px; height: 70px; margin-top: 20px;"
        />
        <p class="notice-message">{{ loginFailNotice }}</p>
      </div>
    </div>
    <el-dialog
      :visible.sync="networkDialogVisible"
      :append-to-body="true"
      :modal="false"
      width="300px"
    >
      <div slot="title" class="dialog-header">网络设置</div>
      <div class="list-container" style="margin-top:-40px;">
        <network-setup isLogin="yes"></network-setup>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
import { webSocketUrl } from '@/utils/url'
import networkSetup from '@/components/system/networkSetup'
// const sm2 = require('sm-crypto').sm2
// const sm3 = require('sm-crypto').sm3
// const SM4 = require('gm-crypt').sm4
// import {sm4utils, encryptData_ECB, decryptData_ECB} from '../../utils/smutils'
// const sm4utils = require('../../utils/smutils')
// require('@/utils/sm4')
// require('@/utils/byte&string')
export default {
  data () {
    return {
      loadingVisible: false,
      loginForm: {
        username: '',
        password: ''
      },
      savePasswordCheckbox: true,
      // 本地缓存的登录记录
      accountList: [],
      accountListVisible: false,
      // 登录失败提示信息
      loginFailNotice: '',
      showLoginFailFlag: false,
      networkDialogVisible: false,
      forgetDialogFlag: false,
      forgetNoticeDialogFlag: false,
      // 忘记密码的账户
      accountNum: '',
      adminTell: '',
      autoLoginCheckbox: false
    }
  },
  components: {
    windowFrame: require('@/components/common/windowFrame-component.vue').default,
    networkSetup
  },
  computed: {
    ...mapState({
      userInfo: state => state.home.userInfo,
      friendList: state => state.home.friendList,
      groupList: state => state.group.groupList,
      isAutoLogin: state => state.home.isAutoLogin
    })
  },
  created () {
    // window.localStorage.removeItem('accountList')
  },
  mounted () {
    // console.log('sm2非对称加密')
    // let keypair = sm2.generateKeyPairHex()
    // var publicKey = keypair.publicKey // 公钥
    // var privateKey = keypair.privateKey // 私钥
    // console.log('publicKey=========', publicKey)
    // console.log('privateKey=========', privateKey)
    // const cipherMode = 0 // 1 - C1C3C2，0 - C1C2C3，默认为1
    // var msgString = '对我加密啊aaa'
    // let encryptData = sm2.doEncrypt(msgString, publicKey, cipherMode) // 加密结果
    // console.log('sm2加密结果====', encryptData)
    // let decryptData = sm2.doDecrypt(encryptData, privateKey, cipherMode) // 解密结果
    // console.log('sm2解密结果====', decryptData)
    // console.log('sm2非对称加密结束')
    // let hashData = sm3('111111') // 杂凑
    // console.log('sm3杂凑算法=======', hashData)
    // console.log('sm4对称加密算法')
    // let sm4Config = {
    //   // encrypt/decypt main key; cannot be omitted
    //   key: 'JeF8U9wHFOMfs2Y8',
    //   // optional; can be 'cbc' or 'ecb'
    //   mode: 'cbc', // default
    //   // optional; when use cbc mode, it's necessary
    //   iv: 'UISwD9fW6cFh9SNS', // default is null
    //   // optional: this is the cipher data's type; Can be 'base64' or 'text'
    //   cipherType: 'base64' // default is base64
    // }
    // let sm4 = new SM4(sm4Config)
    // let plaintext = '中国国密加解密算法'
    // let ciphertext = sm4.encrypt(plaintext)
    // let plaintextSm4 = sm4.decrypt('8fff87812a6ff1165023662d4aad0bd58fb2d2095702798e281487117025c2a1')
    // console.log('对称加密算法加密========', ciphertext)
    // console.log('对称加密算法解密========', plaintextSm4)

    this.loginListener()
    setTimeout(() => {
      ipcRenderer.send('winShow') // 显示内容窗口
    }, 600)
    // 初始化网络配置
    this.initNetWork()
    // 初始化配置
    this.initData()
  },
  methods: {
    ...mapMutations([
      'SET_FRIENDLIST',
      'SET_GROUP_LIST'
    ]),
    ...mapActions([
      'Login',
      'LoginListener',
      'EnterGroup',
      'ForgetPassword'
    ]),
    // 初始化配置
    initData () {
      // 初始化自动登录
      let isAutoLogin = localStorage.getItem('global_is_auto_login')
      let savePass = localStorage.getItem('global_save_password')
      if (localStorage.getItem('accountList') && savePass === 'true') {
        let accountList = JSON.parse(localStorage.getItem('accountList'))
        if (ipcRenderer.sendSync('DecryptStr', accountList[0].password) === '解密失败') {
          localStorage.removeItem('accountList')
        } else {
          this.loginForm = accountList[0]
          this.loginForm.password = ipcRenderer.sendSync('DecryptStr', this.loginForm.password)
        }
      }
      if (isAutoLogin === 'true') {
        this.autoLoginCheckbox = true
        this.savePasswordCheckbox = true
        // 进行自动登录(默认使用本地账户列表中的第一个账户)
        if (this.loginForm.username && this.loginForm.password) this.doAutoLogin()
      } else {
        // 保存密码
        if (savePass === 'true') {
          this.savePasswordCheckbox = true
        } else {
          this.savePasswordCheckbox = false
        }
        this.autoLoginCheckbox = false
      }
    },
    autoLoginChange (val) {
      if (val) {
        this.savePasswordCheckbox = true
        localStorage.setItem('global_save_password', true)
      }
      // console.log(val)
      localStorage.setItem('global_is_auto_login', val)
    },
    // 保存密码才能自动登录，不保存密码肯定不能自动登录
    savePasswordChange (val) {
      if (!val) {
        this.autoLoginCheckbox = false
        localStorage.setItem('global_is_auto_login', false)
      }
      localStorage.setItem('global_save_password', val)
    },
    // 删除本地存储账号
    deleteLocalAccount (account) {
      let accountList = JSON.parse(localStorage.getItem('accountList'))
      let result = accountList.filter(item => {
        return account.username !== item.username
      })
      this.accountList = result
      localStorage.setItem('accountList', JSON.stringify(result))
    },
    // 忘记密码
    startForgetPassword () {
      this.forgetDialogFlag = true
    },
    forgetPassword () {
      this.forgetDialogFlag = false
      this.ForgetPassword(this.accountNum)
        .then(data => {
          this.forgetNoticeDialogFlag = true
          if (data.phone) this.adminTell = data.phone
          this.accountNum = ''
        })
        .catch(() => {
          this.accountNum = ''
          this.showLoginFailFlag = true
          this.loginFailNotice = '账户错误!'
          setTimeout(() => {
            this.showLoginFailFlag = false
          }, 1000)
        })
    },
    // 进行自动登录
    doAutoLogin () {
      this.startLogin()
    },
    // 准备登录
    startLogin () {
      this.debouce(this.login, 100)()
    },
    openSetup () {
      this.networkDialogVisible = true
    },
    // 监听用户登录
    loginListener () {
      this.LoginListener(data => {
        if (data === 'success') {
          if (this.savePasswordCheckbox) this.setAccountList()
          // 默认进群操作
          this.groupList.forEach(item => {
            this.EnterGroup({
              userJid: this.userInfo.jid,
              groupJid: item.jid
            })
          })
          ipcRenderer.send('setContentWindowSize') // 显示内容窗口
          this.$router.push('/')
          // return
        }
        // this.$message({
        //   type: 'error',
        //   message: '账号或密码错误!'
        // })
      })
    },
    // 用户登录
    login () {
      if (!this.loginForm.username.replace(/\s/g, '') && !this.loginForm.password.replace(/\s/g, '')) return
      this.loadingVisible = true
      //var声明的变量是全局变量，会发生“变量提升”现象
      //es6新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效
      //const声明一个只读的常量。一旦声明，常量的值就不能改变。
      const credentials = { service: webSocketUrl(), username: this.loginForm.username, password: this.loginForm.password }
      sessionStorage.setItem('token', 'tokentokenxxxxxxxxxxxx' + new Date().getTime())
      this.Login({
        xmpp: credentials,
        loginData: {
          username: this.loginForm.username,
          password: this.loginForm.password,
          terminal: 'SyntoIM-PC'
        }
      })
        .then(data => {
          // TODO: 缓存账户信息
          const account = {
            username: this.loginForm.username,
            password: ipcRenderer.sendSync('EncryptStr', this.loginForm.password)
          }
          window.localStorage.setItem('account', JSON.stringify(account))
        })
        .catch(err => {
          console.log('登录失败===============', err)
          this.loadingVisible = false
          this.showLoginFailFlag = true
          this.loginFailNotice = err.data
          setTimeout(() => {
            this.showLoginFailFlag = false
          }, 1500)
        })
    },
    // 设置可用账户列表
    setAccountList () {
      let data = []
      let account = JSON.parse(JSON.stringify(this.loginForm))
      if (JSON.parse(window.localStorage.getItem('accountList')) && JSON.parse(window.localStorage.getItem('accountList')).length) {
        data = JSON.parse(window.localStorage.getItem('accountList'))
        if (data.some(item => { return item.username === this.loginForm.username })) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].username === this.loginForm.username) {
              data.splice(i, 1)
              account.password = ipcRenderer.sendSync('EncryptStr', account.password)
              // data.unshift(this.loginForm)
              data.unshift(account)
              break
            }
          }
        } else {
          account.password = ipcRenderer.sendSync('EncryptStr', account.password)
          // data.unshift(this.loginForm)
          data.unshift(account)
          // data.unshift(this.loginForm)
        }
        window.localStorage.setItem('accountList', JSON.stringify(data))
      } else {
        account.password = ipcRenderer.sendSync('EncryptStr', account.password)
        data.push(account)
        // data.push(this.loginForm)
        window.localStorage.setItem('accountList', JSON.stringify(data))
      }
    },
    showAccountList () {
      this.accountList = JSON.parse(window.localStorage.getItem('accountList'))
      console.log(this.accountList)
      this.accountListVisible = false
      if (this.accountList && this.accountList.length) this.accountListVisible = true
    },
    // 使用记录账户登录
    useAccount (account) {
      account.password = ipcRenderer.sendSync('DecryptStr', account.password)
      this.loginForm = account
      this.accountListVisible = false
    },
    // 初始化网络设置
    initNetWork () {
      let serverAddr = localStorage.getItem('global_server_address_db')
      let wsServerAddr = localStorage.getItem('global_ws_server_address_db')
      if (serverAddr) {
        localStorage.setItem('global_server_address_run', serverAddr)
      }
      if (wsServerAddr) {
        localStorage.setItem('global_ws_server_address_run', wsServerAddr)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login-components {
  // border-radius: 6px;
  height: 100%;
  background: #387fb5;
  .login-content-section {
    position: relative;
    width: 400px;
    text-align: center;
    // padding: 0 66px;
    .login-title {
      font-size: 12px;
      position: fixed;
      top: 0;
      left: 0;
      color: #dcdfe6;
      line-height: 25px;
      margin-left: 10px;
    }
    .login-content-box {
      margin: 60px 0 0 0;
    }
    .user-photo-box {
      text-align: center;
    }
    .form-box {
      margin-top: 60px;
      padding-left: 33px;
      .el-form-item {
        display: flex;
        align-items: center;
        text-align: center;
        margin-bottom: 10px;
        background: #ffffff;
        width: 220px;
        height: 40px;
        line-height: 40px;
        border-radius: 40px;
        overflow: hidden;
        .el-form-item-icon {
          margin: 0 10px;
        }
        .input-list-item {
          flex: 1;
          height: 40px;
          border: none;
          outline: none;
        }
      }
    }
    .button-box {
      .password-opreation-box {
        width: 220px;
        text-align: left;
        padding-left: 45px;
        justify-content: space-between;
        height: 30px;
        line-height: 30px;
        color: #ffffff;
        .el-checkbox__label,
        strong {
          font-size: 13px;
          font-weight: normal;
          cursor: pointer;
          color: #ffffff;
        }
      }
      .login-box {
        margin-top: 14px;
        .el-button {
          width: 100%;
          height: 31px;
          line-height: 31px;
          padding: 0;
          background: rgba(72, 134, 255, 1);
          border-radius: 16px;
        }
        .register-button {
          margin-top: 5px;
          font-size: 12px;
          text-align: center;
          color: #ffaa00;
        }
        .login-button {
          margin-top: 30px;
          background: #77b3d7;
          border: none;
          height: 40px;
          border-radius: 40px;
          width: 220px;
          font-size: 15px;
        }
        .reset-pass-button {
          margin-top: 20px;
          font-size: 13px;
          text-align: center;
          color: #f2f6fc;
          span {
            cursor: pointer;
          }
        }
      }
    }
  }
}
.account-list {
  max-height: 100px;
  overflow: auto;
  .account-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    &:hover {
      background: #f7f7f7;
    }
  }
}
.custom-input {
  height: 30px;
  line-height: 30px;
  border: 1px solid #f2f6fc;
  padding: 2px 5px;
  width: 100%;
  border-radius: 5px;
}
.login-fail-notice-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  color: #fff;

  z-index: 9998;
  .login-fail-notice {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 130px;
    box-shadow: 0px 0px 10px rgba($color: #000000, $alpha: 0.5);
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    background: white;
    border-radius: 5px;
    background: rgba($color: #666666, $alpha: 0.9);
    .notice-message {
      font-size: 13px;
    }
  }
}
</style>
