import request from '@/utils/request'

export const checkWindowsUpdate = () =>
  request({
    url: '/syntoim/rest/sc/windows/32/gov/version',
    method: 'GET'
  })

export const checkMipsUpdate = () =>
  request({
    url: '/syntoim/rest/sc/mips/version',
    method: 'GET'
  })

// export const getGroupTree = () =>
//   requestUM({
//     url: '/syntoim/rest/group/tree',
//     method: 'GET'
//   })

// const {ipcRenderer} = require('electron')
// import {ipcRenderer} from 'electron'

// export const getClientSetting = () =>
//   requestUM({
//     url: '/syntoim/rest/clientsetting',
//     method: 'GET'
//   })

// export const getSystemNotice = (userId) =>
//   requestUM({
//     url: '/syntoim/rest/notice/userid/' + userId,
//     method: 'GET'
//   })

// export const setSystemLog = (userId, username, content) =>
//   requestUM({
//     url: '/syntoim/rest/systemlog',
//     method: 'POST',
//     data: {
//       userId: userId,
//       username: username,
//       content: content
//     }
//   })



// 获取版本信息
export function getVersionInfo (sysType) {
  return request.get(`/syntoim/rest/sc/`+sysType+'/version')
}