export default (idx, el) => {
    let $sec = $(el);
    if ($sec.children('section').length == 0) {
	console.log('applying aside addon to section', $sec);
	//$sec.addClass("row");  
	let content = $sec.children('.content').first();
	let asides = content.children('aside');
	if (asides.length > 0) {
	    content.addClass("row");
	    let main = content.children(':not(aside)');
	    
	    main.wrapAll($('<div />', {"class": "col-md-6"}));
	    asides.wrapAll($('<div />', {"class": "col-md-3"}));
	}
    }
};
