<template>
  <el-dialog
    :visible="showUserInfoDialog"
    @close="onClose"
    top="10vh"
    :modal="false"
    width="530px"
    custom-class="system-setting-style"
  >
    <div slot="title" class="dialog-header">系统设置</div>
    <el-tabs tab-position="left" style="height: 400px; margin-top:-20px;">
      <el-tab-pane label="个人资料">
        <el-form
          ref="newUserInfo"
          label-width="60px"
          :model="newUserInfo"
          :rules="rules"
          @submit.native.prevent
        >
          <el-form-item label="姓名" prop="name">
            <input v-model="newUserInfo.name" class="custom-input" style="width:250px;">
          </el-form-item>
          <el-form-item label="性别 " prop="sex">
            <el-radio-group v-model="newUserInfo.sex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="头像 ">
            <div class="img-upload-box">
              <!--<img-->
                <!--v-if="newUserInfo.photo"-->
                <!--style="width: 100px; height: 100px;"-->
                <!--:src="newUserInfo.photo"-->
                <!--class="avatar"-->
              <!--&gt;-->
              <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
              <!--<input-->
                <!--type="file"-->
                <!--id="upload-img"-->
                <!--class="upload-img"-->
                <!--name="image"-->
                <!--title=" "-->
                <!--@change="shangc($event)"-->
                <!--accept="image/jpg, image/jpeg, image/png"-->
              <!--&gt;-->
              <el-upload
                class="avatar-uploader"
                :action="baseUrl + '/syntoim/rest/file/uploadphoto'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :multiple="false"
                :before-upload="handleAvatarBeforeUpload"
              >
                <img v-if="newUserInfo.photo" :src="newUserInfo.photo" class="avatar" style="width: 100%; height: 100%;">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px; text-align: center">
          <el-button size="mini" type="primary" @click="updateUserInfo">修改</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="常规设置">
        <div style="padding:10px;">
          <el-form size="small" label-width="120px" label-position="top" @submit.native.prevent>
            <el-form-item label="即时消息提醒" style="padding:0;">
              <el-checkbox
                v-model="messageTipType"
                label="新消息通知"
                style="margin: 0 0 0 20px;"
                @change="messageTipTypeChange"
              ></el-checkbox>
            </el-form-item>
            <el-form-item label="系统消息提醒" style="padding:0;">
              <el-checkbox
                v-model="sysMessageTipType"
                label="新消息通知"
                style="margin: 0 0 0 20px;"
                @change="sysMessageTipTypeChange"
              ></el-checkbox>
            </el-form-item>
            <el-form-item label="系统启动登录" style="padding:0;">
              <!-- <el-checkbox v-model="sysStartType" style="margin: 0 0 0 20px;">开机自启动</el-checkbox><br> -->
              <el-checkbox
                v-model="isAutoLogin"
                :disabled="isAutoLoginDisabled"
                style="margin: 0 0 0 20px;"
                @change="isAutoLoginChange"
              >启动时自动登录</el-checkbox>
              <p
                v-if="isAutoLoginDisabled"
                style="font-size: 12px; color: orange;"
              >提示:记住密码才可以设置系统自动登录!</p>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="网络设置">
        <network-setup></network-setup>
      </el-tab-pane>
      <el-tab-pane label="音频设置">
        <div style="padding:10px;">
          音量设置
          <div style="padding:5px;">
            <el-slider v-model="volumeInt" :step="10" @change="volumeChange"></el-slider>
          </div>消息提示音
          <div style="padding:10px 8px 8px 8px;">
            <el-radio-group v-model="selectedVoice" @change="voiceChange">
              <el-radio :label="1">音效1</el-radio>
              <el-radio :label="2">音效2</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="热键设置">
        <shortcut-key></shortcut-key>
      </el-tab-pane>
      <el-tab-pane label="文件设置">
        <div class="fileSetting" style="padding:10px;">
          <el-form size="small" label-width="70px" label-position="top" @submit.native.prevent>
            <el-form-item label="文件传输路径">
              <input v-model="fileDownloadPath" class="custom-input" style="width:280px;">
              <el-button
                size="mini"
                type="primary"
                @click="qtDownloadPath"
                style="margin-left:5px;"
              >更改</el-button>
            </el-form-item>
          </el-form>
          <el-form size="small" label-width="70px" label-position="top" @submit.native.prevent>
            <el-form-item label="文件导出路径">
              <input v-model="backupPath" style="width:280px;" class="custom-input">
              <el-button
                size="mini"
                type="primary"
                @click="qtBackupPath"
                style="margin-left:5px;"
              >更改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="聊天设置">
        <div style="padding:10px;">
          <el-checkbox
            v-model="messageRecordRemoteSave"
            style="margin: 5px 0;"
            @change="messageRecordRemoteSaveChange"
          >聊天记录不在服务器保存</el-checkbox>
        </div>
        <div style="padding:10px;">
           服务器端聊天记录占用大小
        </div>
        <div style="padding:10px 10px 10px 30px; color:black;">
          {{ useMessageArea }} 条 / {{ totalMessageArea }} 万条
           <el-button
            @click="onDelRemoteMessage"
            size="mini"
            type="danger"
            style="width:70px; margin-left:30px;"
          >清空</el-button>
        </div>
        <div style="padding:10px;">
           服务器端文件空间占用大小
        </div>
        <div style="padding:10px 10px 10px 30px; color:black;">
          {{ useFileArea }} / {{ totalFileArea }}
           <el-button
            @click="onDelRemoteFile"
            size="mini"
            type="danger"
            style="width:70px; margin-left:30px;"
          >清空</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="退出设置">
        <div style="padding:10px;">
          <el-checkbox
            v-model="quitType"
            style="margin: 5px 0;"
            @change="quitTypeChange"
          >关闭主面板时，退出程序</el-checkbox>
        </div>
      </el-tab-pane>
      <el-tab-pane label="关于">
        <about-info :badgeShow="badgeShow" ref="aboutInfoDlg"></about-info>
        <div style="width:100%; text-align:center;">
          <el-button
            :disabled="downloadFile"
            @click="onCheckUpdate"
            size="mini"
            style="color:#000; width:100px;"
          >检查更新</el-button>
        </div>
        <div style="padding:35px 0 0 10px;" v-if="processShow">
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="percent"
            status="success"
          ></el-progress>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { baseUrl } from '@/utils/url'
import * as myDate from '@/utils/date'
import { validatorSpace } from '@/utils/validateData'
import aboutInfo from '@/components/system/aboutInfo'
import shortcutKey from '@/components/system/shortcutKey'
import networkSetup from '@/components/system/networkSetup'
import Cookie from '@/utils/cookie'
import { ipcRenderer, remote } from 'electron'
import pkg from '../../../../package.json'
import {outputError} from '@/utils/exception'
const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')

export default {
  props: ['showUserInfoDialog'],
  data () {
    return {
      newUserInfo: {
        name: '',
        sex: '男',
        photo: ''
      },
      downloadFile: false,
      fileDownloadPath: '',
      processShow: false,
      percent: 0,
      badgeShow: false,
      backupPath: '',
      soundValue: 50,
      rules: {
        name: [{ required: true, validator: validatorSpace, trigger: 'blur' }]
      },
      selectedVoice: 1,
      messageTipType: [],
      sysMessageTipType: [],
      sysStartType: '',
      volumeInt: 100,
      isAutoLogin: false,
      messageRecordRemoteSave: false,
      selectFolderPathTag: '',
      downloadUrl: '',
      systemOSType: '',
      saveFilePath: '',
      folderSuffix: '\\',
      isAutoLoginDisabled: true,
      workerProcess: '',
      cmdPath: '',
      cmdStr: 'sudo rpm -ivh --force ',
      saveAppPath: '',
      baseUrl: baseUrl(),
      totalFileArea: '0MB',
      totalMessageArea: '0',
      useFileArea: '0MB',
      useMessageArea: '0',
      quitType: false
    }
  },
  components: {
    aboutInfo,
    shortcutKey,
    networkSetup
  },
  computed: {
    ...mapState({
      userInfo: state => state.home.userInfo,
      remoteUseArea: state => state.message.remoteUseArea // 服务端文件占用情况
    })
  },
  mounted () {
    // 获取系统环境
    this.getSystemOSType()
    if (this.systemOSType === 'Linux') {
      this.folderSuffix = '/'
    }
    // 监控下载进度
    this.processInfo()
    // 检查更新
    // this.onCheckUpdate()
    // 获取下载及备份路径
    let downloadPath = Cookie.getDownloadPath()
    if (downloadPath) {
      this.fileDownloadPath = downloadPath
      // eslint-disable-next-line node/no-deprecated-api
      fs.exists(this.fileDownloadPath, function (exists) {
        if (!exists) {
          fs.mkdir(this.fileDownloadPath)
        }
      })
    }
    let backupPaths = Cookie.getCookies('im_backup_path')
    if (backupPaths) {
      this.backupPath = backupPaths
      // eslint-disable-next-line node/no-deprecated-api
      fs.exists(this.backupPath, function (exists) {
        if (!exists) {
          fs.mkdir(this.backupPath)
        }
      })
    } else {
      this.backupPath = Cookie.getExportPath()
      Cookie.setCookie('im_backup_path', this.backupPath)
    }
    if (this.userInfo.name) this.newUserInfo = { ...this.userInfo }
    let volume = localStorage.getItem('global_tip_volume')
    if (volume && volume > -1) {
      this.volumeInt = parseInt(volume)
    }
    let voice = localStorage.getItem('global_tip_voice')
    if (voice) {
      this.selectedVoice = parseInt(voice)
    }
    let isNoticeMessage = localStorage.getItem('global_is_notice_message')
    if (isNoticeMessage === 'false') {
      this.messageTipType = false
    } else {
      this.messageTipType = true
    }
    isNoticeMessage = localStorage.getItem('global_is_auto_login')
    if (isNoticeMessage === 'false') {
      this.isAutoLogin = false
    } else if (isNoticeMessage) {
      this.isAutoLogin = true
    }
    isNoticeMessage = localStorage.getItem('global_sys_message_tip_type')
    if (isNoticeMessage === 'false') {
      this.sysMessageTipType = false
    } else {
      this.sysMessageTipType = true
    }
    isNoticeMessage = localStorage.getItem('global_message_remote_save')
    if (isNoticeMessage === '0') {
      this.messageRecordRemoteSave = true
    } else {
      this.messageRecordRemoteSave = false
    }
    // 获取是否记住密码
    isNoticeMessage = localStorage.getItem('global_save_password')
    if (isNoticeMessage === 'true') {
      this.isAutoLoginDisabled = false
    } else {
      this.isAutoLoginDisabled = true
    }
    // 退出方式
    let qt = localStorage.getItem('global_quit_type')
    if (!qt || qt === 'close') {
      this.quitType = false
    } else {
      this.quitType = true
    }
    this.initGetRemoteAreaInfo()
  },
  methods: {
    ...mapMutations([
      'SET_IS_PLAY_SOUND',
      'SET_IS_PLAY_AUDIO'
    ]),
    ...mapActions([
      'UpdateUserInfo',
      'GetUserInfo',
      'SaveSessionRecordToService',
      'GetVersionInfo',
      'getRemoteAreaInfo',
      'resetRemoteMessageArea',
      'resetRemoteFileArea'
    ]),
    // 获取远端服务端的占用情况
    initGetRemoteAreaInfo () {
      this.getRemoteAreaInfo(this.userInfo.account).then(() => {
        let remoteAreaInfo = this.remoteUseArea
        let remoteMessageCount = (remoteAreaInfo.storageMsgCount ? remoteAreaInfo.storageMsgCount : 0)
        let remoteFileAreaInfo = (remoteAreaInfo.storageFileUpSize ? remoteAreaInfo.storageFileUpSize : 0)
        let remoteMessageUnit = localStorage.getItem('global_remote_area_unit')
        if (!remoteMessageUnit) {
          remoteMessageUnit = 10000
        }
        let remoteTotalFileArea = localStorage.getItem('global_file_remote_area')
        if (remoteTotalFileArea) {
          this.totalFileArea = remoteTotalFileArea + 'MB'
        } else {
          this.totalFileArea = '0MB'
          remoteTotalFileArea = 0
        }
        let remoteTotalMessageArea = localStorage.getItem('global_message_remote_area')
        if (remoteTotalMessageArea) {
          this.totalMessageArea = remoteTotalMessageArea
        } else {
          this.totalMessageArea = '0'
          remoteTotalMessageArea = 0
        }
        let useMessageAreaTemp = remoteMessageCount
        if (remoteTotalMessageArea && useMessageAreaTemp && useMessageAreaTemp > (remoteTotalMessageArea * remoteMessageUnit)) {
          useMessageAreaTemp = (remoteTotalMessageArea * remoteMessageUnit)
        }
        if (remoteTotalFileArea && remoteFileAreaInfo > remoteTotalFileArea) {
          remoteFileAreaInfo = remoteTotalFileArea
        }
        this.useMessageArea = useMessageAreaTemp
        this.useFileArea = remoteFileAreaInfo + 'MB'
      })
    },
    // 删除远端消息记录
    onDelRemoteMessage () {
      this.$confirm('此操作将从服务器永久删除消息记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetRemoteMessageArea(this.userInfo.account).then(data => {
          this.useMessageArea = '0'
        })
      }).catch(() => {
      })
    },
    // 删除远端文件记录
    onDelRemoteFile () {
      this.$confirm('此操作将从服务器永久删除文件记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetRemoteFileArea(this.userInfo.account).then(data => {
          this.useFileArea = '0MB'
        })
      }).catch(() => {
      })
    },
    formatFileSizeUnit (size) {
      return myDate.formatFileSizeUnit(size)
    },
    // 执行命令
    runExec (cmdStr) {
      // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
      this.workerProcess = exec(cmdStr)
      // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
      // 打印正常的后台可执行程序输出
      this.workerProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data)
      })
      // 打印错误的后台可执行程序输出
      this.workerProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data)
      })
      // 退出之后的输出
      this.workerProcess.on('close', function (code) {
        console.log('out code：' + code)
      })
    },
    // 检查版本
    onCheckUpdate () {
      console.log('检查版本更新')
      let that = this
      var savePath = remote.app.getPath('desktop') + '/imdownload/'
      // eslint-disable-next-line node/no-deprecated-api
      fs.exists(savePath, function (exists) {
        console.log('exists======', exists)
        if (!exists) {
          fs.mkdir(savePath)
        }
      })
      this.saveAppPath = savePath
      // eslint-disable-next-line no-unused-vars
      let sysTypeInfo = ''
      if (this.systemOSType === 'Windows') {
        sysTypeInfo = 'windows'
      } else if (this.systemOSType === 'Linux') {
        sysTypeInfo = 'mips'
      }

      console.log('检查版本更新', this.systemOSType)
      this.GetVersionInfo(sysTypeInfo).then(response => {
        let serverVersionData = response.data
        console.log('检查版本更新3', serverVersionData)
        // 判断是否有新版本
        console.log('有新版本了serverVersionData', serverVersionData.version)
        console.log('有新版本了pkg', pkg.version)
        if (serverVersionData.version > pkg.version) {
          that.downloadFile = false
          that.downloadUrl = serverVersionData.updateUrl
          // 判断存储目录是否存在
          let fileNameArr = that.downloadUrl.split('/')
          let fileName = fileNameArr[fileNameArr.length - 1]
          console.log('有新版本了', serverVersionData.version)
          that.saveFilePath = path.join(savePath, fileName)
          // that.writeFileInfo()// 生成脚本文件
          // 判断该目录下是否已下载最新安装包
          // eslint-disable-next-line node/no-deprecated-api
          fs.exists(that.saveFilePath, function (exists) {
            console.log('exists======', exists)
            if (!exists) {
              console.log('文件不存在，自动下载更新')
              // 如果文件不存在则自动下载更新 0.
              console.log('下载路径===============', that.downloadUrl)
              console.log('判断存储路径是否存在=======', savePath)
              that.processShow = true
              ipcRenderer.send('downloadApp', that.downloadUrl + ',' + savePath)
            } else {
              // 文件存在则自动打开安装
              console.log('文件存在，自动打开安装=======', that.saveFilePath)
              that.installApp()
            }
          })
        } else if (serverVersionData.version === pkg.version) {
          that.badgeShow = true
          // 判断存储目录是否存在
          // eslint-disable-next-line node/no-deprecated-api
          fs.exists(savePath, function (exist) {
            // 如果版本号相同，删除该目录下的所有文件
            if (exist) {
              console.log('如果版本号相同，删除该目录下的所有文件', savePath)
              that.deleteall(savePath)
            }
          })
        }
      }).catch(error => {
        outputError(this, error)
      })
    },
    getSystemOSType () {
      let iUserAgent = navigator.userAgent
      console.log('sUserAgent', iUserAgent)
      this.systemOSType = 'Linux'
      if (iUserAgent.indexOf('Linux') !== -1) {
        this.systemOSType = 'Linux'
      } else if (iUserAgent.indexOf('Windows') !== -1) {
        this.systemOSType = 'Windows'
      } else if (iUserAgent.indexOf('Android') !== -1) {
        this.systemOSType = 'Android'
      } else if (iUserAgent.indexOf('iPhone') !== -1) {
        this.systemOSType = 'iPhone'
      } else if (iUserAgent.indexOf('SymbianOS') !== -1) {
        this.systemOSType = 'SymbianOS'
      } else if (iUserAgent.indexOf('iPad') !== -1) {
        this.systemOSType = 'iPad'
      } else if (iUserAgent.indexOf('iPod') !== -1) {
        this.systemOSType = 'iPod'
      } else if (iUserAgent.indexOf('iPod') !== -1) {
        this.systemOSType = 'iPod'
      }
    },
    // 聊天记录不在服务器保存
    messageRecordRemoteSaveChange (val) {
      this.SaveSessionRecordToService({
        username: this.userInfo.jid.split('@')[0],
        chatLogStorage: val ? '0' : '1'
      })
        .then(data => {
          if (data.code === 0) {
            localStorage.setItem('global_message_remote_save', val ? '0' : '1')
          } else {
            this.messageRecordRemoteSave = !val
          }
        })
        .catch(err => {
          console.log(err)
          this.messageRecordRemoteSave = !val
        })
    },
    quitTypeChange (val) {
      if (val) {
        localStorage.setItem('global_quit_type', 'real_close')
      } else {
        localStorage.setItem('global_quit_type', 'close')
      }
    },
    // 消息提醒方式
    messageTipTypeChange (val) {
      console.log(val)
      localStorage.setItem('global_is_notice_message', val)
      this.SET_IS_PLAY_SOUND(!val)
    },
    // 系统消息提醒方式
    sysMessageTipTypeChange (val) {
      console.log(val)
      localStorage.setItem('global_sys_message_tip_type', val)
    },
    // 是否自动登录
    isAutoLoginChange (val) {
      console.log(val)
      localStorage.setItem('global_is_auto_login', val)
    },
    // 音量修改
    volumeChange (val) {
      console.log(val)
      localStorage.setItem('global_tip_volume', val)
    },
    // 音效修改
    voiceChange (val) {
      console.log(val)
      localStorage.setItem('global_tip_voice', val)
      this.SET_IS_PLAY_AUDIO(true)
    },
    // 监控下载进度
    processInfo: function () {
      let that = this
      ipcRenderer.on('process', function (event, processNum) {
        if (processNum) {
          that.percent = parseInt(processNum.toFixed(2) * 100)
          that.percent = parseInt(that.percent.toFixed(0))
          console.log('that.percent=====', that.percent)
          if (that.percent === 100 && that.processShow === true) {
            that.processShow = false
            setTimeout(() => {
              that.percent = 0
              that.installApp()
            }, 2000)
          }
        }
      })
    },
    installApp () {
      let openFolder = 'openFile'
      if (this.systemOSType === 'Windows') {
        openFolder = 'openFile'
      } else if (this.systemOSType === 'Linux') {
        openFolder = 'openFolder'
      }
      this.$confirm('您是否要现在安装最新版本？', '提示', {
        type: 'warning'
      })
        .then(_ => {
          console.log('执行安装命令===============static/mips_run.sh')
          ipcRenderer.send(openFolder, this.saveFilePath)
          setTimeout(() => {
            // 退出程序
            ipcRenderer.send('exitProcess')
          }, 1000)
        })
        .catch(error => {
          outputError(this, error)
        })
    },
    // appDownload () {
    //   console.log('更新版本')
    //   if (this.saveFilePath !== '') {
    //     // 文件存在则自动打开安装
    //     console.log('this.saveFilePath===========', this.saveFilePath)
    //     ipcRenderer.send('openFile', this.saveFilePath)
    //   }
    // },
    // 写入文件
    writeFileInfo () {
      let data = 'sudo rpm -ivh --force ' + this.saveFilePath
      console.log('开始写入文件=====', data)
      // options：flag：对写入文件的操作默认为w，encoding：编码，mode：权限
      fs.writeFile('static/mips_run.sh', data, {lag: 'w', encoding: 'utf-8', mode: '0666'}, function (err) {
        if (err) {
          console.log('文件写入失败')
        } else {
          console.log('文件写入成功')
        }
      })
    },
    // 设置备份路径
    qtBackupPath () {
      ipcRenderer.once('choiceDownloadFolderReply', (event, arg) => {
        console.log('choiceDownloadFolderReply', arg)
        if (arg != null) {
          this.backupPath = arg[0] + this.folderSuffix
          Cookie.setCookie('im_backup_path', this.backupPath)
          // eslint-disable-next-line node/no-deprecated-api
          fs.exists(this.backupPath, function (exists) {
            if (!exists) {
              fs.mkdir(this.backupPath)
            }
          })
        }
      })
      ipcRenderer.send('choiceDownloadFolder', this.backupPath)
    },
    // 设置下载路径
    qtDownloadPath () {
      ipcRenderer.once('choiceDownloadFolderReply', (event, arg) => {
        console.log('choiceDownloadFolderReply', arg)
        if (arg != null) {
          this.fileDownloadPath = arg[0] + this.folderSuffix
          Cookie.setCookie('im_download_path', this.fileDownloadPath)
          // 判断下载路径是否存在，没有则创建
          // eslint-disable-next-line node/no-deprecated-api
          fs.exists(this.fileDownloadPath, function (exists) {
            if (!exists) {
              fs.mkdir(this.fileDownloadPath)
            }
          })
        }
      })
      ipcRenderer.send('choiceDownloadFolder', this.fileDownloadPath)
    },
    // 图片转base64
    shangc (event) {
      let files = document.getElementById('upload-img').files[0]
      let name = document.getElementById('upload-img').files[0].name
      let arr = name.split('.')
      let type = arr[1]
      let fileSize = 0
      // let fileMaxSize = 10240 // 1M
      if (files) {
        fileSize = files.size
        if (fileSize > 1024 * 1024) {
          alert('文件大小不能大于1M！')
          files.value = ''
          return false
        } else if (fileSize <= 0) {
          alert('文件大小不能为0M！')
          files.value = ''
          return false
        }
      } else {
        return false
      }

      // 转码base64
      let reader = new FileReader()
      let imgFile
      // let that = this
      reader.readAsDataURL(files)
      reader.onload = e => {
        imgFile = e.target.result
        let arr = imgFile.split(',')
        this.newUserInfo.photo = `data:images/${type};base64,${arr[1]}`
      }
    },
    // 上传图片之前
    handleAvatarBeforeUpload (res) {
      if (res.size > 200 * 1024) {
        this.$message({
          type: 'warning',
          message: '上传图片必须小于200KB!'
        })
        return false
      }
      return true
    },
    // 头像上传成功
    handleAvatarSuccess (res) {
      if (res.url) this.newUserInfo.photo = res.url
    },
    // 更新用户信息
    updateUserInfo () {
      this.$refs.newUserInfo.validate(valid => {
        if (valid) {
          this.UpdateUserInfo({ ...this.newUserInfo })
          this.GetUserInfo(this.userInfo.jid)
          this.$emit('update:showUserInfoDialog', false)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请核实必要信息'
          })
        }
      })
    },
    onClose () {
      this.$emit('update:showUserInfoDialog', false)
    }
  }
}
</script>

<style lang="scss">
.img-upload-box {
  position: relative;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #dfdfdf;
  overflow: hidden;
  .avatar-uploader-icon {
    font-size: 30px;
  }
  img {
    cursor: pointer;
  }
  .upload-img {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    outline: none;
    opacity: 0;
    cursor: pointer;
  }
  .pathBorder {
    padding-bottom: 20px;
    width: 100px;
    height: 3px;
    background-color: #131212;
  }
  .soundItem {
    width: 20px;
    height: 20px;
    // background-size: 20;
    background-image: url(../../assets/images/sound.png);
  }
}
.system-setting-style {
  border: 1px solid #e4e7ed;
  -webkit-box-shadow: 0 0 10px #000;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3) !important;
}
.custom-input {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  border: 1px solid #ebeef5;
  padding: 2px 5px;
  width: 95%;
  border-radius: 5px;
}
</style>
