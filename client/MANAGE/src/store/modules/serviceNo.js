import {
  getServiceNoListPage,
  getServiceNoArticleListPage,
  getServiceNoListByGcode,
  getServiceNoArticleListByScode,
  delServiceNo,
  delServiceNoArticle,
  addServiceNo,
  addServiceNoArticle,
  updateServiceNoById,
  getServiceNoUser,
  savaServiceNoUser
} from '@/api/serviceNo'
const serviceNo = {
  state: {

  },

  mutations: {

  },

  actions: {
    // 获取列表
    GetServiceNoListPage({
      commit
    },params) {
      return new Promise((resolve, reject) => {
        getServiceNoListPage(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetServiceNoArticleListPage({
       commit
     },params) {
      return new Promise((resolve, reject) => {
        getServiceNoArticleListPage(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetServiceNoListByGcode({
       commit
     },params) {
      return new Promise((resolve, reject) => {
        getServiceNoListByGcode(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增
    AddServiceNo({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        addServiceNo(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    AddServiceNoArticle({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        addServiceNoArticle(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改
    UpdateServiceNoById({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        updateServiceNoById(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除
    DelServiceNo({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        delServiceNo(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    DelServiceNoArticle({
       commit
     }, data) {
      return new Promise((resolve, reject) => {
        delServiceNoArticle(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetServiceNoUser({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        getServiceNoUser(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SavaServiceNoUser({
       commit
     }, data) {
      return new Promise((resolve, reject) => {
        savaServiceNoUser(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default serviceNo
