const config = require('config')

const Morea = require('./morea.js')
const mdrender = require('./markdown-it-render.js')
const morea_render = new Morea(config)
const MoreaReact = require('./morea-react.js')
const html5video = require('./html5video');
const asideAddon = require('./aside-addon.js');
const screenCap = require('./screencap-addon.js');
const imgSwap = require('./imgswap-addon.js');
const sampOutput = require('./samp-addon.js');
const exampleCode = require('./example-addon.js');

const sectionAddOns = {
  'img': imgSwap,
  'img.screencap': screenCap,
  '.section': asideAddon,
  '.svg-highlight': (idx, el) => attachSvg(el),
  '.html5-video': (idx, el) => html5video(el),
  'samp.env-matlab': sampOutput,
  '.matlab-example': exampleCode
};

if (typeof String.prototype.endsWith !== 'function') {
  String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1
  }
}

function sectionToggleHandler(el) {
  var sec = $(el.currentTarget).parent();
  //let module_content = sec.children('.module-content');
  //sec = module_content.length > 0 ? module_content.first() : sec;
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
  let attachSvg = require('../lib/attachSvg.js');
  
  jQuery.fn.comments = require('./jquery-comments.js');
  $('.markdownit').each((idx, el) => {
    mdrender.renderElement(idx, el);
    $(el).children('section').each(function(idx, sec) {
      $(sec).addClass('collapsable').children('h1', 'h2', 'h3').first()
      .on("click", sectionToggleHandler)
        .prepend($('<button>+</button>'));
    })
    
    $(el).find('.html5-video').each((idx, el) => html5video(el));

  })

  let data = $.map($('.morea'), (el) => {
    data = morea_render.data(el)
    data.root = el
    return data
  })
  
  data.forEach((instance) => {
    instance.promise
      .then((e) => MoreaReact(e, instance.root, instance.args), reason => {
        console.log(reason);
      })
      .then(() => {
        let morea_sections = $('section.morea-module, section.morea-reading, section.morea-assessment, section.morea-experience');
        morea_sections.each((idx, el) => {
          const $section = $(el)
          //console.log('appending button to ', el);
          $section.addClass('collapsable').children('h1, h2, h3')
            .first()
            .on("click", sectionToggleHandler)
            .prepend($('<button>+</button>'))
        })
	  	  
        console.log('Processing section addons');
        for (const [selector, func] of Object.entries(sectionAddOns)) {
          console.log('selector', selector);
          $(selector).each(func);
        }

        collapseAll();

      })
      .then(() => {
        console.log('doing final load stuff');
        let stylelink = document.createElement('link');
        stylelink.rel = 'stylesheet';
        stylelink.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css';
        document.head.appendChild(stylelink);
        //let script = document.createElement('script');
        //script.type = 'text/javascript';
        //script.src = '/ef105-2019-08/includes/numeric_explorer.min.js';
        //document.head.appendChild(script);
      });
  })
  
    $("#open-guide").click(function (e) {
        //guideEl = $("#facilitator-guide");
	//this.href;
	$('section.morea-module').each((idx, el) => {
	    let comments = $(el).comments(true); //recursivelyFindComments(el, []);
	    let notes = comments.filter((index, el) => {
		return el.innerHTML.match(/\s*NOTE:/);
	    });
	    if (notes.length > 0) {
		  console.log('notes', notes.toArray().map((el) => ({ rel: el.getAttribute('rel'), note: el.innerHTML })));
	    }
	});

	console.log('clicked open guide');
	var href = e.target.getAttribute("href");
	console.log(href);
        var win = window.open(window.location.origin + href
			      , 'Facilitator Guide'
			      , "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=980,height=680,top="+(screen.height-480)+",left="+(screen.width-840));
	win.setNotes({ "data": [1,2,3,4]});
	win.data = { "data": [1,2,3,4,5] };
	win.morea = $('div.morea');
	win.window.morea = $('div.morea');
	win.focus();
	
    }); //#open-guide.click

})
