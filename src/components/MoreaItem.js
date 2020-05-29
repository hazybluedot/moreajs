import React, { Component, useState, useEffect } from "react";
import { debounce } from "throttle-debounce";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import efmd, {splitRender, render} from 'efmarkdown';
import slugger from "slugger";
import PropTypes from "prop-types";
import ErrorBoundary from "./ErrorBoundary";
import SourceComment from "./SourceComment";
import MarkdownContent from "./MarkdownContent";

const Messages = ({messages}) => {
    return (
	<div>
	  {messages.map((message,idx) => <Alert key={idx} variant={message.variant}>{message.message}</Alert>)}
	</div>
    );
};

//TODO: consider whether this is the only place we need state information about isFetching, pending, etc. if it is,
// we could us the useAsync hook from usehooks.com for local state and simplify the redux store

const MarkdownContentEditor = ({content, saveContent}) => {
    const [value, setValue] = useState(content);
    const [selectedTab, setSelectedTab] = useState("write");

    const debouncedValue = useDebounce(value, 1000);

    useEffect(() => {
	if (debouncedValue !== content) {
	    //console.log('saving content to server', debouncedValue);
	    saveContent(debouncedValue);
	}   
    }, [debouncedValue]);
    
    useEffect(() => {
	if (content !== value) {
	    setValue(content);
	}
    }, [content]);
    
    return (
	<ReactMde value={value}
		  onChange={setValue}
		  selectedTab={selectedTab}
		  onTabChange={setSelectedTab}
		  generateMarkdownPreview={markdown =>
					   Promise.resolve(splitRender(markdown))
					   }
					   />
    );
};

const MoreaItem = ({item, options, resources, env, children, saveItem}) => {
    const [messages, setMessages] = useState([]);
    const [itemState, setItem] = useState(item);
    const [editing, setEditing] = useState(false);
    const [actionText, setAction] = useState("Edit");

    const addMessage = (message) => {
	setMessages([...messages.filter(m => m.key != message.key), message]);
    };
    
    useEffect(() => {
	setItem(item);
	if (item.isWorkingCopy !== null && !item.isWorkingCopy) {
	    addMessage({key: 'working-copy', message: 'A newer draft of this item exists as a working copy', variant: 'warning'});
	}
    }, [item]);
        
    const updateContent = (content) => {
	const newState = {...itemState, content: content};
	setItem(newState);
	saveItem(newState);
    };
    
    let className = "morea-" + item.morea_type;
    const slug = slugger(className + " " + item.title); 
    const content = itemState.content ? (editing ? <MarkdownContentEditor
					 content={itemState.content}
					 saveContent={updateContent} /> :
					 <MarkdownContent
					 content={itemState.content}
					 resources={resources} env={env}
					 editing={editing}
					 />) : "";

    const toggleEditing = () => {
	if (editing) {
	    setEditing(false);
	    setAction("Edit");
	} else {
	    setEditing(true);
	    setAction("Save");
	}
    };
    
    return (
	<section className={className} id={slug}>
	  <Messages messages={messages} />
	  <Button onClick={toggleEditing}>{actionText}</Button>
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

// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(

    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.

      return () => {
        clearTimeout(handler);
      };
    },

    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
