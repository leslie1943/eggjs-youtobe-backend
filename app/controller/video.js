const Controller = require('egg').Controller

class VideoController extends Controller {
  // ð åå»ºè§é¢
  async createVideo() {
    const body = this.ctx.request.body

    const { Video } = this.app.model

    // éªè¯
    this.ctx.validate(
      {
        title: { type: 'string' },
        description: { type: 'string' },
        vodVideoId: { type: 'string' },
        cover: { type: 'string' },
      },
      body
    )

    // video çä½è
    body.user = this.ctx.user._id

    const video = await new Video(body).save()

    this.ctx.status = 201
    this.ctx.body = {
      video,
    }
  }

  // ð è·åè§é¢
  async getVideo() {
    const { Video, VideoLike, Subscription } = this.app.model
    const { videoId } = this.ctx.params

    // æ¾å°è§é¢è®°å½
    let video = await Video.findById(videoId).populate(
      'user',
      '_id username avatar subscribersCount channelDescription'
    )

    if (!video) {
      this.ctx.throw(404, 'Video Not Found.')
    }

    video = video.toJSON() // è½¬ææ®éJSå¯¹è±¡

    // ä¸å¡æ°æ®
    video.isLiked = false // æ¯å¦åæ¬¢
    video.isDisliked = false // æ¯å¦ä¸åæ¬¢
    video.user.isSubscribed = false // æ¯å¦å·²ç»è®¢éè§é¢ä½è

    // ç»å½ç¶æ
    if (this.ctx.user) {
      const userId = this.ctx.user._id
      if (await VideoLike.findOne({ user: userId, video: videoId, like: 1 })) {
        video.isLiked = true
      }

      if (await VideoLike.findOne({ user: userId, video: videoId, like: -1 })) {
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

  // ð è·åè§é¢åè¡¨
  async getVideos() {
    const { Video } = this.app.model
    let { pageNum = 1, pageSize = 10 } = this.ctx.query
    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)

    // æ¥è¯¢è§é¢åè¡¨
    const getVideos = Video.find()
      .populate('user')
      .sort({ createAt: -1 }) // ååºæåº
      .skip(Number.parseInt(pageNum - 1) * pageSize)
      .limit(pageSize)

    const getVideosCount = Video.countDocuments()

    // å¹¶è¡æ§è¡
    const [videos, videosCount] = await Promise.all([getVideos, getVideosCount])

    this.ctx.body = {
      videos,
      videosCount,
    }
  }

  // ð è·åç¨æ·çè§é¢åè¡¨
  async getUserVideos() {
    const { Video } = this.app.model
    let { pageNum = 1, pageSize = 10 } = this.ctx.query
    const { userId } = this.ctx.params
    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)

    // æ¥è¯¢è§é¢åè¡¨
    const getVideos = Video.find({ user: userId })
      .populate('user')
      .sort({ createAt: -1 }) // ååºæåº
      .skip(Number.parseInt(pageNum - 1) * pageSize)
      .limit(pageSize)

    const getVideosCount = Video.countDocuments({ user: userId })

    // å¹¶è¡æ§è¡
    const [videos, videosCount] = await Promise.all([getVideos, getVideosCount])

    this.ctx.body = {
      videos,
      videosCount,
    }
  }

  // ð è·åç¨æ·çè§é¢åè¡¨
  async getUserFeedVideos() {
    const { Video, Subscription } = this.app.model
    const userId = this.ctx.user._id

    // å½åç»å½ç¨æ·çå³æ³¨åè¡¨
    const channels = await Subscription.find({ user: userId }).populate('channel')
    console.info('channels', channels)
    // 60850134ffea9353c4dc68cb
    // 608689e3adcada405ce02a3f

    let { pageNum = 1, pageSize = 10 } = this.ctx.query

    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)

    // æ¥è¯¢è§é¢åè¡¨
    const getVideos = Video.find({
      user: {
        $in: channels.map((item) => item.channel._id), // å½åç¨æ·å³æ³¨é¢éç id æ°ç»
      },
    })
      .populate('user')
      .sort({ createAt: -1 }) // ååºæåº
      .skip(Number.parseInt(pageNum - 1) * pageSize)
      .limit(pageSize)

    const getVideosCount = Video.countDocuments({ user: { $in: channels.map((item) => item.channel._id) } })

    // å¹¶è¡æ§è¡
    const [videos, videosCount] = await Promise.all([getVideos, getVideosCount])

    this.ctx.body = {
      videos,
      videosCount,
    }
  }

  // ð æ´æ°è§é¢
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

    // æ¥è¯¢è§é¢: findById æ¯æ ¹æ®ç³»ç»Id
    const video = await Video.findById(videoId)

    if (!video) {
      this.ctx.throw(404, 'Video Not Found.')
    }

    // è§é¢ä½èæ¯å½åç»å½ç¨æ·
    if (!video.user.equals(userId)) {
      this.ctx.throw(403, 'æ²¡ææéä¿®æ¹.')
    }

    Object.assign(video, this.ctx.helper._.pick(body, ['title', 'description', 'cover', 'videoId']))

    await video.save()

    this.ctx.body = {
      video,
    }
  }

  // ð å é¤è§é¢
  async deleteVideo() {
    const { Video } = this.app.model

    const { videoId } = this.ctx.params

    // æ ¡éª Video æ¯å¦å­å¨
    const video = await Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404, 'Video Not Found')
    }

    // æ ¡éªVideoçä½èæ¯å¦æ¯ç»å½ç¨æ·
    if (!video.user.equals(this.ctx.user._id)) {
      this.ctx.throw(403, 'æ²¡ææéå é¤.')
    }
    await video.remove()

    this.ctx.status = 204
    this.ctx.body = {
      message: 'å é¤æå!',
    }
  }

  // ð æ·»å è¯è®º
  async createComment() {
    const { Comment, Video } = this.app.model
    const { videoId } = this.ctx.params
    const { body } = this.ctx.request

    // æ°æ®éªè¯
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

    // åå»ºè¯è®º
    const comment = await new Comment({
      content: body.content,
      user: this.ctx.user._id,
      video: videoId, // ç»è°çè¯è®º
    }).save()

    // æ´æ°è§é¢çè¯è®ºæ°é: æ ¹æ®è§é¢ID,æ¥è¯¢Commentsçæ°é => è¯è®ºæ°é
    video.commentsCount = await Comment.countDocuments({
      video: videoId,
    })

    await video.save() // æ´æ°

    // mapping è¯è®ºæå±ç¨æ·åè§é¢å­æ®µæ°æ®
    await comment.populate('user').populate('video').execPopulate()

    this.ctx.body = { comment }
  }

  // ð è·åè§é¢çè¯è®ºåè¡¨
  async getComments() {
    const { Comment } = this.app.model
    const { videoId } = this.ctx.params

    let { pageNum = 1, pageSize = 100 } = this.ctx.query
    pageNum = Number.parseInt(pageNum)
    pageSize = Number.parseInt(pageSize)

    const comments = await Comment.find({ video: videoId })
      .populate('user')
      .populate('video')
      .sort({ createdAt: -1 }) // ååºæåº
      .skip(Number.parseInt(pageNum - 1) * pageSize)
      .limit(pageSize)

    const commentTotal = await Comment.countDocuments({ video: videoId })

    this.ctx.body = {
      comments,
      commentTotal,
    }
  }

  // ð å é¤è§é¢
  async deleteComment() {
    const { Video, Comment } = this.app.model
    const { videoId, commentId } = this.ctx.params

    // æ ¡éª Video æ¯å¦å­å¨
    const video = await Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404, 'Video Not Found.')
    }

    // æ ¡éª Comment æ¯å¦å­å¨
    const comment = await Comment.findById(commentId)

    if (!comment) {
      this.ctx.throw(404, 'Comment Not Found.')
    }

    // æ ¡éª Comment çä½èæ¯å¦æ¯ç»å½ç¨æ·
    if (!comment.user.equals(this.ctx.user._id)) {
      this.ctx.throw(403, 'æééè¯¯!')
    }

    // å é¤è¯è®º
    await comment.remove()

    // æ´æ°è§é¢è¯è®ºæ°
    video.commentsCount = await Comment.countDocuments({
      video: videoId,
    })
    await video.save()

    this.ctx.status = 204
  }

  // ð åæ¬¢è§é¢
  async likeVideo() {
    const { Video, VideoLike } = this.app.model
    const { videoId } = this.ctx.params
    const userId = this.ctx.user._id
    const video = await Video.findById(videoId)

    if (!video) {
      this.ctx.throw(404, 'Video Not Found')
    }

    // éè¿è§é¢è·å VideoLike document
    const doc = await VideoLike.findOne({
      user: userId,
      video: videoId,
    })

    let isLiked = true

    if (doc && doc.like === 1) {
      await doc.remove() // åæ¥åæ¬¢,ç°å¨åæ¶åæ¬¢,å é¤
      isLiked = false
    } else if (doc && doc.like === -1) {
      doc.like = 1 // åæ¥ä¸åæ¬¢,ç°å¨åæ¬¢,ä¿®æ¹
      await doc.save()
    } else {
      await new VideoLike({
        user: userId,
        video: videoId,
        like: 1,
      }).save()
    }

    // æ´æ°åæ¬¢è§é¢çæ°é
    video.likesCount = await VideoLike.countDocuments({ video: videoId, like: 1 })

    // æ´æ°ä¸åæ¬¢è§é¢çæ°é
    video.dislikesCount = await VideoLike.countDocuments({ video: videoId, like: -1 })

    // ä¿å­ä¿®æ¹åçæ°æ®
    await video.save()

    this.ctx.body = {
      video: {
        ...video.toJSON(),
        isLiked,
      },
    }
  }

  // ð ä¸åæ¬¢è§é¢
  async dislikeVideo() {
    const { Video, VideoLike } = this.app.model
    const { videoId } = this.ctx.params
    const userId = this.ctx.user._id
    const video = await Video.findById(videoId)

    if (!video) {
      this.ctx.throw(404, 'Video Not Found')
    }

    // éè¿è§é¢è·å VideoLike document
    const doc = await VideoLike.findOne({
      user: userId,
      video: videoId,
    })

    const isDisliked = true

    if (doc && doc.like === -1) {
      await doc.remove() // åæ¶ä¸åæ¬¢
    } else if (doc && doc.like === 1) {
      doc.like = -1 // åæ¥åæ¬¢,ç°å¨ä¸åæ¬¢
      await doc.save()
    } else {
      await new VideoLike({
        user: userId,
        video: videoId,
        like: -1, // åå»ºä¸æ¡ä¸åæ¬¢çè®°å½
      }).save()
    }

    // æ´æ°åæ¬¢è§é¢çæ°é
    video.likesCount = await VideoLike.countDocuments({ video: videoId, like: 1 })

    // æ´æ°ä¸åæ¬¢è§é¢çæ°é
    video.dislikesCount = await VideoLike.countDocuments({ video: videoId, like: -1 })

    // ä¿å­ä¿®æ¹åçæ°æ®
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
