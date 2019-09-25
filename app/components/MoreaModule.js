import React, { Component } from "react";
import MoreaItem from "./MoreaItem.js";
import mdrender from "../markdown-it-render.js"

module.exports = class Module extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items
    };
  }
  
  renderItem(item) {
    return <MoreaItem key={item.morea_id} title={item.title} item={item} />;
  }
  
  renderUnrolled(props, content, children) {
    return (
      <div className="module-content">
	<section className="morea-module">
	<h1>{props.module.title}</h1>
        <div className="content">
	{ content ? <div className="module-content" dangerouslySetInnerHTML={{__html:content}} /> : null }
      </div>
        {children}
      </section>
      </div>
    );
  }

  renderModule(props, content, children) {
    return (
        <section className="morea-module">
	<h1>{props.module.title}</h1>
        <div className="content">
	{ content ? <div className="module-content" dangerouslySetInnerHTML={{__html:content}} /> : null }
      {children}
      </div>
        </section>
    );
  }
  
  render() {
    let content = mdrender.renderString(this.props.module.content);
    let children = this.props.items.map((item) => this.renderItem(item));

    const renderUnrolled = this.renderUnrolled,
          renderModule = this.renderModule;

    return this.props.options.includes('unroll') ? renderUnrolled(this.props, content, children) : renderModule(this.props, content, children);
  }
}
