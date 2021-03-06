module.exports = (app) => {
  // 获取 mongoose 实例
  const mongoose = app.mongoose
  // 获取 Schema 类
  const Schema = mongoose.Schema

  // 定义数据库中集合的字段
  const VideoSchema = new Schema({
    title: { type: String, required: true }, // 视频标题
    description: { type: String, required: true }, // 视频描述
    playUrl: { type: String, required: false }, // 视频播放地址
    cover: { type: String, required: true }, // 视频封面
    user: { type: mongoose.ObjectId, required: true, ref: 'User' }, // 视频作者
    commentsCount: { type: String, required: false },
    likesCount: { type: String, default: 0 }, // 被喜欢的
    dislikesCount: { type: String, default: 0 }, // 被不喜欢的
    viewsCount: { type: String, default: 0 }, // 观看次数
    vodVideoId: { type: String, required: false }, // 阿里云视频ID
    createdAt: { type: Date, default: Date.now }, // 创建时间
    updatedAt: { type: Date, default: Date.now }, // 更新时间
  })

  return mongoose.model('Video', VideoSchema)
}
