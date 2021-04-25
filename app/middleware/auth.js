module.exports = (options = { required: true }) => {
  return async (ctx, next) => {
    // 1.获取请求头中 token
    let token = ctx.headers.authorization // Bearer 空格 token 数据】
    token = token ? token.split('Bearer ')[1] : null

    // 如果有 token 获取信息
    if (token) {
      try {
        // 3.token 有效, 根据userId 获取用户数据挂载到 ctx 对象中给后续中间件使用
        const data = ctx.service.user.verifyToken(token)
        ctx.user = await ctx.model.User.findById(data.userId)
      } catch (error) {
        ctx.throw(401)
      }
    } else if (options.required) {
      // 没有 token, required=true
      ctx.throw(401)
    }

    // 4.next 执行后续中间件
    await next()
  }
}
