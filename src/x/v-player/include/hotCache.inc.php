<?php
/**
 * 热搜关键字缓存管理
 */

include_once 'class.main.php';
include_once '../save/config.php';

class HotCache {
  //全局变量,读写缓存
  public $cache;
  public function __construct() {
    $this->cache = new Main_Cache(array(
      "cachetype" => $CONFIG["chche_config"]["type"] ?? 1,
      "cacheDir" => "./cache",
      "cacheprot" => $CONFIG["chche_config"]["prot"],
      'cacheTime' => 0,
      'compress' => 0,
      'md5' => false,
    ));
  }
  public function getHotCache()
  {
      $hotCache = $this->cache->get('wd.hot.list');

      if ($hotCache) {
          $hotCache = json_decode($hotCache, true);
      }

      if (!$hotCache) {
          $hotCache = array();
      }

      array_multisort($hotCache, SORT_DESC);

      return $hotCache;
  }

  public function updateHotCache($wd)
  {

      if (!$wd) {
          return false;
      }

      $wd = substr($wd, 0, 50);

      $hotCache = $this->getHotCache();

      if ($hotCache[$wd]) {
          $hotCache[$wd]++;
      } else {
          $hotCache[$wd] = 1;
      }
      $ret = $this->cache->set('wd.hot.list', json_encode($hotCache), 0);
      // $CONFIG['resou'] = implode(array_keys(array_slice($hotCache, 0, 10)), '|');

      return $hotCache;
  }

  public function getHotTopN($n = 10)
  {
      $hotCache = $this->getHotCache();
      return array_slice($hotCache, 0, $n);
  }
}

$hotCache = new HotCache();

// $hotCache->updateHotCache('test'); var_dump($hotCache->getHotTopN());
