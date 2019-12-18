import {
  getGroupListXMPP,
  createGroupXMPP,
  saveGroupXMPP,
  filterGroupList,
  getGroupBaseInfoXMPP,
  getGroupMemberXMPP,
  addGroupMemberXMPP,
  groupInviteListenerXMPP,
  deleteMemberPermissionsXMPP,
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
  getGroupInfoByRoomIdRequest,
  updateGroupInfoByRoomIdRequest
} from '../../api/group'
import X2js from 'x2js'

const group = {
  state: {
    // 群组列表
    groupList: [],
    // 更新会话群组标识
    updateGroupFlag: ''
  },
  mutations: {
    SET_UPDATE_GROUP_FLAG (state, data) {
      state.updateGroupFlag = data
    },
    SET_GROUP_LIST (state, data) {
      state.groupList = data
    },
    // 更新群组成员信息（头像和名称）
    UPDATE_GROUP_INFO_BY_JID (state, data) {
      state.groupList.forEach(item => {
        item.members.forEach(member => {
          if (member.jid === data.jid) {
            member.photo = data.photo
            member.name = data.name
            member.sex = member.sex
          }
        })
      })
    },
    // 设置群成员
    SET_GROUP_MEMER_LIST (state, members) {
      state.groupList.forEach(item => {
        if (item.jid === members.jid) {
          item.members = members.members
        }
      })
    },
    ADD_GROUP (state, group) {
      state.groupList.push({
        name: group.groupName,
        jid: group.groupJid,
        rightKeyMenu: false,
        members: []
      })
    },
    DELETE_GROUP (state, jid) {
      state.groupList.forEach((item, index) => {
        if (item.jid === jid) {
          state.groupList.splice(index, 1)
        }
      })
    },
    SET_GROUP_NAME (state, group) {
      state.groupList.forEach(item => {
        if (group.roomJid === item.jid) {
          item.name = group.naturalName
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
    // 更新群组信息（接收到群组其他信息，更新信息）
    UPDATE_GROUP_INFO_BY_ROOMID (state, group) {
      // 新增群聊
      if (!state.groupList.some(item => { return item.jid === group.roomJid })) {
        let obj = {}
        obj.jid = group.roomJid
        obj.name = group.name
        obj.members = []
        obj.rightKeyMenu = false
        group.memberList.forEach(item => {
          let member = {}
          let x2js = new X2js()
          let vcard = x2js.xml2js(item.vcard)
          member.jid = item.jid
          member.affiliation = item.affiliation
          member.nickName = item.nickName ? item.nickName : vcard.vCard.name
          member.sex = vcard.vCard ? vcard.vCard.sex : ''
          member.name = vcard.vCard ? vcard.vCard.name : ''
          member.photo = vcard.vCard ? vcard.vCard.photo : ''
          member.account = item.jid.split('@')[0]
          member.rightKeyMenu = false
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
            let x2js = new X2js()
            let vcard = x2js.xml2js(i.vcard)
            member.jid = i.jid
            member.affiliation = i.affiliation
            member.nickName = i.nickname ? i.nickname : vcard.vCard.name
            member.sex = vcard.vCard ? vcard.vCard.sex : ''
            member.photo = vcard.vCard ? vcard.vCard.photo : ''
            member.name = vcard.vCard ? vcard.vCard.name : ''
            member.account = i.jid.split('@')[0]
            member.rightKeyMenu = false
            item.members.push(member)
            // item.members.forEach(member => {
            //   if (member.jid === i.jid) {
            //     member.nickName = i.nickname ? i.nickname : member.name
            //   }
            // })
          })
        }
      })
      // 遍历更新群组的信息
      // state.groupList.forEach(item => {
      //   if (item.jid === group.roomJid) {
      //     console.log(`开始更新群组名称`)
      //     item.name = group.name
      //     item.members.splice(0)
      //     group.memberList.forEach(i => {
      //       let member = {}
      //       let vcard = {}
      //       X2js.parseString(i.vcard, function (err, res) {
      //         vcard = res
      //       })
      //       member.jid = i.jid
      //       member.affiliation = i.affiliation
      //       member.nickName = i.nickname ? i.nickname : vcard.vCard.name[0]
      //       member.sex = vcard.vCard ? vcard.vCard.sex[0] : ''
      //       member.photo = vcard.vCard ? vcard.vCard.photo[0] : ''
      //       member.account = i.jid.split('@')[0]
      //       item.members.push(member)
      //     })
      //   }
      // })
    }
    // 删除群成员
    // DELETE_GROUP_MEMBER (state, data) {
    //   state.groupList.forEach(item => {
    //     if (item.jid === data.groupJid) {
    //       item.members.forEach((i, index) => {
    //         if (i.jid === data.member.jid) {
    //           item.splice(index, 1)
    //         }
    //       })
    //     }
    //   })
    // },
  },
  actions: {
    // 被踢出群组监听(1、群成员退出监听；2、被群主踢出群组)
    PutForwardGroupListener ({ state, dispatch, commit, rootState }) {
      return new Promise((resolve, reject) => {
        putForwardGroupListenerXMPP(response => {
          let x2js = new X2js()
          let result = x2js.xml2js(response.toString())
          let groupJid = result.presence._from.split('/')[0]
          dispatch('GetGroupList')
            .then(response => {
              if (response.some(item => { return item.jid === groupJid })) {
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
                // 被群主踢出群组
                dispatch('getSessionByJid', { jid: groupJid })
                  .then(res => {
                    if (!res) {
                      console.log('不存在会话')
                      commit('DELETE_GROUP', groupJid)
                      return
                    }
                    dispatch('deleteSessionById', res)
                      .then(() => {
                        commit('SET_SELECTED_CHANNEL_BY_JID', '')
                        commit('DELETE_GROUP', groupJid)
                        resolve()
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
          const groupJid = response.attrs.from.split('/')[0]
          commit('DELETE_GROUP', groupJid)
          dispatch('getSessionByJid', { jid: groupJid })
            .then(res => {
              dispatch('deleteSessionById', res)
                .then(() => {
                  commit('SET_SELECTED_CHANNEL_BY_JID', '')
                  resolve()
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
            // console.log(`群组消息：${JSON.stringify(response.data)}`)
            // response.userJid = rootState.home.userInfo.jid
            commit('UPDATE_GROUP_INFO_BY_ROOMID', response.data)
            console.log('啦啦啦')
            dispatch('getSessionByJid', { jid: data.roomJid })
              .then(channel => {
                if (channel) {
                  resolve(response)
                  channel.name = response.data.name
                  console.log(`更新会话：${JSON.stringify(channel)}`)
                  dispatch('updateSession', { sessionObj: channel })
                  return
                }
                resolve(response)
              })
          })
          .catch(err => {
            reject(err)
          })
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
          res.name = data.groupName
          dispatch('updateSession', { sessionObj: res })
        })
    },
    // 更新群组信息
    UpdateGroupInfoByRoomId ({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        updateGroupInfoByRoomIdRequest(data)
          .then(response => {
            if (response.data === 1) {
              commit('SET_GROUP_NAME', data)
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
                  if (channel) {
                    let session = channel
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
      exitGroupXMPP(data)
      // TODO:删除本地群组和对应群组会话
      return new Promise((resolve, reject) => {
        dispatch('GetGroupList')
          .then(response => {
            if (!response.some(item => { return item.jid === data.groupJid })) {
              commit('DELETE_GROUP', data.groupJid)
              dispatch('getSessionByJid', { jid: data.groupJid })
                .then(res => {
                  dispatch('deleteSessionById', res)
                    .then(() => {
                      resolve(data.groupJid)
                    })
                })
            }
          })
      })
    },
    // 添加群组成员
    AddGroupMember ({ dispatch, commit, rootState }, data) {
      data.addList.forEach(item => {
        addGroupMemberXMPP({
          userJid: rootState.home.userInfo.jid,
          groupJid: data.groupJid,
          member: item.jid ? item.jid : item
        })
      })
      setTimeout(() => {
        dispatch('getGroupInfoByRoomId', {
          roomJid: data.groupJid
        })
          .then(() => {
            // 多端消息同步 => 添加群成员
            dispatch('sendOtherMessage', {
              to: `${rootState.home.userInfo.jid}/SyntoIM-APP`,
              content: JSON.stringify({
                type: 'addMemberToGroup',
                roomId: data.groupJid
              }),
              type: 'PORT_SYNC'
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
      // dispatch('sendGroupOtherMessage', {
      //   to: data.groupJid,
      //   content: '群成员更新啦!',
      //   type: 'newMember'
      // })
      // dispatch('GetGroupMember', {
      //   groupJid: data.groupJid,
      //   userJid: rootState.home.userInfo.jid
      // })
    },
    // 删除群成员
    DeleteGroupMember ({ dispatch, commit, rootState }, data) {
      deleteMemberPermissionsXMPP(data)
      dispatch('getGroupInfoByRoomId', {
        roomJid: data.groupJid
      })
        .then(() => {
          // 多端消息同步 => 删除群成员
          dispatch('sendOtherMessage', {
            to: `${rootState.home.userInfo.jid}/SyntoIM-APP`,
            content: JSON.stringify({
              type: 'deleteMemberToGroup',
              roomId: data.groupJid
            }),
            type: 'PORT_SYNC'
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
      // dispatch('sendGroupOtherMessage', {
      //   to: data.groupJid,
      //   content: '群成员更新啦!',
      //   type: 'newMember'
      // })
    },
    // 监听群组邀请
    GroupInviteListener ({ dispatch, commit, rootState }) {
      groupInviteListenerXMPP(response => {
        let x2js = new X2js()
        let result = x2js.xml2js(response.toString())
        console.log(result)
        dispatch('GetGroupBaseInfo', {
          jid: result.message['stanza-id']._by
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
          if (data.type === 'add') commit('ADD_GROUP', data)
          dispatch('matchLocalMeberToGroup', members)
            .then(() => {
              commit('SET_UPDATE_GROUP_FLAG', data.groupJid)
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
    }
  }
}

export default group
