import {
  getTreeDataRequest,
  getNodeMemberRequest,
  searchTreeMemberRequest,
	getGroupInfo
} from '@/api/tree'
import {
  // recursionRequestMembers,
  // getMemberInfoXMPP,
  recursionSetMemberInfo,
  recursionSetNodeMemberInfo,
  recursionUpdateTreeData,
  filterNodeMemberData,
  recursionSetSearchMemberInfo
} from '@/xmpp/services/tree'
import {
// filterFriendInfo
} from '@/xmpp/services/friend'
import X2js from 'xml2js'
// import normalUrl from '../../utils/normalAvatar'

const tree = {
  state: {
    // 组织树数据
    treeData: [{
      label: ''
    }],
		nodeMemberData:[],
    treeDataForGroup: [{
      label: ''
    }],
    treeDataForMessage: [{
      label: ''
    }],
    treeName: ''
  },
  mutations: {
    SET_TREEDATA (state, data) {
			// console.log('state.treeData======================',data)
      state.treeData = JSON.parse(JSON.stringify(data))
//       state.treeDataForGroup = JSON.parse(JSON.stringify(data))
//       state.treeDataForMessage = JSON.parse(JSON.stringify(data))
//       state.treeName = data[0].label
    },
    SET_TREEMEMBERINFO (state, member) {

				state.nodeMemberData = member;
//       recursionSetMemberInfo(state.treeData, JSON.parse(JSON.stringify(member)))
//       recursionSetMemberInfo(state.treeDataForGroup, JSON.parse(JSON.stringify(member)))
//       recursionSetMemberInfo(state.treeDataForMessage, JSON.parse(JSON.stringify(member)))
    },
    SET_NODE_MEMBER_INFO (state, members) {
			// console.log('SET_TREEMEMBERINFO===========')
			state.nodeMemberData = members;
//       recursionSetNodeMemberInfo(state.treeData, JSON.parse(JSON.stringify(members)))
//       recursionSetNodeMemberInfo(state.treeDataForGroup, JSON.parse(JSON.stringify(members)))
//       recursionSetNodeMemberInfo(state.treeDataForMessage, JSON.parse(JSON.stringify(members)))
    },
    SET_SEARCH_MEMBER_INFO (state, member) {
      recursionSetSearchMemberInfo(state.treeData, JSON.parse(JSON.stringify(member)))
      recursionSetSearchMemberInfo(state.treeDataForGroup, JSON.parse(JSON.stringify(member)))
      recursionSetSearchMemberInfo(state.treeDataForMessage, JSON.parse(JSON.stringify(member)))
    },
    // 更新组织树(添加/删除好友)
    UPDATE_TREE_DATA (state, data) {
      recursionUpdateTreeData(state.treeData, data)
    },
    UPDATE_NODE_MEMBER_STATUS (state, member) {
      let index = state.nodeMemberData.findIndex(item => {
        return `${item.username}${member.xmppDomain}` === member.jid
      })
      if (index > -1) {
        let item = JSON.parse(JSON.stringify(state.nodeMemberData[index]))
        item.status = member.status
        if (member.status === 'online') {
          // 只存在一个成员
          if (state.nodeMemberData.length === 1) {
            state.nodeMemberData[0].status = 'online'
            return
          }
          console.log(`啦啦啦${JSON.stringify(item)}`)
          state.nodeMemberData.splice(index, 1)
          state.nodeMemberData.unshift(item)
        } else {
          // 只存在一个成员
          if (state.nodeMemberData.length === 1) {
            state.nodeMemberData[0].status = 'offline'
            return
          }
          state.nodeMemberData.splice(index, 1)
          let i = state.nodeMemberData.findIndex(item => {
            return item.status === 'offline'
          })
          if (i > -1) {
            state.nodeMemberData.splice(i, 0, item)
          } else {
            state.nodeMemberData.push(item)
          }
        }
      }
    }
  },
  actions: {
    // 获取组织树数据
    GetTreeData ({ dispatch, commit, rootState }, id) {
      // const xmppDomain = rootState.home.xmppDomain
      return new Promise((resolve, reject) => {
        getTreeDataRequest(id)
          .then(response => {
            // const result = [response.data]
            commit('SET_TREEDATA', response)
            // 递归请求成员信息
            // recursionRequestMembers(response.data, xmppDomain, jid => {
            //   dispatch('GetMemberInfo', jid)
            // })
            resolve(response)
          })
          .catch(err => reject(err))
      })
    },
    // 获取子节点成员
    GetNodeMember ({ dispatch, commit, rootState }, {id, organizeName}) {
      // const xmppDomain = rootState.home.xmppDomain
      return new Promise((resolve, reject) => {
        getNodeMemberRequest(id)
          .then(response => {

            // 节点下不存在成员
            // const members = filterNodeMemberData(response, xmppDomain, rootState.tree.treeData)
						// console.log('filterNodeMemberData======================='+JSON.stringify(response))
            // if (!members.length) return
            // dispatch('MatchLocalMeberToTree', members)

            let result = []
						response.forEach(item => {
						  let obj = {
						    ...item
              }
              obj.groupName = organizeName;
              obj.status = item.online !== 0 ? 'online' : 'offline'
              if (obj.status === 'online') {
                let index = result.findIndex(item => {
                  return item.status === 'online'
                })
                if (index > -1) {
                  result.splice(index + 1, 0, obj)
                } else {
                  result.unshift(obj)
                }
              } else {
                result.push(obj)
              }
						})
            commit('SET_NODE_MEMBER_INFO', result)
						// console.log('获取子节点成员---组织=========='+JSON.stringify(result))
						resolve(response)
            // members.forEach(item => {
            //   dispatch('GetMemberInfo', item.jid)
            // })
          })
          .catch(err => reject(err))
      })
    },
    // 匹配本地成员数据
    MatchLocalMeberToTree ({ dispatch, commit, rootState }, members) {
      members.forEach(item => {
        rootState.home.localMemberData.forEach(i => {
          if (item.jid === i.jid) {
            item.name = i.name
            item.friendJid = i.friendJid
            item.label = i.label
            item.photo = i.photo
            item.sex = i.sex
          }
        })
      })
      console.log(members)
      commit('SET_NODE_MEMBER_INFO', members)
//       members.forEach(item => {
//         if (!item.photo) {
//           dispatch('GetMemberInfo', item.jid)
//         }
//       })
    },
    SetTreeMemberInfo ({ commit }, member) {
      commit('SET_TREEMEMBERINFO', member)
    },
    // 模糊查询组织机构成员
    SearchTreeMember ({ dispatch, commit, rootState }, data) {
      return new Promise((resolve, reject) => {
        searchTreeMemberRequest(data)
          .then(response => {
            response.forEach(item => {
							//查询机构信息，添加机构名称
							getGroupInfo(item.groupCode).then(resData => {
								let vcard = {}
								 X2js.parseString(item.vcard, function (err, res) {
									 vcard = res
								 })
								 item.photo = vcard ? (vcard.vCard && vcard.vCard.photo ? vcard.vCard.photo[0] : '') : '';
								 item.groupName = resData ? resData.groupName : '',
								 resolve(response)
							})
            })
          })
          .catch(err => reject(err))
      })
    },
		 // 根据Code获取机构信息
		GetGroupInfo ({ dispatch, commit, rootState }, data) {
		  // let x2js = new xml2js()
		  return new Promise((resolve, reject) => {
		    getGroupInfo(data)
		      .then(response => {
		        resolve(response)
		      })
		      .catch(err => reject(err))
		  })
		},
  }
}

export default tree
