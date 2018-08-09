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
  types: state => {
    const arr = state.typedict
    function filterType(arr) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        arr.map((item) => filterType(item))
      } else {
        if (Object.prototype.toString.call(arr) === '[object Object]') {
          for (var key in arr) {
            if (key === 'id') {
              arr['value'] = arr[key]
            }
            if (key === 'name') {
              arr['label'] = arr[key]
            }
            if (key === 'childList') {
              arr['children'] = arr[key]
            }
            delete arr[key]
          }
          if (!arr['children'].length) {
            delete arr['children']
          }
          if (arr['children'] instanceof Array && arr['children'].length) {
            filterType(arr['children'])
          }
        }
      }
    }
    filterType(arr)
  }
}
export default getters
