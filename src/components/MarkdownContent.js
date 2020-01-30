import React, { Component } from "react";
import efmd, {splitRender} from 'efmarkdown';
import postProcess from '../postProcess.js';

class MarkdownContent extends React.Component {
  componentDidMount() {
    this.el.innerHTML = splitRender(this.el.innerHTML);
    //console.log('postProcess', postProcess, el);

    //this.handleChange = this.handleChange.bind(this);
    //this.el.addEventListener('change', this.handleChange);
    postProcess(this.el);

  }

  componentWillUnmount() {
    //this.el.removeEventListener('change', this.handleChange);
  }

  /*
  handleChange(e) {
  }*/
  
  render() {
    return (
        <div className="module-content efmarkdown" ref={el => this.el = el} dangerouslySetInnerHTML={{__html:this.props.content}} />
    );
  }
}

export default MarkdownContent;
