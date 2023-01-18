# Examples for lzw.me

主要发布博文中涉及的工具子项目、博文示例等资源。

- [博客地址：志文工作室](https://lzw.me)

## 资源列表

### [EXAMPLES](./examples/)

- [PC微信dat图片扫描与转换](./examples/weixin-dat)
- [ffmpeg 批量转换](./examples/ffmpeg-convert)
- more...

### [工具类](./src/tools/)

- [网易云音乐热评墙](https://lzw.me/x/163musichot)
- [Mikutap（初音未来版）](https://lzw.me/x/mikutap)
- [今天吃啥呀？](https://lzw.me/x/jtcs)
- [电子木鱼网页版](https://lzw.me/x/dzmy)
- [白噪音促眠](https://lzw.me/x/relax)
- [VIP视频解析免费看](https://lzw.me/x/vip)
- [M3U8在线播放器](https://lzw.me/x/m3u8-player)
- [m3u8视频在线下载](https://lzw.me/x/m3u8-downloader)
- [音频文件在线转换工具](https://lzw.me/x/audio-converter)
- [随机密码生成器](https://lzw.me/x/random-password)
- [在线屏幕测试](https://lzw.me/x/screentest)
- [福利短视频](https://lzw.me/v)
- [毒鸡汤](https://lzw.me/pages/djt)
- [H5小游戏集合](https://lzw.me/pages/games)
- more...

### [API 类]('./src/tools/iapi')

- [bing每日一图](https://lzw.me/x/iapi/bing/)
- [网易云音乐简易API](https://lzw.me/x/iapi/163music/)
- more...

## 文档

- [awesome-tools 个人常用工具列表](./src/docs/tools.md)
- more...

## 其他

### CDN 资源

- [360 前端静态资源库](https://cdn.baomitu.com) 由奇舞团支持并维护的开源项目免费 CDN 服务，支持 HTTPS 和 HTTP/2，囊括上千个前端资源库和 Google 字体库。
- [staticfile:](http://www.staticfile.org) 七牛云提供 CDN，掘金提供技术支持
- [bootcdn:](https://www.bootcdn.cn) 极兔云联合 Bootstrap中文网共同支持并维护的前端开源项目免费 CDN 服务
- [字节跳动静态资源公共库](https://cdn.bytedance.com)
- [jsdelivr](https://www.jsdelivr.com) 支持 npm 包、github 仓库
  - [unpkg]格式：https://cdn.jsdelivr.net/npm/package@version/file
  - [github]格式：https://cdn.jsdelivr.net/gh/user/repo@version/file
  - [wordpress plugin]格式：https://cdn.jsdelivr.net/wp/plugins/project/tags/version/file
- `zhimg(知乎)`
  - [unpkg]示例：https://unpkg.zhimg.com/jquery@3.3.1/dist/jquery.min.js
- `elemecdn(饿了么)`
  - [unpkg]示例：https://npm.elemecdn.com/jquery@3/dist/jquery.min.js
  - [github]示例：https://github.elemecdn.com/jquery/
- [cdnjs](https://cdnjs.com) 上面许多 CDN 资源均是基于 cdnjs 同步的
- https://statically.io
- https://www.sourcegcdn.com

**CDN 引用示例：**

```html
<!-- bootcdn -->
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js"></script>

<!-- jsdelivr -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/mhDoLbDldZc3qpsJHpLogda//BVZbgYuw6kof4u2FrCedxOtgRZDTHgHUhOCVim" crossorigin="anonymous"></script>
```

常用参考：

```html
<!-- jquery -->
<script crossorigin="anonymous" integrity="sha512-STof4xm1wgkfm7heWqFJVn58Hm3EtS31XFaagaa8VMReCXAkQnJZ+jEy8PCC/iT18dFy95WcExNHFTqLyp72eQ==" src="https://lib.baomitu.com/jquery/3.6.3/jquery.min.js"></script>
<script crossorigin="anonymous" integrity="sha384-rY/jv8mMhqDabXSo+UCggqKtdmBfd3qC2/KvyTDNQ6PcUJXaxK1tMepoQda4g5vB" src="https://lib.baomitu.com/jquery/2.2.4/jquery.min.js"></script>
<script crossorigin="anonymous" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" src="https://lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>

<!-- bootstrap 3 -->
<link crossorigin="anonymous" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" href="https://lib.baomitu.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
<script crossorigin="anonymous" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" src="https://lib.baomitu.com/twitter-bootstrap/3.4.1/js/bootstrap.min.js"></script>

<!-- font-awesome -->
<link crossorigin="anonymous" integrity="sha512-RvQxwf+3zJuNwl4e0sZjQeX7kUa3o82bDETpgVCH2RiwYSZVDdFJ7N/woNigN/ldyOOoKw8584jM4plQdt8bhA==" href="https://lib.baomitu.com/font-awesome/latest/css/fontawesome.min.css" rel="stylesheet">
```

## 声明

部分工具类资源来源于其他开源项目或网络收集，并进行个性化功能定制。如有侵权请联系删除。
