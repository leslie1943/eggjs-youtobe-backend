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
}

module.exports = UserService
