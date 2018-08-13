import api from './../../api'
export default {
  state: {
    listData: { // 预计后端返回数据格式 - 未定
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
    detailData: {}
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
  },
  actions: {
    // 获取内容列表
    getContentList({ commit }, params) {
      return api.post('/content/list?page=true', params).then(res => {
        commit('contentSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 改变内容启用/禁用状态
    changeContentStatus({ commit }, params) {
      return api.post('/content/updatestatus', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
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
        return Promise.resolve(res)
      })
    },
    // 保存内容类型
    saveContentType({ commit }, params) {
      return api.post('/content/updatetype', params).then(res => {
        commit('SET_ARTICLE_TYPE', res.data.list)
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 保存内容标签
    saveContentTags({ commit }, params) {
      return api.post('/content/updatelabel', params).then(res => {
        commit('SET_ARTICLE_TAGS', res.data.list)
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
