const axios = require('axios')
const querystring = require('querystring')
const log = require('./../log')('java')
const methods = ['post']
const config = require('./config')

class Api {
  constructor() {
    methods.forEach(method => {
      this[method] = (baseUrl = '', req, data = {}) => new Promise((resolve, reject) => {
        let url = baseUrl + req.path
        console.log('url', url)
        const options = {
          method: method,
          url: url,
          withCredentials: true,
          timeout: config.timeout,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Type': 'application/json'
          }
        }
        // data 数据处理
        let rquestData = querystring.stringify(this.getData(req, data))
        options.data = rquestData
        // console.log('options', options)
        axios(options).then(res => {
          if (res.status === 200) {
            let result = res.data
            if (result.code === 0) {
              // 数据解密
              let decryptResult = Object.assign(result, res.data.data ? {data: this.decryptData(result.data)} : {})
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
  getData(req, data){
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
  getCommonParams({cityId, ticketId, deviceNo}){
    return {
      repositoryId: 16, // rap2模拟时用
      cityId,
      deviceNo,
      ticketId,
      encryMode: 2, // 加密方式
      version: "1.0.0", //接口版本
      userver: 2,
      utype: 2,
      deviceType: 2, //设备类型
    }
  }
  /** 
   * 加密数据
  */
  encryptData(data){
    return encodeURIComponent(new Buffer(JSON.stringify(data)).toString("base64"))
  }
  /**
   * 解密数据
   * @param {Object} data
   */
  decryptData(data){
    try {
      let result = JSON.parse(new Buffer(data, 'base64').toString())
      return result
    } catch (error) {
      log.fatal(`decryptData error - input data - ${JSON.stringify(data)} - ${error}`)
      return data
    }
  }
  // 输出多个服务端方法
  fetch(host = 'webHost', req, data){
    return this.post(config[host], req, data)
  }
  fetchWeb(req, data){
    return this.post(config['webHost'], req, data)
  }
  fetchJava(req, data){
    return this.post(config['javaHost'], req, data)
  }
  fetchPassport(req, data){
    return this.post(config['passportHost'], req, data)
  }
}

module.exports = new Api()
