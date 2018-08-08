import api from './../../api'
export default {
  state: {
    tagOptions: [{
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
    listData: { // 预计后端返回数据格式 - 未定
      totalPage: 0,
      curPage: 1,
      pageSize: 10,
      totalRecords: 0,
      list: []
    }
  },
  mutations: {
    tagSet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取标签列表
    getTagList({ commit }, params) {
      return api.post('/tag/list', params).then(res => {
        commit('tagSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 新增/修改一条标签
    saveAdvert({ commit }, params) {
      return api.post('/tag/save', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 切换标签状态
    offlineAdvert({ commit }, params) {
      return api.post('/tag/status', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
