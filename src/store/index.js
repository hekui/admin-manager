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
import tag from './modules/tag'
import category from './modules/category'
import api from './../api'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    routerLoading: false, // 路由切换loading效果
    cityDialog: false, // 城市弹窗
    cityId: '51010000', // 城市Id
    cityName: '成都',
    cityOptions: [
      {
        cityId: '51010000',
        cityName: '成都'
      },
      {
        cityId: '50000000',
        cityName: '重庆'
      },
      {
        cityId: '61010000',
        cityName: '西安'
      }
    ],
    typeDict: { // 类型字典
      1: 'paccount', // 1,公众号
      2: 'tag', // 2,标签
      3: 'article' // 3,文章
    },
    paccountTypeDict: [],
    tagTypeDict: [],
    articleTypeDict: [],
    // 公众号相关
    wechatStatus: {
      1: '启用',
      2: '停用'
    },
    pclassify: [{
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
    },
    'SHOW_CITY_DIALOG': (state) => {
      state.cityDialog = true
    },
    'HIDE_CITY_DIALOG': (state) => {
      state.cityDialog = false
    },
    'SET_CITYID': (state, cityId) => {
      state.cityId = cityId
      state.cityOptions.forEach((option) => {
        if (option.cityId === cityId) {
          state.cityName = option.cityName
        }
      })
    },
    stateSet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取指定城市下指定指定顶级类型下所有子项
    getTypeDict({ commit, state }, params) {
      return api.post('/typedict/list', params).then(res => {
        // console.log(`${state.typeDict[params.code]}TypeDict`, res)
        commit('stateSet', {
          target: `${state.typeDict[params.code]}TypeDict`,
          data: res.data.list
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
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
    advert,
    tag,
    category
  },
  getters
})

export default store
