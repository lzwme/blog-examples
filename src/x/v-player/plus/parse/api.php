<?php

require_once("config.php");

//数据防盗
if (!lsreferer()) {
	header('HTTP/1.1 404 Forbidden');
	exit('404,文件未找到');
}

//强制格式
header('content-type:application/json;charset=utf8');
//header("Content-Disposition:attachment;filename='su.js'"); 

//循环取传入参数，支持POST和GET
foreach ($_REQUEST as $k => $v) {
	$$k = trim(urldecode($v));
}

$url = isset($url) ? $url : '';
$cb = isset($cb) && $cb ? $cb : 'seacms:search';
$flag = isset($from) ? $from : FLAG;
$referer = isset($referer) ? $referer : '';
$cip = isset($cip) ? $cip : 'null';

//去反斜杠和前后空格
$url = trim(stripslashes($url));


//初始化
$cache = new Main_Cache(array("cachetype" => $chche_config["type"], "cacheprot" => $chche_config["prot"], 'cacheTime' => $chche_config["time"]));
$info = array("success" => 0);
$myObj = new Queryclass();

//检测url
if ($url == '') {
	$info['code'] = 0;
	$info['m'] = '参数错误';
	exit($myObj->out_json($cb, $info));
}

if (seturl($url, $info)) {
	exit($myObj->out_json($cb, $info));
}

//视频地址替换,手机转PC
foreach ($url_match as $val => $value) {
	if (preg_match($val, $url, $matches)) {
		for ($i = 1; $i < sizeof($matches); $i++) {
			$value = str_replace('(?' . (string) $i . ')', $matches[$i], $value);
		}
		$url = $value;
		break;
	}
}

//简化url,去掉了头尾（scheme,query）便于模糊查询
$url = parse_url($url);
$url = @$url['host'] . @$url['path'];

//取缓存数据 	
$json = $cache->get($url);

if ($json != "") {
	exit($myObj->out_json($cb, json_decode($json)));
} else {
	$myObj->QuerySql($url, $info);

	if ($info['success'] == 1) {
		seturl($info['url'], $info);
		$cache->set($url, json_encode($info));
		exit($myObj->out_json($cb, $info));
	} else {
		if (LOG_PATH !== "") {
			error_log("url：" . $url . "，cip: $cip,time：" . @date("Y-m-d H:i", time()) . " \r\n", 3, LOG_PATH);
		}
		$info['code'] = 0;
		$info['m'] = '解析失败，服务器已记录\r\n' . $info['m'];
		exit($myObj->out_json($cb, $info));
	}
}

//seacms 查询类 by nohacks.cn
class Queryclass
{
	public function QuerySql($keyword, &$DATA)
	{

		global $sql_config, $flag;

		$database = new db_class
		([
				'server' => $sql_config['server'],
				'dbname' => $sql_config['dbname'],
				'username' => $sql_config['username'],
				'password' => $sql_config['password'],
			]);

		$ret = false;

		switch ($sql_config['type']) {
			case 0: //mac v8

				//判断表前缀
				if ($sql_config['profix'] == '') {
					$table = 'mac_vod';
				} else {
					$table = $sql_config['profix'] . "vod";
				}

				//查询操作  
				$datas = $database->query("SELECT  d_name,d_playurl,d_playfrom  FROM " . $table . " WHERE d_playurl like '%" . $database->quote($keyword) . "%'");

				if (!is_array($datas)) {
					$DATA["m"] = "sql query error!";
					return false;
				}
				foreach ($datas as $data) {

					//来源分组
					$flags = explode('$$$', $data['d_playfrom']);

					$videos = explode("$$$", $data['d_playurl']);
					$title = $data['d_name'];

					//资源组循环
					for ($i = 0; $i < sizeof($videos); $i++) {

						//剧集分组
						$video = explode("#", $videos[$i]);

						//匹配集数
						for ($l = 0; $l < sizeof($video); $l++) {
							if (strstr($video[$l], $keyword) !== false) {
								$part = $l + 1;
								break;
							}
						}

						//过滤播放源
						if ($flag == "" || findstrs($flags[$i], $flag)) {
							$info[] = array("flag" => $flags[$i], "part" => sizeof($video), "video" => $video);
							$ret = true;
						}
					}

				}

				break;


			case 1: //mac v10

				//判断表前缀
				if ($sql_config['profix'] == '') {
					$table = 'mac_vod';
				} else {
					$table = $sql_config['profix'] . "vod";
				}

				//查询操作  
				$datas = $database->query("SELECT  vod_name,vod_play_url,vod_play_from  FROM " . $table . " WHERE vod_play_url like '%" . $database->quote($keyword) . "%'");


				if (!is_array($datas)) {
					return false;
				}
				foreach ($datas as $data) {
					//来源分组
					$flags = explode('$$$', $data['vod_play_from']);


					$videos = explode("$$$", $data['vod_play_url']);
					$title = $data['vod_name'];

					//资源组循环
					for ($i = 0; $i < sizeof($videos); $i++) {

						//剧集分组
						$video = explode("#", $videos[$i]);

						//匹配集数
						for ($l = 0; $l < sizeof($video); $l++) {
							if (strstr($video[$l], $keyword) !== false) {
								$part = $l + 1;
								break;
							}
						}

						//过滤播放源
						if ($flag == "" || findstrs($flags[$i], $flag)) {

							$info[] = array("flag" => $flags[$i], "part" => sizeof($video), "video" => $video);

							$ret = true;
						}
					}

				}

				break;

			case 2: //sea  all

				//判断表前缀
				if ($sql_config['profix'] == '') {
					$playdata = 'sea_playdata';
					$playname = 'sea_data';
				} else {
					$playdata = $sql_config['profix'] . 'playdata';
					$playname = $sql_config['profix'] . 'data';
				}
				$title = "";

				//查询操作
				$datas = $database->query("SELECT v_id,body FROM " . $playdata . " WHERE body like '%" . $database->quote($keyword) . "%'");


				if (!is_array($datas)) {
					return false;
				}
				foreach ($datas as $data) {
					//播放数据
					$word = $data['body'];
					//取影片名
					if ($title === "") {
						$id = $data['v_id'];

						$profile = $database->get("SELECT v_name FROM " . $playname . " WHERE v_id=" . $id);

						if (is_array($profile)) {
							$title = $profile['v_name'];
						}
					}

					//播放源分组
					$vods = explode('$$$', $word);
					foreach ($vods as $vod) {
						//播放源名称和剧集数据分离,0为名称，1为剧集数据
						$data = explode('$$', $vod);
						//剧集分组
						$video = explode("#", (string) $data[1]);
						//匹配资源标签
						$_flag = explode("$", (string) $video[0]);
						$_flag = $_flag[2];

						//匹配集数
						for ($i = 0; $i < sizeof($video); $i++) {
							if (strstr($video[$i], $keyword) !== false) {
								$part = $i + 1;
							}
						}

						//过滤播放源
						if ($flag == "" || findstrs($_flag, $flag)) {

							$info[] = array("flag" => $_flag, "part" => sizeof($video), "video" => $video);

							$ret = true;
						}
					}
				}
				break;

			case 3: //zanpian

				//判断表前缀
				if ($sql_config['profix'] == '') {
					$table = 'zanpian_vod';
				} else {
					$table = $sql_config['profix'] . "vod";
				}

				//查询操作  
				$datas = $database->query("SELECT  vod_name,vod_url,vod_play  FROM " . $table . " WHERE vod_url like '%" . $database->quote($keyword) . "%'");


				if (!is_array($datas)) {
					return false;
				}
				foreach ($datas as $data) {
					//来源分组
					$flags = explode('$$$', $data['vod_play']);


					$videos = explode("$$$", $data['vod_url']);
					$title = $data['vod_name'];

					//资源组循环
					for ($i = 0; $i < sizeof($videos); $i++) {

						//剧集分组
						$video = explode("\r\n", $videos[$i]);

						//匹配集数
						for ($l = 0; $l < sizeof($video); $l++) {
							if (strstr($video[$l], $keyword) !== false) {
								$part = $l + 1;
								break;
							}
						}

						//过滤播放源
						if ($flag == "" || findstrs($flags[$i], $flag)) {

							$info[] = array("flag" => $flags[$i], "part" => sizeof($video), "video" => $video);

							$ret = true;
						}
					}

				}

				break;



		} // end switch



		//all code  

		// 如果未匹配到返回假
		if (!isset($part)) {
			return false;
		}


		if ($ret) {
			//结果按集数降序排列。       
			foreach ($info as $key => $row) {
				$num1[$key] = $row['part'];
			}
			array_multisort($num1, SORT_DESC, $info);

			//检查集数，如果未匹配集数返回假，
			$max = sizeof($info[0]['video']);
			if ($part > $max) {
				return false;
			}
			;

			//设置默认播放地址
			$vod = @$info[0]['video'][$part - 1];
			$vod = explode('$', $vod);
			//输出数据
			$DATA['success'] = 1;
			$DATA['type'] = $info[0]['flag'];
			$DATA['title'] = $title;
			$DATA['url'] = @$vod[1];
			$DATA['part'] = $part;
			$DATA['info'] = $info;
			return $ret;

		}
	}

	public function out_json($Callback, $data)
	{
		return json_encode($data);
	}
}


?>