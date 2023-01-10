(function () {
  var VIP = {
    el: {
      JKSelect: document.getElementById('jk'),
      urlInput: document.getElementById('url'),
      palybox: document.getElementById('palybox'),
      playBtn: document.getElementById('playBtn'),
      htmerTime: document.getElementById('htmer_time'),
      tittext: document.getElementById('tittext'),
    },
    urls: [
      ['https://jx.yparse.com/index.php?url='],
      ['https://okjx.cc/?url='],
      ['https://www.jiexila.com/?url='],
      ['https://www.nxflv.com/?url='],
      ['https://jx.aidouer.net/?url='],
      ['https://www.1717yun.com/jx/ty.php?url='],
      ['https://yparse.jn1.cc/?url='],
      ['https://api.jiexi.la/?url='],
      ['https://www.ckplayer.vip/jiexi/?url='],
      ['https://jx.618g.com/?url='],
      ['https://www.ckmov.vip/api.php?url='],
      ['https://www.h8jx.com/jiexi.php?url='],
      ['https://vip.laobandq.com/jiexi.php?url='],
    ],
    play: function () {
      var rul = VIP.el.urlInput.value; //获取input链接

      if (rul == '') {
        alert('提示您：请输入链接，没链接我给你解析个毛线');
      } else {
        VIP.el.palybox.src = VIP.el.JKSelect.value + encodeURIComponent(rul);

        // get title
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');
        xhr.open('post', './data/title.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('titurl=' + rul);
        console.log(xhr.readyState);
        //获取服务器状态码
        xhr.onreadystatechange = function () {
          console.log(xhr.readyState);
          console.log(xhr.status);
          if (xhr.readyState == 4 && xhr.status == 200) {
            VIP.el.tittext.innerHTML = xhr.responseText; //获取服务器响应数据
          }
        };
      }
    },
    initHrTime: function () {
      function secondToDate(second) {
        if (!second) return 0;
        var time = new Array(0, 0, 0, 0, 0);

        if (second >= 365 * 24 * 3600) {
          time[0] = parseInt(second / (365 * 24 * 3600));
          second %= 365 * 24 * 3600;
        }

        if (second >= 24 * 3600) {
          time[1] = parseInt(second / (24 * 3600));
          second %= 24 * 3600;
        }

        if (second >= 3600) {
          time[2] = parseInt(second / 3600);
          second %= 3600;
        }

        if (second >= 60) {
          time[3] = parseInt(second / 60);
          second %= 60;
        }

        if (second > 0) {
          time[4] = second;
        }

        return time;
      }

      function setTime() {
        // 博客创建时间秒数，时间格式中，月比较特殊，是从0开始的，所以想要显示5月，得写4才行，如下
        var create_time = Math.round(new Date(Date.UTC(2008, 5, 28, 0, 0, 0)).getTime() / 1000);
        // 当前时间秒数,增加时区的差异
        var timestamp = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
        currentTime = secondToDate(timestamp - create_time);
        currentTimeHtml =
          currentTime[0] + '年' + currentTime[1] + '天' + currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4] + '秒';
        VIP.el.htmerTime.innerHTML = currentTimeHtml;
      }

      setInterval(setTime, 1000);
    },
    init: function () {
      // select
      var options = VIP.urls.map((d, idx) => `<option value="${d[0]}">${d[1] || `线路${idx + 1}`}</option>`);
      VIP.el.JKSelect.innerHTML = options.join('\n');
      VIP.el.JKSelect.selectedIndex = 0;

      // click
      VIP.el.playBtn.addEventListener('click', VIP.play, false);

      VIP.initHrTime();
    },
  };

  VIP.init();
  window.VIP = VIP;
})();
