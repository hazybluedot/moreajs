import React, { Component } from "react";
import efmd from 'efmarkdown';
import slugger from "slugger";
import ErrorBoundary from "./ErrorBoundary.js"
import SourceComment from "./SourceComment.js"
import MarkdownContent from "./MarkdownContent.js"

export default ({item, title, options}) => {
  let className = "morea-" + item.morea_type;
  const slug = slugger(className + " " + title);
  return (
	  <section className={className} id={slug}>
      <SourceComment text={item._source} />
	  <h1>{title}</h1>
      <ErrorBoundary key={slug}>
      <MarkdownContent content={item.content} />
      </ErrorBoundary>
      </section>
  );
};

//export default MoreaItem;
