import React, { Component, useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import efmd, {splitRender, render} from 'efmarkdown';
import slugger from "slugger";
import PropTypes from "prop-types";
import ErrorBoundary from "./ErrorBoundary";
import SourceComment from "./SourceComment";
import MarkdownContent from "./MarkdownContent";
import MarkdownContentEditor from "./admin/MarkdownContentEditor.jsx";

//TODO: consider whether this is the only place we need state information about isFetching, pending, etc. if it is,
// we could us the useAsync hook from usehooks.com for local state and simplify the redux store

const MoreaItem = ({item, options, resources, env, children, isEditing, onChange}) => {

    const saveContent = (newContent) => {
		const newState = {...item, content: newContent};
		//setItem(newState);
		onChange(newState);
    };
    
    let className = "morea-" + item.morea_type;
    const slug = slugger(className + " " + item.title); 
    const content = item.content ? (isEditing ? <MarkdownContentEditor
				                  content={item.content}
				                  saveContent={saveContent} />:
				    <MarkdownContent
				    content={item.content}
				    resources={resources} env={env}
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

