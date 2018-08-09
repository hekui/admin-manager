import api from './../../api'
export default {
  state: {
    treeData1: [],
    treeData2: [],
    treeData3: []
  },
  mutations: {
    categorySet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取类型列表
    getCategoryList({ commit }, params) {
      return api.post('/typedict/list', params).then(res => {
        commit('categorySet', {
          target: 'treeData1',
          data: res.data
        })
        commit('categorySet', {
          target: 'treeData2',
          data: res.data
        })
        commit('categorySet', {
          target: 'treeData3',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },
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
    }
  }
}
