<?php

//模板样式设置,根据图片尺寸修改对应数字即可,单位像素。(height:高度;width:宽度;left:左边距,top:顶边距;right:右边距)
$style=array(
  //切换logo样式设置(设置宽度或高度为0则不显示);
  'logo_title'=>'不能播？点我',
  'logo_top'=>'0',                              //顶边距
  'logo_left'=>'0',                             //左边距
  
  //右侧列表图标样式设置(设置宽度或高度为0则不显示)；
  'list_url'=>TEMPLETS_PATH.'/images/list.png',           //列表图标路径设置
  'list_width'=>'100',                           //显示宽度,单位：像素，下同
  'list_height'=>'30',                          //高度,
  'list_top'=>'10',                              //顶边距
  'list_right'=>'5',                             //右边距 
  
  //右侧Logo样式设置
   
  'Logo_url'=>TEMPLETS_PATH.'/images/logo.png',   //右侧Logo图标路径设置
  'Logo_width'=>'32',                           //显示宽度,单位：像素，下同
  'Logo_height'=>'32',                          //高度,
  'Logo_top'=>'0',                              //顶边距
  'Logo_right'=>'50',                            //右边距   
   'Logo_display'=>'none',                      //显示为‘block’，隐藏为 ‘none’ 
  
// 数据加载动画
  'loadimg'=>TEMPLETS_PATH.'/images/loading.gif',  
   
);


?>
