import Mock from 'mockjs'
import account from './account'
import paccount from './paccount'
import topic from './topic'
import articlesearch from './articlesearch'
import user from './user'
import feedback from './feedback'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/account\/login/, account.login)
Mock.mock(/\/account\/logout/, account.logout)
Mock.mock(/\/account\/userinfo/, account.getUserInfo)

// 公众号相关
Mock.mock(/\/paccount\/list/, paccount)

// 专题相关
Mock.mock(/\/topic\/list/, topic)
Mock.mock(/\/topic\/articlesearch/, articlesearch)

// 用户管理
Mock.mock(/\/user\/list/, user)
// 用户反馈
Mock.mock(/\/feedback\/list/, feedback)

export default Mock
