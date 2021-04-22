'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  async create() {
    console.info('come into user create')
    const { ctx } = this
    ctx.body = 'User create'
  }
}

module.exports = UserController
