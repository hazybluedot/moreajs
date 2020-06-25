import React, { useEffect, useState } from "react";
import useSWR from "swr";
import PropTypes from "prop-types";
//import { connect } from "react-redux";

import {itemFetcher, putItem} from "../lib/efapi";

//import { fetchItems, saveItem } from "../redux/actions";

import MoreaItem from "./MoreaItem";
import MoreaItemControls from "./admin/MoreaItemControls";
import ErrorBoundary from "./ErrorBoundary";

const Messages = ({messages}) => {
    return (
	<div>
	  {messages.map((message,idx) => <Alert key={idx} variant={message.variant}>{message.message}</Alert>)}
	</div>
    );
};

function isEqual(item1, item2) {
    const keys1 = Object.keys(item1),
          keys2 = Object.keys(item2);

    if (keys1 !== keys2) return false;

    keys1.forEach(key => {
        if (item1[key] !== item2[key]) return false;
    });

    return true;
}

function MoreaItemContainer({canEdit, ...item}) {
    console.group('MoreaItemContainer');
    const [isStale, setIsStale] = useState(true);
    const [state, setState] = useState("published");
    const [localItem, setItem] = useState(item);
    const {data, error, isValidating, mutate} = useSWR([item.morea_type, item.morea_id, state === "published" ? "published" : "working"], itemFetcher);
    console.log('item', localItem, 'state', state);
    
    console.groupEnd();
    
    useEffect(() => {
        if (data && data.content && !isEqual(data, localItem)) {
            setItem(data);
        }
    }, [data])

    const onChange = (newItem) => {
        if (newItem && newItem.content) {
            setItem(newItem);
            console.log('storing item to server', newItem);
            putItem(newItem);
            mutate(newItem);
        }
    };

    //const debouncedContent = localItem && localItem.content ? useDebounce(localItem.content, 1000) : null;

    /*useEffect(() => {
        if (debouncedContent) {
            console.log('Content debounded');
        }
    }, [debouncedContent]);*/

    if (error) console.log('SWR error', error);
    if (error) return <div>failed to load</div>;
    
    return (
	<div>
	  {/*<Messages messages={messages} />*/}
	  {/*if editable, then <MoreaItemControls />*/}
          <ErrorBoundary>
	    { canEdit && <MoreaItemControls view={state} visibility="Public" setState={setState} isStale={isStale} /> }
          </ErrorBoundary>
	  {/*if state === published then <MoreaItem with published item />*/}
	  {/*if state === working then <MoreaItem with working item />*/}
	  {/*if state === edit then <MoreaItemEditor with working item />*/}
	  {/*<MoreaItem item={publishedItem} isEditing={state === "edit" ? true : false} />*/}
          <ErrorBoundary>
            { localItem ? <MoreaItem item={localItem} resources={[]} env={{}} isEditing={state === "edit"} onChange={onChange} /> : <div>loading...</div> }
          </ErrorBoundary>
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
