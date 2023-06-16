[![@lzwme/tinify-cli](https://nodei.co/npm/@lzwme/tinify-cli.png)][download-url]

@lzwme/tinify-cli
========

[![NPM version][npm-badge]][npm-url]
[![node version][node-badge]][node-url]
[![npm download][download-badge]][download-url]
[![GitHub issues][issues-badge]][issues-url]
[![GitHub forks][forks-badge]][forks-url]
[![GitHub stars][stars-badge]][stars-url]
![license MIT](https://img.shields.io/github/license/lzwme/blog-examples)

## Install

```bash
npm i -g @lzwme/tinify-cli
```

## Useage

示例：

```bash
tinify -h

# 压缩 images 目录下的所有图片，并覆盖原始文件
tinify --key <API key> --src ./images

# 压缩 images 目录下的所有图片，并输出至 output 目录
tinify --key <API key> --src ./images --dest ./output

# 仅压缩大小在 50kb 以上的文件
tinify --key <API key> --src ./images --dest ./output -m 50
```

## License

`@lzwme/tinify-cli` is released under the MIT license.

该插件由[志文工作室](https://lzw.me)开发和维护。


[stars-badge]: https://img.shields.io/github/stars/lzwme/blog-examples.svg
[stars-url]: https://github.com/lzwme/blog-examples/stargazers
[forks-badge]: https://img.shields.io/github/forks/lzwme/blog-examples.svg
[forks-url]: https://github.com/lzwme/blog-examples/network
[issues-badge]: https://img.shields.io/github/issues/lzwme/blog-examples.svg
[issues-url]: https://github.com/lzwme/blog-examples/issues
[npm-badge]: https://img.shields.io/npm/v/@lzwme/tinify-cli.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@lzwme/tinify-cli
[node-badge]: https://img.shields.io/badge/node.js-%3E=_10.9.0-green.svg?style=flat-square
[node-url]: https://nodejs.org/download/
[download-badge]: https://img.shields.io/npm/dm/@lzwme/tinify-cli.svg?style=flat-square
[download-url]: https://npmjs.org/package/@lzwme/tinify-cli
[bundlephobia-url]: https://bundlephobia.com/result?p=@lzwme/tinify-cli@latest
[bundlephobia-badge]: https://badgen.net/bundlephobia/minzip/@lzwme/tinify-cli@latest
