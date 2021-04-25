const Service = require('egg').Service
const jwt = require('jsonwebtoken')

class UserService extends Service {
  // 定义 User 模型访问器 => 方便使用
  get User() {
    return this.app.model.User
  }
  findByUsername(username) {
    return this.User.findOne({
      username,
    })
  }
  findByEmail(email) {
    return this.User.findOne({
      email,
    }).select('+password') // 把 password 信息查询出来
  }
  async createUser(data) {
    this.ctx.helper.print()
    data.password = this.ctx.helper.md5(data.password)
    const user = new this.User(data)
    await user.save(user)
    return user
  }

  // 创建token
  createToken(data) {
    return jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    })
  }

  // 验证 token
  verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret)
  }

  // 更新用户
  updateUser(data) {
    // new: true => 返回更新后的user
    return this.User.findByIdAndUpdate(this.ctx.user._id, data, { new: true })
  }

  // 用户订阅
  async subscribe(userId, channelId) {
    const { Subscription, User } = this.app.model
    // 1. 检查是否已经订阅
    const record = await Subscription.findOne({
      user: userId,
      channel: channelId,
    })

    // 💛 被订阅的用户
    const targetUser = await User.findById(channelId)

    // 2. 没有订阅, 添加订阅
    if (!record) {
      const subscription = new Subscription({
        user: userId,
        channel: channelId,
      })
      await subscription.save()

      // 💛 更新用户的订阅数量
      targetUser.subscribersCount++
      // 💛 更新到数据库中
      await targetUser.save()
    }
    // 3. 无论有没有订阅都返回用户信息
    return targetUser
  }
}

module.exports = UserService
