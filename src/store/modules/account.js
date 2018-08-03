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
        console.log('login res', res)
        commit('accountSet', {
          target: 'account',
          data: res.data
        })
        setToken(res.data.token)
        return res
      }, res => {
        return Promise.resolve(res)
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return api.post('/account/userinfo').then(res => {
        commit('accountSet', {
          target: 'account',
          data: res.data
        })
        setToken(res.data.token)
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
