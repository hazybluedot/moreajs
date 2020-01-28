function rangleAside($sec) {
  let content = $sec.children('.content').length > 0 ? $sec.children('.content').first() : $sec;
  let asides = content.children('aside');
  if (asides.length > 0) {
    //console.log('putting aside in a column', content, asides);
	content.addClass("row");
	let main = content.children(':not(aside)');
	
    //console.log('wrapping main', main);
	main.wrapAll($('<div />', {"class": "col-md-6"}));
    //console.log('wrapping asides', asides);
    asides.wrapAll($('<div />', {"class": "col-md-3"}));
  }
}

export default (idx, el) => {
  let $sec = $(el);
  let $subsections = $sec.find('section');

  if ($subsections.length > 0) {
    $subsections.each((idx, el) => {
      rangleAside($(el));
    });
  } else {             
    rangleAside($sec);
  }
};
