
const 
  // javaHost = process.env.javaHost || "http://mfmweb.test1.maifangma.com", // 测试环境
  // javaHost = process.env.javaHost || 'http://mock.maifangma.com/', // rap2模拟数据
  javaHost = process.env.javaHost || 'http://192.168.10.196:8089', // 周波PC
  // javaHost = process.env.javaHost || 'http://192.168.10.190:8089', // 张浩亮PC
  passportHost = process.env.passportHost || "http://passport.test1.maifangma.com", // 登陆
  timeout = 3000; // 超时时间

module.exports = {
  javaHost,
  passportHost,
  timeout,
}
