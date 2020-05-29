import React from 'react'
import ReactDOM from 'react-dom'
import MoreaApp from './MoreaApp.js'

export default function (el, location) {
    ReactDOM.render(<MoreaApp location={location}/>, el);
}
