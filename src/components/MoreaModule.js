import React, { Component } from "react";
import ReactDOM from 'react-dom';
import MoreaItem from "./MoreaItem.js";
import SourceComment from "./SourceComment.js"
import MarkdownContent from "./MarkdownContent.js"

import slugger from "slugger";
import {Tabs, Tab} from 'react-bootstrap';

const renderTabs = (items, resources, env) => (
	<Tabs defaultActiveKey={items[0].morea_id} id="some-tab-example">
	{items.map((item) => (<Tab key={item.morea_id} eventKey={item.morea_id} title={item.title}><MoreaItem title={item.title} item={item} resources={resources} env={env} classNames={[]} /></Tab>))}
    </Tabs>
);

export class MoreaModule extends Component {  
    render() {
	const props = this.props,
              renderModule = this.renderModule,
              renderTabContent = this.renderTabContent;
        
	const options = props.options,
              content = props.module.content,
	      resources = props.resources,
	      env = props.env;
	
	const children = props.items
	      .map((item, index) => <MoreaItem key={item.morea_id} title={item.title} item={item} options={options} resources={resources} env={env} />);
	
	return (
		<section className="morea-module">
		<SourceComment text={props.module._source} />
		{!props.options.includes('notitle') && <h1>{props.module.title}</h1>}
	    { content ? <MarkdownContent content={content} resources={resources} env={env} /> : null }
            {props.options.includes('module-tabs') && props.items ? renderTabs(props.items, resources, env) : children} 
            </section>
	);
    }
}

export default MoreaModule;
