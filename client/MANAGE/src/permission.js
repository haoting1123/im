import router from './router'
// 取到需要权限判断的路由表
import { permissionRouter, fixedRouter } from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getStore } from '@/utils/mUtils.js' // 引入工具方法


const whiteList = ['/login'] // 不重定向白名单


var addRouFlag = getStore('addRouFlag') // 获取localStorage("addRouFlag")

// 在路由跳转的时候，我们需要一些权限判断或者其他操作。这个时候就需要使用路由的钩子函数。
// 定义：路由钩子主要是给使用者在路由发生变化时进行一些特殊的处理而定义的函数。
router.beforeEach((to, from, next) => {  /*在跳转之前执行的钩子函数*/
  /** to: router即将进入的路由对象
   *  from: 当前导航即将离开的路由
   *  next: Function,进行管道中的一个钩子，如果执行完了，则导航的状态就是 confirmed （确认的）；否则为false，终止导航。
   */
  // 取得用户的角色
  let GetRole
  // 使用进度条
  NProgress.start()
  // if(getToken())
  // 如果用户已登录  判断用户角色
  if (getStore('token')) {
    console.log('permission.js  登录成功，判断用户角色')
    if (getStore('token') === 'superAdmin') {
      // 用户角色为超级管理员
      console.log('permission.js  用户为超级管理员')
      GetRole = ['superAdmin']
    } else {
      // 用户角色为普通管理员
      console.log('permission.js  用户为普通管理员')
      GetRole = ['admin']
    }
    // 1.如果路由表 没根据角色进行筛选,就筛选一次
    if (!addRouFlag) {
      addRouFlag = true
      // 2.根据用户的角色、和需要动态展示的路由，生成符合用户角色的路由
      var getRoutes = baseRoleGetRouters(permissionRouter, GetRole)
      // console.log("getRoutes============",getRoutes)
      // 3.利用global属性，让渲染菜单的组件sideMeuns.vue重新生成左侧菜单
      global.antRouter = fixedRouter.concat(getRoutes)
      console.log('permission.js  动态生成路由global.antRouter============', global.antRouter)
      // 4.将生成好的路由addRoutes
      router.addRoutes(fixedRouter.concat(getRoutes))
      // router.options.routes.push(...getRoutes)
      // 5.push之后，会重新进入到beforeEach的钩子里,直接进入第一个if判断
      console.log('permission.js 用户已登录 =>' + to + '( '+ to.path +' )' )
      //next()
      router.push({ path: to.path })
    } else {
      // 进行下一个钩子
      console.log('permission.js 用户已登录，路由已生成，执行next()转到主页')
      // 进入目标页
      next()
    }
  } else { 
    addRouFlag = false
    // 用户没登录，跳转到登录页面
    console.log("permission.js 用户未登录 =>"+ to + '( '+ to.path +' )' )
    // 查看当前路由是否在不重定向白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      // 在不重定向白名单中 执行下一个钩子
      console.log('permission.js' + to.path + '在不重定向白名单中，进入' + to.path)
      next()
    } else {
      // 不在不重定向白名单中 则重定向到登录页
      console.log("permission.js 重定向登录页 =>"+ to + '( '+ to.path +' )' )
      next(`/login?redirect=${to.path}`)  /** 原代码 */
      NProgress.done()
    }
  }
})

// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   console.log('permission....')
//   if (getToken()) {
//     if (to.path === '/login') {
//       next({ path: '/' })
//       NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
//     } else {
//       if (store.getters.roles.length === 0) {
//         store.dispatch('GetInfo').then(res => { // 拉取用户信息
//           next()
//         }).catch((err) => {
//           store.dispatch('FedLogOut').then(() => {
//             Message.error(err || 'Verification failed, please login again')
//             next({ path: '/' })
//           })
//         })
//       } else {
//         next()
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
//       NProgress.done()
//     }
//   }
// })

/** 在跳转之后执行的钩子函数 */
router.afterEach(() => {
  console.log('permission.js 跳转后执行：结束进度条')
  NProgress.done() // 结束Progress 进度条
})


// 根据用户的角色取到该用户对应的路由
function baseRoleGetRouters(allRoutes, roles) {
  // console.log('allRoutes===',allRoutes)
  // console.log('roles===',roles)
  // allRoutes是动态路由表
  // roles是取到的用户角色，数组
  let rightRoutes
  if (allRoutes) {
    rightRoutes = allRoutes.filter((route, index) => {
      if (hasPermission(route, roles)) {
        if (route.children && route.children.length) {
          route.children = baseRoleGetRouters(route.children, roles)
        }
        return true
      }
      return false
    })
  }
  return rightRoutes
}


function hasPermission(route, roles) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}