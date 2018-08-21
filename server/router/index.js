const router = require('express').Router()
const multer = require('multer')
// const log = require('./../log')('api')
const api = require('./../api')
const uploadApi = require('./../api/upload')

// RAP2 mock - 已弃用
// const mock = require('./../mock')
// router.all('*', function(req, res, next){
//   console.log('req.session.user')
//   if(req.session.user){
//     console.log(req.session.user)
//   }else{
//     console.log('not fond')
//   }
//   console.log(req.session)
//   console.log('req.sessionID', req.sessionID)
//   mock(req).then(result => {
//     // req.session.user = {
//     //   name: 'hekui',
//     //   sex: 'male'
//     // }
//     res.json(result)
//   }).catch(error => {
//     let response = {
//       err: error.message
//     }
//     log.info(`${req.url} - response - ${JSON.stringify(response)}`)
//     res.json(response)
//   })
// })

// 文件上传
router.all('/upload/image', multer().single('file'), function(req, res, next) {
  uploadApi.fetchJava(req, req.file).then(result => {
    res.json(result)
  }, result => {
    res.json({ code: result.code, msg: result.message || result.msg })
  })
})

// 登录
router.all('/login', function(req, res, next) {
  api.fetchPassport(req, req.body).then(result => {
    res.json(result)
  }, result => {
    res.json({ code: result.code, msg: result.message || result.msg })
  })
})

// 其他
router.all('*', function(req, res, next) {
  api.fetchJava(req, req.body).then(result => {
    res.json(result)
  }, result => {
    res.json({ code: result.code, msg: result.message || result.msg })
  })
})

module.exports = router
