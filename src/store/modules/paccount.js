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
    articleData: { // 预计后端返回数据格式 - 未定
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
    }
  },
  mutations: {
    paccountSet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    /**
     * @param {Object} params 入参对象，例如：{pageNo:1, pageSize: 20}
     * @returns {Object} Promise 约定所有actions方法均返回Promise对象
     */
    getPaccountList({ commit }, params) {
      // 获取公众号列表代码
      return api.post('/paccount/list', params).then(res => {
        commit('paccountSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    testMock({ commit }, params) {
      // 获取公众号列表代码
      console.log('params', params)
      return api.get('/label/citylabel', params).then(res => {
        console.log(res)
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    getArticleList({ commit }, params) {
      // 获取公众号文章列表代码
      return api.post('/paccount/article', params).then(res => {
        commit('paccountSet', {
          target: 'articleData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
