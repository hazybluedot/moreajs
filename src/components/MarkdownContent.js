import React, { Component, useState, useEffect } from "react";
import ReactMde from "react-mde";

import efmd, {splitRender, render} from 'efmarkdown';
import postProcess from '../postProcess.js';

const MarkdownContentEditor = ({content}) => {
    const [value, setValue] = useState(content);
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("preview");

    useEffect((e) => {
	console.log('valude change', e, value);
    }, [value]);
    
    return (
	<ReactMde value={content}
		  onChange={setValue}
		  selectedTab={selectedTab}
		  onTabChange={setSelectedTab}
		  generateMarkdownPreview={markdown =>
					   Promise.resolve(splitRender(markdown))
					   }
					   />
    );
};

class MarkdownContent extends React.Component {
    componentDidMount() {
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
	if (this.props.editing) {
	    return <div>Editor placeholder</div>;
	} else {
	    return (
		<div className="module-content efmarkdown"
		     ref={el => this.el = el} />
	    );
	}
    }
}

export default MarkdownContent;
