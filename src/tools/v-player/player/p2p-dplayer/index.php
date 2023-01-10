<!DOCTYPE html>
<html lang="zh-cmn-Hans">
    <head>  
        <title>DPlayer</title>    
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><!-- IE内核 强制使用最新的引擎渲染网页 -->
        <meta name="renderer" content="webkit">  <!-- 启用360浏览器的极速模式(webkit) -->
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0 ,maximum-scale=1.0, user-scalable=no"><!-- 手机H5兼容模式 -->
        <meta name="x5-fullscreen" content="true" ><meta name="x5-page-mode" content="app" > <!-- X5  全屏处理 -->
        <meta name="full-screen" content="yes"><meta name="browsermode" content="application">  <!-- UC 全屏应用模式 -->
        <meta name=”apple-mobile-web-app-capable” content=”yes”> <meta name=”apple-mobile-web-app-status-bar-style” content=”black-translucent” /> <!--  苹果全屏应用模式 -->
        <!--必要样式-->
        <script type="text/javascript"  src="../../include/jquery.min.js" ></script>
        <script type="text/javascript"  src="../../include/class.main.js" ></script>
        <script type="text/javascript"  src="p2p.hls.min.js"></script>
        <link rel="stylesheet" href="DPlayer.min.css"> 
		<script>document.write('<script type="text/javascript" src="DPlayer'+_GET('ver')+'.min.js" ><\/script> ');</script>
		<script> if(_GET('logo_off')==="1"){document.write('<style> .dplayer-logo{'+ Base64.decode(_GET('logo_style'))+'}<\/style>'); }</script>
        <style type="text/css">
            html,body{
                background-color:#000;
                padding: 0;
                margin: 0;
                height:100%;
                width:100%;
                color:#999;
                overflow:hidden;
            }
            #video{
                height:100%!important;
                width:100%!important;
            }
           
            #stats{ display:none;position:fixed;top:8px;left:40px;font-size:12px;color:#F2F2F2;z-index:2147483647;text-shadow:1px 1px 1px #000, 1px 1px 1px #000}
        </style>
	    
    </head>

    <body oncontextmenu=self.event.returnValue=false onselectstart="return false">
        <div id="video"></div>	
		<div id="stats"></div>
     <script type="text/javascript">
            window.addEventListener('error', function (e) { window.location.href="../h5/"+ window.location.search;}); 
            var xyplay = ("undefined" !== typeof parent.xyplay) ? parent.xyplay : parent.parent.xyplay;
            var videoUrl = decodeURIComponent(_GET('url'));
			console.log("URL:"+videoUrl);
            var headtime= Number(getCookie("time_"+ videoUrl)|| _GET('headtime'));
            var autoplay= _GET('autoplay')==="0" ? 0 : 1;
            var seektime=_GET('seektime')==="0" ? 0 : 1;
	    var live =_GET('live')==="1" ? 1 : 0;
	    var danmaku=_GET('danmaku')==="1" ? 1 : 0;
            var logo_off=_GET('logo_off')==="1" ? 1 : 0;
            var _peerId = '', _peerNum = 0, _totalP2PDownloaded = 0, _totalP2PUploaded = 0;
            var videoObject = {
                      container: document.getElementById('video'),
                      autoplay:autoplay,
                      live:live,
					  preload:"auto",
                      video: {
                               url: videoUrl,
		      hlsjsConfig: {
                    //   debug: false,
                  // Other hlsjsConfig options provided by hls.js
                p2pConfig: {
                 logLevel: true,
                 live: live        // 如果是直播设为true
                // Other p2pConfig options provided by CDNBye
                // https://docs.cdnbye.com/#/API
            }
        }
    }  
};  

         //LOGO
           if(logo_off===1){ videoObject["logo"]="logo.png";}
        
          //弹幕
          if(danmaku){ videoObject["danmaku"]={
			   id:videoUrl,
			   token:"299b6a5543616b5508c1ce8616ed530b",
                           api: "https://dplayer.moerats.com/",
                          // addition:['https://dplayer.moerats.com/v3/bilibili?aid=7100521'],
		     };
		  
		  }
      
            //智能显示图片及控件
            if (is_mobile()) {
                videoObject["video"]["pic"] = "loading_wap.gif";
            }
            if ("undefined" !== typeof xyplay && "undefined" !== typeof xyplay.list_array) {
                if (xyplay.list_array && xyplay.list_array.length > 0 && live === 0) {
                    videoObject["next"] = "video_next";
                    videoObject["list"] = "xyplay.onlist";
                   if (!is_mobile()) {  videoObject["front"] = "video_front";}
                }
            }
            // 调用dplayer, api参考 ：https://dplayer.js.org/#/zh-Hans/?id=api
            player = new DPlayer(videoObject);
            
            //p2p信息
           if(_GET('p2pinfo')!=="0" ){
                  $("#stats").show();
                    player.on('stats', function (stats) {
                        _totalP2PDownloaded = stats.totalP2PDownloaded;
                        _totalP2PUploaded = stats.totalP2PUploaded;
                        updateStats();
                    });
                    player.on('peerId', function (peerId) {
                        _peerId = peerId;
                    });
                   player.on('peers', function (peers) {
                        _peerNum = peers.length;
                        updateStats();
                    });  

            }
            
            //绑定准备就绪回调
            player.on("loadedmetadata", function () {loadedmetadataHandler();});
            //绑定播放结束回调
            player.on("ended", function () {endedHandler();});
            //绑定错误回调
            player.on("error", function () {"undefined" !== typeof xyplay && xyplay.errorHandler();});
           //全屏play
            player.on("fullscreen", function () {$("#stats").hide();});
            //退出全屏
            player.on("fullscreen_cancel", function (){$("#stats").show();});
            
            //视频就绪回调,用来监控播放开始 
            function loadedmetadataHandler() {
                if ( seektime===1 && !live && headtime > 0 && player.video.currentTime < headtime) {
                        player.seek(headtime);
                        player.notice("继续上次播放");
 
                } else {
                       player.notice("视频已就绪");
            
                }
                   player.on("timeupdate", function () {
                        timeupdateHandler();
                    });
           
            }
            //播放进度回调  	
            function timeupdateHandler() {
               setCookie("time_"+ videoUrl,player.video.currentTime,24);
           }

            //播放结束回调		
            function endedHandler() {
                setCookie("time_"+ videoUrl,"",-1);
                if (xyplay.playlist_array.length > Number(xyplay.part)) {
                    player.notice("视频已结束,为您跳到下一集");
                    setTimeout(function () {
                        video_next();
                    }, 500);
                } else {
                    player.notice("视频播放已结束");
                }
            }
            //播放下集
            function video_next() {
                if ("undefined" !== typeof xyplay && "undefined" !== typeof xyplay.playlist_array)
                    if (Number(xyplay.part) + 1 >= xyplay.playlist_array.length) {
                        return false;
                    }
                xyplay.part++;
                myplay(xyplay.playlist_array[xyplay.part]);
            }
            //播放上集	
            function video_front() {
                if ("undefined" !== typeof xyplay && "undefined" !== typeof xyplay.playlist_array)
                    if (Number(xyplay.part) <= 0) {
                        return false;
                    }
                xyplay.part--;
                myplay(xyplay.playlist_array[xyplay.part]);

            }
            //调用播放
            function myplay(url) { 
                videoUrl=url; headtime= Number(getCookie("time_"+ videoUrl));
                player.switchVideo({url: url});
                player.play();
                if ("undefined" !== typeof xyplay) {
                    if (xyplay.title && !live) {
                        parent.document.title = "正在播放:【" + xyplay.title + "】part " + (Number(xyplay.part) + 1) + "-- " + xyplay.mytitle;
                    }

                }

            } 
     
      function updateStats() {
           var text = 'P2P已加速' + (_totalP2PDownloaded/1024).toFixed(2)
            + 'MB 已分享' + (_totalP2PUploaded/1024).toFixed(2) + 'MB' + ' 正在看' + (_peerNum+1) + '人';
            document.getElementById('stats').innerText = text;
            
          }  
       $("#stats").css("color",random_rgb(0,100));
       $("#stats").mousemove(function(){ $("#stats").css("color",random_rgb());});

        </script>

    </body></html>