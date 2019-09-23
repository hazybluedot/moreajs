import React, { Component } from "react";
import mdrender from "../markdown-it-render.js"

module.exports = class MoreaItem extends Component {
    render() {
	let className = "morea-" + this.props.item.morea_type;
	let content = mdrender.renderString(this.props.item.content);
	return (
	    <section className={className}>
	    <h1>{this.props.title}</h1>
	    <div className="content" dangerouslySetInnerHTML={{__html:content}} />
	    </section>
	);
    };
};
