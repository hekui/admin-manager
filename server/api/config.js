
const 
  // javaHost = process.env.webHost || "http://mfmweb.test1.maifangma.com", // 测试环境
  javaHost = 'http://mock.maifangma.com/', // rap2模拟数据
  // encryptHost = process.env.encryptHost || "http://192.168.10.238:11000", // 加解密
  passportHost = process.env.passportHost || "http://passport.test1.maifangma.com", // 工具接口 登陆 短信验证
  timeout = 3000; // 超时时间

module.exports = {
  javaHost,
  passportHost,
  timeout,
}
