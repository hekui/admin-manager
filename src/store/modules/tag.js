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
    allTags: [], // 全部标签
    listData: { // 预计后端返回数据格式 - 未定
      totalPage: 0,
      curPage: 1,
      pageSize: 10,
      totalRecords: 0,
      list: []
    },
  },
  mutations: {
    tagSet(state, data) {
      state[data['target']] = data['data']
    },
    sequenceNum(state, data) {
      state.listData.list[data.index].sequenceNum = data.sequenceNum
    }
  },
  actions: {
    // 获取所有标签（不分页,内容管理文章关联标签使用到）
    getAllTags({ commit }) {
      return api.post('/label/list').then(res => {
        commit('tagSet', {
          target: 'allTags',
          data: res.data.list
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 获取标签列表
    getTagList({ commit }, params) {
      return api.post('/label/listpage', params).then(res => {
        commit('tagSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 修改排序
    updateSequenceNum({ commit }, params) {
      return api.post('/label/updatelabel', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 根据标签id查询
    queryTagById({ commit }, params) {
      return api.post('/label/querybyid', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 切换标签状态
    changeTagStatus({ commit }, params) {
      return api.post('/label/updatelabel', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 新增/修改一条标签
    saveOrEditTag({ commit }, params) {
      return api.post('/label/saveoredit', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
  }
}
