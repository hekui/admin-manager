
const 
  // encryptHost = process.env.encryptHost || "http://192.168.10.238:11000", // 加解密
  javaHost = process.env.javaHost || "http://platforms.test1.maifangma.com", // java api接口地址
  passportHost = process.env.passportHost || "http://passport.test1.maifangma.com", // 工具接口 登陆 短信验证
  // webHost = process.env.webHost || "http://mfmweb.test1.maifangma.com", // 测试环境
  // webHost = 'http://mock.maifangma.com/', // rap2模拟数据
  webHost = 'http://192.168.10.196:8089', // 周波PC
  // webHost = 'http://192.168.10.190:8089', // 张浩亮PC
  timeout = 3000; // 超时时间

module.exports = {
  javaHost,
  passportHost,
  webHost,
  timeout,
}
