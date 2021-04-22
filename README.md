# egg-youtobe-backend

## QuickStart

<!-- add docs here for user -->
### 💛 项目目标/技术选项
- online: https://utubeclone.netlify.app/
- front-end: https://github.com/manikandanraji/youtubeclone-frontend
- back-end:  https://github.com/manikandanraji/youtubeclone-backend
- 前后端分离架构
- 先做服务端, 然后做客户端
- `后端技术选型`

| 类型 | 技术 |
| - | - |
| Web框架 | Egg.js |
| 数据库 | MongoDB |
| ORM 框架 | mongoose |
| 身份认证 | JWT |

- `客户端技术选型`
- `Vue3` 系列技术栈


### 💛 接口设计
1. 基于 Restful 规范
2. 基于 JWT 身份认证
3. 接口基础路径: /api/v1
4. 使用`CORS`处理跨域
5. 请求与响应均为 `JSON` 格式数据


### 💛 使用 Yapi 管理接口
- `github`: `https://github.com/YMFE/yapi`
- 使用我们提供的 `yapi-cli` 工具, 部署 `YApi` 平台是非常容易的. 执行 `yapi server` 启动可视化部署程序, 输入相应的配置和点击开始部署, 就能完成整个网站的部署. 部署完成之后, 可按照提示信息, 执行 `node/{网站路径/server/app.js}` 启动服务器. 在浏览器打开指定 `url`, 点击登录输入您刚才设置的管理员邮箱, 默认密码为 `ymfe.org` 登录系统(默认密码可在个人中心修改). 
- 如何部署YAPI[https://blog.csdn.net/Lb_fly0505/article/details/104670548]


### 💛 使用 Yapi - 1 - 本地搭建
- 全局安装依赖: `npm install -g yapi-cli --registry https://registry.npm.taobao.org`
- 启动数据库 `mongod --dbpath="C:\Leslie\MongoDB\data"`
- 启动配置 `yapi server`: 访问: `http://localhost:9090`
- 安装默认配置, 如果成功则出现
```
    部署日志
    当前安装版本： 1.9.2
    连接数据库成功!
    开始下载平台文件压缩包...
    http://registry.npm.taobao.org/yapi-vendor/download/yapi-vendor-1.9.2.tgz
    部署文件完成, 正在安装依赖库...
```

### 💛 使用 Yapi - 2 - 服务管理
```
    npm install pm2 -g  //安装pm2
    cd {安装my-yapi的目录}}  C:\Users\leslie\my-yapi
    pm2 start "vendors/server/app.js" --name yapi //pm2管理yapi服务
    pm2 info yapi //查看服务信息
    pm2 stop yapi //停止服务
    pm2 restart yapi //重启服务
```

### 💛 使用 Yapi - 3 - 服务管理
- 访问 `http://127.0.0.1:3000/`
- 用户名: `admin@admin.com`  密码: `ymfe.org` (默认密码)

### 💛 使用 Yapi - 4 - 扩展教程 chrome 安装 yapi 
- chrome 安装 yapi 扩展教程[https://juejin.cn/post/6844904057707085832]
- 使用 Edge 浏览器搜索 `cross-request` 添加扩展
- YApi 新版如何查看 http 请求数据[https://juejin.cn/post/6844903795743260685]

### 💛 安装 egg 脚手架工具 / Development
-  npm install -g create-egg
-  npm i
-  npm run dev
-  open http://localhost:7001/

### 💛 egg-mongoose
- npm i egg-mongoose --save
- 找到 根目录下 `config/plugin`
```js
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
}
```
- 配置连接: 找到`config/config.default.js`,加入下面的代码
```js
  config.mongoose = {
    client: {
      // youtobe 是 数据库
      url: 'mongodb://127.0.0.1/youtobe',
      options: {
          useUnifiedTopology: true
      },
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [],
    },
  }
```

### 💛 启动 mongoDB
- mongod --dbpath="C:\Leslie\MongoDB\data"

### 💛 router 设置基础路径
```js
router.prefix('/api/v1') // 设置基础路径
```

### 💛 关闭 csrf
```js
// config.default.js
 config.security = {
    csrf: {
      enable: false,
    },
  }
```

### Deploy
```bash
$ npm start
$ npm stop
```

### npm scripts
- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.
