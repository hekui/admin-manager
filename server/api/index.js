const axios = require('axios')
const log = require('./../log')('java')
const methods = ['get', 'post']

class Api {
  constructor() {
    methods.forEach(method => {
      this[method] = (url, data = {}) => new Promise((resolve, reject) => {
        const options = {
          method: method,
          url: url,
          withCredentials: true,
          timeout: 5000,
          headers: {
            // 'X-Requested-With': 'XMLHttpRequest',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'token': '111',
            'Content-Type': 'application/json'
          }
        }
        // data 数据处理
        let _data = this.getData(data)
        options.data = _data
        console.log('options', options)
        axios(options).then(res => {
          log.trace(`${url} - request data - ${JSON.stringify(_data)} - response data - ${JSON.stringify(res.data)}`)
          if (res.status === 200) {
            if (res.code === 0) {
              // 数据解密
              let result = Object.assign(res, res.data ? {data: this.decryptData(res.data)} : {})
              resolve(result)
            } else {
              reject(res)
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
  getData(data){
    return Object.assign({}, this.getCommonParams(), {
      deviceNo: '6DN_2BJ0PRp7dafgmqXsgf3e9UQ0AyIV',
      data: this.encryptData(data)
    })
  }
  encryptData(data){
    return encodeURIComponent(new Buffer(JSON.stringify(data)).toString("base64"))
  }
  /**
   * 公共参数
   */
  getCommonParams(){
    return {
      encryMode: 2, // 加密方式
      version: "1.0.0", //接口版本
      userver: 2,
      utype: 2,
      cityId: '51010000',
      deviceType: 2, //设备类型
      // deviceNo: req.sessionID,
      ticketId: ''
    }
  }
  /**
   * 解密data数据
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
}

module.exports = new Api()
