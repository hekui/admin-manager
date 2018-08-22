// TODO: 用KOA实现(index-koa.js)
const express = require('express');
const serve = require('serve-static')
const webpack = require('webpack')
const log4js = require('log4js')
const devConfig = require('./../build/webpack.dev.conf.js')
const config = require('./../config')
const serverRouter = require('./router')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const log = require('./log')()
const compiler = webpack(devConfig)
const isProd = process.env.NODE_ENV === 'production'

let port
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser('fgc-manager'))

app.use(session({
  name: "FGCMANAGERSSID",
  secret: 'fgc-manager',
  resave: false,
  rolling: true, // 刷新有效期
  saveUninitialized: true,
  cookie: { 
    // secure: true,
    domain: isProd ? '.fangguancha.com' : '',
    // maxAge: 10 * 1000, // 单位：ms  10秒（测试用）
    maxAge: 30 * 60 * 1000, // 单位：ms  30分钟
  }
}))

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

app.use('/public', serve('public', {
  maxAge: config.build.assetsMaxage
}))

app.use('/api', serverRouter);

function setCustomCacheControl (res, path) {
  if (serve.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

if(isProd){
  port = config.build.port
  app.use('/static', serve('dist/static', {
    maxAge: config.build.assetsMaxage
  }))
  // router history
  app.use(require('connect-history-api-fallback')())
  app.use('*', serve('dist', {
    maxAge: config.build.assetsMaxage,
    setHeaders: setCustomCacheControl
  }))
}else{
  port = config.dev.port
  // router history
  app.use(require('connect-history-api-fallback')())
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.dev.assetsPublicPath,
    // quiet: true,
    // stats: "errors-only"
  }));
  app.use(require("webpack-hot-middleware")(compiler, {
    log: false,
    path: "/__webpack_hmr",
    heartbeat: 2000
  }))
}

process.on('unhandledRejection', (reason, p) => {
  log.error("未捕捉的Promise错误：", p, "\n reason: ", reason);
  // res.status(500).send('Internal server error.')
});
app.use(function(err, req, res, next){
  let error = err.stack || err.message
  // 错误日志
  log.fatal(error);
  res.status(err.status || 500).send('Internal server error.')
})

app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})