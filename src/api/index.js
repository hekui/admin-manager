import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
const apiContext = ''
const methods = ['get', 'post']

class Api {
  constructor(context = '') { // context 用于扩展多个端口的服务端。
    methods.forEach(method => {
      this[method] = (path, data = {}) => new Promise((resolve, reject) => {
        const url = apiContext + context + path
        console.log('url', url)
        // console.log('-------------------------------------')
        // alert(url+ '|' +JSON.stringify(data))
        const options = {
          method: method,
          url: url,
          withCredentials: true,
          timeout: 10000,
          headers: {
            // 'X-Requested-With': 'XMLHttpRequest',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Accept': '*/*',
            'token': getToken(),
            'Content-Type': 'application/json'
          }
        }
        method === 'get' ? options.params = data : options.data = data
        axios(options).then(res => {
          console.log(`[${method}]${url}`, res)
          if (res.status === 200) {
            if (res.data.code === 0) {
              resolve(res.data)
            } else {
              reject(res.data)
              Message({
                message: res.data.msg,
                type: 'error'
              })
            }
          }
        }).catch(error => {
          // console.log('error.response', error.response)
          // console.log('error.request', error.request)
          reject(error.response)
          Message({
            message: error.message,
            type: 'error'
          })
        })
      })
    })
  }
}

export default new Api()
