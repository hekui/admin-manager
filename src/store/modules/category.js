import api from './../../api'

export default {
  state: {
    paccountTypeDict: [],
    tagTypeDict: [],
    articleTypeDict: []
  },
  mutations: {
    categorySet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取指定城市下指定大类（公众号、文章、标签）下所有子类型（包括激活、锁定）
    getAllTypeDict({ commit, rootState }, params) {
      return api.post('/typedict/list', params).then(res => {
        formatType(res.data.list)
        commit('categorySet', {
          target: `${rootState.typeDict[params.code]}TypeDict`,
          data: res.data.list
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })

      function formatType(list) {
        list.map((item) => {
          if (item.childList.length > 0) {
            formatType(item.childList)
          } else {
            delete item.childList
          }
        })
      }
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
