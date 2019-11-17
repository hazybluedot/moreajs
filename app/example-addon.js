const hljs = require('highlight.js');

function stateTransition(oldState, line) {
    switch (oldState) {
    case 'start':
    case 'code':
	if (line.substr(0,3) == '%% ') {
	    return 'section';
	} else if (line.charAt(0) == '%') {
	    return 'text';
	} else {
	    //console.log('code|start => code', line);
	    return 'code';
	}
	break;
    case 'section':
    case 'text':
	if (line.match(/^\s*$/) || line.charAt(0) == '%') {
	    //console.log('text => text', line);
	    return 'text';
	} else {
	    //console.log('text => code', line);
	    return 'code';
	}
    }
};

function parseLines(text) {
    let sections = text.split(/%%\s+([^\s].*)/);
    console.log('sections', sections);
    sections = sections.reduce((carry, section) => {
	const lines = section.split('\n');
	
	for (var i = 0; i < lines.length; i++) {
	    let line = lines[i];
	    let newState = stateTransition(state, line);
	    lines[i] = `(${newState}) ${line}`;
	    state = newState;
	}
	carry['WHAT TO PUT HERE?'] = lines.join('\n');
    }, {'state': 'start'});
    

    return sections;
};

function createExample(text, uri) {
    let ex = document.createElement('section');
    ex.className = 'collapsable collapsed';
    let content = document.createElement('div');
    content.className = 'content';
    let heading = document.createElement('h1'),
	p = document.createElement('p');
    heading.innerHTML = 'Example';
    p.innerHTML = `The code for this example can be found in <a href="${uri}">${uri}</a>.`;
    content.append(p);
    ex.append(heading);
    ex.append(content);

    heading.onclick = function(event) {
	let sec = this.parentNode;
	if (sec.classList.contains('collapsed')) {
	    sec.classList.remove('collapsed');
	    sec.classList.add('expanded');
	} else {
	    sec.classList.add('collapsed');
	    sec.classList.remove('expanded');
	}
    };

    let code = document.createElement('code');
    code.className = 'lang-matlab';
    text = parseLines(text).join('\n');
    code.innerHTML = hljs.highlight('matlab', text).value;
    
    let pre = document.createElement('pre');
    pre.append(code);
    content.append(pre);
    return ex;
};

module.exports = function(idx, el) {
    const srcfile = el.getAttribute('data-file');
    console.log('Processing example file ', srcfile);
    fetch(srcfile, {method: 'GET'})
	.then(response => {
	    if (response.ok) {
		response.text().then(text => el.append(createExample(text, srcfile)));
	    } else {
		console.log('not ok', srcfile, response);
	    }
	}, reason => {
	    console.log('could not fetch', srcfile, reason);
	})
};
