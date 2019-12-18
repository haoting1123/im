import Vue from 'vue'
// 引入官方的路由管理器
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

// 使用官方的路由管理器
Vue.use(Router)

/* Layout */
// 引入页面组件
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

export const fixedRouter = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    // path 设置为 '/'  默认显示该页面
    path: '/',
    component: Layout,
    redirect: '/home', // 重定向
    name: '主页',
  },
  {
    path: '/home',hidden: true ,
    component: Layout,
    redirect: '/home/index', // 重定向
    name: 'home',
    children: [
      {
        path: 'index',
        name: 'HomeIndex',
        component: () => import('@/views/home/index'),
        meta: { title: '主页', icon: 'processmanage', roles: ['admin', 'superAdmin'] }
      }
    ]
  }
]

export const permissionRouter = [
  {
    path: '/group',
    component: Layout,
    redirect: '/group/index',
    name: 'group',
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'GroupIndex',
        component: () => import('@/views/modules/group/group'),
        meta: { title: '机构管理', icon: 'tree', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/groupNo',
    component: Layout,
    redirect: '/groupNo/index',
    name: 'groupNo',
    meta: { roles: ['superAdmin'] },
    children: [
      {
        path: 'index',
        name: 'GroupNoIndex',
        component: () => import('@/views/modules/group/groupNo'),
        meta: { title: '机构管理', icon: 'tree', roles: ['superAdmin'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/index',
    name: 'user',
    meta: { title: '用户管理', icon: 'user', roles: ['admin'] },
    children: [
      {
        path: '/index',
        name: 'user',
        hidden: true,
        component: () => import('@/views/modules/user/user')
      },
      {
        path: '/addUser',
        name: 'addUser',
        hidden: true,
        component: () => import('@/views/modules/user/addUser'),
        meta: { title: '新增用户' }
      }, {
        path: '/updateUser',
        name: 'updateUser',
        hidden: true,
        component: () => import('@/views/modules/user/updateUser'),
        meta: { title: '修改用户' }
      }
    ]
  },
  {
    path: '/clientSet',
    component: Layout,
    redirect: '/clientSet/index',
    name: 'ClientSet',
    meta: { roles: ['superAdmin'] },
    children: [
      {
        path: 'index',
        name: 'ClientSet',
        component: () => import('@/views/modules/clientSet/index'),
        meta: { title: '客户端设置', icon: 'link', roles: ['superAdmin'] }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice',
    name: 'Notice',
    meta: { roles: ['superAdmin', 'admin'] },
    children: [
      {
        path: '/notice',
        name: 'Notice',
        component: () => import('@/views/modules/notice/index'),
        meta: { title: '系统公告', icon: 'form', roles: ['superAdmin', 'admin'] }
      }, {
        path: '/addNotice',
        name: 'addNotice',
        hidden: true,
        component: () => import('@/views/modules/notice/addNotice'),
        meta: { title: '新增公告' }
      }, {
        path: '/addNoticeNo',
        name: 'addNoticeNo',
        hidden: true,
        component: () => import('@/views/modules/notice/addNoticeNo'),
        meta: { title: '新增公告' }
      }
    ]
  },
  {
    path: '/systemLog',
    component: Layout,
    redirect: '/systemLog/loginLog',
    name: 'systemLog',
    meta: { roles: ['admin'] },
    children: [
      {
        path: '/loginLog',
        name: 'loginLog',
        component: () => import('@/views/modules/systemLog/loginLog'),
        meta: { title: '日志管理', icon: 'tasklist', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/version',
    component: Layout,
    redirect: '/version',
    name: 'version',
    meta: { roles: ['superAdmin'] },
    children: [
      {
        path: '/version',
        name: 'version',
        component: () => import('@/views/modules/version/version'),
        meta: { title: '版本管理', icon: 'tasklist', roles: ['superAdmin'] }
      }
    ]
  },
  {
    path: '/serviceNo',
    component: Layout,
    redirect: '/serviceNo',
    name: 'serviceNo',
    meta: { title: '服务号管理', icon: 'service', roles: ['admin'] },
    children: [
      {
        path: '/serviceNo',
        name: 'serviceNo',
        hidden: true,
        component: () => import('@/views/modules/serviceNo/serviceNo')
      }
    ]
  },
  {
    path: '/serviceNoArticle',
    component: Layout,
    redirect: '/serviceNoArticle',
    name: 'serviceNoArticle',
    meta: { title: '服务号文章', icon: 'formlist', roles: ['admin'] },
    children: [
      {
        path: '/serviceNoArticle',
        name: 'serviceNoArticle',
        hidden: true,
        component: () => import('@/views/modules/serviceNo/serviceNoArticle')
      }
    ]
  },
  {
    path: '/miniProgram',
    component: Layout,
    redirect: '/miniProgram',
    name: 'miniProgram',
    meta: { title: '小程序管理', icon: 'miniProgram', roles: ['superAdmin'] },
    children: [
      {
        path: '/miniProgram',
        name: 'miniProgram',
        hidden: true,
        component: () => import('@/views/modules/miniProgram/miniProgram')
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  // routes: constantRouterMap
  // 配置路由
  routes: fixedRouter
})
