import React, { useState, useEffect } from "react";

import { BrowserRouter as Router,
	 Switch,
	 Route,
	 Link,
	 useRouteMatch,
	 useParams,
       } from "react-router-dom";

import { Provider } from 'react-redux';

import ModuleList from "./components/ModuleList";
import MoreaModule from "./components/MoreaModule";

import libraryStore from "./redux/store";

class DebugRouter extends Router {
    constructor(props){
	super(props);
	console.log('initial history is: ', JSON.stringify(this.history, null,2));
	this.history.listen((location, action)=>{
	    console.log(
		`The current URL is ${location.pathname}${location.search}${location.hash}`
	    );
	    console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
	});
    }
}

export default function MoreaApp(props) {
    console.log('props', props);
    return (
	<DebugRouter basename="/ef105-2020-08/app">
	  <div>
	    <Switch>
	      <Route>
		<Route path="/modules">
		  <Provider store={libraryStore}>
		    <Modules/>
		  </Provider>
		</Route>
		<Route path="/">
		  <h1>Default Route</h1>
		</Route>
	      </Route>
	    </Switch>
	  </div>
	</DebugRouter>
    );
};

function Modules() {
    let { path, url } = useRouteMatch();
    return(
	<div>
	  <Switch>
	    <Route exact path={path}>
	      <ModuleList />
	    </Route>
	    <Route path={`${path}/:moduleId`}>
	      <Link to={url}>Module List</Link>
	      <Module />
	    </Route>
	  </Switch>
	</div>
    );
};

function Module() {
    let { moduleId } = useParams();
    console.log('moduleId', moduleId);
    return (
	<MoreaModule morea_id={ moduleId } morea_type='module' />
    );
};

function itemsToModule(items) {
    const [module, ...children] = items;
    console.log('itemsToModule', items);
    return Object.assign(module, {items: children});
};