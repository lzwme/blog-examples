var vUtils = {
  getcip() {
    return $.get('https://data.video.iqiyi.com/v.f4v').then(function (cdnip) {
      sip = String(cdnip.t || cdnip).match(/\d+\.\d+\.\d+\.\d+/);
      cip = sip[0];
      return cip;
    });
  },
};

window.vUtils = vUtils;
