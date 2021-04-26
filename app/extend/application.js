// 扩展 egg.js 应用实例 application

const RPCClient = require('@alicloud/pop-core').RPCClient
/**
 * 初始化 Vod Client
 * @param {*} accessKeyId
 * @param {*} accessKeySecret
 * @return void
 */
function initVodClient(accessKeyId, accessKeySecret) {
  const regionId = 'cn-shanghai' // 点播服务接入区域
  const client = new RPCClient({
    accessKeyId,
    accessKeySecret,
    endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
    apiVersion: '2017-03-21',
  })

  return client
}

let vodClient = null
module.exports = {
  // 获取 vod client 实例
  get vodClient() {
    if (!vodClient) {
      const { accessKeyId, accessKeySecret } = this.config.vod
      vodClient = initVodClient(accessKeyId, accessKeySecret)
    }
    return vodClient
  },
}
