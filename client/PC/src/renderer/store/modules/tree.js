import {
  getTreeDataRequest,
  getNodeMemberRequest,
  searchTreeMemberRequest
} from '@/api/tree'
import {
  recursionSetNodeMemberInfo,
  filterNodeMemberData,
  recursionSetSearchMemberInfo
} from '@/xmpp/services/tree'
import X2js from 'x2js'
import normalUrl from '../../utils/normalAvatar'

const tree = {
  state: {
    // 组织树数据
    treeData: [{
      label: ''
    }],
    treeDataForGroup: [{
      label: ''
    }],
    treeDataForMessage: [{
      label: ''
    }],
    treeName: ''
  },
  mutations: {
    // 设置组织树的基本数据（树结构）
    SET_TREEDATA (state, data) {
      state.treeData = JSON.parse(JSON.stringify(data))
      state.treeDataForGroup = JSON.parse(JSON.stringify(data))
      state.treeDataForMessage = JSON.parse(JSON.stringify(data))
      state.treeName = data[0].label
    },
    // 设置子节点成员数据
    SET_NODE_MEMBER_INFO (state, members) {
      recursionSetNodeMemberInfo(state.treeData, JSON.parse(JSON.stringify(members)))
      recursionSetNodeMemberInfo(state.treeDataForGroup, JSON.parse(JSON.stringify(members)))
      recursionSetNodeMemberInfo(state.treeDataForMessage, JSON.parse(JSON.stringify(members)))
    },
    SET_SEARCH_MEMBER_INFO (state, member) {
      recursionSetSearchMemberInfo(state.treeData, JSON.parse(JSON.stringify(member)))
      recursionSetSearchMemberInfo(state.treeDataForGroup, JSON.parse(JSON.stringify(member)))
      recursionSetSearchMemberInfo(state.treeDataForMessage, JSON.parse(JSON.stringify(member)))
    }
  },
  actions: {
    // 获取组织树数据
    GetTreeData ({ dispatch, commit, rootState }, id) {
      // const xmppDomain = rootState.home.xmppDomain
      return new Promise((resolve, reject) => {
        getTreeDataRequest(id)
          .then(response => {
            console.log('机构数据')
            console.log(JSON.stringify(response.data))
            commit('SET_TREEDATA', response.data)
            resolve()
          })
          .catch(err => reject(err))
      })
    },
    // 获取子节点成员
    GetNodeMember ({ dispatch, commit, rootState }, data) {
      const xmppDomain = rootState.home.xmppDomain
      return new Promise((resolve, reject) => {
        getNodeMemberRequest(data.id)
          .then(response => {
            // 节点下不存在成员
            if (!response.data.length) return
            const members = filterNodeMemberData(response.data, xmppDomain, data.groupName)
            if (!members.length) return
            console.log('机构成员')
            console.log(JSON.stringify(members))
            commit('SET_NODE_MEMBER_INFO', members)
            resolve()
          })
          .catch(err => reject(err))
      })
    },
    // 模糊查询组织机构成员
    SearchTreeMember ({ dispatch, commit, rootState }, data) {
      let x2js = new X2js()
      return new Promise((resolve, reject) => {
        searchTreeMemberRequest(data)
          .then(response => {
            response.data.forEach(item => {
              let vcard = item.vcard ? x2js.xml2js(item.vcard) : ''
              console.log(vcard)
              const member = {
                groupCode: item.groupCode,
                jid: `${item.username}${rootState.home.xmppDomain}`,
                label: vcard ? (vcard.vCard ? vcard.vCard.name : '') : '',
                name: vcard ? (vcard.vCard ? vcard.vCard.name : '') : '',
                sign: 'user',
                photo: vcard ? (vcard.vCard ? vcard.vCard.photo : normalUrl) : normalUrl,
                sex: vcard ? (vcard.vCard ? vcard.vCard.sex : '') : ''
              }
              commit('SET_SEARCH_MEMBER_INFO', member)
            })
            resolve()
          })
          .catch(err => reject(err))
      })
    }
  }
}

export default tree
