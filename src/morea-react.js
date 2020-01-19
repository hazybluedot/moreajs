import React from 'react'
import ReactDOM from 'react-dom'
import MoreaSequence from './components/MoreaSequence.js'

export default function (data, el, args, location) {
  ReactDOM.render(<MoreaSequence modules={data} options={args} location={location} b/>, el)
}
