module.exports = function(el) {
  let definitions = {};

  function showDefinition(dlid, e) {
    let dd = definitions[dlid].dd,
        dt = definitions[dlid].dt;
    
    if (e.type === "mouseenter") {
      dt.classList.add('highlight');
      dd.classList.add('highlight');
    } else if (e.type === "mouseleave") {
      dt.classList.remove('highlight');
      dd.classList.remove('highlight');
    }
  }

  function attachSvg(svg, attr_el) {
    attr_el.querySelectorAll('[id]').forEach((el, idx) => {
      const dlid = el.getAttribute('id');
      let rect = svg.querySelector('#' + dlid);
      rect.addEventListener('mouseenter', (e) => showDefinition(dlid, e));
      rect.addEventListener('mouseleave', (e) => showDefinition(dlid, e));
      definitions[dlid] = { idx: idx, dt: el };
    });

    for(var propName in definitions) {
      let def = definitions[propName];
      def.dd = attr_el.querySelectorAll('dd')[def.idx];
    }  
  };

  let attrsel = el.getAttribute('data-attribute-selector');    
  let attrel = document.querySelector(attrsel);
  let svg = el.contentDocument === null ? null : el.contentDocument.documentElement;

  if (svg && svg.nodeName === "svg") {
    attachSvg(el.contentDocument.documentElement, attrel);
  } else {
    el.addEventListener('load', (e) => {
      attachSvg(el.contentDocument.documentElement, attrel);
    });
  }
}
