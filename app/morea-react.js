import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MoreaSequence from './components/MoreaSequence.js'

class App extends Component {
  render () {
    return (
      <div className="App">
        <h1>Hello, World!</h1>
      </div>
    )
  }
}

module.exports = function (data, el, args) {
  console.log('morea-react data', data, 'el', el, 'args', args)
  ReactDOM.render(<MoreaSequence modules={data} options={args} />, el)
}
