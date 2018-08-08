import api from './../../api'
export default {
  state: {
    listData: { // 预计后端返回数据格式 - 未定
      totalPage: 0,
      curPage: 1,
      pageSize: 10,
      totalRecords: 0,
      list: []
    }
  },
  mutations: {
    advertSet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取广告列表
    getAdvertList({ commit }, params) {
      return api.post('/advert/list', params).then(res => {
        commit('advertSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 新增/修改一条广告
    saveAdvert({ commit }, params) {
      return api.post('/advert/update', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 广告下线
    offlineAdvert({ commit }, params) {
      return api.post('/advert/offline', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
