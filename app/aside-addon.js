module.export = (idx, el) => {
  let $sec = $(el);
  if ($sec.children('section').length == 0) {
    $sec.addClass("row");            
    let content = $sec.children('.content').first();
    let asides = content.children('aside');
    if (asides.length > 0) {
      let main = content.children(':not(aside)');
      
      main.wrapAll($('<div />', {"class": "col-md-8"}));
      asides.wrapAll($('<div />', {"class": "col-md-4"}));
    }
  }
};
