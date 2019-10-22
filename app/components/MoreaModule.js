import React, { Component } from "react";
import MoreaItem from "./MoreaItem.js";
import mdrender from "../markdown-it-render.js"
import slugger from "slugger";
//import ReactMarkdown from 'react-markdown'

const renderContent = (content) => (
    <div className="module-content">
    {content.map((section, index) => (<section key={index} dangerouslySetInnerHTML={{__html:section}} />))}
  </div>
)

/*
const renderContent = (content) => (
    <div className="module-content">
    {content.map((section, index) => (<section key={index}>
                                      <ReactMarkdown source={section} escapeHtml={false} />
                                     </section>))}
  </div>
)*/

const renderItem = (item) => (
    <MoreaItem key={item.morea_id} title={item.title} item={item} />
)

module.exports = class Module extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items
    };
  }
    
  renderUnrolled(props, content, children) {
      const slug = "module-" + slugger(props.module.title);
      return (
      <div className="module-content">
	    <section className="morea-module" id={slug}>
	<h1>{props.module.title}</h1>
        <div className="content">
	  { content ? renderContent(content) : null }
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
	{ content ? renderContent(content) : null }
      {children}
      </div>
        </section>
    );
  }
  
  render() {
    let splitContent = this.props.module.content.split('<!-- :break section -->');
    let content = splitContent.map((str, idx) => mdrender.renderString(str));
    let children = this.props.items.map((item, index) => renderItem(item));
    const renderUnrolled = this.renderUnrolled,
          renderModule = this.renderModule;

    return this.props.options.includes('unroll') ? renderUnrolled(this.props, content, children) : renderModule(this.props, content, children);
  }
}
