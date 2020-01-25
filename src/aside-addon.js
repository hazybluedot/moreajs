export default (idx, el) => {
  let $sec = $(el);
  if ($sec.children('section').length == 0) {
	let content = $sec.children('.content').length > 0 ? $sec.children('.content').first() : $sec;
	let asides = content.children('aside');
	if (asides.length > 0) {
      //console.log('putting aside in a column', content, asides);
	  content.addClass("row");
	  let main = content.children(':not(aside)');
	  
	  main.wrapAll($('<div />', {"class": "col-md-6"}));
	  asides.wrapAll($('<div />', {"class": "col-md-3"}));
	}
  }
};
