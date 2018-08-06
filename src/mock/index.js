import Mock from 'mockjs'
import account from './account'
import paccount from './paccount'
import content from './content'

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

export default Mock
