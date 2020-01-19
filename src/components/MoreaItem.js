import React, { Component } from "react";
import efmd from 'efmarkdown';
import slugger from "slugger";
import ErrorBoundary from "./ErrorBoundary.js"

export default ({item, title, options}) => {
  let className = "morea-" + item.morea_type;
  //classNames.push(className);
  let content = efmd.render(item.content);
  const slug = slugger(className + " " + title);
  return (
	  <section className={className} id={slug}>
	  <h1>{title}</h1>
      <ErrorBoundary key={slug}>
	  <div className="content" dangerouslySetInnerHTML={{__html:content}} />
      </ErrorBoundary>
      </section>
  );
};

//export default MoreaItem;
