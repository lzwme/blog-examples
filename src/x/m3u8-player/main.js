h5CommInit();

(function () {
  const urlParams = h5Utils.getUrlParams();
  const uri = urlParams.url;

  if (uri.startsWith('http:') && location.origin.startsWith('https://lzw.me')) {
    document.querySelector('a.am-topbar-logo').href = location.href.replace('https:', 'http:');
    if (!uri.startsWith('http://localhost')) {
      h5Utils.alert('由于浏览器安全限制，您访问的 https 页面下无法播放 http 协议的资源，请手动修改访问 URL 改为 http:// 格式并重新访问');
    }
  }

  window.WEBTORRENT_ANNOUNCE = [
    // https://github.com/ngosang/trackerslist/
    // https://cdn.jsdelivr.net/gh/ngosang/trackerslist@master/trackers_all_ws.txt
    'ws://tracker.files.fm:7072/announce',
    'wss://tracker.files.fm:7073/announce',
    'wss://tracker.btorrent.xyz',
    'wss://tracker.webtorrent.io',
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.fastcast.nz',
    // 'udp://tracker.openbittorrent.com:80',
    // 'udp://tracker.internetwarriors.net:1337',
    // 'udp://tracker.leechers-paradise.org:6969',
    // 'udp://tracker.coppersurfer.tk:6969',
    // 'udp://exodus.desync.com:6969',
    // 'udp://tracker.opentrackr.org:1337',
    // 'udp://explodie.org:6969',
    // 'udp://tracker.empire-js.us:1337',
  ];

  const MP = {
    inc: {
      dp: null,
      hls: null,
      flvPlayer: null,
      wtClient: null,
    },
    init() {
      if (uri != null) {
        $('.s-input').val(uri);
        if (urlParams.autoplay !== '0') MP.dplayer(uri);

        if (self !== window.top || urlParams.type === '1') {
          $('header,footer,.logo,.am-text-right,.am-alert-secondary').remove();
          if (!urlParams.showInput) $('.input-div').remove();
          else $('.input-file,.input-content').remove();

          $('#player,.am-container,body,html').css({
            height: '100%',
            width: '100%',
            margin: '0',
            padding: '0',
          });
          $('.am-container').removeClass('am-container');

          setTimeout(function () {
            $('html,body').animate(
              {
                scrollTop: $('.input-div').offset().top - 20,
              },
              200
            );
          }, 3000);
        }
      }

      $('#str-post button.play').on('click', function (ev) {
        ev.preventDefault();

        $('html,body').animate(
          {
            scrollTop: $('.input-div').offset().top - 20,
          },
          200
        );

        let url = $('input[name=url]').val();
        let m3u8Str = $('#m3u8Content').val();

        if (m3u8Str) {
          const m = /EXT-X-KEY: *METHOD=AES-128,URI="\//.exec(m3u8Str);
          if (m) {
            if (url.startsWith('http')) {
              m3u8Str = m3u8Str.replace(m[0], `EXT-X-KEY:METHOD=AES-128,URI="${new URL(url).origin}/`);
            } else {
              return alert('您输入的 M3U8 内容为加密资源，请同时输入来源页面 URL 地址尝试获取解密信息');
            }
          }

          url = URL.createObjectURL(new Blob([m3u8Str], { type: 'text/plain;charset=utf-8' }));
        }

        if (!url) return alert('请输入 m3u8 的 url 或者内容');
        MP.dplayer(url, m3u8Str.includes('.ts') ? 'customHls' : '');
      });

      let vedioRotate = 0;
      $('#str-post button.rotate').on('click', function (ev) {
        ev.preventDefault();
        vedioRotate += 90;
        if (vedioRotate === 360) vedioRotate = 0;

        $('#dplayer').css({
          transform: `rotate(${vedioRotate}deg)`,
        });
      });

      $('button.download').on('click', () => {
        let url = $('input[name=url]').val();

        if (!url) return alert('请输入 m3u8 的 url 地址');
        if (!url.includes('.m3u8')) return alert('仅支持 m3u8 格式的视频下载');

        if (url === 'test.m3u8') url = location.origin + location.pathname + url;
        window.open('../m3u8-downloader?source=' + encodeURIComponent(url));
      });

      $('#vedioSelect').on('change', ev => {
        console.log(ev.target.files);
        const file = ev.target.files[0];
        if (!file) return;
        const url = window.URL.createObjectURL(ev.target.files[0]);

        MP.dplayer(url, file.name.includes('.m3u8') ? 'customHls' : '');
        // player.onload = () => window.URL.revokeObjectURL(url);
      });

      const dropzone = document.querySelector('.am-container');

      dropzone.addEventListener("dragover", function(event) {
        event.preventDefault();
      }, false);
      dropzone.addEventListener(
        'drop',
        e => {
          e.preventDefault();
          const fileList = e.dataTransfer.files;
          const file = fileList[0];
          if (file.name.endsWith('.m3u8')) {
            file.text().then(m3u8Str => {
              $('#m3u8Content').val(m3u8Str);
              $('#str-post button.play').click();
            });
          }
          return false;
        },
        false
      );
    },
    dplayer(url, type) {
      url = decodeURIComponent(url);

      if (!type) {
        if (url.includes('.mp4')) type = 'mp4';
        else if (url.includes('.m3u8')) type = 'hls';
        else if (url.includes('torrent') || url.includes('magnet:')) type = 'customWebTorrent';
        else type = 'auto';
      }

      if (MP.inc.dp) MP.inc.dp.destroy();
      $('#dplayer').show();

      MP.inc.dp = new DPlayer({
        container: document.getElementById('dplayer'),
        autoplay: true,
        airplay: true,
        theme: '#FADFA3',
        loop: true,
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        // logo: 'logo.png',
        volume: 0.7,
        playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 8],
        mutex: true,
        video: {
          url,
          type,
          customType: {
            customHls: function (video, _player) {
              if (MP.inc.hls) MP.inc.hls.destroy();
              MP.inc.hls = new Hls();
              MP.inc.hls.loadSource(video.src);
              MP.inc.hls.attachMedia(video);
            },
            // type: 'customFlv',
            customFlv: function (video, _player) {
              if (MP.inc.flvPlayer) MP.inc.flvPlayer.destroy();
              MP.inc.flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: video.src,
              });
              MP.inc.flvPlayer.attachMediaElement(video);
              MP.inc.flvPlayer.load();
            },
            customWebTorrent: function (video, player) {
              player.container.classList.add('dplayer-loading');
              if (MP.inc.wtClient) MP.inc.wtClient.destroy();
              MP.inc.wtClient = new WebTorrent();
              MP.inc.wtClient.add(video.src, torrent => {
                const file = torrent.files.find(file => file.name.endsWith('.mp4'));
                file.renderTo(
                  video,
                  {
                    autoplay: player.options.autoplay,
                  },
                  () => {
                    player.container.classList.remove('dplayer-loading');
                  }
                );
              });
            },
          },
        },
        pluginOptions: {
          hls: {
            // hls config
          },
          flv: {
            // refer to https://github.com/bilibili/flv.js/blob/master/docs/api.md#flvjscreateplayer
            mediaDataSource: {
              // mediaDataSource config
            },
            config: {
              // config
            },
          },
          webtorrent: {
            // webtorrent config
          },
        },
        contextmenu: [
          {
            text: 'lzwme',
            link: 'https://lzw.me/links',
          },
        ],
      });
    },
  };

  MP.init();
  // MP.dplayer($('.s-input').val());
  window.MP = MP;
})();
