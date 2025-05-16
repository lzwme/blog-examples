var el = {
  muyu: document.getElementById('muyu'),
  audio1: document.getElementById('music'),
  bgmAudio: document.getElementById('music'),
  speed: document.getElementById('speed'),
  count: document.getElementById('count'),
  bgmBtn: document.getElementsByTagName('button'),
};
var cache = getInitCache();
updateCount();

el.muyu.onclick = function () {
  el.muyu.style.cssText = 'animation: run 0.2s linear;';

  var p1 = document.createElement('p');
  p1.innerHTML = '功德+1';
  p1.className = 'n4';
  document.body.appendChild(p1);

  el.audio1.currentTime = 0;
  el.audio1.play();

  updateCount(1);

  setTimeout(() => {
    el.muyu.style.cssText = '';
    p1.style.cssText = '';
  }, 200);

  setTimeout(() => p1.remove(), 800);
};

el.bgmBtn.onclick = function () {
  el.bgmAudio.paused ? el.bgmAudio.play() : el.bgmAudio.pause();
};

function getInitCache() {
  var now = new Date();
  var today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  var lsCache = localStorage.getItem('x_dzmy');
  var cache = {
    date: today,
    count: 0,
    startTime: 0,
    preClkTime: 0,
  };

  if (lsCache) {
    lsCache = JSON.parse(lsCache);
    if (lsCache.date === today) cache = lsCache;
  }

  return cache;
}

var preStats = {
  time: 0,
  count: 0,
};

function updateCount(times = 0) {
  if (times) {
    var now = Date.now();

    if (!cache.startTime) cache.startTime = now;
    cache.count += times;

    updateSpeed(now);
    cache.preClkTime = now;

    localStorage.setItem('x_dzmy', JSON.stringify(cache));
  }

  el.count.innerText = cache.count;
}

function updateSpeed(now) {
    var timeCost = now - preStats.time;
    var times = cache.count - preStats.count;
    if (times > 5) {
      var speed = 60 * 1000 * (times / timeCost);
      console.log('speed:', speed, '次/每分钟');
      if (el.speed) el.speed.innerText = '速度：' + Math.ceil(speed) + ' 次/每分钟';
    }

    if (now - preStats.time > 1000 * 10) {
      preStats = {
        time: now,
        count: cache.count,
      };
    }

    clearTimeout(preStats.timer);
    preStats.timer = setTimeout(() => {
        el.speed.innerText = '';
    }, 3000);
}