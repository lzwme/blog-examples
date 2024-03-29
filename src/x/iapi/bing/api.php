<?php
$idx = $_REQUEST['idx'] ?: 0;
$n = $_REQUEST['n'] ?: 1;
$mkt = $_REQUEST['mkt'] ?: 'zh-CN';

$str = file_get_contents('https://cn.bing.com/HPImageArchive.aspx?format=js&mkt=' . $mkt . '&idx=' . $idx . '&n=' . $n);
$json = json_decode($str, true);

if ($_REQUEST['json']) {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
    header("Access-Control-Allow-Origin:" . $origin);
    header('Content-Type:application/json; charset=utf-8');
    header('cache-control:no-cache');
    print_r($str);
} else {
    $src = $json['images'][0]['url'];

    if (count($json['images']) > 1) {
        $src = $json['images'][array_rand($json['images'], 1)]['url'];
    }

    $imgurl = 'https://cn.bing.com' . $src;
    header("Location: $imgurl");
}
