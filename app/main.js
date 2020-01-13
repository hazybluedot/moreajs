const config = require('config')

const Morea = require('./morea.js')
const mdrender = require('./markdown-it-render.js')
const MoreaReact = require('./morea-react.js')
const html5video = require('./html5video');
const asideAddon = require('./aside-addon.js');
const screenCap = require('./screencap-addon.js');
const imgSwap = require('./imgswap-addon.js');
const sampOutput = require('./samp-addon.js');
const exampleCode = require('./example-addon.js');
//const ResponseQuestions = require('./rq-addon.js');

const morea_render = new Morea(config)
//const response_questions = new ResponseQuestions(config);

const sectionAddOns = {
  'img': imgSwap,
  'img.screencap': screenCap,
  '.section': asideAddon,
  '.svg-highlight': (idx, el) => attachSvg(el),
  '.html5-video': (idx, el) => html5video(el),
  'samp.env-matlab': sampOutput,
  '.matlab-example': exampleCode//,
  //'.response-question': (idx, el) => response_questions.render(idx, el)
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

function postProcess(el) {
  for (const [selector, func] of Object.entries(sectionAddOns)) {
    $(el).find(selector).each(func);
  }
}

jQuery(function () {
  let attachSvg = require('../lib/attachSvg.js');
  
  jQuery.fn.comments = require('./jquery-comments.js');

  let markdownblocks = false;
  $('.markdownit').each((idx, el) => {
    markdownblocks = true;
    mdrender.renderElement(idx, el);
    $(el).children('section').each(function(idx, sec) {
      $(sec).addClass('collapsable').children('h1', 'h2', 'h3').first()
      .on("click", sectionToggleHandler)
        .prepend($('<button>+</button>'));
    })
    
    postProcess(el);
  })

  if (!markdownblocks) {
    $('#gbocontent').each((idx, el) => {
      mdrender.renderElement(idx, el);
    });
  }

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
        /*
        morea_sections.each((idx, el) => {
          const $section = $(el)
          //console.log('appending button to ', el);
          $section.addClass('collapsable').children('h1, h2, h3')
            .first()
            .on("click", sectionToggleHandler)
            .prepend($('<button>+</button>'))
        })*/

        for (const [selector, func] of Object.entries(sectionAddOns)) {
          $(selector).each(func);
        }


        $('h1[data-toggle="tab"]').on('show.bs.tab', (e) => {
          console.log('pushing hash to history', e.target);
          history.pushState({}, '', '#' + e.target.id);
        });

        //collapseAll();
      })
      .then(() => {
        //console.log('doing final load stuff');
        var hash = document.location.hash;
        var postfix = "-tab";
        console.log('got document hash', hash);
        if (hash) {
          $('.nav-tabs h1[href="'+hash.replace(postfix,"")+'"]').tab('show');
        }

        $('[data-toggle="collapse"][data-group][data-default]').each((idx, e) => {
          console.log('data-default', e);
          const target = e.getAttribute('data-target');
          console.log('data-default', target);
          $(target).addClass("show");
        });
        
        $('[data-toggle="collapse"][data-group]').on('click', (e) => {
          console.log('toggleing data-group', e.target.getAttribute('data-group'));
          const group = e.target.getAttribute('data-group');
          $(group).removeClass("show");
        });
      });
  })
  
  var onload = false;
  $("#open-guide").click(function (e) {
    let moduleIDs = [];
    $('div.morea').each((idx, el) => {
      let modules = el.getAttribute('data-modules').split(/\s+/);
      moduleIDs = moduleIDs.concat(modules);
    });

	var href = e.target.getAttribute("href");
    var win = window.open(window.location.origin + href
			          , 'Facilitator Guide'
			          , "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=980,height=680,top="+(screen.height-480)+",left="+(screen.width-840));
    win.addEventListener('load', function() {
      console.log('sending module IDs to child');
      onload = true;
      win.setNotes(moduleIDs);
    }, false);

    if (onload) {
      console.log('sending module IDs to already loaded child', moduleIDs);
      win.setNotes(moduleIDs);
    }
    //win.setNotes(moduleIDs);  
	//win.setNotes(notes);
	win.focus();
	
  }); //#open-guide.click
    
  let stylelink = document.createElement('link');
  stylelink.rel = 'stylesheet';
  stylelink.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css';
  document.head.appendChild(stylelink);
})
