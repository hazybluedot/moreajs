function isFunction(obj) {
    return typeof obj === "function";
}
function render_morea(item, $container) {
    //$container = $(el);
    console.log('el', $container);
    if (Array.isArray(item)) {
	item.forEach((it) => {
	    render_morea(it, $container);
	});
    } else {
	$section = $('<section/>', {"class": 'morea morea-' + item.morea_type});
	$section.append($('<h1/>').text(item.title));

	if (Array.isArray(item.items)) {
	    $content = $('<div/>', { "class": "content" });
	    $section.append($content);
	    item.items.map(item => render_morea(item, $content));
	}

	$container.append($section);
    }
    return $container;
}

module.exports = class Morea {
    constructor(params) {
	this.apibase = params.apibase;
	var self = this;
	console.log('morea object with apibase ' + this.apibase);
    }

    
    render(idx, el) {
	let container = $(el),
	    apibase = this.apibase;

	console.log('render', container, 'idx', idx, 'this', this, 'apibase', apibase);
	let module_ids = container.attr('data-modules').split(/\s+/);
	var args = [];
	
	if (container.attr('data-args')) {
	    args = container.attr('data-args').split(/\s+/);
	}
	
	let modules = module_ids.map((module_id) => {
	    let url = apibase + '/modules/' + module_id;
	    return fetch(url).then(resp => resp.json());
	});

	let resolved = Promise.all(modules)
	    .then(text => {
		let modules = text.map(module_items => {
		    let module = module_items.filter(item => item.morea_type == 'module')[0];
		    module['items'] = module_items.filter(item => item.morea_type != 'module');
		    return module;
		});

		render_morea(modules, $(el));
		//return text;
	    });
    }
};
