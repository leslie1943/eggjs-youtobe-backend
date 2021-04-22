'use strict'

/**
 *
 * @param {*} app 应用实例: 安装 egg-mongoose后会往 app 上挂载 mongoose 实例
 */
module.exports = (app) => {
  // 获取 mongoose 实例
  const mongoose = app.mongoose
  // 获取 Schema 类
  const Schema = mongoose.Schema

  // 定义数据库中集合的字段
  const UserSchema = new Schema({
    username: { type: String, required: true }, // 用户名
    email: { type: String, required: true }, // 邮箱
    password: { type: String, required: true, select: false }, // 默认查询不包含密码
    avatar: { type: String, default: null }, // 头像
    cover: { type: String, default: null }, // 封面
    channelDescription: { type: String, default: null }, // 频道介绍
    createdAt: { type: Date, default: Date.now }, // 创建时间
    updatedAt: { type: Date, default: Date.now }, // 更新时间
  })

  // 返回被定义的模型 User, 模型的约束是 UserSchema, 对应的数据库中会有一个 users 的 表
  // 在 Controller里可以 this.app.model.User 获取模型
  return mongoose.model('User', UserSchema)
}
