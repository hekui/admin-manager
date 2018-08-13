import api from './../../api'
export default {
  state: {},
  mutations: {
    categorySet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 删除类型
    deleteCategory({ commit }, params) {
      return api.post('/typedict/delete', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 改变激活/锁定状态
    changeCategoryStatus({ commit }, params) {
      return api.post('/typedict/editstatus', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    getCategoryById({ commit }, params) {
      return api.post('/typedict/querybyid', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
    // 改变激活/锁定状态
    saveOrEditType({ commit }, params) {
      return api.post('/typedict/saveoredit', params).then(res => {
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
