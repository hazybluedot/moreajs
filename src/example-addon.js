import React, { Component, useState } from 'react'
import ReactDOM from 'react-dom'

/*
import hljs from 'highlight.js/lib/highlight';
import matlab from 'highlight.js/lib/languages/matlab';
hljs.registerLanguage('matlab', matlab);
*/

import efmd from 'efmarkdown';

import {Button,Collapse} from 'react-bootstrap';

//import { render as mdrender } from 'efmarkdown';

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
  const html = efmd.render('``` matlab\n' + code + '\n```\n');
  return (
      <div dangerouslySetInnerHTML={{__html:html}}></div>
  );
  /*
  const html = hljs.highlight('matlab', code).value;
  return (
      <pre>
      <code className="lang-matlab" dangerouslySetInnerHTML={{__html:html}}>
      </code>
      </pre>
  );
  */
};

const ExampleCode = ({text, srcfile, opts}) => {
  const [open, setOpen] = useState(false);
  
  let exampleHeading = "Example",
      snips = text.trim().split(/\n%%/);
  
  if (snips[0].match(/^%%+/)) {
    let lines = snips[0].split('\n');
    let exampleName = lines.shift().replace(/^%+\s*/, '');
    exampleHeading += ': ' + exampleName;
    snips[0] = lines.join('\n');
  }

  content = [];

  snips.forEach(snip => {
    let lines = snip.split('\n'),
        heading = lines.shift().trim(),
        text = '';

    if (heading.length > 0) {
      if (heading.charAt(0) !== '%') {
        content.push(<h2>{heading}</h2>);
      } else {
        text += heading.replace(/^%\s*/, '');
      }
    }

    while (lines[0].charAt(0) === '%') {
      text += lines.shift().replace(/^%\s*/, '');
    }
    
    content.push(<p>{text}</p>);
    //appendText(text, content);

    let revlines = lines.join('\n').trim().split('\n').reverse();
    let postText = [];
    while (revlines[0].charAt(0) === '%') {
      postText.unshift(revlines.shift().replace(/^%\s*/, ''));
    }

    const code = revlines.reverse().join('\n');
    content.push(makeCodeBlock(code.trim()));
    //content.append(makeCodeBlock(code.trim()));
    content.push(<p>{postText.join('\n')}</p>);
    //appendText(postText.join('\n'), content);
    
  });

  console.log('children', content);
  return (
      <>
      <Button onClick={() => setOpen(!open)}>{exampleHeading}</Button>
      <Collapse in={open}>
      <div id="some-id">
      <p>The code for this example can be found in <a href={srcfile}>{srcfile}</a>. This is intended to demonstrate and practice a skill that can be applied to the practice problem.</p>
      <p>Copying the example verbatim will <strong>not</strong> result in the desired behavior.</p>
      <section>
      {content}
    </section>
      </div>
      </Collapse>
      </>
  );
};

const ExampleError = ({srcfile, response}) => (
    <div>
    <h1>Example Error: {srcfile}</h1>
    <p className="alert alert-warning">{response.status}: {response.statusText}</p>
    </div>
);

export default function(idx, el) {
  const srcfile = el.getAttribute('data-file');
  let opts = {};
  const optsel = el.getAttribute('data-options');
  if (optsel) { 
    opts = optsel.split(/\s+/).reduce((carry, opt) => {
      carry[opt] = true;
      return carry;
    }, opts);
  }
  //console.log('Processing example file ', srcfile, opts);
  fetch(srcfile, {method: 'GET', cache: 'no-cache'})
	.then(response => {
	  if (response.ok) {
		response.text().then(text => ReactDOM.render(<ExampleCode text={text} srcfile={srcfile} opts={opts} />, el));
	  } else {
		console.log('not ok', srcfile, response);
        ReactDOM.render(<ExampleError srcfile={srcfile} response={response} />, el);
	  }
	}, reason => {
	  console.log('could not fetch', srcfile, reason);
	})
};
