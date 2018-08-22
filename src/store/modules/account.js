import api from './../../api'
import { setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    account: {
      roles: [],
      token: '',
      introduction: '',
      avatar: '',
      name: ''
    },
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    accountSet: (state, data) => {
      state[data['target']] = data['data']
    }
  },

  actions: {
    // 用户名登录
    login({ commit }, params) {
      return api.post('/account/login', params).then(res => {
        setToken(res.data.ticketId)
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return api.post('/sysuser/userdata').then(res => {
        res.data.roles = res.data.roles || ['admin'] // 角色配置后删除此行
        commit('accountSet', {
          target: 'account',
          data: {
            roles: res.data.roles || [],
            token: res.data.ticketId || '',
            introduction: res.data.introduction || '',
            avatar: res.data.avatar || '',
            name: res.data.account || ''
          }
        })
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },

    // 登出
    LogOut({ commit }) {
      return api.post('/account/logout').then(res => {
        commit('accountSet', {
          target: 'account',
          data: {}
        })
        removeToken()
        return res
      }, res => {
        return Promise.resolve(res)
      })
    }
  }
}

export default user
