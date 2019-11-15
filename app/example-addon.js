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
  code.innerHTML = text;
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
        console.log('ok', srcfile, response);
        response.text().then(text => el.append(createExample(text, srcfile)));
      } else {
        console.log('not ok', srcfile, response);
      }
    }, reason => {
      console.log('could not fetch', srcfile, reason);
    })
};
