<?php
//加载库
require_once("include/main.class.php");

//-------------------------------请修改以下配置------------------------------------

//网站标题设置，后面‘’内填写标题
define('TITLE', '影视CMS专用解析');

//首页防盗链,填写调用站所在域名,多个用|隔开，cdn填写cdn域名 例：'jx.test.com|api.test.com'
define('REFERER_URL', '');

//API防盗链,填写解析所在域名；
define('ENCODE_URL', '');

//错误记录日志，为空则不记录
define('LOG_PATH', "cache/error.log");

//默认播放来源过滤器,推荐设置：'m3u8|mp4|ck|yun|27pan|bgm'
define('FLAG', 'm3u8|mp4|ck|yun|27pan|bgm');

//默认播放器设置,player目录下的子目录名称；
define('PLAYER', 'dplayer');


//数据库设置
$sql_config = array(
  //0 为苹果CMS V8 ,1为苹果CMS V10，2 为 海洋CMS, 3为赞片;
  'type' => 0,
  //服务器地址
  'server' => 'localhost',
  //数据库名
  'dbname' => 'mac',
  //数据库的表前缀,为空时采用默认值，如果修改过请对应修改；
  'profix' => '',
  //登录账号
  'username' => 'root',
  'password' => '123456', //登录密码
);

//视频地址转换,可使用PHP正则,仅用于资源搜索。
//使用技巧：可用变量"(?n)"对应前面正则左起第n个小括号里的内容。
$url_match = array(
  '!m.v.qq.com.*?cid=(.*?)&vid=(.*?)$!i' => 'https://v.qq.com/x/cover/(?1)/(?2).html',
  '!m.v.qq.com.*?cid=(.*?)$!i' => 'https://v.qq.com/x/cover/(?1).html',
  '!m.v.qq.com/cover/r/(.*?)cid=(.*?)$!i' => 'https://v.qq.com/x/cover/(?1).html',
  '!m.v.qq.com/cover/./(.*?)\.html\?vid=(.*?)$!i' => 'https://v.qq.com/x/cover/(?1)/(?2).html',
  '!m.fun.tv/mplay/\?mid=(\d+)&vid=(\d+)$!i' => 'https://www.fun.tv/vplay/g-(?1).v-(?2)',
  //'!m.youku.com/video/id_(.*?)==.html$!i'=>'https://v.youku.com/v_show/id_(?1)==.html',

);


//缓存设置,启用此设置时请确保cache目录有完全控制权限(777)； 
$chche_config = array(
  //缓存类型,0为关闭,1为文件缓存,2为使用Redis缓存服务；
  'type' => 1,
  //缓存服务端口
  'prot' => 6379,
  'time' => 3600 * 24, //缓存有效期,单位秒,设置后如果缓存到期会自动删除,设置为0则永不过期(不推荐)。
);

//-------------------------------修改区域结束------------------------------------

?>