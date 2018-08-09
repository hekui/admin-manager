import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import account from './modules/account'
import topic from './modules/topic'
import paccount from './modules/paccount'
import content from './modules/content'
import getters from './getters'
import user from './modules/user'
import feedback from './modules/feedback'
import advert from './modules/advert'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    routerLoading: false, // 路由切换loading效果
    pstatus: {
      0: '正常',
      1: '锁定',
      2: '停用'
    },
    options: [
      {
        'id': '154',
        'name': '类型一',
        'code': '1001',
        'parentId': '1',
        'typeStatus': 0,
        'remark': '备注',
        'childList': [
          {
            'id': '18184',
            'name': '类型一子一',
            'code': '1001001',
            'parentId': '154',
            'typeStatus': 0,
            'remark': '备注',
            'childList': [
              {
                'id': '1818418541',
                'name': '类型一子一子十六',
                'code': '1001001016',
                'parentId': '18184',
                'typeStatus': 1,
                'remark': '备注',
                'childList': []
              }
            ]
          }
        ]
      }
    ],
    ptype: [{
      id: 1,
      name: '房企'
    }, {
      id: 2,
      name: 'KOL自媒体'
    }]
  },
  mutations: {
    'SHOW_LOADING': (state) => {
      state.routerLoading = true
    },
    'HIDE_LOADING': (state) => {
      state.routerLoading = false
    }
  },
  modules: {
    app,
    account,
    errorLog,
    permission,
    tagsView,
    topic,
    paccount,
    content,
    user,
    feedback,
    advert
  },
  getters
})

export default store
