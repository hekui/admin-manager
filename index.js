import Koa from 'koa'
import serve from 'koa-static'
import Router from 'koa-router'
import webpack from 'webpack'

import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'
const devConfig = require('./build/webpack.dev.conf.js')
const compile = webpack(devConfig)

const app = new Koa()
const port = 3000
// const maxAge = 1000 * 60 *60 * 24 * 30 // ms,30天
const isProd = process.env.NODE_ENV === 'production'
const router = new Router()

// app.use('/api', serverRouter)

// if(isProd){
//   app.use(serve('./dist'))
// }else{

//   // app.use(webpackDevMiddleware(compiler, {
//   //   publicPath: config.output.publicPath
//   // }));
// }


app.use(devMiddleware(compile, {
  // display no info to console (only warnings and errors)
  noInfo: true,

  // display nothing to the console
  quiet: true,

  // switch into lazy mode
  // that means no watching, but recompilation on every request
  lazy: true,

  // watch options (only lazy: false)
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },

  // public path to bind the middleware to
  // use the same as in webpack
  publicPath: "/",

  // custom headers
  headers: { "X-Custom-Header": "yes" },

  // options for formating the statistics
  stats: {
      colors: true
  }
}))
app.use(hotMiddleware(compile, {
// log: console.log,
// path: '/__webpack_hmr',
// heartbeat: 10 * 1000
}))




// process.on('unhandledRejection', (reason, p) => {
//   console.log("未捕捉的Promise错误：", p, "\n reason: ", reason)
//   // log.error("未捕捉的Promise错误：", p, "\n reason: ", reason);
// });
// app.on('error', (err, ctx) => {
//   console.log('server error', err, ctx)
//   ctx.body = 'Not Fond.'
// })

app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})