let Morea = require('./morea.js'),
    mdrender = require('./markdown-it-render.js'),
    // morea_render = new Morea({ apibase: 'https://efcms.engr.utk.edu/ef105-2019-08/api/morea' });
    morea_render = new Morea({ apibase: 'http://localhost:8080/morea' });


jQuery(function() {
    $('.markdownit').each(mdrender);

    $('.morea').each((idx, el) => morea_render.render(idx, el));
});
