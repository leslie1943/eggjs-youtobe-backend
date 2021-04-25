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
        token: this.ctx.headers.authorization.split('Bearer ')[1],
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    }
  }

  // 更新登录用户信息
  async update() {
    // 1.基本数据验证
    const body = this.ctx.request.body
    this.ctx.validate(
      {
        email: { type: 'email', required: false },
        password: { type: 'string', required: false },
        username: { type: 'string', required: false },
        channelDescription: { type: 'string', required: false },
        avatar: { type: 'string', required: false },
      },
      body
    )

    // 获取 user service
    const userService = this.service.user
    console.info('this.ctx.user', this.ctx.user)

    // 2.校验用户是否已存在
    if (body.username) {
      if (body.username !== this.ctx.user.username && (await userService.findByUsername(body.username))) {
        this.ctx.throw(422, 'username 已存在')
      }
    }

    // 3.校验邮箱是否已存在
    if (body.email) {
      // 当前请求的email和登录的email不相等 && 邮箱存在
      if (body.email !== this.ctx.user.email && (await userService.findByEmail(body.email))) {
        this.ctx.throw(422, 'email 已存在')
      }
    }

    // 5.密码做 md5
    if (body.password) {
      body.password = this.ctx.helper.md5(body.password)
    }

    // 6.执行更新
    const user = await userService.updateUser(body)
    // 7. 返回更新后的用户
    this.ctx.status = 200
    this.ctx.body = {
      user: {
        username: user.username,
        email: user.email,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    }
  }

  // 用户订阅
  async subscribe() {
    const userId = this.ctx.user._id
    const channelId = this.ctx.params.userId // 要订阅的用户充当 channelId

    // 1.用户不能订阅自己
    if (userId.equals(channelId)) {
      this.ctx.throw(422, '用户不能订阅自己')
    }

    // 2.添加订阅
    const user = await this.service.user.subscribe(userId, channelId)
    // 3. 发送响应
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount',
        ]), // 转换成普通JS对象
        isSubscribed: true,
      },
    }
  }

  // 用户订阅
  async unsubscribe() {
    const userId = this.ctx.user._id
    const channelId = this.ctx.params.userId // 要订阅的用户充当 channelId

    // 1.用户不能订阅自己
    if (userId.equals(channelId)) {
      this.ctx.throw(422, '用户不能订阅自己')
    }

    // 2.添加订阅
    const user = await this.service.user.unsubscribe(userId, channelId)
    // 3. 发送响应
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount',
        ]), // 转换成普通JS对象
        isSubscribed: false,
      },
    }
  }

  // 获取用户信息
  async getUser() {
    // 1. 获取订阅状态
    let isSubscribed = false

    // 由于中间件的加持, 上下文中已经有了 cxt.user
    if (this.ctx.user) {
      // 获取订阅记录
      const record = await this.app.model.Subscription.findOne({
        user: this.ctx.user._id,
        channel: this.ctx.params.userId,
      })

      // 如果找到了记录,说明该用户对于目标频道已经订阅了
      if (record) {
        isSubscribed = true
      }
    }

    // 2. 获取用户信息
    const user = await this.app.model.User.findById(this.ctx.params.userId)

    // 3. 发送响应
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount',
        ]), // 转换成普通JS对象
        isSubscribed,
      },
    }
  }

  // 获取用户信息
  async getSubscriptions() {
    const Subscription = this.app.model.Subscription
    // 具体看 `ReadMe.md`的 populate()
    let subscriptions = await Subscription.find({ user: this.ctx.params.userId }).populate('channel')

    subscriptions = subscriptions.map((item) => {
      return this.ctx.helper._.pick(item.channel, ['_id', 'username', 'avatar', 'email'])
    })

    this.ctx.body = {
      subscriptions,
    }
  }
}

module.exports = UserController
