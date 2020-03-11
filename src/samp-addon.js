module.exports = (idx, el) => {
    let text = el.innerHTML.split('\n');
    if (text[0] === '') {
	text.shift();
    }
    el.innerHTML = text.map(line => {
	if (line.substr(0,line.indexOf(' ')) == ('&gt;&gt;')) {
	    line = '<span class="prompt">&gt;&gt;</span> <kbd>' + line.substr(line.indexOf(' ')+1) + '</kbd>';
	}
	return line;
    }).join('\n');
};
