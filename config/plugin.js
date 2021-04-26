// 配置 egg-mongoose
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
}

// 配置 egg-validate:  在 ctx 对象上 挂载 validate 方法
exports.validate = {
  enable: true,
  package: 'egg-validate',
}

// 配置跨域
exports.cors = {
  enable: true,
  package: 'egg-cors',
}
