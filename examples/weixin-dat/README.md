# 微信 DAT 格式图片解密工具

## 使用

### 基于 Node.js 命令行使用

```bash
# 全局安装 tsx
npm i -g tsx
```
命令行运行：

```bash
# 查看帮助
yarn start --help

# 解密示例 - D:\xwechat_files 目录或子目录下存在包含多个 DAT 文件
yarn start -s "D:\xwechat_files" -d "D:\xwechat_files_decrypted"
```

### 基于 Web 浏览器使用

编译：

```bash
yarn build
```

运行：

```bash
npx @lzwme/sserver -p 8888
```

浏览器访问：http://localhost:8888/
