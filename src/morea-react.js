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

export default function (data, el, args, location) {
  console.log('Hello from morea-react', args);
  if (args.includes('unroll')) {
    data = unroll_modules(data);
    //console.log('unrolling modules', data);
  }
  ReactDOM.render(<MoreaSequence modules={data} options={args} location={location} />, el)
}
