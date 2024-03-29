<?php include "config.php";if (filter_has_var(INPUT_GET, 'id')){ $id = filter_input(INPUT_GET, 'id');}else{exit("参数调用错误！");} ?>
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/><meta name="renderer" content="webkit"/>
    <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8"/> <!-- 手机H5兼容模式 -->
    <meta http-equiv="pragma" content="no-cache"/><meta http-equiv="expires" content="0" />
    <meta http-equiv="Cache-Control" content="no-siteapp" /><meta http-equiv="Cache-Control" content="no-cache" />
    <title>对接设置-系统设置-Xyplay 智能解析</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="./css/font.css">
    <link rel="stylesheet" href="./css/xadmin.css">
      <script type="text/javascript" src="https://lzw.me/x/lib/jquery/1/jquery.min.js"></script>
    <script type="text/javascript" src="./lib/layui/layui.js" charset="utf-8"></script>
    <script type="text/javascript" src="./js/xadmin.js"></script>
    <!-- 让IE8/9支持媒体查询，从而兼容栅格 -->
    <!--[if lt IE 9]>
      <script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
      <script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body>
    <div class="x-body">

        <form class="layui-form">

            <fieldset class="layui-elem-field">
                <legend>接口设置</legend>

                <div class="layui-field-box">

                    <div class="layui-form-item">
                        <label for="username" class="layui-form-label">
                            描述
                        </label>
                        <div class="layui-input-inline">
                            <input type="text" name="LINK_NAME" autocomplete="off" value="<?php echo $CONFIG["LINK_URL"][$id]['name']; ?>" class="layui-input" >
                        </div>
                        <div class="layui-form-mid layui-word-aux">
                            输入一个名称用来进行区分，例：授权网站
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label for="username" class="layui-form-label">
                            状态
                        </label>
                        <div class="layui-input-inline">
                            <select name="LINK_OFF" lay-filter="province">
                                <?php foreach (array("关闭", "启用") as $key => $val): ?>
                                    <option value="<?php echo $key ?>"  <?php echo (trim($CONFIG["LINK_URL"][$id]['off']) == $key) ? "selected" : ''; ?>><?php echo $val ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                          <div class="layui-input-inline">
                            <select name="LINK_TYPE" lay-filter="province">
                                <?php foreach (array("POST", "GET") as $key => $val): ?>
                                    <option value="<?php echo $key ?>"  <?php echo (trim($CONFIG["LINK_URL"][$id]['type']) == $key) ? "selected" : ''; ?>><?php echo $val ?></option>
                              <?php endforeach; ?>
                            </select>
                        </div>


                        <div class="layui-input-inline">
                            <input type="text" name="LINK_NUM" autocomplete="off" value=<?php echo trim($CONFIG["LINK_URL"][$id]['num']); ?> class="layui-input" title="数字越小，优先级越高">
                        </div>
                        <div class="layui-form-mid layui-word-aux">
                            启用状态,提交模式及优先级，注意：数字越小，优先级越高
                        </div>
                    </div>

                     <div class="layui-form-item">
                        <label class="layui-form-label">地址</label>


						 <div class="layui-input-inline">
                            <select name="LINK_API" lay-filter="province">
                                <?php foreach (array("解析地址", "API地址") as $key => $val): ?>
                                    <option value="<?php echo $key ?>"  <?php echo (trim($CONFIG["LINK_URL"][$id]['api']) == $key) ? "selected" : ''; ?>><?php echo $val ?></option>
                             <?php endforeach; ?>
                            </select>
                        </div>


                        <div class="layui-input-inline">
                            <input type="text" name="LINK_PATH" autocomplete="off" class="layui-input" placeholder="http://" value="<?php echo trim($CONFIG["LINK_URL"][$id]['path']);?>" >

                        </div>

                        <div class="layui-input-inline">
                            <input type="text" name="LINK_MATCH" autocomplete="off" class="layui-input" value=<?php echo base64_decode($CONFIG["LINK_URL"][$id]['match']);?>>

                        </div>

                            <div class="layui-form-mid layui-word-aux">设置为解析地址时，需要设置API获取正则,例如：{\$\.post\("(.+?)",(\{.*\}),}</div>
                    </div>


                       <div class="layui-form-item">
                        <label class="layui-form-label">参数</label>
                        <div class="layui-input-block">
                           <input type="text" name="LINK_FIELDS" autocomplete="off" value="<?php echo base64_decode($CONFIG["LINK_URL"][$id]['fields']);?>"  class="layui-input" >
                           <div class="layui-form-mid layui-word-aux"> 提交参数：key=value的格式，value支持变量，多条用&分割，例如： url=$url&key=123456</div>

                        </div>

                    </div>

					 <div class="layui-form-item">
                        <label class="layui-form-label">变量</label>
                        <div class="layui-input-block">
                           <input type="text" name="LINK_STRTR" autocomplete="off" value="<?php echo base64_decode($CONFIG["LINK_URL"][$id]['strtr']);?>"  class="layui-input" >
                           <div class="layui-form-mid layui-word-aux">提交参数变量声明,多个用逗号","分割，例如： $url,$key</div>
                     </div>

                    </div>
			 <div class="layui-form-item">
                        <label class="layui-form-label">HTML脚本</label>
                        <div class="layui-input-block">
                           <textarea name="LINK_HTML" class="layui-textarea" ><?php echo base64_decode($CONFIG["LINK_URL"][$id]['html']);?></textarea>
                          <div class="layui-form-mid layui-word-aux">参数提交html脚本，可用变量$fields（提交参数对象文本,格式如：{"url":" ","key":" ","md5":" "}）,此处一般进行加解密操作;</div>

                        </div>

                      </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">PHP脚本</label>
                        <div class="layui-input-block">

                           <textarea name="LINK_SHELL" class="layui-textarea" ><?php echo base64_decode($CONFIG["LINK_URL"][$id]['shell']);?></textarea>
                          <div class="layui-form-mid layui-word-aux">提交参数附加PHP脚本，可对变量进行设置,例如对$url加密的代码： $url=base64_encode($url);</div>

                        </div>

                    </div>

                      <div class="layui-form-item">
                        <label class="layui-form-label">header</label>
                        <div class="layui-input-block">
                           <textarea name="LINK_HEADER" class="layui-textarea" placeholder=""><?php if(isset($CONFIG["LINK_URL"][$id]['header'])){foreach ($CONFIG["LINK_URL"][$id]['header'] as $key=>$val){ echo"$key:$val\r\n";}}?></textarea>
                          <div class="layui-form-mid layui-word-aux"> 提交参数附加头，格式：key:value的格式,一行一条,例如：Content-Type:application/x-www-form-urlencoded</div>
                        </div>


                    </div>


                     <div class="layui-form-item">
                        <label class="layui-form-label">cookie</label>
                        <div class="layui-input-block">
                           <textarea name="LINK_COOKIE" class="layui-textarea" ><?php echo trim($CONFIG["LINK_URL"][$id]['cookie']);?></textarea>
                           <div class="layui-form-mid layui-word-aux"> 提交参数附加cookie,格式：key=value;key2=value2;key3=value3</div>
                        </div>


                    </div>


                     <div class="layui-form-item">
                        <label class="layui-form-label">代理</label>
                        <div class="layui-input-block">
                            <input type="text" name="LINK_PROXY" autocomplete="off"  value="<?php echo $CONFIG["LINK_URL"][$id]['proxy']; ?>" class="layui-input" >
                           <div class="layui-form-mid layui-word-aux"> 代理格式：10.10.10.10:8080,使用代理访问你提交的接口。</div>
                        </div>

                    </div>

                </div>
            </fieldset>



            <fieldset class="layui-elem-field">

                <legend>输出转换
                <input type="checkbox" id="LINK_VAL_OFF" name="LINK_VAL_OFF" lay-skin="switch"  lay-text="开|关"  <?php echo $CONFIG["LINK_URL"][$id]['val_off'] == "1" ? "checked" : ''; ?> value=<?php echo $CONFIG["LINK_URL"][$id]['val_off']; ?> >

                </legend>
                <div class="layui-field-box">

                    <div class="layui-form-item">
                        <label class="layui-form-label">转换</label>
                        <div class="layui-input-block">

                            <textarea name="LINK_VAL" class="layui-textarea" placeholder=""><?php  if(isset($CONFIG["LINK_URL"][$id]['val'])){foreach ($CONFIG["LINK_URL"][$id]['val'] as $key=>$val){echo "$key=>$val\r\n";}}?></textarea>
                 	    <div class="layui-form-mid layui-word-aux">

                                对接口输出内容进行转换以供xyplay使用;格式: 输出接口名=>xyplay接口名 ,一行一条，例如:url=>url 或 video.file=>url<br>
                                xypaly支持的接口名：success(成功标志),code(结果代码),url(视频地址),title(视频标题),ext(视频扩展名),player(播放器),part(视频集数),type(视频类型),info(剧集信息)

                            </div>
                        </div>

                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">附加</label>
                        <div class="layui-input-block">

                            <textarea name="LINK_ADD" class="layui-textarea" placeholder=""><?php  if(isset($CONFIG["LINK_URL"][$id]['add'])){  foreach ($CONFIG["LINK_URL"][$id]['add'] as $key=>$val){ echo "$key=>$val\r\n";}}?></textarea>
                 	    <div class="layui-form-mid layui-word-aux">

                                对接口输出内容进行附加 ;格式: 接口名=>内容 ,一行一条，例如：type=> hls

                            </div>
                        </div>

                    </div>



                </div>
            </fieldset>

            <div class="layui-form-item">
                <button class="layui-btn" lay-submit="" lay-filter="edit">
                    保存
                </button>
            </div>


        </form>
    </div>
    <script>
        layui.use(['form', 'layer'], function () {
            $ = layui.jquery;
            var form = layui.form
                    , layer = layui.layer;

            //监听提交
            form.on('submit(edit)', function (data) {

			//console.log(data.field.LINK_MATCH);

                //发异步，把数据提交给php
                data.field.type = 'link_edit'; data.field.id = "<?php echo $id; ?>";
                //添加开关按钮数据
                    if ("undefined" !== typeof data.field.LINK_VAL) {
                        data.field.LINK_VAL_OFF = $("#LINK_VAL_OFF").prop("checked") ? "1" : "0";
                    }
                  //加密特殊字符数据
                    if ("undefined" !== typeof data.field.LINK_MATCH) {
                        data.field.LINK_MATCH=Base64.encode(data.field.LINK_MATCH);
                        data.field.LINK_SHELL=Base64.encode(data.field.LINK_SHELL);
                        data.field.LINK_HTML=Base64.encode(data.field.LINK_HTML);
                        data.field.LINK_FIELDS=Base64.encode(data.field.LINK_FIELDS);
                        data.field.LINK_STRTR=Base64.encode(data.field.LINK_STRTR);

                    }

                   //post提交
                    x_admin_post("admin.php", data.field);

                return false;
            });


        });
    </script>


</body>

</html>