<?php

/** 基于文件的文本缓存 */
class FileCache
{
    private $cacheDir = './.cache'; //缓存绝对路径
    private $cacheTime = 3600; //默认缓存时间,单位微秒；文件缓存为 秒
    private $md5 = true; //是否对键进行加密
    private $suffix = ""; //设置文件后缀
    public function __construct($config = [])
    {
        if (is_array($config)) {
            foreach ($config as $key => $val) {
                $this->$key = $val;
            }
        }
    }
    private function getCacheFile($key, $checkExist = true)
    {
        $key_md5 = $this->md5 ? md5($key) : $key;
        $filepath = $this->cacheDir . '/' . $key_md5 . $this->suffix;
        return (!$checkExist || file_exists($filepath)) ? $filepath : '';
    }
    public function set($key, $val, $cacheTime = null)
    {
        if ($cacheTime == null) {
            $cacheTime = $this->cacheTime;
        }

        $val = json_encode([
            'data' => $val,
            't' => $cacheTime ? time() + $cacheTime : 0,
        ]);

        if ($this->md5) {
            // $val = base64_encode($val);
            $val = @gzcompress($val);
        }

        $file = $this->getCacheFile($key, false);
        !file_exists($this->cacheDir) && mkdir($this->cacheDir, 0777, true);
        @file_put_contents($file, $val) or $this->error(__line__, "文件写入失败: " . $file);
    }
    /** 获取缓存内容（返回缓存信息，不检查过期与否） */
    public function getCacheInfo($key)
    {
        $filepath = $this->getCacheFile($key);

        if ($filepath) {
            $val = @file_get_contents($filepath);

            if ($this->md5) {
                $val = @gzuncompress($val);
            }

            $result = @json_decode($val, true);
            if ($result) {
                $result['valid'] = 0 == $result['t'] || time() < $result['t'];
            }

            return $result;
        }
    }
    /** 获取缓存（原始内容） */
    public function get($key, $checkExpired = true, $delExpired = true)
    {
        $result = $this->getCacheInfo($key);

        if ($result) {
            if (!$checkExpired || $result['valid']) {
                return $result['data'];
            }

            $delExpired && @unlink($filepath);
        }
    }
    /** 文件缓存是否存在 */
    public function isset($key, $checkExpired = false)
    {
        if ($checkExpired) {
            return $this->get($key) != null;
        }

        return $this->getCacheFile($key) != '';
    }
    /** 删除指定缓存 */
    public function unset($key)
    {
        $filepath = $this->getCacheFile($key);
        return file_exists($filepath) ? @unlink($filepath) : false;
    }
    /** 清除缓存文件 */
    public function clear($isall = false)
    {
        $files = scandir($this->cacheDir);
        $cacheTime = $this->cacheTime;

        foreach ($files as $val) {
            if ($isall || 0 != $cacheTime && @filemtime($this->cacheDir . "/" . $val) + $cacheTime < time()) {
                @unlink($this->cacheDir . "/" . $val);
            }
        }
    }

    private function error($line, $msg)
    {
        echo ("出错文件：" . __file__ . "/n出错行：$line/n错误信息：$msg");
    }
}

// test
// $cache = new FileCache(['md5' => false]);
// $cache->set('a', 'bbb', 5);
// $r = $cache->get('a');
// var_dump($r);
