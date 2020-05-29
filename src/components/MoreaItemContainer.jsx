import React, { Component, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { fetchItems, saveItem } from "../redux/actions";

import MoreaItem from "./MoreaItem.js";

const MoreaItemContainer = ({isLoaded, isFetching, children, ...props}) => {

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

export default connect(mapStateToProps, mapDispatchToProps)(MoreaItemContainer);
