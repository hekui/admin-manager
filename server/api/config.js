
const
  // javaHost = process.env.javaHost || 'http://mock.maifangma.com/', // rap2模拟数据
  // javaHost = process.env.javaHost || 'http://???', // 测试环境
  // javaHost = process.env.javaHost || 'http://japi.fangguancha.com', // 生产环境
  // javaHost = process.env.javaHost || 'http://192.168.10.196:8089', // 周波PC
  // javaHost = process.env.javaHost || 'http://192.168.10.190:8092', // 张浩亮PC
    javaHost = process.env.javaHost || 'http://192.168.10.118:8081', // 杨翔PC
  // javaHost = process.env.javaHost || 'http://192.168.10.88:8092', // 何洋PC
  // passportHost = process.env.passportHost || 'http://192.168.10.190:8090', // 登陆(张浩亮)
  // passportHost = process.env.passportHost || 'http://passport.test1.maifangma.com', // 登陆
  // passportHost = process.env.passportHost || 'https://uiap.maifangma.com', // 登陆(正式环境)
  passportHost = process.env.passportHost || 'http://192.168.10.88:8090', // 登陆（何洋）
  timeout = 3000; // 超时时间

module.exports = {
  javaHost,
  passportHost,
  timeout,
}
