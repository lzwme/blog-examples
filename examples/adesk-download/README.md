# adesk 接口图库下载

示例：

```bash
# 启动并下载全部分类，每个分类最多 1000 条
pnpm start

# 仅下载指定的分类
pnpm start --type girl --type 明星 --type 动漫

# 指定接口请求的排序类型。可选：hot、favs、new。默认为 hot
pnpm start --type girl --order favs

# 指定单一分类最多下载的图片数量。默认为 100
pnpm start --limit 1000
```
