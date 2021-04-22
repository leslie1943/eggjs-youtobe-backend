'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  async create() {
    // 1. 数据校验

    const { ctx } = this
    this.ctx.validate({
      userName: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'string' },
    })
    // 2. 保存用户
    // 3. 生成 token
    // 4. 发送响应
    ctx.body = 'User create'
  }
}

module.exports = UserController
