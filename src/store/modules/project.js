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
    }
  },
  actions: {
    getProjectList({ commit }, params) {
      // 公众号列表-分页  /house/list
      return api.post('/subscription/list', params).then(res => {
        commit('projectSet', {
          target: 'listData',
          data: res.data
        })
        return res
      }, res => {
        return Promise.reject(res)
      })
    },
    getProjectMfm({ commit }, params) {
      // 取买房吗楼盘列表数据
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
    getProjectAdd({ commit }, params) {
      // 项目(楼盘)管理 / 批量添加楼盘
      return api.post('/house/add', params).then(res => {
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
