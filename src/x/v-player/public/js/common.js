/*
 * @Author: renxia
 * @Date: 2023-03-29 11:23:16
 * @LastEditors: renxia
 * @LastEditTime: 2024-04-16 17:15:44
 * @Description:
 */
var vUtils = {
  async getcip() {
    return '';
    // return $.get('https://data.video.iqiyi.com/v.f4v').then(function (cdnip) {
    //   sip = String(cdnip.t || cdnip).match(/\d+\.\d+\.\d+\.\d+/);
    //   cip = sip[0];
    //   return cip;
    // });
  },
};

window.vUtils = vUtils;
