const axios = require('axios')
const log = require('./../log')('java')
const methods = ['post']
const config = require('./config')

class Api {
  constructor() {
    methods.forEach(method => {
      this[method] = (baseUrl = '', req, data = {}) => new Promise((resolve, reject) => {
        log.trace('data', data)
        const url = baseUrl + req.url
        log.trace('url', url)
        log.trace('req.session', req.session)
        const options = {
          method: method,
          url: url,
          withCredentials: true,
          timeout: config.timeout,
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Type': 'application/json'
            'Content-Type': req.headers['content-type']
          }
        }
        // data 数据处理
        // let rquestData = querystring.stringify(this.getData(req, data))
        const rquestData = this.getData(req, data)
        options.data = rquestData
        log.trace('options', options.data)
        axios(options).then(res => {
          if (res.status === 200) {
            const result = res.data
            if (result.code === 0) {
              // 数据解密
              const decryptResult = Object.assign(result, res.data.data ? { data: this.decryptData(result.data) } : {})
              log.trace(`${url} - request data: - ${JSON.stringify(rquestData)} - data: ${JSON.stringify(data)} - response data: - ${JSON.stringify(decryptResult)}`)
              resolve(decryptResult)
            } else {
              log.error(`${url} - request data: - ${JSON.stringify(rquestData)} - data: ${JSON.stringify(data)} - response data: - ${JSON.stringify(result)}`)
              reject(result)
            }
          }
        }).catch(error => {
          // console.log('err', error)
          log.error(`${url} - ${error.message} - ${error.stack}`)
          reject(error)
        })
      })
    })
  }
  /**
   * 处理参数，拼接公共参数及业务参数加密
  */
  getData(req, data) {
    return Object.assign({}, this.getCommonParams({
      sessionID: req.sessionID,
      ticketId: req.session.ticketId || '',
      cityId: req.headers.cityid || 51010000,
    }), {
      data: this.encryptData(data)
    })
  }
  /**
   * 公共参数
   */
  getCommonParams({ cityId, ticketId, deviceNo }) {
    return {
      repositoryId: 16, // rap2模拟时用
      cityId,
      deviceNo,
      ticketId,
      encryMode: 2, // 加密方式
      version: '1.0.0', // 接口版本
      userver: 10,
      utype: 1,
      deviceType: 2, // 设备类型
    }
  }
  /**
   *  加密数据
   */
  encryptData(data) {
    return new Buffer(JSON.stringify(data)).toString('base64')
  }
  /**
   * 解密数据
   * @param {Object} data
   */
  decryptData(data) {
    try {
      const result = JSON.parse(new Buffer(data, 'base64').toString())
      return result
    } catch (error) {
      log.fatal(`decryptData error - input data - ${JSON.stringify(data)} - ${error}`)
      return data
    }
  }
  // 输出多个服务端方法
  // fetch(req, data){
  //   return this.post(config['javaHost'], req, data)
  // }
  fetchJava(req, data) {
    return this.post(config['javaHost'], req, data)
  }
  fetchPassport(req, data) {
    return this.post(config['passportHost'], req, data)
  }
}

module.exports = new Api()
