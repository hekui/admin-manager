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
    },
    mfmList: { // 预计后端返回数据格式 - 未定
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
    },
  },
  mutations: {
    projectSet(state, data) {
      state[data['target']] = data['data']
    },
    houseSort(state, data) {
      state.listData.list[data.index].sort = data.sort
    },
    'SET_HOT_HOUSE': (state, data) => {

    }
  },
  actions: {
    // 查询房观察楼盘列表
    getProjectList({ commit }, params) {
      return api.post('/house/list', params).then(res => {
        commit('projectSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 修改序号
    updateHouseSort({ commit }, params) {
      return api.post('/house/updatesort', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 更新楼盘热门状态
    updateHouseHotstatus({ commit }, params) {
      return api.post('/house/updatehotstatus', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    getProjectDetail({ commit }, params) {
      return api.post('/house/matchwordlist', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    // 获取买房吗楼盘列表数据
    getProjectMfm({ commit }, params) {
      return api.post('/house/mfmlist', params).then(res => {
        commit('projectSet', {
          target: 'mfmList',
          data: res.data
        })
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
    // 项目(楼盘)管理 / 批量添加楼盘
    getProjectAdd({ commit }, params) {
      return api.post('/house/add', params).then(res => {
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    getProjectArticleList({ commit }, params) {
      return api.post('/house/contentlist', params).then(res => {
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
