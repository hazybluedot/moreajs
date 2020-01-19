module.exports = (idx, el) => {
  var currentTitle = $(el).attr('title');
  //console.log('adding screencap expand to image: ' + $(el).attr('src'));
  $(el).attr('title', '(click to enlarge)');
  $(el).on('click', function(e) {
	e.preventDefault();
	$(this).toggleClass('screencap-expanded');
  });
};
