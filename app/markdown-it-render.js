let MarkdownIt = require('markdown-it'),
    md = new MarkdownIt(),
    mk = require('markdown-it-katex'),
    mc = require('markdown-it-container');

let markdownContainers = [
    {
	name: 'section',
	validate: regexValidator(/^section\s+(.*)$/),
	render: function(tokens, idx) {
	    var m = tokens[idx].info.trim().match(/^section\s+(.*)$/);
	    if (tokens[idx].nesting === 1) {
		return '<section><h1><button>+</button>' + m[1] + '</h1><div class="content">\n';
	    } else {
		return '</div>\n</section>\n';
	    }
	}
    },
    {
	name: 'screen',
	validate: regexValidator(/^screen\s+(.*)$/),
	render: function(tokens, idx) {
	    var m = tokens[idx].info.trim().match(/^screen\s+(.*)$/);
	    if (tokens[idx].nesting === 1) {
		return '<pre class="screen screen-' + m[1] + '">\n<code>\n';
	    } else {
		return '</code>\n</pre>\n';
	    }
	}
    },
    {
	name: 'aside',
	validate: regexValidator(/^aside\s+(.*)$/),
	render: function(tokens,idx) {
	    var m = tokens[idx].info.trim().match(/^aside\s+(.*)$/);
	    if (tokens[idx].nesting == 1) {
		return '<aside><h1>' + m[1] + '</h1><div class="content">\n';
	    } else {
		return '</div>\n</aside>\n';
	    }
	}
    }
];


md.configure('default').set({ html: true, xhtmlOut: true});

md.use(mk)
    .use(require('markdown-it-anchor'));

markdownContainers.reduce(function(acc, current) {
    console.log('processing container config', current);
    md.use(mc, current.name, current);
    return md;
}, md);

function regexValidator(regex) {
    return function(params) {
	return params.trim().match(regex);
    };
}

function renderString(rawContent) {
    var lines = rawContent.split('\n');
    var whitespace = null;
    var i = 0;
    while (!whitespace && i < lines.length ) {
	whitespace = lines[i].match(/^(\s+)[^\s]/);
	i++;
    }
    // strip off same whitespace from all lines
    if (whitespace) {
	rawContent = lines.reduce(function(acc, line) {
	    acc += line.replace(whitespace[1], "") + '\n';
	    return acc;
	}, "");
    }

    return md.render(rawContent);
}

module.exports = {
    renderString: renderString,
    
    renderElement: function(idx, el) {
	var rawContent = el.innerHTML;
	// check leading whitespace on first line of content
	
	el.innerHTML = md.render(renderString(rawContent));
    }
};
