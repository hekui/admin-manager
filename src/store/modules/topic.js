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
    }
  },
  mutations: {
    topicSet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    getTopicList({ commit }, params) {
      // 获取公众号列表代码
      return api.post('/topic/list', params).then(res => {
        console.log(res.data)
        commit('topicSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
