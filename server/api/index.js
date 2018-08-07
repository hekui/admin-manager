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
        method === 'get' ? options.params = data : options.data = data
        axios(options).then(res => {
          log.trace(`${url} - request data - ${JSON.stringify(data)} - response data - ${JSON.stringify(res.data)}`)
          if (res.status === 200) {
            // 数据解密
            let data = this.decryptData(res.data)
            if (data.code === 0) {
              resolve(data)
            } else {
              reject(data)
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
   * 公共参数
   */
  getCommonParams(){
    return {
      encryMode: 2, // 加密方式
      version: "1.0.0", //接口版本
      userver: 2,
      utype: 2,
      cityId: '1',
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
      log.fatal(`decryptData error - input data - ${data} - ${error}`)
      return data
    }
  }
}

module.exports = new Api()
