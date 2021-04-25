const crypto = require('crypto')
const _ = require('lodash')

// 加密
exports.md5 = (str) => {
  return crypto.createHash('md5').update(str).digest('hex')
}

// 测试 helper
exports.print = () => {
  console.info(`[Current time]: ${Date.now()}`)
}

// 挂载 lodash
exports._ = _
