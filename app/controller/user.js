'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  // 创建
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

  // 登录
  async login() {
    const body = this.ctx.request.body
    const userService = this.service.user
    // 1. 数据校验
    this.ctx.validate(
      {
        email: { type: 'email' },
        password: { type: 'string' },
      },
      body
    )

    // 2. 校验邮箱是否存在
    const user = await userService.findByEmail(body.email)
    if (!user) {
      this.ctx.throw(422, '用户不存在')
    }

    // 3. 校验密码是否正确
    if (this.ctx.helper.md5(body.password) !== user.password) {
      this.ctx.throw(422, '密码不正确!')
    }

    // 4. 生成 token
    const token = userService.createToken({
      userId: user._id,
    })
    // 5. 发送响应
    this.ctx.status = 200 // 设置响应码
    this.ctx.body = {
      user: {
        username: user.username,
        email: user.email,
        token,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    }
  }

  // 获取登录用户信息
  async getCurrentUser() {
    // 验证 token: 在 auth 中间件中完成
    // 获取用户: 在 auth 中间件中完成
    // 发送响应
    const user = this.ctx.user
    this.ctx.status = 201 // 设置响应码
    this.ctx.body = {
      user: {
        username: user.username,
        email: user.email,
        token: this.ctx.headers.authorization,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    }
  }
}

module.exports = UserController
