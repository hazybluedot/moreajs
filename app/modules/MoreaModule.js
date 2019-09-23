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
    
    render() {
	let content = mdrender.renderString(this.props.module.content);
	
	return (
	    <section className="morea-module">
	    <h1>{this.props.module.title}</h1>
	    <div className="content">
	    { content ? <div className="module-content" dangerouslySetInnerHTML={{__html:content}} /> : null }
	    {this.props.items.map((item) => this.renderItem(item))}
	    </div>
	    </section>
	);
    }
}
