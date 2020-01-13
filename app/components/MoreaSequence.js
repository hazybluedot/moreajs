import React, { Component } from "react";
import MoreaModule from "./MoreaModule.js"
import ErrorBoundary from "./ErrorBoundary.js"

module.exports = class Module extends Component {
  renderModule(module, idx, options) {    
    let ordered_ids = ['outcomes', 'readings', 'experiences', 'assessments'].reduce((ids, type) => {
      let key = 'morea_' + type
      if (key in module ) {
	ids = ids.concat(module[key]);
      }
      return ids;
    }, []);

    let items = ordered_ids.map((id) => {
      let item = module.items.filter( i => i.morea_id == id );
      return (item.length > 0) ? item[0] : null;
    }).filter((i) => i !== null);
    const active = idx == 0 ? true : false;
    return (<ErrorBoundary key={module.morea_id}>
	        <MoreaModule key={module.morea_id} id={module.morea_id} module={module} items={items} active={active} options={options} />
	    </ErrorBoundary>);
  }

  renderModuleTitle(module, idx) {
    const idbase = module.morea_id;
    const id = idbase + "-tab",
          href = "#" + idbase;
    const className = idx == 0 ? "nav-link active" : "nav-link",
          aria_selected = idx == 0 ? true : false;
    return (
        <li key={id} className="nav-item">
        <h1 className={className} id={id} data-toggle="tab" href={href} role="tab" aria-controls={idbase} aria-selected={aria_selected}>
        {module.title}
      </h1>
      </li>
    );
  }
  
  render() {
    if (this.props.options.includes('tabs')) {
      return(
        <div>
          <ul className="nav nav-tabs" id="morea-module-tabs" role="tablist">
          {this.props.modules.map((module, idx) => this.renderModuleTitle(module, idx))}
        </ul>
          <div className="tab-content">  
          {this.props.modules.map((module,idx) => this.renderModule(module, idx, this.props.options))}
        </div>
          </div>
      );
    } else {
      return(
        this.props.modules.map(module => this.renderModule(module, 0, this.props.options))
      );
    }
  };
}
