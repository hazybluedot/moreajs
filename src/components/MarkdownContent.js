import React, { Component, useState, useEffect } from "react";

import efmd, {splitRender, render} from 'efmarkdown';
import postProcess from '../postProcess.js';

class MarkdownContent extends React.Component {
    
    componentDidMount() {
	this.handleUpdate = this.handleUpdate.bind(this);
	this.handleUpdate();
    }

    componentDidUpdate() {
	this.handleUpdate();
    }

    handleUpdate() {
	this.el.innerHTML = splitRender(this.props.content);
	
	//this.handleChange = this.handleChange.bind(this);
	//this.el.addEventListener('change', this.handleChange);
	postProcess(this.el, this.props.resources, this.props.env);
    }
    /*
  componentWillUnmount() {
    //this.el.removeEventListener('change', this.handleChange);
  }
  */
  /*
  handleChange(e) {
  }*/
  
    render() {
	return (
		<div className="module-content efmarkdown"
	    ref={el => this.el = el} />
	);
    }
}

export default MarkdownContent;
