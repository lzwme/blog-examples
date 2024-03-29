<?php
//不显示读取错误
ini_set("error_reporting", "E_ALL & ~E_NOTICE");
//配置操作类
class Main_db
{
    //变量转文本
    public static function word($name)
    {
        global $$name;
        $key = var_export($$name, true);return "$$name=$key;\r\n";}
    //保存配置
    public static function save($file = "../save/config.php")
    {
        //排除注释和php标记
        $data = preg_replace('!\/\/.*?[\r\n]|\/\*[\S\s]*?\*\/!', '', preg_replace('/(?:\<\?php|\?\>)/', '', file_get_contents($file)));
        //按php语句分组
        $lines = preg_split('/[;]+/s', $data, -1, PREG_SPLIT_NO_EMPTY);
        if ("../save/config.php" == $file) {$word = '<?php require_once dirname(__FILE__)."/../include/main.class.php";include "data.php"; header("Content-type: text/html; charset=utf-8");' . "\r\n";} else { $word = "<?php\r\n";}
        foreach ($lines as $value) {
            $value = trim($value);if ('' !== $value && substr($value, 0, 1) === '$') {$line = explode('=', $value, 2);
                $name                            = str_replace('$', '', trim($line[0]));
                $word .= self::word($name);}}
        return file_put_contents($file, $word);
    }
}
