import api from './../../api'
export default {
  state: {
    options: [{
      value: 1,
      label: '一级分类1',
      children: [{
        value: 3,
        label: '二级分类1'
      }, {
        value: 4,
        label: '二级分类2'
      }]
    }, {
      value: 2,
      label: '一级分类2',
      children: [{
        value: 5,
        label: '二级分类1'
      }, {
        value: 6,
        label: '二级分类2'
      }]
    }],
    tagOptions: ['标签1', '标签2', '标签3'],
    listData: { // 预计后端返回数据格式 - 未定
      totalPage: 0,
      curPage: 1,
      pageSize: 10,
      totalRecords: 0,
      list: []
    },
    detailData: { // 预计后端返回数据格式 - 未定
      id: '',
      url: '',
      articleTitle: '',
      name: '',
      origin: '',
      date: '',
      articleContent: '',
      praisingQuantity: '',
      readingQuantity: '',
      lonlat: '',
      articleType: [],
      tags: []
    }
  },
  mutations: {
    contentSet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取内容列表
    getContentList({ commit }, params) {
      return api.post('/content/list', params).then(res => {
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
      return api.post('/content/status', params).then(res => {
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
    // 保存内容二次编辑
    saveContentEdit({ state }) {
      return api.post('/content/save', state.detailData).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
