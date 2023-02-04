
<style type="text/css">
html,body,#main{
background-color:#000;
padding: 0;
margin: 0;
height:100%;
width:100%;
color:#999;
overflow:hidden;
}
#player,#playad{ 
height:100%!important;
width:100%!important;
object-fit:fill;
}


#logo{
    margin-top:<?php echo $style['logo_top']?>px;	
    margin-left:<?php echo $style['logo_left']?>px;

}

.Logo{
    position: fixed;
    display: <?php echo $style['Logo_display']?>;
     z-index: 3;
    width: <?php echo $style['Logo_width']?>px;
    height:<?php echo $style['Logo_height']?>px;
    top:<?php echo $style['Logo_top']?>px;	
    right:<?php echo $style['Logo_right']?>px;
    background: transparent url("<?php echo $style['Logo_url']?>") no-repeat scroll ;
	
}

.slideout-menu{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
  width: 156px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: none;
}

.slideout-panel {
  position:fixed;
  z-index: 1;
}

.slideout-open,
.slideout-open body,
.slideout-open .slideout-panel {
  overflow: hidden;
}

.slideout-open .slideout-menu {
  display: block;
}

.header{	
   position: fixed;
   z-index: 4;
   top:0px;
   left:0px;
   height:auto;
   width:100%;

}


 /*  播放列表图标   */	  
.list{	
	display:none;
        
        position: fixed;
        z-index: 2147483647;
	width:<?php echo $style['list_width']?>px;
	height:<?php echo $style['list_height']?>px;
	top:<?php echo $style['list_top']?>px;
	right:<?php echo $style['list_right']?>px;
	background: transparent url("<?php echo $style['list_url']?>") no-repeat scroll ;
	cursor: pointer;

	}



/*  播放列表内容   */	

.aside{
   background-color:#000;
   position: fixed;
   z-index: 2147483647;
   padding: 0;margin: 0;

   margin-top:<?php echo $style['list_height']+$style['list_top']+10;?>px;
   margin-left:<?php echo $style['list_left']?>px;
   right:-25px;
   /*  设置纵向滚动条  */
    overflow-x:hidden;
    overflow-y:scroll;
	height:auto;
	max-height:calc(100% - <?php echo $style['list_height']+$style['list_top']+50;?>px);
	width:auto;
    max-width:230px;
    min-width:130px;
  
  /*  半透明背景  */
    filter:alpha(opacity=50);
    -moz-opacity:0.5;
    -khtml-opacity: 0.5;
    opacity: 0.5; 
}

 /*  移动设备自适应宽高  */  
@media screen and (max-width: 650px) {.aside {width:100%;height:auto;left:0px;max-width:100%;min-width:auto;}} 

 #flaglist,#playlist{	 
	  display: none;
 }

/* 播放列表元素 */
 #flaglist li, #playlist li{	
   
    display: inline-table;
	border: 1px solid #f00;          /* 边框大小及颜色 */
	color:#0f0;                     /*  列表字体颜色 */
    width:80px;                 
    padding: 5px;
    margin:5px;
    font-size: 12px;
    text-align: center;
    border-radius: 5px;

     <?php echo $CONFIG["play"]['style']['play_style']?>
		
	/* 列表文字剪裁 */
	 
	overflow: hidden; 
   	white-space: nowrap;     /* 不换行 */
    text-overflow: ellipsis;   
    -o-text-overflow: ellipsis;     
    text-decoration: none;	
	table-layout:fixed;
    cursor:pointer;          /* 鼠标设置为手型 */

	}	


</style>
