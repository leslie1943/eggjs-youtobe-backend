const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    const User = this.app.model.User

    // 新增一个 user
    await new User({
      userName: 'admin',
      password: 'admin',
    }).save()

    ctx.body = 'Hello, egg'
  }
}

module.exports = HomeController
