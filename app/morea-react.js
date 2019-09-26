import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MoreaSequence from './components/MoreaSequence.js'

module.exports = function (data, el, args) {
  ReactDOM.render(<MoreaSequence modules={data} options={args} />, el)
}
