import React, { Component, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MoreaItem from "./MoreaItem.js";

import slugger from "slugger";
import {Tabs, Tab} from 'react-bootstrap';
import store from "../redux/store";
import { fetchItems } from "../redux/actions";

import MoreaItemContainer from "./MoreaItemContainer.jsx";

const renderTabs = (items, resources, env) => (
	<Tabs defaultActiveKey={items[0].morea_id} id="some-tab-example">
	{items.map((item) => (<Tab key={item.morea_id} eventKey={item.morea_id} title={item.title}><MoreaItem title={item.title} item={item} resources={resources} env={env} classNames={[]} /></Tab>))}
    </Tabs>
);

const MoreaItemsContainer = ({items, item, children, isFetching, fetchItems}) => {

    useEffect(() => {
	if (items.length == 0 && !isFetching) {
	    fetchItems();
	}
      }, []);
    
    if  (items.length > 0 && item) {
	return (
	    <MoreaItemContainer {...item}>
	      {children}
	    </MoreaItemContainer>
	);
    } else {
	return (<div>Loading Items</div>);
    }
};

const createChildItems = (container, state) => {
    if (container === undefined) {
	return [];
    }
    const item = container.item;
    const child_ids = ['morea_outcomes', 'morea_readings', 'morea_experiences', 'morea_assessments'].reduce((acc, cur) => {
	const children = item[cur] ? item[cur] : []; 
	acc = [...acc, ...children];
	return acc;
    }, []);
    const children = state.items.items.filter(item => child_ids.includes(item.item.morea_id));
    console.log(`children of ${container.item.morea_id}`, children);
    return children.map(child => <MoreaItemContainer {...child.item}/>);
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchItems: () => dispatch(fetchItems())
});

const mapStateToProps = (state, ownProps) => {
    //console.group('MoreaModule mapStateToProps');
    //console.info(state, ownProps);
    let container = state.items.items.filter((item) => item.item.morea_id === ownProps.morea_id)[0];
    //console.log('container', container);
    //console.groupEnd();
    return { //items: state.items.items,
	...state.items,
	items: state.items.items,
	item: container ? container.item : null,
	children: createChildItems(container, state)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreaItemsContainer);
