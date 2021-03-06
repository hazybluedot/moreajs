function render_morea (item, $container) {
    // $container = $(el);
    console.log('el', $container)
    if (Array.isArray(item)) {
	item.forEach((it) => {
	    render_morea(it, $container)
	})
    } else {
	$section = $('<section/>', { class: 'morea morea-' + item.morea_type })
	$section.append($('<h1/>').text(item.title))

	if (Array.isArray(item.items)) {
	    $content = $('<div/>', { class: 'content' })
	    $section.append($content)
	    item.items.map(item => render_morea(item, $content))
	}

	$container.append($section)
    }
    return $container
}

function morea_structure (item, root) {
    if (Array.isArray(item)) {
	const items = item.map((i) => morea_structure(i, {}))
	root.items = items
    } else {
	if (item.morea_type == 'module') {
	    item.children = []
	    return item
	} else {
	    root.children.push(item)
	}
    }

    return root
}

export default class Morea {
    constructor (params) {
	this.apibase = params.apibase + '/morea'
	var self = this
	//console.log('morea object with apibase ' + this.apibase)
    }

    data (el) {
	const container = $(el)
	const apibase = this.apibase

	const module_ids = container.attr('data-modules').split(/\s+/)
	let args = []

	if (container.attr('data-args')) {
	    args = container.attr('data-args').split(/\s+/)
	}

	const morea_data = module_ids.map((module_id) => {
	    const url = apibase + '/modules/' + module_id
	    return fetch(url).then(resp => resp.json(), reason => reason);
	});

	//let data = {};

	const resolved = Promise.all(morea_data)
	      .then(text => {		  
		  const extra = text.reduce((acc, bundle) => {
		      let {modules, resources, env} = bundle;
		      acc.env = Object.assign(acc.env, env);
		      const current_ids = acc.resources.map(res => res.id);
		      if (resources) {
			  let new_resources = resources.filter(res => !current_ids.includes(res.id));
			  acc.resources=acc.resources.concat(new_resources);
		      }
		      return acc;
		  }, {resources: [], env: {}});
		  const modules = text.map(bundle => {
		      let {modules, resources, env} = bundle;
		      if (Array.isArray(modules)) {
			  const module = modules.filter(item => item.morea_type == 'module')[0]
			  module.items = modules.filter(item => item.morea_type != 'module')
			  //module.resources = resources;
			  //module.env = env;
			  return module
		      } else {
			  console.log('module items not an array', modules);
			  return null;
		      }
		  }).filter((obj) => obj !== null);
		  
		  // console.log('promis all modules', modules);
		  //data.modules = modules;
		  //data.extra = extra;
		  return {modules, extra};
		  // data = morea_structure(modules, data);
		  // render_morea(modules, $(el));
		  // return text;
	      });
	return { promise: resolved, args }
    }

    render (idx, el) {
	const container = $(el)
	const apibase = this.apibase

	console.log('render', container, 'idx', idx, 'this', this, 'apibase', apibase)
	const module_ids = container.attr('data-modules').split(/\s+/)
	var args = []
	
	if (container.attr('data-args')) {
	    args = container.attr('data-args').split(/\s+/)
	}

	const modules = module_ids.map((module_id) => {
	    const url = apibase + '/modules/' + module_id
	    return fetch(url).then(resp => resp.json())
	})

	const resolved = Promise.all(modules)
	      .then(text => {
		  const modules = text.map(module_items => {
		      const module = module_items.filter(item => item.morea_type === 'module')[0]
		      module.items = module_items.filter(item => item.morea_type !== 'module')
		      return module
		  })

		  render_morea(modules, $(el))
		  // return text;
	      })
    }
}
