import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

const router = new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

router.beforeEach((to, from, next) => {
  next()
})

export default router

export const asyncRouterMap = [
  // 公众号
  {
    path: '/paccount',
    name: 'paccount',
    component: Layout,
    redirect: '/paccount/list',
    meta: {
      title: 'paccount',
      icon: 'wechat'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'list',
      component: () => import('@/views/paccount/list'),
      name: 'paccountList',
      meta: {
        title: 'paccountList'
        // roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'add',
      component: () => import('@/views/paccount/edit'),
      name: 'paccountAdd',
      meta: {
        title: 'paccountAdd'
        // if do not set roles, means: this page does not require permission
      }
    }, {
      path: 'edit',
      hidden: true,
      component: () => import('@/views/paccount/edit'),
      name: 'paccountDetail',
      meta: {
        title: 'paccountDetail'
        // if do not set roles, means: this page does not require permission
      }
    }]
  },

  {
    path: '/content',
    component: Layout,
    meta: { title: 'content', icon: 'article', noCache: true },
    children: [{
      path: 'index',
      component: () => import('@/views/content/index'),
      name: 'contentlist',
      meta: { title: 'contentlist', noCache: true }
    }, {
      path: 'detail',
      component: () => import('@/views/content/detail'),
      name: 'contentdetail',
      meta: { title: 'contentdetail', noCache: true }
    }, {
      path: 'edite',
      component: () => import('@/views/content/edit'),
      name: 'contentedit',
      meta: { title: 'contentedit', noCache: true }
    }]
  },
  // 专题管理
  {
    path: '/topic',
    name: 'topic',
    component: Layout,
    redirect: '/topic/list',
    meta: {
      title: 'topic',
      icon: 'topic'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'list',
      component: () => import('@/views/paccount/list'),
      name: 'topicList',
      meta: {
        title: 'topicList'
        // roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'edit',
      component: () => import('@/views/svg-icons/index'),
      name: 'editTopic',
      meta: {
        title: 'editTopic'
        // if do not set roles, means: this page does not require permission
      }
    }]
  },
  // 用户管理
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/list',
    meta: {
      title: 'userMange',
      icon: 'user'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'userMange',
      meta: {
        title: 'userMange'
        // roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'feedback',
      component: () => import('@/views/user/feedback'),
      name: 'userFeedback',
      meta: {
        title: 'userFeedback'
        // if do not set roles, means: this page does not require permission
      }
    }]
  },
  // 配置
  {
    path: '/setting',
    name: 'setting',
    component: Layout,
    redirect: '/setting/advert',
    meta: {
      title: 'setting',
      icon: 'setting'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'advert',
      component: () => import('@/views/svg-icons/index'),
      name: 'advert',
      meta: {
        title: 'advert'
        // roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'category',
      component: () => import('@/views/svg-icons/index'),
      name: 'category',
      meta: {
        title: 'category'
        // if do not set roles, means: this page does not require permission
      }
    }, {
      path: 'tag',
      component: () => import('@/views/svg-icons/index'),
      name: 'tag',
      meta: {
        title: 'tag'
        // if do not set roles, means: this page does not require permission
      }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]
