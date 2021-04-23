module.exports = (app) => {
  const { router, controller } = app
  const auth = app.middleware.auth()
  // router.get('/', controller.home.index);
  router.prefix('/api/v1') // 设置基础路径
  router.post('/users', controller.user.create)
  router.post('/users/login', controller.user.login)

  // 先经过 auth middleware
  router.get('/user', auth, controller.user.getCurrentUser)
}
