'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1618986745371_8418'

  // add your middleware config here
  config.middleware = ['errorHandler']

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  config.mongoose = {
    client: {
      // youtobe 是 数据库
      url: 'mongodb://127.0.0.1/youtobe',
      options: {
        useUnifiedTopology: true,
      },
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [],
    },
  }

  config.security = {
    csrf: {
      enable: false,
    },
  }

  config.jwt = {
    secret: '68fc7856-2359-4bd4-85d2-8e9914bb63d5',
    expiresIn: '1d',
  }

  return {
    ...config,
    ...userConfig,
  }
}
