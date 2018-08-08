const router = require('express').Router()
const log = require('./../log')('api')

// RAP2 mock
const mock = require('./../mock')
router.all('*', function(req, res, next){
  // console.log('req.session.user')
  // if(req.session.user){
  //   console.log(req.session.user)
  // }else{
  //   console.log('not fond')
  // }
  // console.log(req.session)
  mock(req).then(result => {
    // req.session.user = {
    //   name: 'hekui',
    //   sex: 'male'
    // }
    res.json(result)
  }).catch(error => {
    let response = {
      err: error.message
    }
    log.info(`${req.url} - response - ${JSON.stringify(response)}`)
    res.json(response)
  })
})


// router.use('/account', function(req, res, next){

// })

router.all('*', function(req, res, next){
  console.log('req.url', req.url)
  res.send('hello api: '+ req.url);
  // let startTime = new Date().getTime()
  // webDecryptInterface(req, req.url, req.body).then(result => {
  //   console.log(`route - ${req.url} - ${new Date().getTime() - startTime}ms`)
  //   res.json(result);
  // })
})

module.exports = router