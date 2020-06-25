import React, { Component, useEffect } from "react";
import PropTypes from "prop-types";

import MoreaItem from "./MoreaItem";

import slugger from "slugger";
import {Tabs, Tab} from 'react-bootstrap';
import { fetchItems } from "../redux/actions";

import useSWR from "swr";

import MoreaItemContainer from "./MoreaItemContainer";

const renderTabs = (items, resources, env) => (
	<Tabs defaultActiveKey={items[0].morea_id} id="some-tab-example">
	{items.map((item) => (<Tab key={item.morea_id} eventKey={item.morea_id} title={item.title}><MoreaItem title={item.title} item={item} resources={resources} env={env} classNames={[]} /></Tab>))}
    </Tabs>
);

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

const MoreaModule = ({morea_id}) => {
    return (
	    <MoreaItemContainer canEdit={true} morea_id={morea_id} morea_type="module" />
    );
};

export default MoreaModule;
