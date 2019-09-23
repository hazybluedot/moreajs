import React, { Component } from "react";
import MoreaModule from "./MoreaModule.js"
import ErrorBoundary from "./ErrorBoundary.js"

module.exports = class Module extends Component {
    renderModule(module) {
	{console.log('module props', module)}

	return (<ErrorBoundary key={module.morea_id}>
		<MoreaModule key={module.morea_id} module={module} items={module.items} />
		</ErrorBoundary>);
    }
    
    render() {
	console.log('MoreaSequence props', this.props.props);
	return(
	    this.props.modules.map(this.renderModule)
	);
    };
}
