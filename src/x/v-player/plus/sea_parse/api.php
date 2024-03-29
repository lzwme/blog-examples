<?php

//不显示读取错误
ini_set("error_reporting", "E_ALL & ~E_NOTICE");
//加载库
require_once "../include/common.php";
require_once sea_INC . "/main.class.php";

//-----------------配置区域-------------------

//缓存设置
$chche_config = array(
    'type' => 1, //缓存类型,0为关闭,1为文件缓存,2为使用Redis缓存服务；
     'prot' => 6379, //缓存服务端口
     'time' => 3600 * 24, //缓存有效期,单位秒,设置后如果缓存到期会自动删除,设置为0则永不过期(不推荐)。
);

//错误记录日志，为空则不记录
define('LOG_PATH', "cache/error.log");

//默认来源设置，为空为不限制,通过浏览器参数'flag'传值时此设置自动失效。

define('FLAG', 'm3u8|ck|yun|27pan');

//海洋CMS数据库前缀,默认为'sea_'';
define('DB_PROFIX', 'sea_');

//授权域名(防盗链),多个用|隔开，如果使用cdn请填写cdn域名，为空则不限制；
//例子： define('REFERER_URL','jx.test.com|api.test.com')；
define('REFERER_URL', '');

//-----------------配置区域结束-------------------

//检测防盗链
if (!is_referer()) {header('HTTP/1.1 404 Forbidden');exit('404,文件未找到');}

//全局变量,读写缓存
$cache = new Main_Cache(array("cachetype" => $chche_config["type"], "cacheprot" => $chche_config["prot"], 'cacheTime' => $chche_config["time"]));

//强制格式
header('content-type:application/json;charset=utf8');
//header("Content-Disposition:attachment;filename='su.js'");

//循环过滤取参
foreach ($_REQUEST as $k => $v) {$$k = _RunMagicQuotes(gbutf8(RemoveXSS($v)));}

$cb   = isset($cb) && $cb ? $cb : 'seacms:search';
$cip  = isset($cip) ? $cip : "null";
$flag = isset($flag) ? $flag : FLAG;

//去反斜杠和前后空格
$url = trim(stripslashes($url));

$info = array('success' => 0, 'code' => 0);

$myObj = new Queryclass();

if ('' == $url) {
  $info['m'] = "参数错误!";exit(json_encode($info));
}

if (seturl($url, $info)) {
    exit($myObj->out_json($cb, $info));
}

//简化url,去掉了头尾（scheme,query）便于模糊查询
$url = parse_url($url);
$url = @$url['host'] . @$url['path'];

//取缓存数据
$json = $cache->get($url);

if ("" != $json) {
    exit($myObj->out_json($cb, json_decode($json)));
} else {

    $myObj->QuerySql($url, $info);

    if (1 == $info['success']) {
        seturl($info['url'], $info);
        $cache->set($url, json_encode($info));
        exit($myObj->out_json($cb, $info));

    } else {

        if (LOG_PATH !== "") {error_log("url：" . $url . "，cip: $cip,time：" . @date("Y-m-d H:i", time()) . " \r\n", 3, LOG_PATH);}
        $info['m'] = "解析失败,服务器已记录";exit($myObj->out_json($cb, $info));

    }
}

//seacms 查询类 by nohacks.cn
class Queryclass
{

/*  query方法：执行sql语句      */
    public function query($sql, $num)
    {
        global $dsql, $cfg_iscache;
        $rows       = array();
        $this->dsql = $dsql;
        if ($num) {$sql .= ' LIMIT 0,' . $num;}
        //执行查询
        $this->dsql->SetQuery($sql);
        $this->dsql->Execute('zz');
        if ($this->dsql->GetTotalRow('zz') > 0) {
            while ($row = $this->dsql->GetAssoc('zz')) {
                $rows[] = $row;
            }
            return $rows;
        } else {

            return false;
        }

    }

    /*  get方法：执行sql语句,只获取一条记录  */

    public function get($sql)
    {
        global $dsql, $cfg_iscache;
        $rows       = array();
        $this->dsql = $dsql;

        //执行查询
        $this->dsql->SetQuery($sql . " LIMIT 0,1");
        $this->dsql->Execute('zz');
        if ($this->dsql->GetTotalRow('zz') > 0) {
            $row = $this->dsql->GetAssoc('zz');
            return $row;
        } else {

            return false;
        }

    }

    public function QuerySql($keyword, &$DATA)
    {

        global $flag;
        //查询操作
        $datas = $this->query("SELECT v_id,body FROM " . DB_PROFIX . "playdata WHERE body like '%" . $keyword . "%'", 10);

        if (!is_array($datas)) {return false;}
        foreach ($datas as $data) {
            //播放数据
            $word = $data['body'];

            //取影片名
            if (!is_array($title)) {
                $id = $data['v_id'];

                $profile = $this->get("SELECT v_name FROM " . DB_PROFIX . "data WHERE v_id=" . $id);
                if (is_array($profile)) {$title = $profile['v_name'];}
            }

            //播放源分组
            $vods = explode('$$$', $word);
            foreach ($vods as $vod) {
                //播放源名称和剧集数据分离,0为名称，1为剧集数据
                $data = explode('$$', $vod);
                //剧集分组
                $video = explode("#", (string)$data[1]);
                //匹配资源标签
                $_flag = explode("$", (string)$video[0]);
                $_flag = $_flag[2];

                //匹配集数s
                for ($i = 0; $i < sizeof($video); $i++) {if (strstr($video[$i], $keyword) !== false) {$part = $i + 1;}}

                //过滤播放源
                if ("" == $flag || findstrs($_flag, $flag)) {

                    $info[] = array('flag' => $_flag, 'part' => sizeof($video), 'video' => $video);

                    $ret = true;
                }
            }
        }

        // 如果未匹配到返回假
        if (!isset($part)) {return false;}

        if ($ret) {

            //结果先按集数降序排列。
            foreach ($info as $key => $row) {$num1[$key] = $row['part'];}array_multisort($num1, SORT_DESC, $info);

            //检查集数，如果未匹配集数，
            $max = sizeof($info[0]['video']);
            if ($max >= $part) {
                //设置默认播放地址
                $vod = @$info[0]['video'][$part - 1];
                $vod = explode('$', $vod);
                //输出数据
                $DATA['code']    = 200;
                $DATA['title']   = @$title;
                $DATA['url']     = @$vod[1];
                $DATA['type']    = $info[0]['flag'];
                $DATA['part']    = $part;
                $DATA['success'] = 1;
                $DATA['info']    = $info;
                return $ret;
            }
            return false;
        }

    }
    public function out_json($Callback, $data)
    {
        $str = json_encode($data);
        return $str;
    }

}

class Main_Cache
{
    private $__cachetype = 1; //默认缓存类型,1为文件，2为Redis服务
    private $__cacheprot = 6379; //缓存服务端口，默认为Redis服务端口
    private $__cacheTime = 3600; //默认缓存时间,单位微秒。
    private $__cacheDir  = './cache'; //缓存绝对路径
    private $__md5       = true; //是否对键进行加密
    private $__suffix    = ""; //设置文件后缀
    private $__cache;
    public function __construct($config)
    {

        if (0 == $this->cachetype) {
            return;
        }

        if (is_array($config)) {
            foreach ($config as $key => $val) {
                $this->$key = $val;
            }
        }

        if (2 == $this->cachetype) {

            $this->cache = new Redis();
            $this->cache->connect('127.0.0.1', $this->cacheprot);
        }

    }
    //设置缓存
    public function set($key, $val, $leftTime = null)
    {

        if (0 == $this->cachetype) {
            return;
        } elseif (1 == $this->cachetype) {

            $key = $this->md5 ? md5($key) : $key;
            $val = $this->md5 ? base64_encode($val) : $val;
            $val = @gzcompress($val);

            $leftTime = $leftTime ? $leftTime : $this->cacheTime;
            !file_exists($this->cacheDir) && mkdir($this->cacheDir, 0777);
            $file = $this->cacheDir . '/' . $key . $this->suffix;
            //$val = serialize($val);

            @file_put_contents($file, $val) or $this->error(__line__, "文件写入失败");
            // @chmod($file,0777)  or $this->error(__line__,"设定文件权限失败");
            // @touch($file,time()+$leftTime) or $this->error(__line__,"更改文件时间失败");

        }if (2 == $this->cachetype) {
            $key_md5    = $this->md5 ? md5($key) : $key;
            $val_base64 = $this->md5 ? base64_encode($val) : $val;

            $val_base64 = @gzcompress($val_base64);
            $this->cache->set($key_md5, $val_base64);
            if (0 != $this->cacheTime) {
                $this->cache->EXPIRE($key_md5, $this->cacheTime);
            }
            // $this->cache->del($val_base64);
        }
    }

    //得到缓存
    public function get($key)
    {

        if (0 == $this->cachetype) {
            return;

        } elseif (1 == $this->cachetype) {
            $this->clear();
            if ($this->_isset($key)) {
                $key_md5 = $this->md5 ? md5($key) : $key;
                $file    = $this->cacheDir . '/' . $key_md5 . $this->suffix;
                $val     = file_get_contents($file);
                $val     = @gzuncompress($val); // $val=unserialize($val);
                $val     = $this->md5 ? base64_decode($val) : $val;
                return $val;
            }
            return null;
        }if (2 == $this->cachetype) {
            $key_md5    = $this->md5 ? md5($key) : $key;
            $val        = $this->cache->get($key_md5);
            $val        = @gzuncompress($val);
            $val_base64 = $this->md5 ? base64_decode($val) : $val;
            return $val_base64;

        }

    }

    //判断文件是否有效
    public function isset($key)
    {
        $key  = $this->md5 ? md5($key) : $key;
        $file = $this->cacheDir . '/' . $key . $this->suffix;
        if (file_exists($file)) {
            if (0 == $this->cacheTime || @filemtime($file) + $this->cacheTime >= time()) {
                return true;
            } else {
                @unlink($file);
                return false;
            }
        }
        return false;
    }

    //删除指定缓存
    public function unset($key)
    {
        if (0 == $this->cachetype) {
            return;
        } elseif (1 == $this->cachetype) {
            if ($this->_isset($key)) {
                $key_md5 = $this->md5 ? md5($key) : $key;
                $file    = $this->cacheDir . '/' . $key_md5 . $this->suffix;
                return @unlink($file);
            }
            return false;
        } elseif (2 == $this->cachetype) {
            $key_md5 = $this->md5 ? md5($key) : $key;
            $val     = $this->cache->del($key_md5);
        }
    }
    //清除过期缓存文件
    public function clear()
    {
        $files     = scandir($this->cacheDir);
        $cacheTime = $this->cacheTime;
        foreach ($files as $val) {
            if (0 != $cacheTime && @filemtime($this->cacheDir . "/" . $val) + $cacheTime < time()) {

                @unlink($this->cacheDir . "/" . $val);
            }
        }
    }

    //清除所有缓存文件
    public function clear_all()
    {
        if (0 == $this->cachetype) {
            return;
        }
        $files = scandir($this->cacheDir);
        foreach ($files as $val) {
            @unlink($this->cacheDir . "/" . $val);
        }
    }

    private function __error($line, $msg)
    {

        die("出错文件：" . __file__ . "/n出错行：$line/n错误信息：$msg");
    }
}

//检测字符串组的字符在字符串中是否存在,对大小写不敏感
function findstrs($str, $find, $separator = "|")
{
    $ymarr = explode($separator, $find);
    foreach ($ymarr as $find) {
        if (stripos($str, $find) !== false) {return true;}
    }
    return false;
}

//防盗链判断，即授权域名
function is_referer()
{
    if (defined('REFERER_URL') == false) {return true;} elseif (REFERER_URL == "") {return true;}
    @$host  = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
    @$ymarr = explode("|", REFERER_URL);
    if (in_array($host, $ymarr)) {return true;}
    return false;
}

function seturl($word, &$data)
{
    if (preg_match("/\.(ogg|mp4|webm|m3u8)$/i", $word)) {
        $data['success'] = 1;
        $data['type']    = "video";
        $data['url']     = $word;
        return true;
    } elseif (preg_match("/^BGM/i", $word)) {
        $data['success'] = 1;
        $data['type']    = "url";
        $data['url']     = "http://api.jp255.com/api/?url=$word";
        return true;
    }
    return false;
};
