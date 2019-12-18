import {
  getVersionInfo
} from '../../api/system'

const system = {
  state: {

  },
  mutations: {},
  actions: {
    // 获取版本信息
    GetVersionInfo ({ commit }, systype) {
      return new Promise((resolve, reject) => {
        getVersionInfo(systype).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default system
