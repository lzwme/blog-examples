/**
 * github 文件访问代理路径替换
 * {@link https://ghproxy.com/https://github.com/hunshcn/gh-proxy/blob/master/index.js}
 */
function githubUrlToProxy(path = '') {
  const exp1 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:releases|archive)\/.*$/i;
  const exp2 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:blob|raw)\/.*$/i;
  const exp3 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:info|git-).*$/i;
  const exp4 = /^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com\/.+$/i;
  const exp5 = /^(?:https?:\/\/)?gist\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+$/i;
  const exp6 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/tags.*$/i;

  path = path.replace(/^https?:\/+/, 'https://');
  if (path.startsWith('github')) path = 'https://' + urlStr;

  if (
    path.search(exp1) === 0 ||
    path.search(exp5) === 0 ||
    path.search(exp6) === 0 ||
    path.search(exp3) === 0
    // path.search(exp4) === 0
  ) {
    return `https://ghproxy.com/` + path;
  } else if (path.search(exp2) === 0) {
    path = path.replace('/blob/', '@').replace(/^(?:https?:\/\/)?github\.com/, 'https://cdn.jsdelivr.net/gh');
  } else if (path.search(exp4) === 0) {
    path = path
      .replace(/(?<=com\/.+?\/.+?)\/(.+?\/)/, '@$1')
      .replace(/^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com/, 'https://cdn.jsdelivr.net/gh');
  }

  if (path.startsWith('https://github.com')) {
    path = path.replace('https://github.com', 'https://cdn.jsdelivr.net/gh');
  }

  return path;
}
