module.exports = (app) => {
  const { router, controller } = app
  const auth = app.middleware.auth()

  // 设置基础路径
  router.prefix('/api/v1')

  router.post('/users', controller.user.create)
  router.post('/users/login', controller.user.login)

  // 先经过 auth middleware
  router.get('/user', auth, controller.user.getCurrentUser)
  router.patch('/user', auth, controller.user.update)
  // 获取用户信息
  router.get('/users/:userId', app.middleware.auth({ required: false }), controller.user.getUser)

  // 用户订阅
  router.post('/users/:userId/subscribe', auth, controller.user.subscribe)
  // 取消用户订阅
  router.delete('/users/:userId/subscribe', auth, controller.user.unsubscribe)

  // 获取用户频道列表
  router.get('/users/:userId/subscriptions', controller.user.getSubscriptions)

  // 阿里云 Vod
  router.get('/vod/CreateUploadVideo', auth, controller.vod.createUploadVideo)
}
