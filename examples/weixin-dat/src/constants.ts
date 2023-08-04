export const ALL_FILE_TYPE = {
  ffd8ffe000104a464946: 'jpg', //JPEG (jpg)
  '89504e470d0a1a0a0000': 'png', //PNG (png)
  '47494638396126026f01': 'gif', //GIF (gif)
  '49492a00227105008037': 'tif', //TIFF (tif)
  '424d228c010000000000': 'bmp', //16色位图(bmp)
  '424d8240090000000000': 'bmp', //24位位图(bmp)
  '424d8e1b030000000000': 'bmp', //256色位图(bmp)
  '41433130313500000000': 'dwg', //CAD (dwg)
  '3c21444f435459504520': 'html', //HTML (html)
  '3c21646f637479706520': 'htm', //HTM (htm)
  '48544d4c207b0d0a0942': 'css', //css
  '696b2e71623d696b2e71': 'js', //js
  '7b5c727466315c616e73': 'rtf', //Rich Text Format (rtf)
  '38425053000100000000': 'psd', //Photoshop (psd)
  '46726f6d3a203d3f6762': 'eml', //Email [Outlook Express 6] (eml)
  d0cf11e0a1b11ae10000: 'doc', //MS Excel 注意：word、msi 和 excel的文件头一样
  //   d0cf11e0a1b11ae10000: 'vsd', //Visio 绘图
  //   d0cf11e0a1b11ae10000: 'wps', //WPS文字wps、表格et、演示dps都是一样的
  '5374616E64617264204A': 'mdb', //MS Access (mdb)
  '252150532D41646F6265': 'ps',
  '255044462d312e360d25': 'pdf', //Adobe Acrobat (pdf)
  '2e524d46000000120001': 'rmvb', //rmvb/rm相同
  '464c5601050000000900': 'flv', //flv与f4v相同
  '00000020667479706973': 'mp4',
  '49443303000000000f76': 'mp3',
  '000001ba210001000180': 'mpg', //
  '3026b2758e66cf11a6d9': 'wmv', //wmv与asf相同
  '524946464694c9015741': 'wav', //Wave (wav)
  '52494646d07d60074156': 'avi',
  '4d546864000000060001': 'mid', //MIDI (mid)
  '504b0304140000000800': 'zip',
  '526172211a0700cf9073': 'rar',
  '235468697320636f6e66': 'ini',
  '504b03040a0000000000': 'jar',
  '4d5a9000030000000400': 'exe', //可执行文件
  '3c25402070616765206c': 'jsp', //jsp文件
  '4d616e69666573742d56': 'mf', //MF文件
  '3c3f786d6c2076657273': 'xml', //xml文件
  efbbbf2f2a0d0a53514c: 'sql', //xml文件
  '7061636b616765207765': 'java', //java文件
  '406563686f206f66660d': 'bat', //bat文件
  '1f8b0800000000000000': 'gz', //gz文件
  '6c6f67346a2e726f6f74': 'properties', //bat文件
  cafebabe0000002e0041: 'class', //bat文件
  '49545346030000006000': 'chm', //bat文件
  '04000000010000001300': 'mxp', //bat文件
  '504b0304140006000800': 'docx', //docx文件
  '6431303a637265617465': 'torrent',
  '494d4b48010100000200': '264',
  '6D6F6F76': 'mov', //Quicktime (mov)
  FF575043: 'wpd', //WordPerfect (wpd)
  CFAD12FEC5FD746F: 'dbx', //Outlook Express (dbx)
  '2142444E': 'pst', //Outlook (pst)
  AC9EBD8F: 'qdf', //Quicken (qdf)
  E3828596: 'pwl', //Windows Password (pwl)
  '2E7261FD': 'ram', //Real Audio (ram)
} as const;
