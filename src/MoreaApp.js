import React, { useState, useEffect } from "react";

import { BrowserRouter as Router,
         Switch,
         Route,
         Link,
         useRouteMatch,
         useParams,
       } from "react-router-dom";

import { ProvideAuth } from "./hooks/use-auth.js";

import ModuleList from "./components/ModuleList";
import ModuleListManager from "./components/admin/ModuleListManager";

import MoreaModule from "./components/MoreaModule";

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
          <ProvideAuth>
          <div>
            <Switch>
              <Route path="/modules">
                <Modules/>
              </Route>
              <Route path="/">
                <h1>Default Route</h1>
              </Route>
            </Switch>
          </div>            
          </ProvideAuth>
        </DebugRouter>
    );
};

function Modules() {
    let { path, url } = useRouteMatch();
    return(
        <div>
          <Switch>
            <Route exact path={path}>
              {/*<ModuleList />*/}
              <ModuleListManager />
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
