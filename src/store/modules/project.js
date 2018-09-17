import api from './../../api'
export default {
  state: {

  },
  mutations: {
    projectSet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    getProjectDetail({ commit }, params) {
      return api.post('/house/matchwordlist', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    saveMatchWords({ commit }, params) {
      return api.post('/house/savematchword', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    getProjectArticleList({ commit }, params) {
      return api.post('/house/contentlist?page=true', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    cancelBindArticle({ commit }, params) {
      return api.post('/house/removecontent', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    /**
     * dialog弹框使用数据，组件使用，数据存放到对应组件
     * @param {Object} params 入参对象，例如：{pageNo:1, pageSize: 20}
     * @returns {Object} Promise 约定所有actions方法均返回Promise对象
     */
    getProjectDialogData({ commit }, params) {
      return api.post('/', params)
    }
  }
}
