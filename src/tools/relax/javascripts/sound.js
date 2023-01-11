(function (window, document, undefined) {
  'use strict';
  var tool = {
    toArray: function (target) {
      return window.Array.prototype.slice.call(target);
    },
  };
  function Slider(target, width, callback) {
    this._eventPc = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
    };
    this._eventMobile = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
    };
    this._isMobile = this.isMobile();
    this.eventType = this._isMobile ? this._eventMobile : this._eventPc;
    this.slider = target;
    this.width = width;
    this.callback = callback;
    this.begin = false;
    this.init();
  }
  Slider.prototype = {
    constructor: Slider,
    init: function () {
      this.event();
    },
    isMobile: function () {
      return /(iPhone|iPad|iPod|Android|SymbianOS)/i.test(
        window.navigator.userAgent
      );
    },
    event: function () {
      this.slider.addEventListener(
        this.eventType.start,
        this.start.bind(this),
        false
      );
      this.slider.parentElement.addEventListener(
        this.eventType.move,
        this.move.bind(this),
        false
      );
      this.slider.addEventListener(
        this.eventType.end,
        this.end.bind(this),
        false
      );
      this.slider.parentElement.addEventListener(
        'click',
        function (ev) {
          ev.stopPropagation();
          ev.preventDefault();
        },
        false
      );
    },
    getValue: function () {
      return window.parseInt(this.slider.style.left) / 100;
    },
    setValue: function (value) {
      this.slider.style.left = value.toFixed(2) * 100 + '%';
    },
    _getPosition: function (ev) {
      return this._isMobile ? ev.touches[0].pageX : ev.pageX;
    },
    start: function (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      this._x = this._getPosition(ev);
      this.value = this.getValue();
      this.begin = true;
    },
    move: function (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      if (this.begin) {
        var x = this._getPosition(ev);
        this._delta = x - this._x;
        this._x = x;
        this.value = this.value + this._delta / this.width;
        this.value = this.value > 1 ? 1 : this.value < 0 ? 0 : this.value;
        this.setValue(this.value);
      }
    },
    end: function (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      if (this.begin) {
        this.begin = false;
        this.callback(this.value);
      }
    },
  };
  function Player(target) {
    this._muted = false;
    this.initStatus = false;
    this.player = target;
    this.audio = target.querySelector('audio');
    if (this.audio.preload === 'none') {
      this.audio.load();
    }
    this.audio.addEventListener('canplaythrough', this.init.bind(this), false);
  }
  Player.prototype = {
    constructor: Player,
    init: function () {
      if (!this.initStatus) {
        this.initStatus = true;
        this.play();
        if (Player.muted) {
          this.audio.mute();
        } else {
          this.audio.volume = this._randomVolume();
        }
        var slider = this.player.querySelector('.slider');
        this.control = new Slider(
          slider,
          slider.parentElement.scrollWidth,
          function (value) {
            this.setVolume(value);
          }.bind(this)
        );
        this.control.setValue(this.audio.volume);
      }
    },
    play: function () {
      this.audio.play();
    },
    pause: function () {
      this.audio.pause();
    },
    _randomVolume: function () {
      return Math.random() * 0.8 + 0.2;
    },
    getVolume: function () {
      return this.audio.volume;
    },
    setVolume: function (value) {
      this.audio.volume = +value.toFixed(2);
    },
    mute: function () {
      this.audio.muted = !this.audio.muted;
    },
  };
  var register = {},
    soundList = document.getElementById('sound-list'),
    list = tool.toArray(soundList.querySelectorAll('li'));
  list.forEach(function (item) {
    var type = item.dataset.sound;
    item.addEventListener(
      'click',
      function () {
        if (!register[type]) {
          register[type] = new Player(item);
          item.classList.add('active');
        } else {
          if (register[type].audio.paused) {
            register[type].play();
            item.classList.add('active');
          } else {
            register[type].pause();
            item.classList.remove('active');
          }
        }
      },
      false
    );
  });
  var setupBtn = document.querySelector('.setup'),
    menu = document.getElementById('menu');
  setupBtn.addEventListener(
    'click',
    function (ev) {
      ev.stopPropagation();
      setupBtn.classList.add('active');
      menu.classList.add('visible');
    },
    false
  );
  var exitBtn = document.querySelector('.icon-exit');
  exitBtn.addEventListener(
    'click',
    function (ev) {
      ev.stopPropagation();
      window.location = 'https://toolwa.com/';
    },
    false
  );
  var logoBtn = document.querySelector('.icon-logo');
  logoBtn.addEventListener(
    'click',
    function (ev) {
      ev.stopPropagation();
      setupBtn.classList.remove('active');
      menu.classList.remove('visible');
    },
    false
  );
  var listBtn = document.querySelector('.icon-list'),
    sideBar = document.querySelector('.side-bar'),
    mask = sideBar.querySelector('.mask');
  listBtn.addEventListener(
    'click',
    function (ev) {
      ev.stopPropagation();
      menu.classList.remove('visible');
      sideBar.classList.add('visible');
    },
    false
  );
  mask.addEventListener(
    'click',
    function (ev) {
      ev.stopPropagation();
      sideBar.classList.remove('visible');
      setupBtn.classList.remove('active');
    },
    false
  );
  var volumeBtn = document.querySelector('.icon-volume');
  function mute() {
    for (var type in register) {
      register[type].mute();
    }
    if (volumeBtn.classList.contains('muted')) {
      volumeBtn.classList.remove('muted');
      Player.muted = false;
    } else {
      volumeBtn.classList.add('muted');
      Player.muted = true;
    }
  }
  volumeBtn.addEventListener(
    'click',
    function (ev) {
      ev.stopPropagation();
      mute();
    },
    false
  );
  function Timer(target) {
    this.timer = target;
  }
  Timer.prototype = {
    constructor: Timer,
    init: function (time, callback) {
      this._minute = '99';
      this._second = '99';
      this.minute = this.timer.querySelector('.minute');
      this.second = this.timer.querySelector('.second');
      this.createTimer(time, callback);
    },
    createTimer: function (time, callback) {
      this._timer = window.setInterval(
        function () {
          time--;
          if (time > 0) {
            this.render(
              this._format(window.parseInt(time / 60)),
              this._format(time % 60)
            );
          } else {
            this.destroy();
            callback();
          }
        }.bind(this),
        1000
      );
    },
    _format: function (value) {
      return value < 10 ? '0' + value : value;
    },
    render: function (minute, second) {
      if (this._minute !== minute) {
        this.minute.textContent = minute;
        this._minute = minute;
      }
      if (this._second !== second) {
        this.second.textContent = second;
        this._second = second;
      }
    },
    destroy: function () {
      this._minute = '99';
      this._second = '99';
      this.render('30', '00');
      window.clearInterval(this._timer);
    },
  };
  var timerBtn = document.querySelector('.icon-timer'),
    timerView = document.querySelector('.timer'),
    timer = new Timer(timerView);
  timerBtn.addEventListener(
    'click',
    function (ev) {
      ev.stopPropagation();
      timerBtn.classList.add('active');
      timerView.classList.add('visible');
      timer.init(1800, function () {
        mute();
        timerView.classList.remove('visible');
        timerBtn.classList.remove('active');
      });
    },
    false
  );
  timerView.addEventListener(
    'click',
    function (ev) {
      ev.stopPropagation();
      timer.destroy();
      timerView.classList.remove('visible');
      timerBtn.classList.remove('active');
    },
    false
  );
})(window, document);
