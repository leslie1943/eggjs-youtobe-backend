module.exports = () => {
  return async (ctx, next) => {
    // 1.获取请求头中 token
    let token = ctx.headers.authorization // Bearer 空格 token 数据】
    token = token ? token.split('Bearer ')[1] : null
    // 2.验证 token, 无效 401
    if (!token) {
      ctx.throw(401)
    }

    try {
      // 3.token 有效, 根据userId 获取用户数据挂载到 ctx 对象中给后续中间件使用
      const data = ctx.service.user.verifyToken(token)
      ctx.user = await ctx.model.User.findById(data.userId)
    } catch (error) {
      ctx.throw(401)
    }

    // 4.next 执行后续中间件
    await next()
  }
}
