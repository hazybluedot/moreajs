let config = require('config');

console.log('config', config);
let Morea = require('./morea.js'),
    mdrender = require('./markdown-it-render.js'),
    // morea_render = new Morea({ apibase: 'https://efcms.engr.utk.edu/ef105-2019-08/api/morea' });
    morea_render = new Morea(config);
let MoreaReact = require('./morea-react.js');


jQuery(function() {
    $('.markdownit').each(mdrender.renderElement);

    //$('.morea').each((idx, el) => morea_render.render(idx, el));

    let data = $.map($('.morea'), (el) => {
	data = morea_render.data(el)
	data['root'] = el;
	return data;
    });

    data.forEach((instance) => {
	instance['promise'].then((e) => MoreaReact(e, instance['root']));
    });
});
