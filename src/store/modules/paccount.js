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
    },
    infoData: [],
    detailsStatus: {
      0: '删除',
      1: '启用',
      2: '禁用'
    },
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
      // 公众号列表-分页
      return api.post('/subscription/list?page=true', params).then(res => {
        commit('paccountSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    getPaccountInfo({ commit }, params) {
      // 查询公众号基本信息
      return api.post('/subscription/find', params).then(res => {
        commit('paccountSet', {
          target: 'infoData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    editPaccountInfo({ commit }, params) {
      // 编辑公众号基本信息
      return api.post('/subscription/updatestatus', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    getArticleList({ commit }, params) {
      // 公众号详情-分页
      return api.post('/subscription/detail?page=true', params).then(res => {
        commit('paccountSet', {
          target: 'articleData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    addPaccountInfo({ commit }, params) {
      // 新增公众号监控
      return api.post('/subscription/add', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    updateArticleStatus({ commit }, params) {
      // 更新公众号文单内容状态
      return api.post('/content/updatestatus', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
  }
}
