module.exports = function(el) {
  const videotypes = {
    'mp4': 'video/mp4',
    'ogv': 'video/ogg',
    'webm': 'video/webm'
  };
  
  const srcstub = el.getAttribute('data-file');
  const starttime = el.getAttribute('data-timeoffset');
  console.log('timeoffset', starttime);
  let video = document.createElement('video');
  video.setAttribute('width', 360);
  video.setAttribute('controls', true);
  ['mp4', 'ogv', 'webm'].forEach(function(extension) {
    const uri = srcstub + '.' + extension;
    fetch(uri, { method: 'HEAD'}).then((response) => {
      if (response.ok) {
        let source = document.createElement('source');
        source.setAttribute('src', uri);
        source.setAttribute('type', videotypes[extension]);
        if (starttime) {
          a = starttime.split(':');
          let seconds = (+a[0])*60 + a[1];
          console.log('setting currentTime to', seconds);
          source.setAttribute('currentTime', seconds)
        }
        video.appendChild(source);
      }
    }, reason => {
      console.log('could not fetch', uri, reason);
    });
  });
  el.appendChild(video);
};
