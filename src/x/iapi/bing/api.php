<?php
$idx = isset($_REQUEST['idx']) ? $_REQUEST['idx'] : 0;
$n = isset($_REQUEST['n']) ? $_REQUEST['n'] : 1;
$mkt = isset($_REQUEST['mkt']) ? $_REQUEST['mkt'] : 'zh-CN';

// $str = file_get_contents('https://cn.bing.com/HPImageArchive.aspx?format=js&mkt=' . $mkt . '&idx=' . $idx . '&n=' . $n);
$json = get_bing_hpimage_info($n, $idx, $mkt);

if ($_REQUEST['json']) {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
    header("Access-Control-Allow-Origin:" . $origin);
    header('Content-Type:application/json; charset=utf-8');
    header('cache-control:no-cache');
    die(json_encode($json));
} else {
    $src = $json['images'][0]['url'];

    if (count($json['images']) > 1) {
        $src = $json['images'][array_rand($json['images'], 1)]['url'];
    }

    $imgurl = 'https://cn.bing.com' . $src;
    header("Location: $imgurl");
}

function get_bing_hpimage_info($n = 1, $offset = 0, $mkt = 'zh-CN')
{
    $today = (int) date('Ymd', strtotime("-1 day"));
    $n = max(1, min((int) $n, 10));
    $offset = max(0, min((int) $offset, 100));

    // 取缓存
    $cacheFile = 'cache/bing_HPImageArchive.json';
    $cacheInfo = file_exists($cacheFile) ? json_decode(file_get_contents($cacheFile), true) : [];
    $result = ['images' => [], 'cache' => 1];

    if (!isset($cacheInfo[$today])) {
        $str = file_get_contents('https://cn.bing.com/HPImageArchive.aspx?format=js&mkt=' . $mkt . '&idx=' . $offset . '&n=' . $n);
        $json = json_decode($str, true);

        if (is_array($json['images'])) {
            foreach ($json['images'] as $k => $v) {
                $cacheInfo[$v['startdate']] = $v;
            }

            if (!file_exists(dirname($cacheFile))) {
                mkdir(dirname($cacheFile));
            }
            file_put_contents($cacheFile, json_encode($cacheInfo, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            $result = ['images' => [], 'cache' => 0];
        }
    }

    for ($i = 1; $i <= $n; $i++) {
        $o = $i + $offset;
        $key = date("Ymd", strtotime("-$o day"));
        if (isset($cacheInfo[$key])) {
            $result['images'][$i] = $cacheInfo[$key];
        }
    }

    return $result;
}
