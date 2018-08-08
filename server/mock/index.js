const axios = require('axios')
// const api = require('./../api')
const log = require('./../log')('java')

function mock(req){
  let baseUrl = 'http://rap2s.maifangma.com/app/mock/16/'
  let url = `${baseUrl}${req.method}${req.url}`
  // return api.get(url, req.body)
  return axios({
    url: url,
    method: 'get',
    withCredentials: true,
    timeout: 10000,
    headers: {
      'token': '111',
      'Content-Type': 'application/json'
    }
  }).then(res => {
    log.trace(`${url} - ${JSON.stringify(res.data)}`)
    if (res.status === 200) {
      if (res.data.code === 0) {
        return res.data
      } else {
        return Promise.reject(res.data)
      }
    }
  }).catch(error => {
    // console.log('err', error)
    log.error(`${url} - ${error.message} - ${error.stack}`)
    return Promise.reject(error)
  })
}

module.exports = mock
