import {
  getGroupListXMPP,
  createGroupXMPP,
  saveGroupXMPP,
  filterGroupList,
  getGroupBaseInfoXMPP,
  getGroupMemberXMPP,
  addGroupMemberXMPP,
  groupInviteListenerXMPP,
  // filterGroupInviteInfoXMPP,
  deleteMemberPermissionsXMPP,
  // filterVisitorInfoXMPP,
  // rejectInviteXMPP,
  enterGroupXMPP,
  exitGroupXMPP,
  filterGroupBaseInfo,
  filterSaveGroupData,
  SetAliasToGroupXMPP,
  setGroupNameXMPP,
  filterGroupMemberXMPP,
  destoryGroupXMPP,
  destoryGroupListenerXMPP,
  putForwardGroupListenerXMPP
} from '../../xmpp/services/group'
import {
  addGroupNoticeRequest,
  getGroupNoticeRequest
} from '../../api/notice'
import {
  getGroupInfoByRoomIdRequest,
  updateGroupInfoByRoomIdRequest,
  updateGroupMemberNameByRoomIdRequest
} from '../../api/group'
import X2js from 'xml2js'
var moment = require('../../common/moment.js');

const group = {
  state: {
    // 群组列表
    groupList: [],
    // 更新会话群组标识
    updateGroupFlag: '',
    // 当前操作群组
    activeGroup: {},
    // 群公告列表
    groupNoticeList: [],
    // 新的群公告
    groupNoticeId: '',
    // 当前向用户展示的群公告
    groupNotice: {},
    // 当前解散群组
    activeDissolveGroup: ''
  },
  mutations: {
    SET_DISSOLVE_GROUP (state, roomJid) {
      state.activeDissolveGroup = roomJid
    },
    SET_GROUP_NOTICE_ID (state, data) {
      state.groupNotice = data
    },
    SET_ACTIVE_GROUP (state, data) {
      state.activeGroup = data
    },
    SET_UPDATE_GROUP_FLAG (state, data) {
      state.updateGroupFlag = data
    },
    // 更新群组成员信息（头像和名称）
    UPDATE_GROUP_INFO_BY_JID (state, data) {
      state.groupList.forEach(item => {
        item.members.forEach(member => {
          if (member.jid === data.jid) {
            console.log('更新群成员信息')
            member.photo = data.photo
            member.name = data.name
            member.sex = data.sex
          }
        })
      })
    },
    SET_GROUP_LIST (state, data) {
      state.groupList = data
    },
    // 设置群成员
    SET_GROUP_MEMER_LIST (state, members) {
      // TODO:如果当前操作群组的成员变动，需要实时更新
      if (members.jid === state.activeGroup.jid) state.activeGroup.members = members.members
      state.groupList.forEach(item => {
        if (item.jid === members.jid) {
          item.members = members.members
        }
      })
    },
    // 删除群成员
    DELETE_GROUP_MEMBER (state, data) {
      state.groupList.forEach(item => {
        if (item.jid === data.groupJid) {
          item.members.forEach((i, index) => {
            if (i.jid === data.member.jid) {
              item.splice(index, 1)
            }
          })
        }
      })
    },
    ADD_GROUP (state, group) {
      // 如果群组已存在，则跳过添加，添加成员和监听群组邀请的数据格式一致，导致多次添加，后期需要优化
      // if (state.groupList.some(item => { return item.jid === group.groupJid })) return
      state.groupList.push({
        name: group.groupName,
        jid: group.groupJid,
        rightKeyMenu: false,
        members: []
      })
    },
    // 更新群组名字
    UPDATE_GROUP_NAME (state, group) {
      state.groupList.forEach(item => {
        if (group.roomJid === item.jid) {
          item.name = group.naturalName
        }
      })
    },
    // 更新在群中的昵称
    UPDATE_ALIAS_TO_GROUP (state, group) {
      state.groupList.forEach(item => {
        if (group.roomJid === item.jid) {
          item.nickName = group.nickname
          item.members.forEach(i => {
            if (i.jid === group.jid) {
              i.nickName = group.nickname
            }
          })
        }
      })
    },
    // 更新群组信息（接收到群组其他信息，更新信息）
    UPDATE_GROUP_INFO_BY_ROOMID (state, group) {
      // 新增群聊
      if (!state.groupList.some(item => { return item.jid === group.roomJid })) {
        let obj = {}
        obj.jid = group.roomJid
        obj.name = group.name
        obj.members = []
        group.memberList.forEach(item => {
          let member = {}
          let vcard = {}
          X2js.parseString(item.vcard, function (err, res) {
            vcard = res
          })
          member.jid = item.jid
          member.affiliation = item.affiliation
          member.nickName = item.nickName ? item.nickName : vcard.vCard.name[0]
          member.sex = vcard.vCard ? vcard.vCard.name[0] : ''
          member.photo = vcard.vCard ? vcard.vCard.photo[0] : ''
          obj.members.push(member)
        })
        obj.members.forEach(item => {
          if (item.jid === group.userJid) {
            obj.nickName = item.nickName
          }
        })
        state.groupList.push(obj)
        return
      }
      // 遍历更新群组的信息
      state.groupList.forEach(item => {
        if (item.jid === group.roomJid) {
          item.name = group.name
          item.members.splice(0)
          group.memberList.forEach(i => {
            let member = {}
            let vcard = {}
            X2js.parseString(i.vcard, function (err, res) {
              vcard = res
            })
            member.jid = i.jid
            member.affiliation = i.affiliation
            member.nickName = i.nickname ? i.nickname : vcard.vCard.name[0]
            member.sex = vcard.vCard ? vcard.vCard.sex[0] : ''
            member.photo = vcard.vCard ? vcard.vCard.photo[0] : ''
            member.account = i.jid.split('@')[0]
            item.members.push(member)
            // item.members.forEach(member => {
            //   if (member.jid === i.jid) {
            //     member.nickName = i.nickname ? i.nickname : member.name
            //   }
            // })
          })
        }
      })
    },
    DELETE_GROUP (state, jid) {
      console.log(`将要删除的群组:${jid}`)
			let groupIndex = state.groupList.findIndex(item => {
				return item.jid === jid
			})
			if(groupIndex > -1){
				state.groupList.splice(groupIndex, 1)
			}
      // console.log(`state.groupList:${JSON.stringify(state.groupList)}`)
    },
    SET_GROUP_NAME (state, group) {
      state.groupList.forEach(item => {
        if (group.groupJid === item.jid) {
          item.name = group.groupName
        }
      })
    },
    // TODO:用户信息改变，更新群组中的用户信息
    UPDATE_GROUP_LIST_OWNER (state, owner) {
      state.groupList.forEach(item => {
        item.members.forEach((i, index) => {
          if (i.jid === owner.jid) {
            item.members.photo = owner.photo
            item.members.name = owner.name
            item.members.sex = owner.sex
          }
        })
      })
    },
    // 设置群公告
    SET_GROUP_NOTICE (state, data) {
      state.groupNoticeList = data
    }
  },
  actions: {
    // 被踢出群组监听(1、群成员退出监听; 2、被群主踢出群组(自己退出群聊);)
    PutForwardGroupListener ({ state, dispatch, commit, rootState }) {
      return new Promise((resolve, reject) => {
        putForwardGroupListenerXMPP(response => {
          console.log('被踢出群组监听：PutForwardGroupListener')
          let result = {}
          X2js.parseString(response.toString(), function (err, res) {
            result = res
          })
          let groupJid = result.presence.$.from.split('/')[0]
          dispatch('GetGroupList')
            .then(response => {
              // console.log(`群列表:${JSON.stringify(response)}`)
              // console.log(`群Jid:${groupJid}`)
              if (response.some(item => { return item.jid === groupJid })) {
                console.log('群成员退出群组')
                // 群成员退出群组
                commit('SET_UPDATE_GROUP_FLAG', '')
                dispatch('getGroupInfoByRoomId', {
                  roomJid: groupJid
                })
                // dispatch('GetGroupMember', {
                //   groupJid: groupJid,
                //   userJid: rootState.home.userInfo.jid
                // })
              } else {
                // 被群主踢出群组(自己退出群聊)
                dispatch('getSessionByJid', { jid: groupJid })
                  .then(res => {
                    if (!res.length) {
                      console.log('不存在会话')
                      commit('DELETE_GROUP', groupJid)
                      return
                    }
                    dispatch('deleteSessionById', res[0].id)
                      .then(() => {
                        dispatch('removeMessageByDbSessionId', res[0].channelId)
                          .then(() => {
                            commit('DELETE_GROUP', groupJid)
                          })
                      })
                  })
              }
            })
        })
      })
    },
    // 群组解散监听
    DestoryGroupListener ({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        destoryGroupListenerXMPP(response => {
          console.log('监听到群组解散：DestoryGroupListener')
          const groupJid = response.attrs.from.split('/')[0]
          // TODO:删除对应会话和数据
          dispatch('getSessionByJid', {jid: groupJid})
            .then(channel => {
              if (!channel.length) {
                commit('DELETE_GROUP', groupJid)
                commit('SET_DISSOLVE_GROUP', groupJid)
                resolve(groupJid)
                return
              }
              // console.log(`删除会话数据:${JSON.stringify(channel)}`)
              dispatch('deleteSessionById', channel[0].id)
                .then(() => {
                  console.log('删除会话啦啦啦')
                  dispatch('removeMessageByDbSessionId', channel[0].channelId)
                    .then(() => {
                      commit('DELETE_GROUP', groupJid)
                      commit('SET_DISSOLVE_GROUP', groupJid)
                      resolve(groupJid)
                    })
                })
            })
        })
      })
    },
    // 获取某个群组信息
    getGroupInfoByRoomId ({ dispatch, commit, rootState }, data) {
      return new Promise((resolve, reject) => {
        getGroupInfoByRoomIdRequest(data.roomJid)
          .then(response => {
            // console.log(`群组消息：${JSON.stringify(response)}`)
            if (rootState.home.userInfo && rootState.home.userInfo.jid) {
              response.userJid = rootState.home.userInfo.jid
            }
            commit('UPDATE_GROUP_INFO_BY_ROOMID', response)
            dispatch('getSessionByJid', { jid: data.roomJid })
              .then(channel => {
                if (channel.length) {
                  let session = channel[0]
                  session.name = response.name
                  dispatch('updateSession', { sessionObj: session })
                }
              })
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 更新群组信息
    UpdateGroupInfoByRoomId ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        updateGroupInfoByRoomIdRequest(data)
          .then(response => {
            if (response === 1){
              commit('UPDATE_GROUP_NAME', data)
              let obj = {
                roomJid: data.roomJid
              }
              dispatch('sendGroupOtherMessage', {
                to: data.roomJid,
                content: JSON.stringify(obj),
                type: 'UPDATE_GROUP_INFO'
              })
              dispatch('getSessionByJid', { jid: data.roomJid })
                .then(channel => {
                  if (channel.length) {
                    let session = channel[0]
                    session.name = data.naturalName
                    dispatch('updateSession', { sessionObj: session })
                  }
                })
            }
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 更新在群组中的昵称
    UpdateGroupMemberNameByRoomId ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        updateGroupMemberNameByRoomIdRequest(data)
          .then(response => {
            commit('UPDATE_ALIAS_TO_GROUP', data)
            let obj = {
              roomJid: data.roomJid
            }
            dispatch('sendGroupOtherMessage', {
              to: data.roomJid,
              content: JSON.stringify(obj),
              type: 'UPDATE_GROUP_INFO'
            })
            resolve()
          })
          .catch(err => reject(err))
      })
    },
    // 解散群组
    DestoryGroup ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        destoryGroupXMPP(data)
        resolve()
      })
    },
    // 设置群名
    SetGroupName ({ dispatch, commit }, data) {
      setGroupNameXMPP(data)
      commit('SET_GROUP_NAME', data)
      dispatch('getSessionByJid', { jid: data.groupJid })
        .then(res => {
          if (!res.length) return
          let channel = res[0]
          channel.name = data.groupName
          console.log(`群会话信息:${JSON.stringify(channel)}`)
          dispatch('updateSession', { sessionObj: channel })
        })
    },
    // 设置昵称
    SetAliasToGroup ({ commit }, data) {
      SetAliasToGroupXMPP(data)
    },
    // 进入房间
    EnterGroup ({ commit }, data) {
      enterGroupXMPP(data)
    },
    // 退出房间
    ExitGroup ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        exitGroupXMPP(data)
        console.log(`退出群聊:${data.groupJid}`)
        resolve()
      })
    },
    // 添加群组成员
    AddGroupMember ({ dispatch, commit, rootState }, data) {
      data.addList.forEach(item => {
        addGroupMemberXMPP({
          userJid: rootState.home.userInfo.jid,
          groupJid: data.groupJid,
          member: item
        })
      })
      setTimeout(() => {
        // 多端消息同步 => 添加群成员
        dispatch('sendOtherMessage', {
          to: `${rootState.home.userInfo.jid}/SyntoIM-PC`,
          content: JSON.stringify({
            type: 'addMemberToGroup',
            roomId: data.groupJid
          }),
          type: 'PORT_SYNC'
        })
          .then(() => {
            dispatch('getGroupInfoByRoomId', {
              roomJid: data.groupJid
            })
              .then(() => {
                dispatch('sendGroupOtherMessage', {
                  to: data.groupJid,
                  content: '群成员更新啦!',
                  type: 'newMember'
                })
              })
          })
      }, 700)
      // dispatch('GetGroupMember', {
      //   groupJid: data.groupJid,
      //   userJid: rootState.home.userInfo.jid
      // })
    },
    // 删除群成员
    DeleteGroupMember ({ dispatch, commit, rootState }, data) {
      deleteMemberPermissionsXMPP(data)
      dispatch('sendOtherMessage', {
        to: `${rootState.home.userInfo.jid}/SyntoIM-PC`,
        content: JSON.stringify({
          type: 'deleteMemberToGroup',
          roomId: data.groupJid
        }),
        type: 'PORT_SYNC'
      })
        .then(() => {
          dispatch('getGroupInfoByRoomId', {
            roomJid: data.groupJid
          })
            .then(() => {
              dispatch('sendGroupOtherMessage', {
                to: data.groupJid,
                content: '群成员更新啦!',
                type: 'newMember'
              })
            })
        })
      // commit('DELETE_GROUP_MEMBER', data)
      // dispatch('GetGroupMember', {
      //   groupJid: data.groupJid,
      //   userJid: rootState.home.userInfo.jid
      // })
    },
    // 监听群组邀请
    GroupInviteListener ({ dispatch, commit, rootState }) {
      groupInviteListenerXMPP(response => {
        let result = {}
        X2js.parseString(response.toString(), function (err, res) {
          result = res
        })
        console.log(`监听群组邀请`)
        dispatch('GetGroupBaseInfo', {
          jid: result.message['stanza-id'][0].$.by
        })
          .then(response => {
            dispatch('getGroupInfoByRoomId', {
              roomJid: response.id
            })
              .then(() => {
                dispatch('EnterGroup', {
                  userJid: rootState.home.userInfo.jid,
                  groupJid: response.id
                })
              })
            // dispatch('GetGroupMember', {
            //   userJid: rootState.home.userInfo.jid,
            //   groupJid: response.id,
            //   groupName: response.name,
            //   type: 'add'
            // })
            // dispatch('EnterGroup', {
            //   userJid: rootState.home.userInfo.jid,
            //   groupJid: response.id
            // })
          })
      })
    },
    // 获取群组成员
    GetGroupMember ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        getGroupMemberXMPP(data, response => {
          console.log(response)
          const members = filterGroupMemberXMPP(response)
          // TODO:如果是新创建的群，需先先添加至群列表
          if (data.type === 'add') {
            console.log(`data:${JSON.stringify(data)}`)
            console.log(`新创建群:${JSON.stringify(data)}`)
            commit('ADD_GROUP', {
              groupJid: data.groupJid,
              groupName: data.groupName
            })
          }
          dispatch('matchLocalMeberToGroup', members)
            .then(() => {
              // commit('SET_UPDATE_GROUP_FLAG', data.groupJid)
            })
          resolve()
        })
      })
    },
    // 创建群聊
    CreateGroup ({ commit, rootState }, data) {
      data.xmppGroupDomain = rootState.home.xmppGroupDomain
      return new Promise((resolve, reject) => {
        createGroupXMPP(data, (response) => {
          const data = filterSaveGroupData(response)
          resolve(data)
        })
      })
    },
    // 保存为永久群聊
    SaveGroup ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        saveGroupXMPP(data)
        dispatch('getGroupInfoByRoomId', {
          roomJid: data.groupJid
        })
          .then(() => {
            resolve()
          })
        // TODO：初始化新建群组在本地的数据
        // dispatch('GetGroupMember', {
        //   userJid: data.groupOwner,
        //   groupJid: data.groupJid,
        //   groupName: data.groupName,
        //   type: 'add'
        // })
        //   .then(() => {
        //     resolve()
        //   })
      })
      // 群聊创建成功，获取最新群组信息
      // dispatch('GetGroupList')
    },
    // 匹配本地成员数据
    matchLocalMeberToGroup ({ dispatch, commit, rootState }, data) {
      let result = JSON.parse(JSON.stringify(data))
      return new Promise((resolve, reject) => {
        result.members.forEach(item => {
          rootState.home.localMemberData.forEach(i => {
            if (i.jid === item.jid) {
              item.friendJid = i.friendJid
              item.id = i.id
              item.name = i.name
              item.label = i.label
              item.photo = i.photo
              item.rightKeyMenu = i.rightKeyMenu
              item.sex = i.sex
              item.sign = i.sign
            }
          })
        })
        console.log(result)
        commit('SET_GROUP_MEMER_LIST', result)
        resolve()
      })
    },
    // 获取群聊列表
    GetGroupList ({ dispatch, commit, rootState }) {
      return new Promise((resolve, reject) => {
        getGroupListXMPP(rootState.home.xmppGroupDomain.split('@')[1], (response) => {
          const data = filterGroupList(response)
          resolve(data)
        })
      })
    },
    // 获取群组信息
    GetGroupBaseInfo ({ commit, state }, group) {
      return new Promise((resolve, reject) => {
        getGroupBaseInfoXMPP(group, response => {
          const data = filterGroupBaseInfo(response)
          resolve(data)
        })
      })
    },
    // 获取群公告
    GetGroupNotice ({ commit }, groupJid) {
      return new Promise((resolve, reject) => {
        getGroupNoticeRequest({
          roomJid: groupJid,
          page: 1,
          size: 100
        })
          .then(response => {
            // console.log(`获取群公告成功:${JSON.stringify(response.content)}`)
            if (response.content.length) {
              let result = response.content
              result.forEach(item => {
                item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
              })
              commit('SET_GROUP_NOTICE', result)
              resolve(response.content)
            } else {
              commit('SET_GROUP_NOTICE', [])
              resolve([])
            }
          })
      })
    },
    // 发布群公告
    AddGroupNotice ({ commit }, notice) {
      return new Promise((resolve, reject) => {
        addGroupNoticeRequest(notice)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}

export default group
