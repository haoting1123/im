require('electron-cookies')
import { remote } from 'electron'
/**
 * 获得
 */
const Cookie = {}

Cookie.setCookie = (cname, cvalue) => {
  var d = new Date()
  var exdays = 30
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  //   var expires = 'expires=' + d.toGMTString()
  const cookieInfo = cname + '=' + cvalue

  // console.log("设置Cookie=======",cookieInfo);

  document.cookie = cookieInfo
  // console.log("document.cookie==========",document.cookie)
}
Cookie.getCookies = (cname) => {
//   let data = []
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim()
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

Cookie.getDownloadPath = () => {
    let path = Cookie.getCookies('im_download_path')
    if (!path) {
      let iUserAgent = navigator.userAgent
      if (iUserAgent.indexOf('Linux') !== -1) {
        path = remote.app.getPath('home') + '/IM/'
      } else {
        path = remote.app.getPath('home') + '\\IM\\'
      }
      Cookie.setCookie('im_download_path', path)
    }
    return path
  }

Cookie.getExportPath = () => {
    let path = Cookie.getCookies('im_backup_path')
    if (!path) {
      let iUserAgent = navigator.userAgent
      if (iUserAgent.indexOf('Linux') !== -1) {
        path = remote.app.getPath('desktop') + '/'
      } else {
        path = remote.app.getPath('desktop') + '\\'
      }
      Cookie.setCookie('im_backup_path', path)
    }
    return path
  }

export default Cookie
