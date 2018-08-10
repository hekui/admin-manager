import Mock from 'mockjs'
import account from './account'
// import paccount from './paccount'
import content from './content'
import topic from './topic'
// import user from './user'
// import feedback from './feedback'
import advert from './advert'
import tag from './tag'
import category from './category'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/account\/login/, account.login)
Mock.mock(/\/account\/logout/, account.logout)
Mock.mock(/\/account\/userinfo/, account.getUserInfo)

// 公众号相关
// Mock.mock(/\/paccount\/list/, paccount.index)
// Mock.mock(/\/paccount\/article/, paccount.article)

// 内容管理相关
// Mock.mock(/\/content\/list/, content.list)
Mock.mock(/\/content\/detail/, content.detail)
Mock.mock(/\/content\/save/, content.save)
Mock.mock(/\/content\/status/, content.status)

// 专题相关
// Mock.mock(/\/topic\/list/, topic.topiclist)
Mock.mock(/\/topic\/articlesearch/, topic.articlelist)
// Mock.mock(/\/tag\/list/, topic.taglist)
// Mock.mock(/\/topic\/find/, topic.topicinfo)

// 用户管理
// Mock.mock(/\/user\/list/, user)
// 用户反馈
// Mock.mock(/\/feedback\/list/, feedback)

// 配置管理相关
// 广告管理相关
Mock.mock(/\/advert\/list/, advert.list)
Mock.mock(/\/advert\/save/, advert.save)
Mock.mock(/\/advert\/offline/, advert.offline)
// 标签管理相关
Mock.mock(/\/label\/list/, tag.list)
Mock.mock(/\/label\/querybyid/, tag.querybyid)
Mock.mock(/\/label\/saveoredit/, tag.save)
Mock.mock(/\/label\/status/, tag.status)
Mock.mock(/\/label\/updateSequenceNum/, tag.updateSequenceNum)
// 类型管理相关
// Mock.mock(/\/typedict\/list/, category.list)
Mock.mock(/\/typedict\/querybyid/, category.querybyid)
Mock.mock(/\/typedict\/saveoredit/, category.save)
Mock.mock(/\/typedict\/editstatus/, category.status)
Mock.mock(/\/typedict\/delete/, category.delete)

export default Mock
