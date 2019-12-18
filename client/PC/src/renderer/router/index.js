import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const MessageDialog = resolve => require(['@/components/dialog/messageDialog'], resolve)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: require('@/views/login/Login').default,
      meta: { requiresAuth: false }
    }, {
      path: '/',
      name: 'home',
      component: require('@/views/home/Home').default,
      // component: require('@/components/LandingPage').default
      meta: { requiresAuth: false },
      children: [
        {
          path: 'messages/messageChat/:channelId',
          name: 'messageDialog',
          component: require('@/components/dialog/messageDialog').default
        },
        {
          path: 'noContent',
          name: 'noContent',
          component: require('@/components/common/no-content').default
        },
        {
          path: 'message/notice/newfriend',
          name: 'newFriendComponent',
          component: require('@/components/home/newFriend-component').default
        }
      ]
    }
  ]
})

// 验证token，存在才跳转
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token')
  if (to.path === '/') {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  if (to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router
