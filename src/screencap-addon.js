module.exports = (idx, el) => {
  let $img = $(el).children('img').length > 0 ? $(el).children('img').first() : $(el);
  var currentTitle = $img.attr('title');
  $img.addClass('screencap');
  $img.attr('title', '(click to enlarge)');
  $img.on('click', function(e) {
	e.preventDefault();
	$(this).toggleClass('screencap-expanded');
  });
};
