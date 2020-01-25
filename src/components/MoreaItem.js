import React, { Component } from "react";
import efmd from 'efmarkdown';
import slugger from "slugger";
import ErrorBoundary from "./ErrorBoundary.js"
import SourceComment from "./SourceComment.js"

const renderContent = (content) => (
    <>
    {content.map((section, index) => (<section key={index} dangerouslySetInnerHTML={{__html:section}} />))}
  </>
)

export default ({item, title, options}) => {
  let className = "morea-" + item.morea_type;
  //classNames.push(className);
  let splitContent = item.content.split('<!-- :break section -->');
  let content = splitContent.map((str, idx) => efmd.render(str));
  //let content = efmd.render(item.content);
  const slug = slugger(className + " " + title);
  return (
	  <section className={className} id={slug}>
      <SourceComment text={item._source} />
	  <h1>{title}</h1>
      <ErrorBoundary key={slug}>
	  {renderContent(content) /*<div className="content" dangerouslySetInnerHTML={{__html:content}} />*/}
      </ErrorBoundary>
      </section>
  );
};

//export default MoreaItem;
