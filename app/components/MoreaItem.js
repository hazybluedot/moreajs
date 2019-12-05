import React, { Component } from "react";
import mdrender from "../markdown-it-render.js"
import slugger from "slugger";
import ErrorBoundary from "./ErrorBoundary.js"

module.exports = class MoreaItem extends Component {
    render() {
	let className = "morea-" + this.props.item.morea_type;
	let content = mdrender.renderString(this.props.item.content);
	const slug = slugger(className + " " + this.props.title);
	return (
	    <section className={className} id={slug}>
	    <h1>{this.props.title}</h1>
        <ErrorBoundary key={slug}>
	    <div className="content" dangerouslySetInnerHTML={{__html:content}} />
        </ErrorBoundary>
      </section>
	);
    };
};
