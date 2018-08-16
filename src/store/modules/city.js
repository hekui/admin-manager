import api from './../../api'
export default {
  state: {
    allCitys: [], // 所有城市
    activatedCitys: [] // 激活状态的城市
  },
  mutations: {
    citySet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取所有城市
    getAllCitys({ commit }, params) {
      return api.post('/city/listall', params).then(res => {
        commit('citySet', {
          target: 'allCitys',
          data: res.data.list
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 获取激活城市
    getActivatedCitys({ commit }) {
      return api.post('/city/list').then(res => {
        commit('citySet', {
          target: 'activatedCitys',
          data: res.data.list
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 根据城市id查询
    queryCityById({ commit }, params) {
      return api.post('', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 切换城市状态
    changeCityStatus({ commit }, params) {
      return api.post('', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 新增/修改一条城市
    saveOrEditCity({ commit }, params) {
      return api.post('', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
  }
}
