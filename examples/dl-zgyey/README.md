# zgyey 幼儿园班级相册批量下载工具

幼儿园门户：http://zgyey.com

## 用法

- 下载并安装 [Node.js](https://nodejs.org)
- 进入当前目录，打开 cmd 命令提示符，执行 `npm install`
- 打开浏览器，登录至幼儿园班级相册，F12 从任意请求中复制 `cookie` 值
- 打开 `src/index.mjs` 文件，修改 `albumIndex` 和 `cookie` 为实际数值
- 进入当前目录，打开 cmd 命令提示符，执行 `node src/index.mjs "<cookie>"` 开始下载。下载的图片将保存在 `cache` 目录下
