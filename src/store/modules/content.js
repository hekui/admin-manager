import api from './../../api'
export default {
  state: {
    listData: {
      curPage: 1,
      hasNext: true,
      hasPrevious: false,
      nextPage: 2,
      pageSize: 10,
      qualification: '',
      sortType: '',
      totalPage: 0,
      totalRecords: 0,
      list: []
    },
    refreshList: false,
    recommendlistData: {
      curPage: 1,
      hasNext: true,
      hasPrevious: false,
      nextPage: 2,
      pageSize: 10,
      qualification: '',
      sortType: '',
      totalPage: 0,
      totalRecords: 0,
      list: []
    },
    refreshRecommendList: false,
    detailId: '',
    detailData: {},
    houseList: []
  },
  mutations: {
    contentSet(state, data) {
      state[data['target']] = data['data']
    },
    'SET_ARTICLE_TYPE': (state, data) => {
      state.detailData.typeDictList = data
    },
    'SET_ARTICLE_TAGS': (state, data) => {
      state.detailData.labels = data
    },
    'SET_ARTICLE_HOUSELIST': (state, data) => {
      state.detailData.houseList = data
    },
    'SET_RECOMMEND_STATUS': (state, data) => {
      state.listData.list[data.index].recommendStatus = data.recommendStatus
    },
    'SET_SORT': (state, data) => {
      state.recommendlistData.list[data.index].sort = data.sort
    },
    'SET_RECOMMENDATION': (state, data) => {
      state.recommendlistData.list[data.index].recommendation = data.recommendation
    },
    'SET_REFRESH_LIST': (state, flag) => {
      state.refreshList = flag
    },
    'SET_REFRESH_RECOMMEND_LIST': (state, flag) => {
      state.refreshRecommendList = flag
    }
  },
  actions: {
    // 获取内容列表
    getContentList({ commit }, params) {
      commit('contentSet', {
        target: 'listData',
        data: {}
      })
      commit('SET_REFRESH_LIST', false) // 将监听刷新数据的属性改成默认值
      return api.post('/content/list', params).then(res => {
        commit('contentSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 获取推荐内容列表
    getContentRecommendlist({ commit }, params) {
      commit('SET_REFRESH_RECOMMEND_LIST', false) // 将监听刷新数据的属性改成默认值
      return api.post('/content/recommendlist', params).then(res => {
        commit('contentSet', {
          target: 'recommendlistData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 改变内容启用/禁用状态
    changeContentStatus({ commit }, params) {
      return api.post('/content/updatestatus', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 更新文章推荐状态
    updateRecommendStatus({ commit }, params) {
      return api.post('/content/updaterecommendstatus', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 更新展示顺序
    updateSort({ commit }, params) {
      return api.post('/content/updatesort', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 更新文章推荐状态
    updateRecommendation({ commit }, params) {
      return api.post('/content/updaterecommendation', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 获取内容详情
    getContentDetail({ commit }, params) {
      return api.post('/content/detail', params).then(res => {
        commit('contentSet', {
          target: 'detailData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 保存内容类型
    saveContentType({ commit }, params) {
      return api.post('/content/updatetype', params).then(res => {
        commit('SET_ARTICLE_TYPE', res.data.list)
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 保存内容标签
    saveContentTags({ commit }, params) {
      return api.post('/content/updatelabel', params).then(res => {
        commit('SET_ARTICLE_TAGS', res.data.list)
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 删除项目
    deleteHouse({ commit }, params) {
      return api.post('/content/delhouse', params).then(res => {
        commit('SET_ARTICLE_HOUSELIST', res.data.houseList)
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 新增项目
    addHouse({ commit }, params) {
      return api.post('/content/addhouse', params).then(res => {
        commit('SET_ARTICLE_HOUSELIST', res.data.houseList)
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    getHouseList({ commit }, params) {
      return api.post('/house/list', params).then(res => {
        commit('contentSet', {
          target: 'houseList',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    }
  }
}
