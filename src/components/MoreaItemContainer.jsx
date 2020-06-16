import React, { useEffect, useState } from "react";
import useSWR from "swr";
import PropTypes from "prop-types";
//import { connect } from "react-redux";

import {fetcher, itemFetcher, putItem} from "../async";

//import { fetchItems, saveItem } from "../redux/actions";

import MoreaItem from "./MoreaItem.js";
import MoreaItemControls from "./MoreaItemControls.jsx";
import ErrorBoundary from "./ErrorBoundary";
import useDebounce from "../useDebounce";

const Messages = ({messages}) => {
    return (
	<div>
	  {messages.map((message,idx) => <Alert key={idx} variant={message.variant}>{message.message}</Alert>)}
	</div>
    );
};

function MoreaItemContainer({canEdit, ...item}) {
    console.group('MoreaItemContainer');
    const [localItem, setItem] = useState(item);
    const [isStable, setIsStable] = useState(true);
    const [state, setState] = useState("published");
    const {data, error, isValidating, mutate} = useSWR([item.morea_type, item.morea_id, state === "published" ? "published" : "working"], itemFetcher);
    console.log('item', item, 'state', state);

    const debouncedValue = localItem && localItem.content ? useDebounce(localItem, 1000) : null;
    
    useEffect(() => {
        setItem(data);
    }, [data]);

    
    useEffect(() => {
	if (debouncedValue && debouncedValue !== item.content) {
	    console.log('saving content to server', debouncedValue);
            /*
            putItem(debouncedValue).then(data => {
                mutate({...data, content: debouncedValue});
                console.log('success', data);
                setIsStable(true);
            });*/
	}   
    }, [debouncedValue]);
    
    const onChange = (item) => {
        console.log('setItem', item);
        setIsStable(false);
        setItem(item);
        //mutate(item);
        //mutate(item);
    };

    console.groupEnd();

    if (error) return <div>failed to load</div>;
    
    return (
	<div>
	  {/*<Messages messages={messages} />*/}
	  {/*if editable, then <MoreaItemControls />*/}
          <ErrorBoundary>
	    { canEdit && <MoreaItemControls view={state} visibility="Public" setState={setState} isLoading={!isStable} /> }
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
