const router = require('express').Router()
const api = require('./../api')


// 登录
router.all('/login', function(req, res, next) {
  api.fetchPassport(req, req.body).then(result => {
    req.session.ticketId = result.data.ticketId
    console.log('req.session', req.session)
    res.json(result)
  }, result => {
    res.json({ code: result.code, msg: result.message || result.msg })
  })
})
// 登出
router.all('/logout', function(req, res, next) {
  api.fetchPassport(req, req.body).then(result => {
    req.session.ticketId = null
    res.json(result)
  }, result => {
    res.json({ code: result.code, msg: result.message || result.msg })
  })
})


module.exports = router
