/**
 * 针对 生产环境 的配置文件
 */

// 通过环境变量指定参数
exports.vod = {
  accessKeyId: process.env.accessKeyId,
  accessKeySecret: process.env.accessKeySecret,
}
