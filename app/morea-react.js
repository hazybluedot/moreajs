import React, { Component } from "react";
import ReactDOM from "react-dom";
import MoreaSequence from "./modules/MoreaSequence.js"

class App extends Component {
    render() {
	return(
		<div className="App">
		<h1>Hello, World!</h1>
		</div>
	);
    }
}

module.exports = function(data, el) {
    console.log('morea-react data', data, 'el', el);
    ReactDOM.render(<MoreaSequence modules={data} />, el);
};
