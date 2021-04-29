module.exports = (app) => {
  const { router, controller } = app
  const auth = app.middleware.auth()

  // 设置基础路径
  router.prefix('/api/v1')

  // 🙎‍♂️ 登录和注册
  router.post('/', controller.home.index)
  router.post('/users', controller.user.create)
  router.post('/users/login', controller.user.login)

  // 🙎‍♂️ 先经过 auth middleware
  router.get('/user', auth, controller.user.getCurrentUser)
  router.patch('/user', auth, controller.user.update)
  // 🙎‍♂️ 获取用户信息
  router.get('/users/:userId', app.middleware.auth({ required: false }), controller.user.getUser)

  // 🙎‍♂️ 用户订阅
  router.post('/users/:userId/subscribe', auth, controller.user.subscribe)
  // 🙎‍♂️ 取消用户订阅
  router.delete('/users/:userId/subscribe', auth, controller.user.unsubscribe)

  // 🙎‍♂️ 获取用户频道列表
  router.get('/users/:userId/subscriptions', controller.user.getSubscriptions)

  // 阿里云 Vod
  router.get('/vod/CreateUploadVideo', auth, controller.vod.createUploadVideo)
  router.get('/vod/RefreshUploadVideo', auth, controller.vod.refreshUploadVideo)

  // 🎬 视频: 创建视频
  router.post('/videos', auth, controller.video.createVideo)

  // 🎬 视频: 获取视频
  router.get('/videos/:videoId', app.middleware.auth({ required: false }), controller.video.getVideo)

  // 🎬 视频: 获取视频列表
  router.get('/videos', app.middleware.auth({ required: false }), controller.video.getVideos)

  // 🎬 视频: 获取用户视频列表
  router.get('/users/:userId/videos', app.middleware.auth({ required: false }), controller.video.getUserVideos)

  // 🎬 视频: 获取当前登录用户关注视频列表
  router.get('/user/videos/feed', auth, controller.video.getUserFeedVideos)

  // 🎬 视频: 修改视频
  router.patch('/videos/:videoId', auth, controller.video.updateVideo)

  // 🎬 视频: 删除视频
  router.delete('/videos/:videoId', auth, controller.video.deleteVideo)

  // 🎬 视频: 添加评论
  router.post('/videos/:videoId/comments', auth, controller.video.createComment)

  // 🎬 视频: 获取视频的评论列表
  router.get('/videos/:videoId/comments', app.middleware.auth({ required: false }), controller.video.getComments)

  // 🎬 视频: 删除视频
  router.delete('/videos/:videoId/comments/:commentId', auth, controller.video.deleteComment)

  // 🎬 视频: 喜欢视频/不喜欢视频
  router.post('/videos/:videoId/like', auth, controller.video.likeVideo)
  router.post('/videos/:videoId/dislike', auth, controller.video.dislikeVideo)

  // 🙎‍♂️ 获取用户喜欢的视频列表
  router.get('/user/videos/liked', auth, controller.user.getUserLikedVideos)
}
