import React from 'react'
import ReactDOM from 'react-dom'
import MoreaSequence from './components/MoreaSequence.js'

function unroll_modules(modules) {
    return modules.reduce((acc, cur) => {
	let items = cur.items;
	cur.items = [];
	acc.push(cur);
	acc = acc.concat(items);
	return acc;
    }, [])
}

export default function ({modules, extra}, el, args, location) {
    /*
    if (extra && extra.env && extra.env.user && extra.env.user.priv === 'admin') {
	console.log('Hello from morea-react', args, 'data', modules, 'extra', extra);
    }*/
    if (args.includes('unroll')) {
	modules = unroll_modules(modules);
	//console.log('unrolling modules', data);
    }
    ReactDOM.render(<MoreaSequence modules={modules} options={args} location={location} resources={extra.resources} env={extra.env} />, el)
}
