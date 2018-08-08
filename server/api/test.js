// import api from './index'

let url = 'http://mfmweb.test1.maifangma.com/home/wtopic'
// api.post(url, {
//   limitNum: 8,
//   CITY_ID: '51010000'
// })

import fetch from 'node-fetch'
const axios = require('axios')
let body = { 
  encryMode: 2,
  version: '1.0.0',
  userver: 2,
  utype: 2,
  cityId: 51010000,
  deviceType: 2,
  ticketId: '',
  deviceNo: 'qrUuTf50SalAqYTm-FF8HYEQBYh3G86h',
  data: 'eyJDSVRZX0lEIjoiNTEwMTAwMDAiLCJsaW1pdE51bSI6OH0%3D'
}
function api(url, body){
  return fetch(url, {
    method: "post",
    body: 'encryMode=2&userver=2&utype=2&version=1.0.0&cityId=51010000&deviceNo=qrUuTf50SalAqYTm-FF8HYEQBYh3G86h&deviceType=2&ticketId=&data=eyJDSVRZX0lEIjoiNTEwMTAwMDAiLCJsaW1pdE51bSI6OH0%3D',
    // body: body,
    timeout: 3000, // ms
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then((res) => {
    console.log(`>>> fetch response - url: ${url} - ${res.status}`)
    // console.log(res)
    if (res.status !== 200) {
      return { code: res.status, msg: res.statusText };
    }else {
      return res.json();
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
    log.fatal(`decryptData error - input data - ${JSON.stringify(data)} - ${error}`)
    return data
  }
}

api(url, body).then(res => {
  let result = Object.assign(res, res.data ? {data: decryptData(res.data)} : {})
  console.log(JSON.stringify(result))
})