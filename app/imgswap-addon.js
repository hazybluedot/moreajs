module.exports = function(idx, el) {
  const src = el.getAttribute('src').split('\.')
  if (src[0].endsWith('-alt')) {
    el.setAttribute('onclick', 'swapimage(this)')
  }
};
