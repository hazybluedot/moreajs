const config = require('config')

console.log('config', config)
const Morea = require('./morea.js')
const mdrender = require('./markdown-it-render.js')
// morea_render = new Morea({ apibase: 'https://efcms.engr.utk.edu/ef105-2019-08/api/morea' });
const morea_render = new Morea(config)
const MoreaReact = require('./morea-react.js')

if (typeof String.prototype.endsWith !== 'function') {
  String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1
  }
}

function sectionToggleHandler(el) {
  var sec = $(el.currentTarget).parent();
  //let module_content = sec.children('.module-content');
  //sec = module_content.length > 0 ? module_content.first() : sec;
  //console.log('toggeling element', el, 'section', sec);
  sec.children('.content').toggle();
  if (sec.children('.content').css('display') == 'none') {
    sec.find('h2 button, h1 button').text('+');
  } else {
    sec.find('h2 button, h1 button').text('-');	
  }
};

function collapseAll() {
  $('section.collapsable > div.content').hide();
}

jQuery(function () {
  $('.markdownit').each((idx, el) => {
    mdrender.renderElement(idx, el);
    $(el).find('.collapsable').children('h1', 'h2', 'h3').first()
      .on("click", sectionToggleHandler)
  })

  // $('.morea').each((idx, el) => morea_render.render(idx, el));

  let data = $.map($('.morea'), (el) => {
    data = morea_render.data(el)
    data.root = el
    return data
  })
  
  data.forEach((instance) => {
    instance.promise
      .then((e) => MoreaReact(e, instance.root, instance.args))
      .then(() => {
        $('section.morea-module, section.morea-reading, section.morea-assessment, section.morea-experience').each((idx, el) => {
          const $section = $(el)
          //console.log('appending button to ', el);
          $section.addClass('collapsable').children('h1, h2, h3')
            .first()
            .on("click", sectionToggleHandler)
            .prepend($('<button>+</button>'))
        })
        
        collapseAll();

        $('img').each((idx, el) => {
          const src = el.getAttribute('src').split('\.')
          if (src[0].endsWith('-alt')) {
            el.setAttribute('onclick', 'swapimage(this)')
          }
        })

        $('img.screencap')
	  .each(function(idx, el) {
		var currentTitle = $(el).attr('title');
		console.log('adding screencap expand to image: ' + $(el).attr('src'));
		$(el).attr('title', '(click to enlarge)');
		$(el).on('click', function(e) {
		    e.preventDefault();
		    $(this).toggleClass('screencap-expanded');
		});
	    });

      })    
  })

})
