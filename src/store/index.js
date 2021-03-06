import Vue from 'vue'
import Vuex from 'vuex'
import api from './../api'
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
import city from './modules/city'
import project from './modules/project'
import mini from './modules/mini'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    routerLoading: false, // 路由切换loading效果
    cityDialog: false, // 城市弹窗
    cityId: '51010000', // 城市Id
    cityOptions: [], // 激活状态的所有城市
    typeDict: { // 类型字典
      1: 'paccount', // 1,公众号
      2: 'tag', // 2,标签
      3: 'article' // 3,文章
    },
    paccountTypeDict: [],
    tagTypeDict: [],
    articleTypeDict: [],
    pclassifyTypeDict: [],
    region: [], // 区域字典数据列表
    salestatus: [], // 销售状态字典数据
    // 公众号相关
    status: {
      1: '启用',
      2: '停用'
    },
    wechatStatus: {
      1: '是',
      2: '否'
    },
    pclassify: {
      1: '房企',
      2: 'KOL自媒体'
    },
    pickerOptions: { // 日期快捷选项
      shortcuts: [{
        text: '最近一周',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }]
    }
  },
  mutations: {
    'SHOW_LOADING': (state) => {
      state.routerLoading = true
    },
    'HIDE_LOADING': (state) => {
      state.routerLoading = false
    },
    'SET_CITY_OPTIONS': (state, data) => {
      state.cityOptions = data
    },
    'SHOW_CITY_DIALOG': (state) => {
      state.cityDialog = true
    },
    'HIDE_CITY_DIALOG': (state) => {
      state.cityDialog = false
    },
    'SET_CITYID': (state, cityId) => {
      state.cityId = cityId
    },
    'SET_REGION_OPTIONS': (state, data) => {
      state.region = data
    },
    'SET_SALESTATUS_OPTIONS': (state, data) => {
      state.salestatus = data
    },
    stateSet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取指定城市下指定大类（公众号、文章、标签）下所有已激活的子类型（不包括锁定）
    getTypeDict({ commit, state }, params) {
      params.status = 1
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
    // 获取全部城市
    getActivatedCitys({ commit }) {
      return api.post('/city/listall').then(res => {
        commit('SET_CITY_OPTIONS', res.data.list)
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 获取区域字典数据
    getRegion({ commit }) {
      return api.post('/dict/region').then(res => {
        commit('SET_REGION_OPTIONS', res.data)
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 获取销售状态字典数据
    getSaleStatus({ commit }) {
      return api.post('/dict/salestatus').then(res => {
        commit('SET_SALESTATUS_OPTIONS', res.data)
        return res
      }, res => {
        return Promise.resolve(res)
      })
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
    advert,
    tag,
    category,
    city,
    project,
    mini,
  },
  getters
})

export default store
