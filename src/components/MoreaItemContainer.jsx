import React, { Component, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import useSWR from 'swr';
import {fetcher} from '../async';

import { fetchItems, saveItem } from "../redux/actions";

import MoreaItem from "./MoreaItem.js";
import MoreaItemControls from "./MoreaItemControls.jsx";

/*const MoreaItemContainer = ({isLoaded, isFetching, children, ...props}) => {

    useEffect(() => {
	console.log('MoreaItemContainer props', props);
	if (!isLoaded && !isFetching) {
	    props.fetchItem();
	}
    }, []);
    
    return (
	<MoreaItem {...props}>
	  {children}
	</MoreaItem>
    );
};

*/

const Messages = ({messages}) => {
    return (
	<div>
	  {messages.map((message,idx) => <Alert key={idx} variant={message.variant}>{message.message}</Alert>)}
	</div>
    );
};

const MoreaItemContainer = ({canEdit, ...item}) => {
    const [state, setState] = useState("published");
    const {publishedItem, publishedItemError} = useSWR(item, fetcher); // one call for both deploy and working data?
    const {workingItem, workingItemError} = useSWR({...item, working: true}, fetcher); // one call for both deploy and working data?
    const [messages, setMessages] = useState([]);
    
    const itemState = state === "published" ? publishedItem : workingItem;

    /*
    useEffect(() => {
	setItem(item);
	if (item.isWorkingCopy !== null && !item.isWorkingCopy) {
	    addMessage({key: 'working-copy', message: 'A newer draft of this item exists as a working copy', variant: 'warning'});
	}
    }, [item]);
    const addMessage = (message) => {
	setMessages([...messages.filter(m => m.key != message.key), message]);
    };
    */

    console.log('publishedItem', publishedItem, publishedItemError);
    return (
	<div>
	  <Messages messages={messages} />
	  {/*if editable, then <MoreaItemControls />*/}
	  { canEdit && <MoreaItemControls view={state} visibility="Public" setState={setState} /> }
	  {/*if state === published then <MoreaItem with published item />*/}
	  {/*if state === working then <MoreaItem with working item />*/}
	  {/*if state === edit then <MoreaItemEditor with working item />*/}
	  { publishedItem ? <MoreaItem item={publishedItem} isEditing={state === "edit" ? true : false} /> : 'loading...'}
	</div>
    );
};

/*
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchItem: () => ownProps.morea_id ? dispatch(fetchItems(ownProps)) : console.log('cannot fetch item with no id', ownProps),
    saveItem: (newItem) => ownProps.morea_id ? dispatch(saveItem(newItem)) : console.log('cannot save item with no id', ownProps) 
});

const mapStateToProps = (state, ownProps) => {
    let container = state.items.items.filter((item) => item.item.morea_id === ownProps.morea_id)[0];
    const props = {
	...container,
	resources: [],
	chilren: ownProps.children,
	env: {}
    };
    return props;
};
*/
export default MoreaItemContainer;

//export default connect(mapStateToProps, mapDispatchToProps)(MoreaItemContainer);
