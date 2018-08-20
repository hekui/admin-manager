const axios = require('axios')
const FormData = require('form-data')
const log = require('./../log')('java')
const methods = ['post']
const config = require('./config')

class Api {
  constructor() {
    methods.forEach(method => {
      this[method] = (baseUrl = '', req) => new Promise((resolve, reject) => {
        const url = baseUrl + req.url
        const form = this.getData(req)
        const options = {
          method: method,
          url: url,
          data: form,
          withCredentials: true,
          timeout: config.timeout,
          headers: {
            'Accept': 'image/*,application/json;q=0.9, */*;',
            'Content-Type': 'multipart/form-data;boundary=' + form.getBoundary()
          }
        }
        axios(options).then(res => {
          if (res.status === 200) {
            const result = res.data
            if (result.code === 0) {
              // 数据解密
              const decryptResult = Object.assign(result, res.data.data ? { data: this.decryptData(result.data) } : {})
              // 注销日志，buffer输出会卡死控制台
              // log.trace(`${url} - request data: - ${JSON.stringify(form)} - data: ${JSON.stringify(req.file)} - response data: - ${JSON.stringify(decryptResult)}`)
              resolve(decryptResult)
            } else {
              // 注销日志，buffer输出会卡死控制台
              // log.trace(`${url} - request data: - ${JSON.stringify(form)} - data: ${JSON.stringify(req.file)} - response data: - ${JSON.stringify(decryptResult)}`)
              reject(result)
            }
          }
        }).catch(error => {
          // console.log('err', error)
          log.error(`${url} - ${error.message} - ${error.stack}`)
          reject(error)
        })
        // form表单提交方式：
        // form.submit({
        //   host: baseUrl,
        //   hostname: '192.168.10.190',
        //   path: req.url,
        //   port: 8089,
        //   withCredentials: true,
        //   timeout: config.timeout,
        //   headers: {
        //     'Accept': 'image/*,application/json;q=0.9, */*;',
        //     'Content-Type': 'multipart/form-data;boundary=' + form.getBoundary()
        //   }
        // }, (error, res) => {
        //   if (error) {
        //     log.error(`${url} - ${error.message} - ${error.stack}`)
        //     reject(error)
        //   } else {
        //     if (res.statusCode === 200) {
        //       res.on('data', buffer => {
        //         const result = JSON.parse(buffer.toString())
        //         if (result.code === 0) {
        //           // 数据解密
        //           const decryptResult = Object.assign(result, result.data ? { data: this.decryptData(result.data) } : {})
        //           // 注销日志，buffer输出会卡死控制台
        //           // log.trace(`${url} - request data: - ${JSON.stringify(form)} - data: ${JSON.stringify(req.file)} - response data: - ${JSON.stringify(decryptResult)}`)
        //           resolve(decryptResult)
        //         } else {
        //           // 注销日志，buffer输出会卡死控制台
        //           // log.error(`${url} - request data: - ${JSON.stringify(form)} - data: ${JSON.stringify(req.file)} - response data: - ${JSON.stringify(result)}`)
        //           reject(result)
        //         }
        //       })
        //     }
        //   }
        // })
      })
    })
  }
  /**
   * 处理参数，拼接公共参数及业务参数加密
  */
  getData(req) {
    const form = new FormData()
    const options = Object.assign({}, this.getCommonParams({
      sessionID: req.sessionID,
      ticketId: req.session.ticketId || '',
      cityId: req.headers.cityid || 51010000,
    }))
    for (const key in options) {
      form.append(key, options[key] + '\r\n--' + form.getBoundary())
    }
    form.append('fileStreams', req.file.buffer, {
      filename: req.file.fieldname,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      encoding: req.file.encoding
    })
    return form
  }
  /**
   * 公共参数
   */
  getCommonParams({ cityId, ticketId, deviceNo = '' }) {
    return {
      repositoryId: 16, // rap2模拟时用
      cityId,
      deviceNo,
      ticketId,
      encryMode: 2, // 加密方式
      version: '1.0.0', // 接口版本
      userver: 2,
      utype: 2,
      deviceType: 2, // 设备类型
    }
  }
  /**
   *  加密数据
   */
  encryptData(data) {
    debugger
    return new Buffer(JSON.stringify(data)).toString('base64')
  }
  /**
   * 解密数据
   * @param {Object} data
   */
  decryptData(data) {
    debugger
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
  fetchJava(req, file) {
    return this.post(config['javaHost'], req, file)
  }
  fetchPassport(req, file) {
    return this.post(config['passportHost'], req, file)
  }
}

module.exports = new Api()
