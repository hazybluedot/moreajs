import React, { Component, useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import efmd, {splitRender, render} from 'efmarkdown';
import slugger from "slugger";
import PropTypes from "prop-types";
import ErrorBoundary from "./ErrorBoundary";
import SourceComment from "./SourceComment";
import MarkdownContent from "./MarkdownContent";

//TODO: consider whether this is the only place we need state information about isFetching, pending, etc. if it is,
// we could us the useAsync hook from usehooks.com for local state and simplify the redux store

const MoreaItem = ({item, options, resources, env, children, isEditing, saveItem}) => {
    const [itemState, setItem] = useState(item);
            
    const updateContent = (content) => {
	const newState = {...itemState, content: content};
	setItem(newState);
	saveItem(newState);
    };
    
    let className = "morea-" + item.morea_type;
    const slug = slugger(className + " " + item.title); 
    const content = itemState.content ? (isEditing ? <MarkdownContentEditor
					 content={itemState.content}
					 saveContent={updateContent} /> :
					 <MarkdownContent
					 content={itemState.content}
					 resources={resources} env={env}
					 editing={editing}
					 />) : "";
    
    return (
	<section className={className} id={slug}>
	  <SourceComment text={item._source} />
	  <h1>{item.title}</h1>
	  <ErrorBoundary key={slug}>
	    {content}
	  </ErrorBoundary>
	  {children}
	</section>
    );
};

MoreaItem.propTypes = {
    item: PropTypes.shape({
	morea_id: PropTypes.string.isRequired,
	morea_type: PropTypes.string.isRequired,
	title: PropTypes.string,
	content: PropTypes.string,
	_source: PropTypes.string,
    }).isRequired,
    env: PropTypes.object.isRequired,
    children: PropTypes.array,

};

export default MoreaItem;

