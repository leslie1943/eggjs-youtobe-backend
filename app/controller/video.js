const Controller = require('egg').Controller

class VideoController extends Controller {
  // 💛 创建视频
  async createVideo() {
    const body = this.ctx.request.body

    const { Video } = this.app.model

    // 验证
    this.ctx.validate(
      {
        title: { type: 'string' },
        description: { type: 'string' },
        vodVideoId: { type: 'string' },
        cover: { type: 'string' },
      },
      body
    )

    // video 的作者
    body.user = this.ctx.user._id

    const video = await new Video(body).save()

    this.ctx.status = 201
    this.ctx.body = {
      video,
    }
  }

  // 💛 获取视频
  async getVideo() {
    const { Video, Like, Subscription } = this.app.model
    const { videoId } = this.ctx.params

    // 找到视频记录
    let video = await Video.findById(videoId).populate('user', '_id username avatar subscribersCount')

    if (!video) {
      this.ctx.throw(404, 'Video Not Found.')
    }

    video = video.toJSON() // 转成普通JS对象

    // 业务数据
    video.isLiked = false // 是否喜欢
    video.isDisliked = false // 是否不喜欢
    video.user.isSubscribed = false // 是否已经订阅视频作者

    // 登录状态
    if (this.ctx.user) {
      const userId = this.ctx.user._id
      if (await Like.findOne({ user: userId, video: videoId, like: 1 })) {
        video.isLiked = true
      }

      if (await Like.findOne({ user: userId, video: videoId, like: -1 })) {
        video.isDisliked = true
      }

      if (await Subscription.findOne({ user: userId, channel: video.user._id })) {
        video.user.isSubscribed = true
      }
    }

    this.ctx.body = {
      video,
    }
  }

  // 💛 获取视频列表
  async getVideos() {
    const { Video } = this.app.model
    let { pageNum = 1, pageSize = 10 } = this.ctx.query
    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)

    // 查询视频列表
    const getVideos = Video.find()
      .populate('user')
      .sort({ createAt: -1 }) // 倒序排序
      .skip(Number.parseInt(pageNum - 1) * pageSize)
      .limit(pageSize)

    const getVideosCount = Video.countDocuments()

    // 并行执行
    const [videos, videosCount] = await Promise.all([getVideos, getVideosCount])

    this.ctx.body = {
      videos,
      videosCount,
    }
  }

  // 💛 获取用户的视频列表
  async getUserVideos() {
    const { Video } = this.app.model
    let { pageNum = 1, pageSize = 10 } = this.ctx.query
    const { userId } = this.ctx.params
    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)

    // 查询视频列表
    const getVideos = Video.find({ user: userId })
      .populate('user')
      .sort({ createAt: -1 }) // 倒序排序
      .skip(Number.parseInt(pageNum - 1) * pageSize)
      .limit(pageSize)

    const getVideosCount = Video.countDocuments({ user: userId })

    // 并行执行
    const [videos, videosCount] = await Promise.all([getVideos, getVideosCount])

    this.ctx.body = {
      videos,
      videosCount,
    }
  }

  // 💛 获取用户的视频列表
  async getUserFeedVideos() {
    const { Video, Subscription } = this.app.model
    const userId = this.ctx.user._id

    // 当前登录用户的关注列表
    const channels = await Subscription.find({ user: userId }).populate('channel')
    console.info('channels', channels)
    // 60850134ffea9353c4dc68cb
    // 608689e3adcada405ce02a3f

    let { pageNum = 1, pageSize = 10 } = this.ctx.query

    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)

    // 查询视频列表
    const getVideos = Video.find({
      user: {
        $in: channels.map((item) => item.channel._id), // 当前用户关注频道的 id 数组
      },
    })
      .populate('user')
      .sort({ createAt: -1 }) // 倒序排序
      .skip(Number.parseInt(pageNum - 1) * pageSize)
      .limit(pageSize)

    const getVideosCount = Video.countDocuments({ user: { $in: channels.map((item) => item.channel._id) } })

    // 并行执行
    const [videos, videosCount] = await Promise.all([getVideos, getVideosCount])

    this.ctx.body = {
      videos,
      videosCount,
    }
  }

  // 💛 更新视频
  async updateVideo() {
    const { body } = this.ctx.request

    const { Video } = this.app.model

    const { videoId } = this.ctx.params

    const userId = this.ctx.user._id

    this.ctx.validate(
      {
        title: { type: 'string', required: false },
        description: { type: 'string', required: false },
        cover: { type: 'string', required: false },
        vodVideoId: { type: 'string', required: false },
      },
      body
    )

    // 查询视频: findById 是根据系统Id
    const video = await Video.findById(videoId)

    if (!video) {
      this.ctx.throw(404, 'Video Not Found.')
    }

    // 视频作者是当前登录用户
    if (!video.user.equals(userId)) {
      this.ctx.throw(403, '没有权限修改.')
    }

    Object.assign(video, this.ctx.helper._.pick(body, ['title', 'description', 'cover', 'videoId']))

    await video.save()

    this.ctx.body = {
      video,
    }
  }

  // 💛 删除视频
  async deleteVideo() {
    const { Video } = this.app.model

    const { videoId } = this.ctx.params

    // 校验 Video 是否存在
    const video = await Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404, 'Video Not Found')
    }

    // 校验Video的作者是否是登录用户
    if (!video.user.equals(this.ctx.user._id)) {
      this.ctx.throw(403, '没有权限删除.')
    }
    await video.remove()

    this.ctx.status = 204
    this.ctx.body = {
      message: '删除成功!',
    }
  }

  // 💛 添加评论
  async createComment() {
    const { Comment, Video } = this.app.model
    const { videoId } = this.ctx.params
    const { body } = this.ctx.request

    // 数据验证
    this.ctx.validate(
      {
        content: 'string',
      },
      body
    )

    const video = await Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404)
    }

    // 创建评论
    const comment = await new Comment({
      content: body.content,
      user: this.ctx.user._id,
      video: videoId, // 给谁的评论
    }).save()

    // 更新视频的评论数量: 根据视频ID,查询Comments的数量 => 评论数量
    video.commentsCount = await Comment.countDocuments({
      video: videoId,
    })

    await video.save() // 更新

    // mapping 评论所属用户和视频字段数据
    await comment.populate('user').populate('video').execPopulate()

    this.ctx.body = { comment }
  }

  // 💛 获取视频的评论列表
  async getComments() {
    const { Comment } = this.app.model
    const { videoId } = this.ctx.params

    let { pageNum = 1, pageSize = 10 } = this.ctx.query
    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)

    const comments = await Comment.find({ video: videoId })
      .populate('user')
      .populate('video')
      .sort({ createAt: -1 }) // 倒序排序
      .skip(Number.parseInt(pageNum - 1) * pageSize)
      .limit(pageSize)

    const commentTotal = await Comment.countDocuments({ video: videoId })

    this.ctx.body = {
      comments,
      commentTotal,
    }
  }

  // 💛 删除视频
  async deleteComment() {
    const { Video, Comment } = this.app.model
    const { videoId, commentId } = this.ctx.params

    // 校验 Video 是否存在
    const video = await Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404, 'Video Not Found.')
    }

    // 校验 Comment 是否存在
    const comment = await Comment.findById(commentId)

    if (!comment) {
      this.ctx.throw(404, 'Comment Not Found.')
    }

    // 校验 Comment 的作者是否是登录用户
    if (!comment.user.equals(this.ctx.user._id)) {
      this.ctx.throw(403, '权限错误!')
    }

    // 删除评论
    await comment.remove()

    // 更新视频评论数
    video.commentsCount = await Comment.countDocuments({
      video: videoId,
    })
    await video.save()

    this.ctx.status = 204
  }

  // 💛 喜欢视频
  async likeVideo() {
    const { Video, VideoLike } = this.app.model
    const { videoId } = this.ctx.params
    const userId = this.ctx.user._id
    const video = await Video.findById(videoId)

    if (!video) {
      this.ctx.throw(404, 'Video Not Found')
    }

    // 通过视频获取 VideoLike document
    const doc = await VideoLike.findOne({
      user: userId,
      video: videoId,
    })

    let isLiked = true

    if (doc && doc.like === 1) {
      await doc.remove() // 原来喜欢,现在取消喜欢,删除
      isLiked = false
    } else if (doc && doc.like === -1) {
      doc.like = 1 // 原来不喜欢,现在喜欢,修改
      await doc.save()
    } else {
      await new VideoLike({
        user: userId,
        video: videoId,
        like: 1,
      }).save()
    }

    // 更新喜欢视频的数量
    video.likesCount = await VideoLike.countDocuments({ video: videoId, like: 1 })

    // 更新不喜欢视频的数量
    video.dislikesCount = await VideoLike.countDocuments({ video: videoId, like: -1 })

    // 保存修改后的数据
    await video.save()

    this.ctx.body = {
      video: {
        ...video.toJSON(),
        isLiked,
      },
    }
  }

  // 💛 不喜欢视频
  async dislikeVideo() {
    const { Video, VideoLike } = this.app.model
    const { videoId } = this.ctx.params
    const userId = this.ctx.user._id
    const video = await Video.findById(videoId)

    if (!video) {
      this.ctx.throw(404, 'Video Not Found')
    }

    // 通过视频获取 VideoLike document
    const doc = await VideoLike.findOne({
      user: userId,
      video: videoId,
    })

    const isDisliked = true

    if (doc && doc.like === -1) {
      await doc.remove() // 取消不喜欢
    } else if (doc && doc.like === 1) {
      doc.like = -1 // 原来喜欢,现在不喜欢
      await doc.save()
    } else {
      await new VideoLike({
        user: userId,
        video: videoId,
        like: -1, // 创建一条不喜欢的记录
      }).save()
    }

    // 更新喜欢视频的数量
    video.likesCount = await VideoLike.countDocuments({ video: videoId, like: 1 })

    // 更新不喜欢视频的数量
    video.dislikesCount = await VideoLike.countDocuments({ video: videoId, like: -1 })

    // 保存修改后的数据
    await video.save()

    this.ctx.body = {
      video: {
        ...video.toJSON(),
        isDisliked,
      },
    }
  }
}

module.exports = VideoController
