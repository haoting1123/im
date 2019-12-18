'use strict'

import {
  app,
  BrowserWindow,
  Menu,
  Tray,
  globalShortcut,
  ipcMain,
  dialog,
  shell
} from 'electron'
// import { main } from './xmpp'
import { localDB } from './db'
import ShortcutCapture from 'shortcut-capture'
const { download } = require('electron-dl')
const path = require('path')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}
let favicon = '/icon/favicon.ico'
let emptyIcon = '/icon/empty.ico'
let crypto = require('crypto')

let downloadpath // 下载路径
let savepath // 保存路径
// let processVisible // 进度条
let tray = null
let trayTimer = null
let isShowTimer = null
let flickerChecked = false
let soundChecked = false
let mainWindow = null
let os = process.platform

if (os === 'linux') {
  favicon = '/icon/icon_x20.png'
  emptyIcon = '/icon/empty_x20.png'
}
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9081`
    : `file://${__dirname}/index.html`

// const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
//   // Someone tried to run a second instance, we should focus our window.
//   if (mainWindow) {
//     if (mainWindow.isMinimized()){
//       mainWindow.restore();
//     };
//     mainWindow.focus();
//   };
// })
//
// if (isSecondInstance) {
//   app.quit();
//   return;
// }
function createWindow () {
  /**
   * Initial window options
   * minHeight: 640,
   * minWidth: 905,
   */
  mainWindow = new BrowserWindow({
    height: 540,
    width: 325,
    useContentSize: false,
    icon: path.join(__static, favicon),
    frame: false,
    show: false,
    center: true,
    backgroundColor: '#387FB5',
    // resizable: false,

    // transparent: true,
    webPreferences: {
      webSecurity: false
    }
  })

  ipcMain.on('setContentWindowSize', function () {
    mainWindow.setSize(905, 640)
    mainWindow.setResizable(true)
    mainWindow.setMaximizable(true)
    mainWindow.center()
  })

  ipcMain.on('setLoginWindowSize', function () {
    mainWindow.setSize(325, 540)
    mainWindow.setResizable(false)
    mainWindow.setMaximizable(false)
    mainWindow.center()
  })

  ipcMain.on('winHide', function () {
    mainWindow.hide()
  })

  ipcMain.on('winShow', function () {
    mainWindow.show()
  })

  mainWindow.loadURL(winURL)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setResizable(false)
    mainWindow.setMaximizable(false)
  })

  mainWindow.on('minimize', () => {
    console.log('窗口最小化了1')
    addCheckIsShowTimer()
  })

  // 打开窗口的调试工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  // 去掉菜单
  mainWindow.setMenu(null)
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 窗口关闭的监听
  mainWindow.on('close', event => {
    mainWindow.hide()
    mainWindow.setSkipTaskbar(true)
    // event.preventDefault()
  })

  // 托盘右键菜单
  tray = new Tray(path.join(__static, favicon))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '消息免打扰',
      type: 'checkbox',
      click: item => {
        console.log('消息免打扰', item.checked)
        if (item.checked) {
          soundChecked = true
          flickerChecked = true
          // 清除闪烁
          tray.setImage(path.join(__static, favicon))
          if (trayTimer) {
            clearInterval(trayTimer)
          }
        } else {
          soundChecked = false
          flickerChecked = false
        }
        soundSetUp()
      }
    },
    {
      type: 'separator'
    },
    {
      label: '最大化',
      click: () => {
        mainWindow.maximize()
      }
    },
    {
      label: '最小化',
      click: () => {
        console.log('窗口最小化1')
        mainWindow.minimize()
      }
    },
    {
      label: '还原',
      click: () => {
        mainWindow.restore()
      }
    },
    {
      label: '退出',
      click: () => {
        // 退出清理数据库
        localDB.clearDb()
        mainWindow.destroy()
      }
    }
  ])
  tray.setToolTip('即时通')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    tray.setImage(path.join(__static, favicon))

    if (trayTimer != null && trayTimer._idlePrev != null) {
      // 闪烁时点击直接显示
      clearInterval(trayTimer)
      mainWindow.show()
      mainWindow.setSkipTaskbar(false)
      mainWindow.webContents.send('setWindowIsShow', true)
    } else {
      clearInterval(trayTimer)
      if (mainWindow.isVisible()) {
        console.log('窗口最小化了2')
        mainWindow.hide()
        // 让窗口不在任务栏中显示
        mainWindow.setSkipTaskbar(true)
        addCheckIsShowTimer()
      } else {
        mainWindow.show()
        // 让窗口在任务栏中显示
        mainWindow.setSkipTaskbar(false)
        mainWindow.webContents.send('setWindowIsShow', true)
        clearIsShowTimer()
      }
    }
  })
  const shortcutCapture = new ShortcutCapture({
    parent: mainWindow
  })
  // 登录成功后初始化功能   1.截图初始化快捷键
  ipcMain.on('initWork', function () {
    globalShortcut.register('Ctrl+Alt+Q', () => {
      shortcutCapture.shortcutCapture()
      // if (os === 'linux') {
      //   mainWindow.minimize()
      // }
    })
    // 拿取截图后返回信息
  })

  shortcutCapture.on('capture', ({ dataURL }) => {
    // 写入文件
    base64ToFileAndSendMessage(dataURL)
  })

  // 接收base64来生成图片
  ipcMain.on('base64ToFileAndMessage', function (dataURL) {
    // 拿取截图后返回信息
    base64ToFileAndSendMessage(dataURL)
  })

  ipcMain.on('openShortcutCapture', function () {
    shortcutCapture.shortcutCapture()
  })
  // 聚焦窗口
  ipcMain.on('setWindowFocus', function () {
    mainWindow.focus()
  })

  // 退出程序
  ipcMain.on('exitProcess', function () {
    // 退出清理数据库
    localDB.clearDb()
    mainWindow.destroy()
  })

  // 获取热键
  ipcMain.on('hotKey', function (event, newKeyBoard, oldKeyBoark) {
    var isRegister = globalShortcut.isRegistered(newKeyBoard)
    if (isRegister) {
      // 热键存在
      event.sender.send('hotKeyReply', '1')
      return
    }
    // 注销旧的热键
    if (oldKeyBoark) {
      globalShortcut.unregister(oldKeyBoark)
    }
    // 注册热键
    var ret = globalShortcut.register(newKeyBoard, () => {
      mainWindow.show()
      // 清除图标闪烁
      tray.setImage(path.join(__static, favicon))
      if (trayTimer) {
        clearInterval(trayTimer)
      }
    })
    // 注册成功返回空字符串，热键冲突返回2
    event.sender.send('hotKeyReply', ret ? '' : '2')
  })
  // 选择下载目录
  ipcMain.on('choiceDownloadFolder', function (event, option) {
    console.log('选择下载目录默认路径========', option)
    dialog.showOpenDialog(
      {
        properties: ['openDirectory'],
        defaultPath: option
      },
      function (files) {
        event.sender.send('choiceDownloadFolderReply', files)
      }
    )
  })
  ipcMain.on('downloadApp', (event, args) => {
    mainWindow.webContents.session.once('will-download', (e, item, webContents) => {
      // 获取文件的总大小
      const totalBytes = item.getTotalBytes()
      // 设置文件的保存路径，此时默认弹出的 save dialog 将被覆盖
      const filePath = path.join(savepath, item.getFilename())
      item.setSavePath(filePath)
      // 监听下载过程，计算并设置进度条进度
      item.on('updated', () => {
        let processNum = item.getReceivedBytes() / totalBytes
        mainWindow.webContents.send('process', processNum)
        mainWindow.setProgressBar(processNum)
      })
      // 监听下载结束事件
      item.on('done', (e, state) => {
        // 如果窗口还在的话，去掉进度条
        if (!mainWindow.isDestroyed()) {
          mainWindow.setProgressBar(-1)
        }
        // 下载被取消或中断了
        if (state === 'interrupted') {
          // dialog.showErrorBox('下载失败', '文件因为某些原因被中断下载')
        }
        if (state === 'completed') {
          // shell.openItem(filePath)
        }
      })
    })
    var arr = args.split(',')
    console.log('下载路径=======', args)
    // var arr = JSON.parse(args)
    downloadpath = arr[0]
    savepath = arr[1]
    // 下面这句会触发will-download事件
    mainWindow.webContents.downloadURL(downloadpath)
  })

  ipcMain.on('downloadImage', (event, args) => {
    var arr = args.split(',')
    console.log('下载路径=======', args)
    // var arr = JSON.parse(args)
    downloadpath = arr[0]
    savepath = arr[1]
    // 下面这句会触发will-download事件
    mainWindow.webContents.downloadURL(downloadpath)
  })

  // 打开文件
  ipcMain.on('openFile', function (e, filePath) {
    console.log('openFile=============', filePath)
    shell.openItem(filePath)
  })
  // // 打开文件夹
  // ipcMain.on('openDir', function (e, filePath) {
  //   console.log('openDir=============', filePath)
  //   shell.openItem(filePath)

  // })

  // 窗口最大化
  ipcMain.on('topWinMax', function () {
    console.log(mainWindow.isMaximized())
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })

  // 窗口最小化
  ipcMain.on('topWinMin', function () {
    console.log('窗口最小化')
    mainWindow.minimize()
  })

  // 退出窗口
  ipcMain.on('topWinClose', function (event) {
    // mainWindow.destroy()
    mainWindow.hide()
    mainWindow.setSkipTaskbar(true)
    // event.preventDefault()
  })

  // 真正退出窗口
  ipcMain.on('real_close', function (event) {
    localDB.clearDb()
    mainWindow.destroy()
  })

  // main(mainWindow)
  // 监听数据库初始化事件
  // 用户表-会话列表-用户ID
  localDB.userTable()
  // 消息表 -用户ID+好友ID
  localDB.messageTable()

  // 系统托盘图标闪烁
  ipcMain.on('trayFlicker', function () {
    if (!flickerChecked) {
      mainWindow.flashFrame(true)
      var count = 0
      if (trayTimer) {
        clearInterval(trayTimer)
      }
      trayTimer = setInterval(function () {
        count++
        if (count % 2 === 0) {
          tray.setImage(path.join(__static, favicon))
        } else {
          tray.setImage(path.join(__static, emptyIcon))
        }
      }, 600)
    }
  })
  // 关闭声音闪烁
  ipcMain.on('closeTrayFlicker', function () {
    tray.setImage(path.join(__static, favicon))
    if (trayTimer) {
      clearInterval(trayTimer)
    }
  })

  // 另存文件
  ipcMain.on('saveAsFile', function (event, option) {
    dialog.showSaveDialog(option, function (files) {
      event.sender.send('showSaveDialogReply', files)
    })
  })
  // 打开下载的文件
  ipcMain.on('openFile', function (event, file, option) {
    shell.openItem(file)
  })

  // 打开下载目录
  ipcMain.on('openFolder', function (event, file, option) {
    shell.showItemInFolder(file)
  })

  // 导出消息记录返回选择的路径
  ipcMain.on('exportMessage', function (event, option) {
    dialog.showSaveDialog(
      {
        title: '导出记录',
        defaultPath: option,
        filters: [
          {
            name: 'File',
            extensions: ['txt']
          }
        ]
      },
      function (files) {
        event.sender.send('exportMessageReply', files)
      }
    )
  })
  // 下载文件
  ipcMain.on('downloadFile', function (event, file, option) {
    console.log('downloadFile:', file)
    download(mainWindow, file, option)
      .then(dl => {
        console.log('success:', dl)
        // if (option.showFolder) {
        shell.showItemInFolder(dl.getSavePath())
        // }
      })
      .catch(error => {
        console.log(error)
      })
  })
  // 加密字符串
  ipcMain.on('EncryptStr', function (event, str) {
    let returnStr = Encrypt(str, secret)
    // console.log(returnStr)
    event.returnValue = returnStr
  })

  // 解密字符串
  ipcMain.on('DecryptStr', function (event, str) {
    try {
      let returnStr = Decrypt(str, secret)
      // console.log(returnStr)
      event.returnValue = returnStr
    } catch (err) {
      event.returnValue = '解密失败'
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// base64转图片文件
function base64ToFileAndSendMessage (imgData) {
  var fs = require('fs')
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
  var dataBuffer = Buffer.from(base64Data, 'base64')
  let fileName = 'shot_' + new Date().getTime() + '.png'
  let path = app.getPath('temp') + '/'
  fs.writeFile(path + fileName, dataBuffer, function (err) {
    console.log(err)
    // 回复前端截图消息
    mainWindow.webContents.send('shortcutCaptureReply', path + fileName)
  })
}

// 向页面发送设置
function soundSetUp () {
  mainWindow.webContents.send('globalSoundSetUp', soundChecked)
}

let secret = '58AD9F033M5'
let Encrypt = (data, key) => {
  const cipher = crypto.createCipher('aes192', key)
  var crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

let Decrypt = (encrypted, key) => {
  const decipher = crypto.createDecipher('aes192', key)
  var decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

function addCheckIsShowTimer () {
  if (isShowTimer) {
    clearInterval(isShowTimer)
  }
  isShowTimer = setInterval(() => {
    // console.log('是否显示' + mainWindow.isVisible())
    // console.log('是否最小化' + mainWindow.isMinimized())
    let visible = mainWindow.isVisible()
    let minimized = mainWindow.isMinimized()
    if (visible === true && minimized === false) {
      clearIsShowTimer()
    }
  }, 1000)
  mainWindow.webContents.send('setWindowIsShow', false)
}

function clearIsShowTimer () {
  if (isShowTimer) {
    clearInterval(isShowTimer)
  }
  mainWindow.webContents.send('setWindowIsShow', true)
}
