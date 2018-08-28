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
    syncStatus: {
      0: '未同步',
      1: '同步中',
      2: '同步完成',
      3: '同步失败',
      4: '数据未收录'
    },
    editId: '',
    detailId: '',
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
      return api.post('/subscription/list', params).then(res => {
        commit('paccountSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
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
        return Promise.reject(res)
      })
    },
    updatestatusStateInfo({ commit }, params) {
      // 更新公众号状态
      return api.post('/subscription/updatestatus', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    editPaccountInfo({ commit }, params) {
      // 编辑公众号
      return api.post('/subscription/edit', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    getArticleList({ commit }, params) {
      // 公众号详情-分页
      return api.post('/subscription/detail', params).then(res => {
        commit('paccountSet', {
          target: 'articleData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    addPaccountInfo({ commit }, params) {
      // 新增公众号监控
      return api.post('/subscription/add', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    updateArticleStatus({ commit }, params) {
      // 更新公众号文单内容状态
      return api.post('/content/updatestatus', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    syncPaccount({ commit }, params) {
      // 同步公众号数据
      return api.post('/subscription/sync', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
  }
}
