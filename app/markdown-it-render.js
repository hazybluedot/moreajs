const hljs = require('highlight.js')
const md = require('markdown-it')();

const mc = require('markdown-it-container')

const markdownContainers = [
  {
    name: 'section',
    validate: regexValidator(/^section\s+(.*)$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^section\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return '<section><h1>' + m[1] + '</h1><div class="content">\n'
      } else {
        return '</div>\n</section>\n'
      }
    }
  },
  {
    name: 'aside',
    marker: '~',
    validate: regexValidator(/^aside\s+(.*)$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^aside\s+(.*)$/)
      if (tokens[idx].nesting == 1) {
        return '<aside><h1>' + m[1] + '</h1><div class="content">\n'
      } else {
        return '</div>\n</aside>\n'
      }
    }
  },
  {
    name: 'figure',
    validate: regexValidator(/^figure\s+(.*)$/),
    render: function (tokens, idx) {
      if (tokens[idx].nesting == 1) {
        var m = tokens[idx].info.trim().match(/^figure\s+(.*)$/)
        var params = m[1].split(/\s+/)
        return '<figure class="figure float-' + params[0] + '">\n'
      } else {
        return '</figure>\n'
      }
    }
  }
]

md.configure('default').set({ html: true,
			      xhtmlOut: true,
			      langPrefix: 'lang-',
			      highlight: function(str, lang) {
				  if (lang && hljs.getLanguage(lang)) {
				      try {
					  return hljs.highlight(lang, str).value;
				      } catch (__) {}
				  }
				  return '';
			      }
			    })

md.use(require('markdown-it-anchor'))
  .use(require('markdown-it-decorate'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-katex'), { throwOnError: false, errorColor: '#cc0000' })
//  .use(require('markdown-it-highlightjs'))

markdownContainers.reduce(function (acc, current) {
  md.use(mc, current.name, current)
  return md
}, md)

function regexValidator (regex) {
  return function (params) {
    return params.trim().match(regex)
  }
}

function renderString (rawContent) {
    var lines = rawContent.split('\n')
    var whitespace = null;
    var content = null;
    var i = 0
    while (content === null && i < lines.length) {
	if (lines[i].length > 0) {
	    whitespace = lines[i].match(/^(\s*)([^\s]+)/);
	    if (whitespace !== null && whitespace[2].length > 0) {
		content = whitespace[2];
		//console.log('found whitespace at line ', i, whitespace);
	    }
	}
	i++
    }
    // strip off same whitespace from all lines
    if (whitespace !== null) {
	rawContent = lines.reduce(function (acc, line) {
	    acc += line.replace(whitespace[1], '') + '\n'
	    return acc
	}, '')
	//console.log('stripping whitespace', whitespace, rawContent);
    }
    
    return md.render(rawContent)
}

module.exports = {
  renderString: renderString,

  renderElement: function (idx, el) {
    var rawContent = el.innerHTML
    // check leading whitespace on first line of content

    el.innerHTML = md.render(renderString(rawContent))
    return el;
  }
}
