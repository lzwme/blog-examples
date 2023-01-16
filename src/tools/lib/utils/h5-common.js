const h5Utils = {
  config: {
    h5List: [
      // url, title, desc, type
      ['/', '官方博客', '志文工作室博客', 'lzwme'],
      ['/v', '福利短视频', '小姐姐福利短视频在线看', 'h5'],
      ['/pages/djt', '毒鸡汤', '干了这碗鸡汤!', 'h5'],
      ['/x/mikutap', 'Mikutap（初音未来版）', '初音未来二次元音乐解压娱乐应用', 'h5'],
      ['/x/relax', '白噪音促眠', '白噪音促眠在线播放网页版', 'h5'],
      ['/x/jtcs', '今天吃啥呀？', '今天吃啥呀？再也不用为今天吃什么发愁了', 'h5'],
      ['/x/dzmy', '电子木鱼网页版', '在线电子木鱼', 'h5'],
      ['/x/163musichot', '网易云音乐热评墙', '网易云热评墙，热评音乐在线随心听!', 'h5'],
      ['/pages/games', 'H5小游戏集合', '收集的几十款好玩又解压的H5小游戏', 'game'],
      ['/x/vip', 'VIP视频解析免费看', '支持所有视频网站VIP视频免费在线解析播放', 'tool'],
      ['/x/m3u8-player', 'M3U8在线播放器', 'tool'],
      ['/x/m3u8-downloader', 'm3u8视频在线下载工具', 'm3u8视频免费在线下载工具', 'tool'],
      ['/x/audio-converter', '音频文件在线转换工具', ''],
      ['/x/screentest', '在线屏幕测试', '', 'tool'],
      ['/x/random-password', '随机密码生成器', '随机密码生成器网页版', 'tool'],
    ],
  },
  getUrlParams(search = location.search) {
    const params = {};
    const paramsSplit = search
      .replace(/^[^\?]*\?/i, '')
      .split(/&/)
      .filter(d => d.trim());

    if (paramsSplit.length > 0) {
      paramsSplit.forEach(function (item) {
        const list = item.split('=').map(d => decodeURIComponent(d));
        const key = list.splice(0, 1);
        const value = list.join('=');

        if (params[key]) {
          if (!Array.isArray(params[key])) params[key] = [params[key]];
          params[key].push(value);
        } else {
          params[key] = value;
        }
      });
    }

    return params;
  },
  initTJ(id) {
    var _hmt = _hmt || [];
    var hm = document.createElement('script');
    hm.src = 'https://hm.baidu.com/hm.js?' + (id || '1c720b7315e37bbf488afd28e60002bf');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(hm, s);
  },
};

/** ios 禁用缩放 */
function iosDisableScale() {
  if (/iPad｜Macintosh|iPhone OS/i.test(navigator.userAgent)) {
    document.addEventListener('gesturestart', function (event) {
      event.preventDefault();
    });
  }
}

function setRandomBodyBg() {
  const bg = '//lzw.me/x/iapi/bing/api.php?n=8&idx=' + Math.ceil(Math.random() * 7);
  document.body.setAttribute('style', `background: url(${bg}) no-repeat center bottom;`);
}

function setCurrentYear() {
  var cy = document.getElementById('currentYear');
  if (cy) cy.innerText = new Date().getFullYear();
}

// === init ====
function h5CommInit(types, isMergeDefault = true) {
  var defaultTypes = ['disableScale', 'bdtj'];

  if (!types) types = defaultTypes;
  else if (isMergeDefault) types = defaultTypes.concat(types);

  setCurrentYear();

  if (types.includes('bdtj')) h5Utils.initTJ();
  if (types.includes('disableScale')) iosDisableScale();
  if (types.includes('bg')) setRandomBodyBg();
}
