import React, { Component } from "react";
import ReactDOM from 'react-dom';
import MoreaItem from "./MoreaItem.js";
import SourceComment from "./SourceComment.js"
import MarkdownContent from "./MarkdownContent.js"

import slugger from "slugger";
import {Tabs, Tab} from 'react-bootstrap';

const renderTabs = (items) => (
  <Tabs defaultActiveKey={items[0].morea_id} id="some-tab-example">
    {items.map((item) => (<Tab key={item.morea_id} eventKey={item.morea_id} title={item.title}><MoreaItem title={item.title} item={item} classNames={[]} /></Tab>))}
  </Tabs>
);

export class MoreaModule extends Component {  
  render() {
    const props = this.props,
          renderModule = this.renderModule,
          renderTabContent = this.renderTabContent;
          
    let options = props.options,
        content = props.module.content,
        children = props.items
	    .map((item, index) => <MoreaItem key={item.morea_id} title={item.title} item={item} options={options} />);
    
    return (
        <section className="morea-module">
        <SourceComment text={props.module._source} />
	    {!props.options.includes('notitle') && <h1>{props.module.title}</h1>}
	    { content ? <MarkdownContent content={content} /> : null }
        {props.options.includes('module-tabs') && props.items ? renderTabs(props.items) : children} 
        </section>
    );
  }
}

export default MoreaModule;
