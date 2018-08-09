import api from './../../api'
export default {
  state: {
    treeData1: [{
      id: 1,
      label: '公众号一级 1',
      status: 1,
      children: [{
        id: 4,
        label: '公众号二级 1-1',
        status: 1,
        children: [{
          id: 9,
          label: '公众号三级 1-1-1',
          status: 1
        }, {
          id: 10,
          label: '公众号三级 1-1-2',
          status: 1
        }]
      }]
    }, {
      id: 2,
      label: '公众号一级 2',
      status: 1,
      children: [{
        id: 5,
        label: '公众号二级 2-1',
        status: 1
      }, {
        id: 6,
        label: '公众号二级 2-2',
        status: 1
      }]
    }, {
      id: 3,
      label: '公众号一级 3',
      status: 1,
      children: [{
        id: 7,
        label: '公众号二级 3-1',
        status: 1
      }, {
        id: 8,
        label: '公众号二级 3-2',
        status: 1
      }]
    }],
    treeData2: [{
      id: 1,
      label: '标签一级 1',
      status: 1,
      children: [{
        id: 4,
        label: '标签二级 1-1',
        status: 1,
        children: [{
          id: 9,
          label: '标签三级 1-1-1',
          status: 1
        }, {
          id: 10,
          label: '标签三级 1-1-2',
          status: 1
        }]
      }]
    }, {
      id: 2,
      label: '标签一级 2',
      status: 1,
      children: [{
        id: 5,
        label: '标签二级 2-1',
        status: 1
      }, {
        id: 6,
        label: '标签二级 2-2',
        status: 1
      }]
    }, {
      id: 3,
      label: '标签一级 3',
      status: 1,
      children: [{
        id: 7,
        label: '标签二级 3-1',
        status: 1
      }, {
        id: 8,
        label: '标签二级 3-2',
        status: 1
      }]
    }],
    treeData3: [{
      id: 1,
      label: '文章一级 1',
      status: 1,
      children: [{
        id: 4,
        label: '文章二级 1-1',
        status: 1,
        children: [{
          id: 9,
          label: '文章三级 1-1-1',
          status: 1
        }, {
          id: 10,
          label: '文章三级 1-1-2',
          status: 1
        }]
      }]
    }, {
      id: 2,
      label: '文章一级 2',
      status: 1,
      children: [{
        id: 5,
        label: '文章二级 2-1',
        status: 1
      }, {
        id: 6,
        label: '文章二级 2-2',
        status: 1
      }]
    }, {
      id: 3,
      label: '文章一级 3',
      status: 1,
      children: [{
        id: 7,
        label: '文章二级 3-1',
        status: 1
      }, {
        id: 8,
        label: '文章二级 3-2',
        status: 1
      }]
    }]
  },
  mutations: {
    categorySet(state, data) {
      state[data['target']] = data['data']
    }
  },
  actions: {
    // 获取标签列表
    getTreeList({ commit }, params) {
      return api.post('/tag/list', params).then(res => {
        commit('categorySet', {
          target: 'treeDate',
          data: res.data
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}
