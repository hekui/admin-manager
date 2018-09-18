import api from './../../api'
export default {
  state: {
    statusData: { status: 0 }
  },
  mutations: {
    miniSet(state, data) {
      state[data['target']] = data['data']
    },
  },
  actions: {
    /**
     * @param {Object} params 入参对象，例如：{pageNo:1, pageSize: 20}
     * @returns {Object} Promise 约定所有actions方法均返回Promise对象
     */
    switchMini({ commit }, params) {
      // 小程序首页"预售入口"开关
      return api.post('/miniprogram/presellswitch', params).then(res => {
        commit('miniSet', {
          target: 'statusData',
          data: { status: params.status }
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    getMiniStatus({ commit }, params) {
      // 获取小程序首页"预售入口"开关状态
      return api.post('/miniprogram/presellstatus', params).then(res => {
        commit('miniSet', {
          target: 'statusData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    }
  },
}
