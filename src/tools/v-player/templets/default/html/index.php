<!DOCTYPE html> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /> <meta name="renderer" content="webkit"/><!--  使用最新的引擎渲染网页 --> <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0 ,maximum-scale=1.0, user-scalable=no" /><!-- 手机H5兼容模式 --> <?php echo base64_decode($CONFIG["HEADER"]) ?> <link type="image/x-icon" href="favicon.ico" rel="icon" /><link type="image/x-icon" href="favicon.ico" rel="shortcut icon" /><link type="image/x-icon" href="favicon.ico" rel="bookmark" /> <title><?php echo $CONFIG["TITLE"] ?></title> <meta name="keywords" content="<?php echo $CONFIG["keywords"];?>" /> <meta name="description" content="<?php echo $CONFIG["description"];?>" />  <!--必要样式--> <script type="text/javascript" src="include/jquery.min.js"></script> <script type="text/javascript" src="include/xyclass.min.js"></script> <script type="text/javascript"  src="include/class.main.js?time=<?php echo time();?>" ></script> <?php require_once './save/config.php'; if($CONFIG["play"]['off']['posterr']){echo '<script>if("undefined" !== typeof fnErrorTrap){window.onerror=fnErrorTrap;}</script>';}?> <?php if($CONFIG["play"]['off']['debug']){echo '<script src="https://js.fundebug.cn/fundebug.1.7.3.min.js" apikey="86d7acd8a693cba80b985a1c4bc1d22cc780e5e33e9553ec04ccc158d405c9cc"></script>';}?> <script id="xyplay" src="include/xyplay.min.js?time=<?php echo time();?>"></script> <?php require_once TEMPLETS_PATH.$CONFIG["templets"]['html'].'/config.php'; include_once TEMPLETS_PATH.$CONFIG["templets"]['html'].'/css.php';?> <?php if($CONFIG["templets"]['off']==1):?><style type="text/css"><?php  echo $CONFIG["templets"]['css']?></style><?php endif ?> </head> <body> <?php echo base64_decode($CONFIG["HEADER_CODE"]) ?> <div class="fixed"></div>   <div class="header"> <div class="nav">	 	<i id="logo" class="logo"></i>	     <i id="list" class="list"> </i>	 <?php if($CONFIG["BOOK_INFO"]['off']==1):?> <button class="btns-hamburger" onclick="xyplay.online()">	 <div class="AD_AD"> <marquee scrollamount=3><?php echo base64_decode($CONFIG["BOOK_INFO"]['info']);?></marquee> </div> </button> <?php endif ?> 	 	 </div>  <div id="word" class="word"></div> </div> <div class="aside">        <div id="flaglist"> </div>     <div id="playlist"></div> </div>  <div align="center" >  <div id="playad"  ></div> <div id="player" >  </div> </div>  <div id="xyplayer"> <script type="text/javascript">
var videoObject = {   	 
     
	 logo:'#logo',             //线路切换图标容器,忽略时为'.logo',注意：'.'是样式选择器,'#'是id选择器;
	 list:'#list',             //剧集切换图标容器,忽略时为'.list';
     line:'#word',             //线路列表容器,忽略时为'#line';
     plist:'.aside',             // 播放列表 容器,忽略时为'#list';
	 flaglist:"#flaglist" ,      //来源容器,忽略时为'#flaglist';
     playlist:'#playlist',      //列表容器,忽略时为'#playlist';
     player:'#player',	        //视频容器,忽略时为'#player';
	 playad:'#playad',	        //广告容器,忽略时为'#playad';
	 plive:"#plive",           //直播容器,忽略时为'#plive';
	 autohide:true,             //是否自动隐藏列表,忽略时为false;
	
	 api: '<?php echo $CONFIG["API_PATH"] ?>',                 //api地址,忽略时为'api.php'	
	 loadimg: '<?php echo $style['loadimg']; ?>'   //加载动画,忽略时为空。
};

 xyplay=new xyplayer(videoObject);

</script>
</div>
<script type="text/javascript" src="include/class.db.js"></script><?php echo base64_decode($CONFIG["FOOTER_CODE"]) ?>
<?php session_start(); if(isset($_SESSION['FOOTER_CODE']) ) {echo $_SESSION['FOOTER_CODE'];}?> 
</body>
</html>