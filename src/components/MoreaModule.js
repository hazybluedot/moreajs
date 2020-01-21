import React, { Component } from "react";
import MoreaItem from "./MoreaItem.js";
import efmd from 'efmarkdown';
import slugger from "slugger";
import {Tabs, Tab} from 'react-bootstrap';
//import ReactMarkdown from 'react-markdown'

const renderContent = (content) => (
    <div className="module-content">
    {content.map((section, index) => (<section key={index} dangerouslySetInnerHTML={{__html:section}} />))}
  </div>
)

const renderItem = (item, options) => {
  const classNames = options.includes('tabs') ? ['tab-pane', 'fade', 'show'] : [];
  return (
      <MoreaItem key={item.morea_id} title={item.title} item={item} options={options} />
  );
};

const renderTabs = (items) => (
  <Tabs defaultActiveKey={items[0].morea_id} id="some-tab-example">
    {items.map((item) => (<Tab key={item.morea_id} eventKey={item.morea_id} title={item.title}><MoreaItem title={item.title} item={item} classNames={[]} /></Tab>))}
  </Tabs>
);

export class MoreaModule extends Component {
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
	    {!props.options.includes('notitle') && <h1>{props.module.title}</h1>}
	    { content ? renderContent(content) : null }
        {props.options.includes('module-tabs') && props.items ? renderTabs(props.items) : children} 
        </section>
    );
  }
  
  render() {
    const renderUnrolled = this.renderUnrolled,
          renderModule = this.renderModule,
          renderTabContent = this.renderTabContent,
          options = this.props.options;
    let splitContent = this.props.module.content.split('<!-- :break section -->');
    let content = splitContent.map((str, idx) => efmd.render(str));
      let children = this.props.items
	  .map((item, index) => renderItem(item, options));

    return options.includes('unroll') ? renderUnrolled(this.props, content, children) : renderModule(this.props, content, children);
  }
}

export default MoreaModule;
