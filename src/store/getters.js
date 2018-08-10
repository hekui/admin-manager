import utils from './utils'
const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  account: state => state.account.account,
  // TODO: 将account相关的信息，融合到一个getter
  token: state => state.account.token,
  avatar: state => state.account.avatar,
  name: state => state.account.name,
  introduction: state => state.account.introduction,
  status: state => state.account.status,
  roles: state => state.account.roles,
  setting: state => state.account.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  // 格式化类型数据
  paccountTypeDict: state => { // 公众号类型
    // console.log('state.paccountTypeDict', state.paccountTypeDict)
    return utils.formatType(state.paccountTypeDict)
  },
  tagTypeDict: state => { // 标签类型
    return utils.formatType(state.tagTypeDict)
  },
  articleTypeDict: state => { // 文章类型
    return utils.formatType(state.articleTypeDict)
  },
}
export default getters
