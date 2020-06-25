import React, { useState, useEffect } from "react";
import useSWR from "swr";

import Badge from "react-bootstrap/Badge";
import { Link, useRouteMatch } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import { moduleFetcher, itemFetcher } from "../lib/efapi";

import ViewControl from "./admin/ViewControl";

const ItemStatus = ({isFetching, isLoaded, index, item, url, doLoad}) => {
    /*useEffect(() => {
	console.log('ItemStatus', isFetching, isLoaded, index, item);
    });*/
    
    const handleClick = () => {
	doLoad(item);
    };

    return (
	<li key={item.morea_id}>
	  <Badge variant={isLoaded ? "success" : "secondary"}>Loaded</Badge>
	  <Badge variant={isFetching ? "warning" : "secondary"}>Fetching</Badge>
	  <Badge pill variant="primary" onClick={handleClick}>{index}</Badge>
	  <Link to={`${url}/${item.morea_id}`}>{ item.title }</Link>
	</li>
    );
};

const ModuleListItem = ({title, morea_id, url}) => (
    <li>
        <Link to={`${url}/${morea_id}`}>{ title }</Link>
    </li>
);

function ModuleList() {
    //const [modules, setModules] = useState([]);  //TODO: it may turn out to make sense to move this to the parent App component
    const { user } = useAuth();
    const {data, error, isFetching, mutate} = useSWR(["all"], moduleFetcher);
    const [modules, setModules] = useState([]);
    const [view, setView] = useState("admin");

    useEffect(() => {
        if (data) {
            setModules(data.modules);
        }
    }, [data]);

    let { path, url } = useRouteMatch();
    console.log('ModuleList RouteMatch', path, url);
    
    if (error) console.log('moduleFetcher', error);
    if (error) return <div>Error loading module list</div>;
    if (isFetching) return <div>Fetching...</div>;

    const children = modules.map((container, idx) => (
        <ModuleListItem key={idx} {...container} url={url.replace(/\/+$/, "")} />
    ));
    
    return (
	    <div>
	    <ul>
	        { user && user.priv === 'admin' && <ViewControl view={view} setView={setView} /> }
            <div>
                { children }
            </div>
	    </ul>
		</div>
    );
}

export default ModuleList;
