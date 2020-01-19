function format(data, qn) {
  const qobj = data.list[qn-1];
  console.log('qobj', qobj);
  let qel = $('<div>', {'class': 'RQBox'});
  qel.text(qobj.question);
  let qlist = $('<ol>', {type: 'A'});
  qobj.answers.forEach((a) => {
    const cls  = '';
    qlist.append($(`<li ${cls}>${a}</li>`));
  });
  return qel.append(qlist);
}

module.exports = class RQ {
  constructor(params) {
    this.apibase = params.apibase;
    this.wwwroot = params.wwwroot;
    var self = this;
    console.log(this);
  }

  render (idx, el) {
    const apibase = this.apibase;
    const module_id = el.getAttribute('data-module');
    const question_id = el.getAttribute('data-id');
    const question_n = question_id + 1;
    const url = apibase + '/response_questions/' + module_id;
    console.log('rendering response question', module_id, question_id, url, this);
    const rqs = fetch(url)
          .then(resp => resp.json())
          .then(data => $(el).append(this.render_question(question_n, data)));
  }

  render_question (question_n, data) {
    return $(`<div><img src="${this.wwwroot}/img/rq.jpg">Question #${question_n}</div>`).append(format(data, question_n));
  }
}
