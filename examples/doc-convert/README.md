# 将 doc 转换为 docx 等格式


## 基于 python 的方案

仅支持 Windows 系统，需要安装 `pywin32` 库。

```bash
# 安装依赖
pip install pywin32

# 执行转换
python ./dc.py <doc文件所在根目录>
```

## 基于 Node.js 的方案

```bash
# 安装依赖
pnpm install
# 全局安装 tsx
npm i -g tsx
```

用法：

```bash
tsx main.ts --srcDir ./src --destDir ./dest
```

**提示：**

- 使用了 `@aspose/words` 库，需要授权，否则会有水印文字。
- 也可以使用 `convertapi` 库。但会涉及上传到远端，有文件泄露风险。
