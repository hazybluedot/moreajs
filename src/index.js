//import $ from 'jquery';

import efmd from 'efmarkdown';
const config = require('../deploy.js');

import Morea from './morea.js';
import MoreaReact from './morea-react.js';
const html5video = require('./html5video');
import asideAddon from './aside-addon.js';
const screenCap = require('./screencap-addon.js');
const imgSwap = require('./imgswap-addon.js');
const sampOutput = require('./samp-addon.js');
import exampleCode from './example-addon.js';
const ResponseQuestions = require('./rq-addon.js');
const attachSvg = require('../lib/attachSvg.js');

console.log('exampleCode', exampleCode);

const morea_render = new Morea(config)
const response_questions = new ResponseQuestions(config);

const sectionAddOns = {
  'img': imgSwap,
  'img.screencap': screenCap,
  'section': asideAddon,
  '.svg-highlight': (idx, el) => attachSvg(el),
  '.html5-video': (idx, el) => html5video(el),
  'samp.env-matlab': sampOutput,
  '.matlab-example': exampleCode,
  '.response-question': (idx, el) => response_questions.render(idx, el)
};

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1
    }
}

function postProcess(el) {
  for (const [selector, func] of Object.entries(sectionAddOns)) {
    $(el).find(selector).each(func);
  }
}

jQuery(function () {
  
  jQuery.fn.comments = require('./jquery-comments.js');

  /*
  let markdownblocks = false;
  $('.markdownit').each((idx, el) => {
    markdownblocks = true;
    efmd.renderElement(el);
    postProcess(el);
  })
  */
  
  let data = $.map($('.morea'), (el) => {
    data = morea_render.data(el)
    data.root = el
    return data
  })
  
  data.forEach((instance) => {
    instance.promise
      .then((e) => MoreaReact(e, instance.root, instance.args, document.location, postProcess), reason => {
        console.log(reason);
      })
      .then(() => {
//        let morea_sections = $('section.morea-module, section.morea-reading, section.morea-assessment, section.morea-experience');

        for (const [selector, func] of Object.entries(sectionAddOns)) {
          $(selector).each(func);
        }
      })
      .then(() => {
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
