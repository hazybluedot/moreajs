const hljs = require('highlight.js');
import mdrender from './markdown-it-render.js';

function stateTransition(oldState, line) {
    switch (oldState) {
    case 'start':
	if (line.charAt(0) == '%') {
	    return 'text';
	} else {
	    //console.log('code|start => code', line);
	    return 'title';
	}
	break;
    case 'title':
    case 'text':
	if (line.match(/^\s*$/) || line.charAt(0) == '%') {
	    return 'text';
	} else {
	    return 'code';
	}
    }
};

function parseLines(text) {
    let sections = text.split(/%%\s+([^\s].*)/);
    let sectionIdx = 0;
    let state = 'start';
    let result = [];
    while (sections.length > 0) {
      if (sections[0].charAt(0) == '%') {
        // Intro text
        let text = sections.shift();
        result.push({'text': text});
      } else {
        let title = sections.shift(),
            text = sections.shift();
        result.push({title: title, text: text});
      }
    }
    return result;
};

function makeCodeBlock(code) {
  let pre = document.createElement('pre');
  if (code !== undefined && code.length > 0) {
    let codeEl = document.createElement('code');
    codeEl.className = 'lang-matlab';
    codeEl.innerHTML = hljs.highlight('matlab', code).value;
    pre.append(codeEl);
  }
  return pre;
};

function appendText(text, el) {
  if (text.length > 0) {
    console.log('typesetting text', text);
    let p = document.createElement('p');
    p.innerHTML = mdrender.renderString(text);
    el.append(p);
  }
}

function createExample(text, uri, options) {
  let ex = document.createElement('section'),
      exampleHeading = 'Example';
  if (options['expanded']) {
    ex.className = 'collapsable expanded';
  } else {
    ex.className = 'collapsable collapsed';
  }
  let content = document.createElement('div');
  content.className = 'content nested-content';
  let heading = document.createElement('h1'),
	  p = document.createElement('p');
  p.innerHTML = `The code for this example can be found in <a href="${uri}">${uri}</a>. This is intended to demonstrate and practice a skill that can be applied to the practice problem. <p>Copying the example verbatim will <strong>not</strong> result in the desired behavior.</p>`;
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

  //content.append(makeCodeBlock(text.trim()));
  let snips = text.trim().split(/\n%%/);

  if (snips[0].match(/^%%+/)) {
    let lines = snips[0].split('\n');
    let exampleName = lines.shift().replace(/^%+\s*/, '');
    exampleHeading += ': ' + exampleName;
    snips[0] = lines.join('\n');
  }
  
  heading.innerHTML = exampleHeading.trim();
  
  snips.forEach(snip => {
    let lines = snip.split('\n'),
        heading = lines.shift().trim(),
        text = '';

    if (heading.length > 0) {
      if (heading.charAt(0) !== '%') {
        let header = document.createElement('h2');
        header.innerHTML = heading;
        content.append(header);
      } else {
        text += heading.replace(/^%\s*/, '');
      }
    }

    while (lines[0].charAt(0) === '%') {
      text += lines.shift().replace(/^%\s*/, '');
    }

    appendText(text, content);

    let revlines = lines.join('\n').trim().split('\n').reverse();
    let postText = [];
    while (revlines[0].charAt(0) === '%') {
      postText.unshift(revlines.shift().replace(/^%\s*/, ''));
    }

    const code = revlines.reverse().join('\n');
    content.append(makeCodeBlock(code.trim()));

    appendText(postText.join('\n'), content);
    
  });
  
  return ex;
};

function errorResponse(srcfile, response) {
  let sec = document.createElement('div'),
      heading = document.createElement('h1'),
      p = document.createElement('div');
  heading.innerHTML = `Example Error: ${srcfile}`;
  p.innerHTML = `${response.status}: ${response.statusText}`;
  sec.className = 'error';
  sec.append(heading);
  sec.append(p);
  return sec;
};

module.exports = function(idx, el) {
  const srcfile = el.getAttribute('data-file');
  let opts = {};
  const optsel = el.getAttribute('data-options');
  if (optsel) { 
    opts = optsel.split(/\s+/).reduce((carry, opt) => {
      carry[opt] = true;
      return carry;
    }, opts);
  }
  console.log('Processing example file ', srcfile, opts);
  fetch(srcfile, {method: 'GET', cache: 'no-cache'})
	.then(response => {
	  if (response.ok) {
		response.text().then(text => el.append(createExample(text, srcfile, opts)));
	  } else {
		console.log('not ok', srcfile, response);
        el.append(errorResponse(srcfile, response));
	  }
	}, reason => {
	  console.log('could not fetch', srcfile, reason);
	})
};
