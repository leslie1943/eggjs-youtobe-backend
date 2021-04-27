# egg-youtobe-backend - vod 

### 阿里云-视频点播
- `https://www.aliyun.com/product/vod` - `9.9 套餐`
- 点播控制台
- `https://vod.console.aliyun.com/#/media/video/detail/3beed1371c954be0987918c41487ec13/video`
- 文档: `https://help.aliyun.com/document_detail/51512.html?spm=5176.12672711.0.dexternal.700d1fa3InZhJT`

### 使用上传地址和凭证方式上传
- 1. `web`客户端请求(egg.js)接口获取上传凭证和地址
- 2. 在`egg.js`中请求阿里云`vod`获取上传地址和上传凭证
- 3. 阿里云`vod`返回上传地址和上传凭证给`egg.js`
- 4. `egg.js`返回频资和地址给`web`客户端.
- 5. 上传:`OSS输入Bucket`
- 6. 返回上传结果给`web`客户端

<img src="./app/public/image/upload-flow.png">

- [Web端SDK下载](https://help.aliyun.com/document_detail/51992.htm?spm=a2c4g.11186623.2.4.4b78b227IjMTmX#topic-1959787)
- 解压进入`vue-demo`, `npm install` 然后`npm install env-cross -D`
- 修改`package.json`
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --inline --hot --host 0.0.0.0",
    "build": "cross-env NODE_ENV=production webpack --progress"
  },
```

### 媒体上传 - 客户端上传
- [客户端上传](https://help.aliyun.com/document_detail/55398.html)
- 客户端上传, 是指将移动端(`Web`, `iOS`, `Android`)或`PC`端媒体文件上传到点播存储, 适合 `UGC`, `PGC`, 运营后台等场景.本文为您介绍客户端上传的流程, 准备工作, 部署授权, 支持的功能和提供的 `SDK`.

- 获取权限 `RAM` 访问控制台创建 `RAM` 用户,并授予 `VOD` 权限

### Vod 媒体上传 - 部署授权服务
- 在客户端上传媒体文件时, 会直接将文件上传到点播存储（基于`OSS`）, 不会再经服务端进行中转, 故客户端上传必须进行鉴权, 也就是需要您在应用服务器上部署授权服务。
- `使用上传地址和凭证上传`
- (安装`视频点播`-`服务端SDK`-`Node.js SDK`)[https://help.aliyun.com/document_detail/101351.html]
- `npm install @alicloud/pop-core --save`
- `Egg.js` 应用中 添加 `路由` 
- `router.get('/vod/CreateUploadVideo', auth, controller.vod.createUploadVideo)`
- 新增 `VodController` 在`Controller`里 初始化 `Vod Client`
```js
// src/controller/vod.js
const RPCClient = require('@alicloud/pop-core').RPCClient

function initVodClient(accessKeyId, accessKeySecret) {
  const regionId = 'cn-shanghai' // 点播服务接入区域
  const client = new RPCClient({
    accessKeyId,
    accessKeySecret,
    endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
    apiVersion: '2017-03-21',
  })

  return client
}

class VodController extends Controller {
  async createUploadVideo() {
    const query = this.ctx.query

    // 验证参数
    this.ctx.validate(
      {
        Title: { type: 'string' },
        FileName: { type: 'string' },
      },
      query
    )

    const vodClient = initVodClient('LTAI5tBKLjGhbcnbbY7zgAKs', 'qi4EBj6vykkFcKJUVBGh7C9qqBHpYR')
    // 第一个参数是 action type
    this.ctx.body = await vodClient.request('CreateUploadVideo', query, {})
    // 此时 this.ctx.body 如下:
    /*
      {
        UploadAddress: '0f20acfe70ac8ab14f08ce138ef0',
        RequestId: 'eyJFbmRwb2ludCI6Imh0dHBzOi8vb3NzLWN222uLXNoYW5naGFpLmFsaXl1bmNzLmNvbSIsIkJ1Y2tldCI6Im91dGluLTNmNjNkMDgzYTU5ODExZWJhYWU4MDAxNjNlMWEzYjRhIiwiRmlsZU5hbWUiOiJzdi8xZDY2MjM3My0xNzkwODZmY2Q5MS8xZD333Y2MjM3My0xNzkwODZmY2Q5MS5tcDQifQ',
        VideoId: '4A40440182-2233-4FE2-822177-055010BBC1C55A',
        UploadAuth: 'eyJTZWN1cml0eVRva2VuIjoiQ0FJUzBBUjFxNkZ0NUIyeWZTaklyNURNR1BTQW1KdEk0SU95WVhERGlXNGpUYzVvbTVEbHJ6ejJJSDVFZW5OcUF1d2F2Lzh5bEd0VDZQZ1psclVxRnNBYUh4R2NNWlF0c2N3SnJsUHdKcGZa05YmFCMjUvelcrUGREZTBkc1Znb0lGS09waUdXRzNSTE5uK3p0Sjl4YmtlRStzS1VsNktTcUo4NFFGQW51NEVQVkZpSWU5OWtvZ3crdS9Mc3RCbksrYlRwRG5udDVYUi91UHVncHRVUnN4WTZKS241M0xYSzRXR0Q1zlpOGpiM3c1ZHRic0NsYm5KTzE4d0xwSHJ5WXNVUlpnL28zM0h4RzF4cjZmOXNZRUE9IiwiQWNjZXNzS2V5SWQiOiJTVFMuTlN5U040dURpV0FZY1ZybW52QUFEdFVOTSIsIkV4cGlyZVVUQ1RpbWUiOiIyMDIxLTA0LTI1VDEwOjUwOjE1WiIsIkFjY2Vzc0tleVNlY3JldCI6IkZBcjFLM1dieHRCdlZ6NU42M2lYSzdlWkFDd0tOSExQTmhrRUg2dFBXcnJ5IiwiRXhwaXJhdGlvbiI6IjM2MDAiLCJSZWdpb24iOiJjbi1zaGFuZ2hhaSJ9'
      }
    */
  }
}
```
- 直接用 `Postman` / `Yapi` 测试, 生成一条`上传中`的记录
- 使用`vue-demo`带着文件, 生成一条真正记录

### 🚀 测试接口 - (1) - 配置跨域处理
- 运行之前下载的项目`/aliyun-upload-sdk/vue-demo`,修改组件`UploadAuth.vue`的服务地址`createUrl`
```js
let createUrl = 'http://localhost:7001/api/v1/vod/CreateUploadVideo'
axios.get(createUrl,
  {
    params: {
      Title: 'Foo', FileName: 'Bar.mp4'
    },
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDgyOGMwODlkMzExYzBiYjBmNmZhMDMiLCJpYXQiOjE2MTkzNjMxMjYsImV4cCI6MTYxOTQ0OTUyNn0.jS1RaO4BQLQ9huEXE9GA2NVeIPtw4Zo-nzUT2pE6Hnw'
    }
  }).then(({ data }) => {
    let uploadAuth = data.UploadAuth
    let uploadAddress = data.UploadAddress
    let videoId = data.VideoId
    uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
  })
```
- 配置跨域处理
- `npm install egg-cors`
```js
// 配置跨域: config/plugin.js
exports.cors = {
  enable: true,
  package: 'egg-cors',
}
```
- 配置`config.default.js`
```js
// cross origin resource share
  config.cors = {
    origin: '*', // 允许所有网站访问
  }
```

### 🚀 测试接口 - (2) - 刷新视频上传凭证
- 扩展 `application`
```js
// extend/application.js
// 扩展 egg.js 应用实例 application

const RPCClient = require('@alicloud/pop-core').RPCClient
const accessConfig = require('../../private/access.key')

/**
 * 初始化 Vod Client
 * @param {*} accessKeyId
 * @param {*} accessKeySecret
 * @return void
 */
function initVodClient(accessKeyId, accessKeySecret) {
  const regionId = 'cn-shanghai' // 点播服务接入区域
  const client = new RPCClient({
    accessKeyId,
    accessKeySecret,
    endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
    apiVersion: '2017-03-21',
  })

  return client
}

let vodClient = null
module.exports = {
  // 获取 vod client 实例
  get vodClient() {
    if (!vodClient) {
      vodClient = initVodClient(`${accessConfig.accessKeyId}`, `${accessConfig.accessKeySecret}`)
    }
    return vodClient
  },
}
```
- 在`controller`或者其他的文件中可以直接使用 `vodClient`
```js
await this.app.vodClient.request('RefreshUploadVideo', query, {})
```
- 定义新路由, 定义controller处理方法
- 修改 / 启动 vue-demo 测试
```js
let refreshUrl = 'http://localhost:7001/api/v1/vod/RefreshUploadVideo'
axios.get(refreshUrl, {
  params: {
    VideoId: uploadInfo.videoId
  },
  headers: {
    Authorization: 'Bearer CI6MTYxOTQ0OTUyNn0.jS1RaO4BQLQ9huEXE9GA2NVeIPtw4Zo-nzUT2pE6Hnw'
  }
}).then(({ data }) => {
  let uploadAuth = data.UploadAuth
  uploader.resumeUploadWithAuth(uploadAuth)
  console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
})
self.statusText = '文件超时...'
```
- 测试场景: ❗ 通常这种场景是 `网络较慢, 文件较大` 的情况会出现


### 🚀 测试接口 - (3) - 优化配置信息
- `config`目录下新增`config.prod.js`和`config.local.js`文件
- `config.prod.js`: 通过环境变量 `process.env` 获取
- `config.local.js`: 通过配置 `私有文件` 获取


### 创建视频
- 使用 阿里云服务器上通过 `vue-demo`上传上去的`video id`
- `egg.js`定义了接口, 并且访问 阿里云VOD获取了`AccessKeyID`和`AccessKeySecret`
- 客户端访问接口地址,执行上传,在阿里云上生成一条记录