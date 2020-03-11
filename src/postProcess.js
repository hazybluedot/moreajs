const html5video = require('./html5video');
import asideAddon from './aside-addon.js';
const screenCap = require('./screencap-addon.js');
const imgSwap = require('./imgswap-addon.js');
const sampOutput = require('./samp-addon.js');
import exampleCode from './example-addon.js';
const ResponseQuestions = require('./rq-addon.js');
const attachSvg = require('../lib/attachSvg.js');
//const config = require('../deploy.js');

//const response_questions = new ResponseQuestions(config);

const sectionAddOns = {
    'img': imgSwap,
    'figure.screencap, img.screencap': screenCap,
    'section': asideAddon,
    '.svg-highlight': (idx, el) => attachSvg(el),
    '.html5-video': (idx, el) => html5video(el),
    'pre.env-matlab samp, samp.env-matlab': sampOutput,
    //'pre.env-matlab samp': sampOutput,
    '.matlab-example': exampleCode,
    //'.response-question': (idx, el) => response_questions.render(idx, el)
};

function postProcess(el) {
    asideAddon(0, el);
    for (const [selector, func] of Object.entries(sectionAddOns)) {
	try {
	    $(el).find(selector).each(func);
	} catch (e) {
	    console.log(`postProcess selector ${selector} exception`, e);
	}
    }
}

export default postProcess;
