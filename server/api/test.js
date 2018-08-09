// import api from './index'

// let url = 'http://mfmweb.test1.maifangma.com/home/wtopic'
// api.post(url, {
//   limitNum: 8,
//   CITY_ID: '51010000'
// })

const querystring = require('querystring')
import fetch from 'node-fetch'
const axios = require('axios')
let url = 'http://mock.maifangma.com/subscription/list?page=true'

function encryptData(data){
  return new Buffer(JSON.stringify(data)).toString("base64")
}

// let data = {
//   "ticketId": '',
//   "cityId": 51010000
// }
let data = { cityId: 51010000, article: "", category: [], date: "", pageNo: 1, pageSize: 20, ticketId: ""}

let body = { 
  repositoryId: 16,
  cityId: 51010000,
  encryMode: 2,
  version: '1.0.0',
  userver: 2,
  utype: 2,
  deviceType: 2,
  ticketId: '',
  deviceNo: 'qrUuTf50SalAqYTm-FF8HYEQBYh3G86h',
  data: encryptData(data)
}
function api(url, body){
  let options = {
    url,
    method: "POST",
    // data: 'encryMode=2&userver=2&utype=2&version=1.0.0&cityId=51010000&deviceNo=qrUuTf50SalAqYTm-FF8HYEQBYh3G86h&deviceType=2&ticketId=&data=eyJDSVRZX0lEIjoiNTEwMTAwMDAiLCJsaW1pdE51bSI6OH0%3D',
    data: querystring.stringify(body),
    // timeout: 3000, // ms
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded' 
    }
  }
  console.log('options', options)
  return axios(options).then((res) => {
    console.log(`>>> fetch response - url: ${url} - ${res.status}`)
    // console.log(res)
    if (res.status !== 200) {
      return { code: res.status, msg: res.statusText };
    }else {
      return res.data;
    }
  }).catch(e => {
    return e;
  });
}

function decryptData(data){
  try {
    let result = JSON.parse(new Buffer(data, 'base64').toString())
    return result
  } catch (error) {
    console.log(`decryptData error - input data - ${JSON.stringify(data)} - ${error}`)
    return data
  }
}


api(url, body).then(res => {
  console.log('---success---')
  let result = Object.assign(res, res.data ? {data: decryptData(res.data)} : {})
  console.log(JSON.stringify(result))
}, res => {
  console.log('---error---')
  console.log(res)
})



// const api = require('./../api')()

// api.post(req, ).then(res => {
//   console.log('---success---')
//   console.log(res)
// }, res => {
//   console.log('---error---')
//   console.log(res)
// })