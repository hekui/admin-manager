import Mock from 'mockjs'
import account from './account'
import paccount from './paccount'
import content from './content'
import topic from './topic'
import articlesearch from './articlesearch'
import user from './user'
import feedback from './feedback'
import advert from './advert'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/account\/login/, account.login)
Mock.mock(/\/account\/logout/, account.logout)
Mock.mock(/\/account\/userinfo/, account.getUserInfo)

// 公众号相关
Mock.mock(/\/paccount\/list/, paccount)

// 内容管理相关
Mock.mock(/\/content\/list/, content.list)
Mock.mock(/\/content\/detail/, content.detail)
Mock.mock(/\/content\/save/, content.save)
Mock.mock(/\/content\/status/, content.status)

// 专题相关
Mock.mock(/\/topic\/list/, topic)
Mock.mock(/\/topic\/articlesearch/, articlesearch)

// 用户管理
Mock.mock(/\/user\/list/, user)
// 用户反馈
Mock.mock(/\/feedback\/list/, feedback)

// 配置管理相关
// 广告位管理相关
Mock.mock(/\/advert\/list/, advert.list)
Mock.mock(/\/content\/detail/, content.detail)
Mock.mock(/\/content\/save/, content.save)

export default Mock
