'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  async create() {
    // 请求体
    const body = this.ctx.request.body
    // 1. 数据校验

    const { ctx } = this
    const userService = this.service.user

    this.ctx.validate({
      username: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'string' },
    })

    // 校验用户是否已存在
    if (await userService.findByUsername(body.username)) {
      this.ctx.throw(422, '用户已存在')
    }
    // 校验邮箱是否已存在
    if (await userService.findByEmail(body.email)) {
      this.ctx.throw(422, '邮箱已存在')
    }

    // 2. 保存用户
    const user = await userService.createUser(body)

    // 3. 生成 token
    const token = userService.createToken({
      userId: user._id,
    })

    // 4. 发送响应
    ctx.status = 201 // 设置响应码
    ctx.body = {
      user: {
        username: user.username,
        email: user.email,
        token,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    }
  }
}

module.exports = UserController
