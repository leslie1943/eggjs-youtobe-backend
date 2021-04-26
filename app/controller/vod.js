const Controller = require('egg').Controller

class VodController extends Controller {
  // 创建视频: 获取上传地址和凭证
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

    // 第一个参数是 action
    this.ctx.body = await this.app.vodClient.request('CreateUploadVideo', query, {})
  }

  // 刷新视频: 获取上传地址和凭证
  async refreshUploadVideo() {
    const query = this.ctx.query

    // 验证参数
    this.ctx.validate({ VideoId: { type: 'string' } }, query)

    // 第一个参数是 action
    this.ctx.body = await this.app.vodClient.request('RefreshUploadVideo', query, {})
  }
}

module.exports = VodController
