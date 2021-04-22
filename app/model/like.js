// 'use strict'

module.exports = (app) => {
  // 获取 mongoose 实例
  const mongoose = app.mongoose
  // 获取 Schema 类
  const Schema = mongoose.Schema

  // 定义数据库中集合的字段
  const LikeSchema = new Schema({
    like: { type: Number, enum: [1, -1], required: true }, // 点赞状态 1: 喜欢, -1: 不喜欢
    user: { type: mongoose.ObjectId, required: true, ref: 'User' }, // 点赞用户
    video: { type: mongoose.ObjectId, required: true, ref: 'Video' }, // 点赞视频
    createdAt: { type: Date, default: Date.now }, // 创建时间
    updatedAt: { type: Date, default: Date.now }, // 更新时间
  })

  // 返回被定义的模型 User, 模型的约束是 UserSchema, 对应的数据库中会有一个 users 的 表
  // 在 Controller里可以 this.app.model.User 获取模型
  return mongoose.model('Like', LikeSchema)
}
