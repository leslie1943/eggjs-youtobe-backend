/**
 * 只针对本地开发的配置文件
 */
const vodConfig = require('../private/access.key')

// 通过环境变量指定参数
exports.vod = {
  ...vodConfig,
}
