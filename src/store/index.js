import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import paccount from './modules/paccount'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pstatus: {
      0: '正常',
      1: '锁定',
      2: '停用'
    },
    options: [{
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
    }]
  },
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    paccount
  },
  getters
})

export default store
