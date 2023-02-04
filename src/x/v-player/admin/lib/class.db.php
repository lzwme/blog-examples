<?php

//不显示读取错误
ini_set("error_reporting","E_ALL & ~E_NOTICE");
//配置操作类
class Main_db
{
  
     //保存配置
     public static function save($file,$array)

     {     
	  
	  if(file_exists($file))
	  {
	   
	    $info = file_get_contents($file); 
	   
	    foreach($array as $k=>$v){$info = preg_replace("{define\('$k'.*?\)|define\(\"$k\".*?\)}i","define('{$k}','{$v}')",$info);} 
		 
		if($info!==""){return file_put_contents($file,$info); }
          
	}	
       return false;
	   
     }
	 
}
