// 外层被导出的函数负责接收参数
module.exports = () => {
  // 返回一个中间件处理函数
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (err) {
      console.info('whole err', err)
      /**
       * {
       *    message: "Validation Failed",
       *    errors: [{"message":"required","field":"email","code":"missing_field"}],
       *    code: "invalid_param"
       * }
       */
      // 所有的异常都在 app 上触发一个 error 事件,框架会记录一条错误日志
      ctx.app.emit('error', err, ctx)

      const status = err.status || 500

      // 生产环境时 500 错误的详细内容不返回给客户端, 因为可能包含敏感信息
      const error =
        status === 500 && ctx.app.config.env === 'prod'
          ? 'Interal Server Error'
          : err.message // message 可能是个对象

      // 从 error 对象上读取各个属性, 设置到响应中
      ctx.body = { error }

      if (status === 422) {
        // 添加一个 detail 属性
        ctx.body.detail = err.errors
      }

      ctx.status = status
    }
  }
}
