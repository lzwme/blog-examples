<?php

require_once 'utils.php';

function fetch60s($encode = 'json', $isV1 = false)
{
    $api = 'https://www.zhihu.com/api/v4/columns/c_1715391799055720448/items?limit=2';
    $reg = '/<p\s+data-pid=[^<>]+>([^<>]+)<\/p>/';
    $today = date('Y-m-d', time() + 8 * 3600);
    $cachefile = '60s_' . $today . '.json';

    $finalData = cacheGet($cachefile);

    if (!$finalData) {
        $response = file_get_contents($api);
        $data = json_decode($response, true);

        $content = $data['data'][0]['content'] ?? '';
        $url = $data['data'][0]['url'] ?? '';
        $title_image = $data['data'][0]['title_image'] ?? '';
        $updated = $data['data'][0]['updated'] ?? 0;

        $contents = preg_match_all($reg, $content, $matches);
        $result = array_map(function ($e) {
            return preg_replace('/<[^<>]+>/', '', $e);
        }, $matches[1]);

        if (!empty($result)) {
            $finalData = [
                'url' => $url,
                'result' => $result,
                'title_image' => $title_image,
                'updated' => $updated * 1000,
            ];

            cacheSet($cachefile, $finalData);
        }
    }

    if ($isV1) {
        if ($encode === 'json') {
            return responseWithBaseRes($finalData['result'] ?? []);
        } else {
            return implode("\n", $finalData['result'] ?? []);
        }
    } else {
        $news = array_map(function ($e) {
            return preg_replace('/^(\d+)、\s*/', '$1. ', $e);
        }, $finalData['result'] ?? []);
        $tip = array_pop($news);

        if ($encode === 'json') {
            return responseWithBaseRes([
                'news' => $news,
                'tip' => $tip,
                'updated' => $finalData['updated'] ?? 0,
                'url' => $finalData['url'] ?? '',
                'cover' => $finalData['title_image'] ?? '',
            ]);
        } else {
            return implode("\n", array_merge($news, [$tip]));
        }
    }
}
