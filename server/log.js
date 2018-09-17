const log4js = require('log4js')

log4js.configure({
  appenders: {
    // file: {
    //   type: 'file',
    //   filename: __dirname +'/logs/important-things.log',
    //   maxLogSize: 1 * 1024 * 1024, // = 10Mb
    //   numBackups: 5, // keep five backup files
    //   encoding: 'utf-8',
    //   mode: 0o0640,
    //   flags: 'w+'
    // },
    dateFile: {
      type: 'dateFile',
      filename: __dirname +'/../logs/log',
      // pattern: 'yyyy-MM-dd-hh',
      pattern: '.yyyy-MM-dd'
      // compress: true
    },
    console: {
      type: 'stdout'
    }
  },
  categories: {
    default: {
      appenders: ['console', 'dateFile'],
      level: 'trace'
    }
  }
});

// const logger = log4js.getLogger('thing');

// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

// let i = 0;
// setInterval(() => {
//   logger.info('just doing the thing');
// }, 1000)

module.exports = function(tag){
  return log4js.getLogger(tag);
}