function swapimage(e) {
  let i = e.target;
  var s=i.src;
  var len=s.length;
  var post="-alt";
  var dot=s.lastIndexOf('.');
  var tlen=post.length;
  if (s.substr(dot-tlen,tlen)==post) {
    i.src = s.substr(0,dot-tlen) + s.substr(dot);
  }
  else {
    i.src = s.substr(0,dot) + post + s.substr(dot);
  }
}

module.exports = function(idx, el) {
  const src = el.getAttribute('src').split('\.')
  if (src[0].endsWith('-alt')) {
    el.onclick =  swapimage;
  }
};
