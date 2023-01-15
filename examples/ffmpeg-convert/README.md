# ffmpeg 音视频格式转换

## ffmpeg 常用命令操作

```bash
# ffmpeg 获取音视频信息
ffmpeg -i lzwme.mp4

# 最简单的音视频转换命令（默认使用 CPU 编解码）
ffmpeg -i input.mp4 output.mp4

# 视频压缩
ffmpeg -i "test.mp4" -vf scale=长:宽 "test-output.mp4"
# 视频压缩(硬件加速)
ffmpeg -hwaccel videotoolbox -i input.mp4 -vf scale=-1:720 -b:v 1000K -c:v h264_videotoolbox output.mp4
```

## ffmpeg 使用 GPU 硬件加速

```bash
# 查看所支持的硬件加速方法 -- MacBook Air 下为： videotoolbox
ffmpeg -hwaccels

# 查看所支持的 h264 编解码器（windows）
ffmpeg -codecs | findstr "h264"
# 查看所支持的 h264 编解码器（mac/linux） -- MacBook Air 下为： h264_videotoolbox
ffmpeg -codecs | grep h264

# 使用硬解模式
ffmpeg -hwaccel -c:v videotoolbox -i input.mp4 -c:v h264_videotoolbox output.mp4
# 使用硬解模式，指定码率
ffmpeg -hwaccel -c:v videotoolbox  -i input.mp4 -c:v h264_videotoolbox -b:v 10000k output.mp4
```

## Macbook ffmpeg 使用硬件加速

Macbook 上的英特尔核显显卡一般为 `videotoolbox`，故硬件加速命令格式参考如下：

```bash
ffmpeg -hwaccel videotoolbox -i input.avi -vf scale=-1:720 -b:v 2000K -c:v h264_videotoolbox output.mp4
```

参数说明：

- `-hwaccel videotoolbox` 使用硬件解码，一般是英特尔的核显显卡
- `-i input.avi` 需要压缩转码的视频文件
- `-vf scale=-1:720` 视频压缩，压缩成 720P。 格式：`scale=长:宽`
- `-b:v 2000K` 指定码率。`v` 表示视频，音频则应为 `-b:a`
- `-c:v h264_videotoolbox` 使用MacOS上的显卡GPU加速转码

## ffmpeg 对视频截图

```bash
# 指定时间截图
ffmpeg -ss 00:00:01 -i ./lzw.me.mp4 -f image2 -y ./lzw.me-screenshot.jpg

# 指定每隔一秒截取一次
ffmpeg -i lzw.me.mp4 -r 1 lzw.me-screenshot-%d.jpg

ffmpeg -i NLP-CNN.mp4 -f image2 -r 0.2 -ss 00:00 -t 02:45  NLP_CNN_Image%3d.jpg

```

## ffmpeg 图片合成视频

```bash
ffmpeg -framerate 2 -i ./images/*.jpg lzw.me.mp4
```

## ffmpeg 为视频加 logo

```bash
# 左上角
ffmpeg -i input.mp4 -i lzw.me.logo.png -filter_complex overlay output.mp4
# 右上角： 
ffmpeg -i input.mp4 -i lzw.me.logo.png -filter_complex overlay=W-w output.mp4 
# 左下角： 
ffmpeg -i input.mp4 -i lzw.me.logo.png -filter_complex overlay=0:H-h output.mp4 
# 右下角： 
ffmpeg -i input.mp4 -i lzw.me.logo.png -filter_complex overlay=W-w:H-h output.mp4
```

## ffmpeg 为视频去 logo
