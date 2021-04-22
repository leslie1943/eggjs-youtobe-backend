const crypto = require('crypto')

// 加密
exports.md5 = (str) => {
  return crypto.createHash('md5').update(str).digest('hex')
}

// 测试 helper
exports.print = () => {
  console.info('print test')
}
