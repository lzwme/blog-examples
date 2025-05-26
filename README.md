# Examples for lzw.me

主要发布博文中涉及的工具子项目、博文示例等资源。

- [博客地址：https://lzw.me](https://lzw.me)

## 开发与预览

```bash
npm i -g @lzwme/sserver

git clone https://github.com/lzwme/blog-examples.git
cd blog-examples
pnpm install

# src 预览。注意，部分涉及 PHP 的模块，需要全局安装 PHP 环境
cd src
ss -a

# examples 下具体参见各示例目录下的 README.md 文件说明
```

## 资源列表

### [工具包（发布至NPM）](./packages)

- [@lzwme/tinify-cli: 基于 tinify 的图片批量压缩工具](./packages/tinify-cli/README.md)

### [EXAMPLES](./examples/)

- [PC微信dat图片扫描与转换](./examples/weixin-dat)
- [adesk 壁纸批量下载](./examples/adesk-download/README.md)
- [复制 Cookie 的 chrome 插件](./examples/chrome-extension-copy-cookies/README.md)
- [cookie-cloud Node.js 中使用示例](./examples/cookie-cloud)
- [zgyey 幼儿园班级相册批量下载工具](./examples/dl-zgyey/README.md)
- [ffmpeg 批量转换](./examples/ffmpeg-convert/README.md)
- [对照片目录按日期分类](./examples/files-cate/README.md)
- [JS 解密工具](./examples/js-decrypt/README.md)
- [网易云音乐NCM格式转换MP3格式工具](./examples/ncmtomp3/README.md)
- [基于人脸识别的图片查找工具](./examples/photo-find-by-face/)
- [photoplus 活动图片批量下载](./examples/photoplus-download/README.md)
- more...

### [工具类](./src/x/)

- `./src/x/`
  - [网易云音乐热评墙](https://lzw.me/x/163musichot)
  - [音频文件在线转换工具](https://lzw.me/x/audio-converter)
  - [电子木鱼网页版](https://lzw.me/x/dzmy)
  - [今天吃啥呀？](https://lzw.me/x/jtcs)
  - [m3u8视频在线下载](https://lzw.me/x/m3u8-downloader)
  - [M3U8在线播放器](https://lzw.me/x/m3u8-player)
  - [Mikutap（初音未来版）](https://lzw.me/x/mikutap)
  - [随机密码生成器](https://lzw.me/x/random-password)
  - [VIP视频解析免费看](https://lzw.me/x/vip)
- lzw.me(不在本仓库)
  - [毒鸡汤](https://lzw.me/pages/djt)
  - [H5小游戏集合](https://lzw.me/pages/games)
  - [白噪音促眠](https://lzw.me/x/relax)
  - [在线屏幕测试](https://lzw.me/x/screentest)
  - [福利短视频](https://lzw.me/v)
- more...

### [API 类]('./src/x/iapi/')

- [60s 看世界（PHP 版）](./src/x/iapi/60s/README.md)
- [网易云音乐简易API](https://lzw.me/x/iapi/163music/)
- [bing每日一图](https://lzw.me/x/iapi/bing/)
- more...

## 文档

- [awesome-tools 个人常用工具列表](./src/docs/awesome-tools.md)
- [Awesome ChatGPT 学习资料搜集](./src/docs/AIGC/ChatGPT/READEME.md)
- more...

## 其他

### CDN 资源

| 厂商                 | 网址                          | 说明  |
|:-------------------:| :---------------------------:|:-----:|
| Zstatic CDN         | https://cdn.zstatic.net      | 由又拍云赞助。仅同步 [cdnjs](https://github.com/cdnjs/cdnjs) 服务资源。`支持 SRI！` |
| staticfile          | https://www.staticfile.org    | 七牛云提供 CDN 赞助。仅同步 [cdnjs](https://github.com/cdnjs/cdnjs) 服务资源。`支持 SRI！` |
| 知乎npm             | https://unpkg.zhimg.com       | 未公开。`企业级服务`，内外网均可访问。支持的包不太多。 |
| 饿了么npm           | https://npm.elemecdn.com      | 未公开。`企业级服务`，不支持外网。 |
| 360 前端静态资源库    | https://cdn.baomitu.com       | 不支持外网。`支持 SRI！`由奇舞团支持并维护的开源项目免费 CDN 服务，支持 HTTPS 和 HTTP/2，囊括上千个前端资源库和 Google 字体库。|
| 字节跳动静态资源公共库 | https://cdn.bytedance.com     | 同步 cdnjs 资源。缓存过期时间最长设置一年。`自 2022 年 3 月起，静态资源已不再更新。` |
| bootcdn            | https://www.bootcdn.cn        | 极兔云联合 Bootstrap 中文网共同支持并维护的前端开源项目免费 CDN 服务。**出现过数次不稳定现象。** |
| BeeCDN             | https://www.beecdn.com       | 基于 CDNJS.COM 的前端开源库文件快速浏览搜索平台。 |
| cdnjs              | https://cdnjs.com             | CDNJS 官方。**境外服务，国内慢**，上面许多 CDN 资源均是基于 cdnjs 同步的。 |
| jsdelivr           | https://cdn.jsdelivr.net     | 支持 npm 包、github 仓库。**境外厂商，国内不稳定**  |
| statically.io      | https://statically.io        | **境外厂商，国内不稳定。** |

`unpkg / gh / wp`:

- `gh(github)`
  - 格式：https://cdn.jsdelivr.net/gh/user/repo@branch/file
    - 示例：https://cdn.jsdelivr.net/gh/lzwme/console-log-colors@main/package.json
  - 饿了么 github。示例：https://github.elemecdn.com/jquery/
  - statically（国内不稳定）：https://cdn.statically.io/gh/:user/:repo/:tag/:file
- `unpkg`
  - unpkg 官方
    - 示例：https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
  - npmmirror 镜像，大厂稳定资源，但**外网不可访问**
    - 示例：https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js
  - jsdelivr 服务，由于不在国内，时常存在不可访问的问题
    - [unpkg]格式：https://cdn.jsdelivr.net/npm/package@version/file
    - 示例：https://cdn.jsdelivr.net/npm/console-log-colors@latest/package.json
  - [知乎unpkg]示例：https://unpkg.zhimg.com/jquery@3.7.1/dist/jquery.min.js
  - [饿了么unpkg]示例：https://npm.elemecdn.com/jquery@3/dist/jquery.min.js
- `wordpress`
    - 格式：https://cdn.jsdelivr.net/wp/plugins/project/tags/version/file
      - 示例：https://cdn.jsdelivr.net/wp/plugins/wp-slimstat/tags/4.6.5/wp-slimstat.js

**CDN 引用示例：**

建议加上 `integrity` 属性，以防止供应链被攻击导致受到影响。可以从以下地址查询具体资源文件的 `integrity` 值。

- [https://lzw.me/x/srihash/](https://lzw.me/x/srihash/)
- [https://www.srihash.org](https://www.srihash.org)
- [https://cdn.jsdelivr.net](https://cdn.jsdelivr.net)

```html
<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha256-3gQJhtmj7YnV1fmtbVcnAV6eI4ws0Tr48bVZCThtCGQ=" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha256-PI8n5gCcz9cQqQXm3PEtDuPG8qx9oFsFctPg0S5zb8g=" crossorigin="anonymous">

<!-- bootcdn -->
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
```

常用参考：

<details>
  <summary>jQuery</summary>

```html
<!-- jquery3 -->
<script src="https://unpkg.zhimg.com/jquery@3.7.1/dist/jquery.min.js" crossorigin="anonymous"></script>

<script src="https://npm.elemecdn.com/jquery/dist/jquery.min.js" crossorigin="anonymous"></script>

<script src="https://cdn.bootcss.com/jquery/3.7.1/jquery.min.js" crossorigin="anonymous"></script>

<script crossorigin="anonymous" integrity="sha512-STof4xm1wgkfm7heWqFJVn58Hm3EtS31XFaagaa8VMReCXAkQnJZ+jEy8PCC/iT18dFy95WcExNHFTqLyp72eQ==" src="https://lib.baomitu.com/jquery/3.6.3/jquery.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>

<!-- jquery2 -->
<script crossorigin="anonymous" integrity="sha384-rY/jv8mMhqDabXSo+UCggqKtdmBfd3qC2/KvyTDNQ6PcUJXaxK1tMepoQda4g5vB" src="https://lib.baomitu.com/jquery/2.2.4/jquery.min.js"></script>

<!-- jquery1 -->
<script crossorigin="anonymous" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" src="https://lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>

<!-- 其他
https://cdn.jsdelivr.net/npm/jquery/
https://npm.elemecdn.com/jquery/
https://unpkg.zhimg.com/jquery/
-->
```

</details>

<details>
  <summary>Bootstrap</summary>

```html
<!-- bootstrap 5 -->
<link crossorigin="anonymous" href="https://unpkg.zhimg.com/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script crossorigin="anonymous" src="https://unpkg.zhimg.com/bootstrap@5.3.3/dist/js/bootstrap.min.js"></script>

<link crossorigin="anonymous" integrity="sha512-SbiR/eusphKoMVVXysTKG/7VseWii+Y3FdHrt0EpKgpToZeemhqHeZeLWLhJutz/2ut2Vw1uQEj2MbRF+TVBUA==" href="https://lib.baomitu.com/twitter-bootstrap/5.2.3/css/bootstrap.min.css" rel="stylesheet">
<script crossorigin="anonymous" integrity="sha512-1/RvZTcCDEUjY/CypiMz+iqqtaoQfAITmNSJY17Myp4Ms5mdxPS5UV7iOfdZoxcGhzFbOm6sntTKJppjvuhg4g==" src="https://lib.baomitu.com/twitter-bootstrap/5.2.3/js/bootstrap.min.js"></script>

<!-- bootstrap 3 -->
<link crossorigin="anonymous" href="https://lib.baomitu.com/bootstrap@3/dist/css/bootstrap.min.css" rel="stylesheet">
<script crossorigin="anonymous" src="https://npm.elemecdn.com/bootstrap@3/dist/js/bootstrap.min.js"></script>

<link crossorigin="anonymous" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" href="https://lib.baomitu.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
<script crossorigin="anonymous" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" src="https://lib.baomitu.com/twitter-bootstrap/3.4.1/js/bootstrap.min.js"></script>

<!-- bootstrap 4 -->
<link crossorigin="anonymous" integrity="sha512-T584yQ/tdRR5QwOpfvDfVQUidzfgc2339Lc8uBDtcp/wYu80d7jwBgAxbyMh0a9YM9F8N3tdErpFI8iaGx6x5g==" href="https://lib.baomitu.com/twitter-bootstrap/4.6.1/css/bootstrap.min.css" rel="stylesheet">
<script crossorigin="anonymous" integrity="sha512-UR25UO94eTnCVwjbXozyeVd6ZqpaAE9naiEUBK/A+QDbfSTQFhPGj5lOR6d8tsgbBk84Ggb5A3EkjsOgPRPcKA==" src="https://lib.baomitu.com/twitter-bootstrap/4.6.1/js/bootstrap.min.js"></script>

<!-- 其他
https://cdn.jsdelivr.net/npm/twitter-bootstrap/
https://npm.elemecdn.com/twitter-bootstrap/
https://unpkg.zhimg.com/bootstrap/
-->
```

</details>

<details>
  <summary>font-awesome</summary>

```html
<!-- font-awesome latest all -->

<!-- css 方式引入：会渲染为 font 字体格式 -->
 <link rel="stylesheet" href="https://s4.zstatic.net/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha256-5eIC48iZUHmSlSUz9XtjRyK2mzQkHScZY1WdMaoz74E=" crossorigin="anonymous">
<link href="https://cdn.staticfile.net/font-awesome/6.6.0/css/all.min.css" rel="stylesheet" crossorigin="anonymous">

<!-- js 方式引入：会渲染为 svg 格式 -->
<script src="https://npm.elemecdn.com/@fortawesome/fontawesome-free@6.3/js/all.min.js" crossorigin="anonymous"></script>

<link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" crossorigin="anonymous">
<script src="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/js/all.min.js" crossorigin="anonymous"></script>

<link href="https://lib.baomitu.com/font-awesome/latest/css/all.min.css" rel="stylesheet" crossorigin="anonymous" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="> <!-- font-awesome 5.8.1 -->
<link href="https://lib.baomitu.com/font-awesome/6.2.1/css/all.min.css" rel="stylesheet" crossorigin="anonymous" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==">
<script src="https://lib.baomitu.com/font-awesome/6.2.1/js/all.min.js" crossorigin="anonymous"></script>


<!-- fontawesome-free latest https://npm.elemecdn.com/fontawesome-free/ -->
<link href="https://npm.elemecdn.com/@fortawesome/fontawesome-free/css/fontawesome.min.css" rel="stylesheet" crossorigin="anonymous">
<script src="https://npm.elemecdn.com/@fortawesome/fontawesome-free/js/fontawesome.min.js" crossorigin="anonymous"></script>

<!-- font-awesome 4.7 -->
<link href="https://lib.baomitu.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" crossorigin="anonymous" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN">

<link href="https://npm.elemecdn.com/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet" crossorigin="anonymous">

<!-- 其他
https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/
https://npm.elemecdn.com/@fortawesome/fontawesome-free/
-->

```

</details>

## 声明

部分工具类资源来源于其他开源项目或网络收集，并进行个性化功能定制。如有侵权请联系删除。
