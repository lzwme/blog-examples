<?php 

error_reporting(0);	
if(filter_input(INPUT_GET, "url")){$url=filter_input(INPUT_GET, 'url');}else{exit("input error！");}
require_once(dirname(__FILE__).'/'."../include/class.main.php");
parse(urldecode($url));
 function parse($url)
{	        $base=array();
		$name = preg_match("#/([\w]+\.ts)#",$url,$base)?$base[1]:"m3u8.ts";		
		header('cache-control:public'); 
    	        header('Access-Control-Allow-Origin:*');
    	        header('content-type:application/octet-stream;'); 
		header('content-disposition:attachment; filename='.$name);		
		$data = curl($url);
	        exit(trim($data));	
}			
function curl($url,$cookie="")
	{
       $params["ua"] = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36";
       $params["cookie"] = $cookie;
      	return GlobalBase::curl($url,$params);
	}
