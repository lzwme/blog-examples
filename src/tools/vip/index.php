<?php include ('./data/beipy.inc.php');?>

<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8" />
		<title>
			<?php echo $aik['title'];?>
		</title>
		<meta name="keywords" content="<?php echo $aik['keywords'];?>" />
		<meta name="description" content="<?php echo $aik['description'];?>" />
		<meta name=viewport content="width=device-width,anicital-scale=1">
		<link rel="stylesheet" href="css/bootstrap.css" />
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/bootstrap.js"></script>

		<link rel="stylesheet" href="css/style.css" />
		<!--浏览器标签ico-->
		<link rel="shortcut icon" href="img/favicon.ico" />
		<!--书签标签-->
		<link rel="bookmark" href="img/tvico.png" />
		<!--苹果桌面标题-->
		<meta name="apple-mobile-web-app-title" content="VIP视频解析">
		<!--苹果桌面图标-->
		<link rel="apple-touch-icon-precomposed" sizes="180x180" href="img/tvlogo.png">
	</head>

	<body>
		<header>
			<div class="container">
				<nav class="navbar navbar-default">
					<div class="container-fluid">
						<!-- 手机自适应样式 -->
						<div class="navbar-header">
							<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
			        <span class="sr-only">导航切换</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			      </button>
							<!--logo图标-->
							<a class="navbar-brand logo" href="#"></a>
						</div>
						<!-- pc导航样式 -->
						<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
							<ul class="nav navbar-nav">
								<li>
									<a href="https://lzw.me" target="_blank">官方博客</a>
								</li>
								<li>
									<a href="/x/relax">在线白噪音应用</a>
								</li>
								<?php echo $aik['topnav'];?>
							</ul>
							<!--导航 右侧-->
							<ul class="nav navbar-nav navbar-right">

								<li class="dropdown">
									<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="badge" style="background: red;">1</span>  旗下网站 <span class="caret"></span></a>
									<ul class="dropdown-menu">
										<li>
											<a href="https://lzw.me" target="_blank" title="志文工作室">官方博客</a>
										</li>
										<li>
											<a href="https://lzw.me/pages/djt" target="_blank" title="毒鸡汤">毒鸡汤</a>
										</li>
										<li role="separator" class="divider"></li>
										<li>
											<a href="https://lzw.me/v" target="_blank" title="小姐姐福利短视频在线看">短视频</a>
										</li>
										<li>
											<a href="http://lzw.me/pages/m3u8/" target="_blank" title="m3u8视频流在线解析转换mp4格式下载">m3u8在线下载</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="https://lzw.me/x/screentest/" target="_blank">在线屏幕测试</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		</header>
		<!--视频box区域-->
		<div class="container-fluid video-box">
			<div class="container ">
				<div class="tit-name">
					<span>正在播放:</span>
					<h1 id="tittext">感谢您使用VIP视频解析服务,正在播放音乐MV视频！</h1>
				</div>

				<iframe id="palybox"
          src="https://jx.yparse.com/index.php?url=<?php echo $aik['maurl'];?>"
          allowtransparency="true"
          allowfullscreen="true"
          frameborder="0" scrolling="no"></iframe>

				<div class="url-box">
					<div class="input-group">
						<input type="text" id="url"
              class="form-control url-text"
              aria-label="Text input with segmented button dropdown"
              value="<?php echo $aik['maurl'];?>"
              placeholder="请粘贴视频网址>ㅂ<ﾉ ☆"
              title="请复制你想要看的视频网址，粘贴到此处点击播放即可！" />
						<div class="input-group-addon">
							<select class="url-c url-text" title="如发现视频无法正常播放请尝试更换视频线路！记得地址开头要有：http://或者https://" id="jk"></select>
						</div>
						<div class="input-group-btn">
							<button id="playBtn" type="button" class="btn btn-default btn-play" title="点击开始解析并开始播放">解析播放</button>
						</div>
					</div>

				</div>
				<div class="tit-gg">
					<span><?php echo $aik['gonggao'];?></span>
				</div>
			</div>
		</div>
		<div class="container-fluid logo-box">
			<div class="container ">
				<?php echo $aik['guanggao'];?>
				</div>
				</div>
		<!--平台logo	-->
		<div class="container-fluid logo-box">
			<div class="container ">
				<div class="row">
					<div class="col-lg-12">
						<div class="title-tit">
							<h4>支持以下网站视频</h4>
							<p>敬请关注，近期将开放支持更多平台。</p>
						</div>
					</div>
				</div>
				<!--第一行-->
				<div class="row">
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="https://vip.iqiyi.com/" target="_blank" title="爱奇艺会员">
								<img class="img-responsive" src="img/iqiyilogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="https://film.qq.com/" target="_blank" title="腾讯会员中心">
								<img class="img-responsive" src="img/qqlogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="https://vip.youku.com/" target="_blank" title="优酷会员中心">
								<img class="img-responsive" src="img/youkulogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="http://www.mgtv.com/vip/" target="_blank" title="芒果会员中心">
								<img class="img-responsive" src="img/hunantvlogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="http://yuanxian.le.com/" target="_blank" title="乐视会员中心 - 已失效">
								<img class="img-responsive" src="img/letvlogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="http://vip.tudou.com" target="_blank" title="土豆会员中心">
								<img class="img-responsive" src="img/tudoulogo.png" />
							</a>
						</div>
					</div>
				</div>
				<!--第一行结束-->

				<!--第二行开始-->
				<div class="row">
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="http://www.baofeng.com/" target="_blank" title="暴风会员 - 已失效">
								<img class="img-responsive" src="img/baofeng.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="https://vip.1905.com/" target="_blank" title="1905电影网视频">
								<img class="img-responsive" src="img/1905logo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="https://vip.kankan.com/" target="_blank" title="天天看看 - 已失效">
								<img class="img-responsive" src="img/kankan.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="https://www.pptv.com/" target="_blank" title="PPTV聚力">
								<img class="img-responsive" src="img/pptv.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="https://www.yinyuetai.com/" target="_blank" title="音悦台MV">
								<img class="img-responsive" src="img/yinyuetailogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="https://www.56.com/" target="_blank" title="56视频">
								<img class="img-responsive" src="img/56logo.png" />
							</a>
						</div>
					</div>
				</div>
				<!--第二行结束-->

				<!--第三行开始-->
				<div class="row">

					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="https://www.fun.vip" target="_blank" title="风行视频 - 已失效">
								<img class="img-responsive" src="img/fengxing.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="http://movie.ku6.com/" target="_blank" title="酷6视频 - 已失效">
								<img class="img-responsive" src="img/ku6logo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="https://vip.wasu.cn/" target="_blank" title="WASU华数视频">
								<img class="img-responsive" src="img/wasulogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="http://video.sina.com.cn/" target="_blank" title="新浪视频 - 已失效">
								<img class="img-responsive" src="img/sinalogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="https://film.sohu.com/" target="_blank" title="搜狐视频">
								<img class="img-responsive" src="img/sohulogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="https://www.baomihua.com/" target="_blank" title="爆米花">
								<img class="img-responsive" src="img/baomihualogo.png" />
							</a>
						</div>
					</div>
				</div>
				<!--第三行结束-->
				<div class="row">

					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a target="_blank" title="看看新闻网视频">
								<img class="img-responsive" src="img/kankannewslogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a target="_blank" title="糖豆视频">
								<img class="img-responsive" src="img/tangdoulogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="https://tv.cctv.com/" target="_blank" title="央视网">
								<img class="img-responsive" src="img/cntvlogo.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2 ">
						<div class="logo-lie">
							<a href="http://www.acfun.cn/" target="_blank" title="Ac弹幕网">
								<img class="img-responsive" src="img/acfun.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="https://www.bilibili.com/" target="_blank" title="哔哩哔哩">
								<img class="img-responsive" src="img/bilibili.png" />
							</a>
						</div>
					</div>
					<div class="col-xs-4 col-sm-2">
						<div class="logo-lie">
							<a href="https://www.aipai.com/" target="_blank" title="爱拍原创">
								<img class="img-responsive" src="img/aipai.png" />
							</a>
						</div>
					</div>
				</div>

				<!---->
			</div>
		</div>
	<!--	<div class="container-fluid logo-box">
			<div class="container">
				<div class="row">
					<div class="col-lg-12">
						<div class="title-tit">
							<h4>畅所欲言评论一下 </h4>
						</div>
					</div>
				</div>
			</div>
		</div>  -->
		<div class="cy-box">
			<div class="container">
				<!--畅言内容框-->
				<?php echo $aik['changyan'];?>
				<!--PC和WAP自适应版-->
			</div>
		</div>

		<?php  include 'footer.php';?>

		<script type="text/javascript" src="js/tv-beipy.js" /></script>
	</body>

</html>
