import {
  getTreeInfo, delGroup, addGroup, getGroupMessage, getGroupNo,
  getGroupNoList, sequenceTree, groupVisible, getGroupVisible, getGroupCount,
  createLicense, downloadLicense,getLicense, saveMiniprogram, getGroupTreeAndUser,
  updateServiceLisence, getServiceLisence
} from '@/api/group'

const group = {
  state: {
    treeData: ''
  },

  mutations: {
    SET_TREEDATA: (state, treeData) => {
      state.treeData = treeData
    }
  },

  actions: {
    // 获取组织树
    getTree({ commit }, code) {
      console.log('store::', code)
      return new Promise((resolve, reject) => {
        getTreeInfo(code).then(response => {
          console.log(response)
          const data = response
          commit('SET_TREEDATA', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //添加组织机构
    addTreeNode({ commit }, data) {
      return new Promise((resolve, reject) => {
        addGroup(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //删除组织机构信息
    delTreeNode({ commit }, code) {
      return new Promise((resolve, reject) => {
        delGroup(code).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetGroupMessage({ commit }, code) {
      return new Promise((resolve, reject) => {
        getGroupMessage(code).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取所有非直属机构根节点
    GetGroupNo({ commit }, params) {
      return new Promise((resolve, reject) => {
        getGroupNo(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取所有非直属机构根节点List
    GetGroupNoList({ commit },params) {
      return new Promise((resolve, reject) => {
        getGroupNoList(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 拖拽排序树
    SequenceTree({ commit }, data) {
      return new Promise((resolve, reject) => {
        sequenceTree(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 设置组织机构的可见范围
    GroupVisible({ commit }, data) {
      return new Promise((resolve, reject) => {
        groupVisible(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取该机构的可见范围
    GetGroupVisible({ commit }, groupCode) {
      return new Promise((resolve, reject) => {
        getGroupVisible(groupCode).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据组织机构代码查询机构信息
    GetGroupCount({ commit }, groupCode) {
      return new Promise((resolve, reject) => {
        getGroupCount(groupCode).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 生成授权文件
    CreateLicense({ commit }, data) {
      return new Promise((resolve, reject) => {
        createLicense(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
   GetLicense({ commit }, groupCode) {
      return new Promise((resolve, reject) => {
        getLicense(groupCode).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SaveMiniprogram({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveMiniprogram(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetGroupTreeAndUser({ commit }, data) {
      return new Promise((resolve, reject) => {
        getGroupTreeAndUser(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //
    UpdateServiceLisence({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateServiceLisence(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetServiceLisence({ commit }, data) {
      return new Promise((resolve, reject) => {
        getServiceLisence(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

  }
}

export default group
