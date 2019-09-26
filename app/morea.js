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

module.exports = class Morea {
  constructor (params) {
    this.apibase = params.apibase
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

    const modules = module_ids.map((module_id) => {
      const url = apibase + '/modules/' + module_id
      return fetch(url).then(resp => resp.json())
    })

    const data = {}

    const resolved = Promise.all(modules)
      .then(text => {
        const modules = text.map(module_items => {
          const module = module_items.filter(item => item.morea_type == 'module')[0]
          module.items = module_items.filter(item => item.morea_type != 'module')
          return module
        })

        // console.log('promis all modules', modules);
        data.modules = modules
        return modules
        // data = morea_structure(modules, data);
        // render_morea(modules, $(el));
        // return text;
      })

    //console.log('morea data', data, 'resolved', resolved)
    return { promise: resolved, data: data, args }
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
