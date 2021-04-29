## 发布
- 更新 `apt update`

## 安装 nvm
- 如果安装出现问题
- 打开 `https://www.ipaddress.com/`, 把`raw.githubusercontent.com`输入得到一个可用的 IP
- 在`Linux`系统上修改 host 文件 `vi /etc/hosts`
```bash
185.199.108.133 raw.githubusercontent.com
```
- 按`esc` => `:wq` 保存推退出

- 安装nodejs: `nvm install 14.15.4`
- 安装nodejs: `nvm install 15.8.0`

## 安装 MongoDB
- 在Ubuntu上安装, `install on ubuntu`: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
- 🚀🚀 Step-1: Import the public key used by the package management system. 执行命令: 
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
# The operation should respond with an OK.
```
- 🚀🚀 Step-2: 
```bash
sudo apt-get install gnupg
```
- 🚀🚀 Step-3
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```
- 🚀🚀 Step-4
```bash
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```
- 🚀🚀 Step-5
```bash
sudo apt-get update
```
- 🚀🚀 Step-6
```bash
sudo apt-get install -y mongodb-org
```

## 管理 MongoDB
- 🚀 `Start MongoDB`: 执行完以下命令没有任何提示, 就是成功了
```bash
sudo systemctl start mongod
```
- 🚀 `Verify that MongoDB has started successfully`
```bash
sudo systemctl status mongod
```
- 🚀 开机启动`mongo`服务: `sudo systemctl enable mongod`
- 🚀`Stop MongoDB`
```bash
sudo systemctl stop mongod
```
- 🚀`Restart MongoDB`
```bash
sudo systemctl restart mongod
```
- 🚀`Begin using MongoDB`
```bash
    mongo
```

## 安装 nginx
- 测试 47.114.105.120

## 安装 git
- `apt install git`

## 服务器生产 ssh key
- `🛬阿里云服务器`上执行 `ssh-keygen -o`
- 无需密码
- 查看 `ls .ssh/` 得到 `authorized_keys  id_rsa  id_rsa.pub`
- 执行 `cat .ssh/id_rsa.pub` 得到 ssh key, copy
- 在 github 的设置中找到`SSH and GPG keys` 中 `new SSH key`
- 名字可以随便起一个 `ubuntu 20.04`
- `🛬阿里云服务器`上下载项目 `git clone git@github.com:leslie1943/eggjs-youtobe-backend.git`
- 执行 `cd eggjs-youtobe-backend`
- 执行 `npm i --production`: 只安装生产依赖
- 安装依赖完成执行 `npm start`
- 然后在浏览器输入 `47.114.105.120:7001`测试是否启动成功
- 确保 `🛬阿里云服务器`开放`7001`端口号

## Egg.js 应用部署
- [部署文档](https://eggjs.org/zh-cn/core/deployment.html)

## 手动部署 Egg.js
1. 代码提交到 `github` 远程仓库
2. 远程服务器下载 `github` 远程仓库
```bash

```
3. 启动运行
