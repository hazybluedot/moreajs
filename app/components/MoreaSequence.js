import React, { Component } from "react";
import MoreaModule from "./MoreaModule.js"
import ErrorBoundary from "./ErrorBoundary.js"

module.exports = class Module extends Component {
  renderModule(module, options) {
	{console.log('module props', module)}
	
	let ordered_ids = ['outcomes', 'readings', 'experiences', 'assessments'].reduce((ids, type) => {
	    let key = 'morea_' + type
	    if (key in module ) {
		ids = ids.concat(module[key]);
	    }
	    return ids;
	}, []);

	console.log('ordered_ids', ordered_ids);
	let items = ordered_ids.map((id) => {
	    let item = module.items.filter( i => i.morea_id == id );
	    return (item.length > 0) ? item[0] : null;
	}).filter((i) => i !== null);
	

	console.log('items', items);

	return (<ErrorBoundary key={module.morea_id}>
		<MoreaModule key={module.morea_id} module={module} items={items} options={options} />
		</ErrorBoundary>);
    }
    
    render() {
	console.log('MoreaSequence props', this.props);
	return(
	  this.props.modules.map(module => this.renderModule(module, this.props.options))
	);
    };
}
