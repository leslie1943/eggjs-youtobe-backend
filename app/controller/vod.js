const Controller = require('egg').Controller

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

class VodController extends Controller {
  async createUploadVideo() {
    const query = this.ctx.query

    // 验证参数
    this.ctx.validate(
      {
        Title: { type: 'string' },
        FileName: { type: 'string' },
      },
      query
    )

    const vodClient = initVodClient('LTAI5tBKLjGhbcnbbY7zgAKs', 'qi4EBj6vykkFcKJUVBGh7C9qqBHpYR')
    // 第一个参数是 action
    this.ctx.body = await vodClient.request('CreateUploadVideo', query, {})
  }
}

module.exports = VodController
