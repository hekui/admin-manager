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
      return api.post('/advert/list?page=true', params).then(res => {
        commit('advertSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 获取广告信息
    getAdvertById({ commit }, params) {
      return api.post('/advert/find', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 修改一条广告
    editAdvert({ commit }, params) {
      return api.post('/advert/edit', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 新增一条广告
    addAdvert({ commit }, params) {
      return api.post('/advert/add', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 广告下线
    updateAdvertStatus({ commit }, params) {
      return api.post('/advert/updateStatus', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 上传
    uploadAdertImage({ commit }, params) {
      return api.post('/uploadimage', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
