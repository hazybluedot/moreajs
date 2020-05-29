import React, { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import { connect } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { fetchItems } from "../redux/actions";

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

function ModuleList({ modules, doLoad }) {
    //const [modules, setModules] = useState([]);  //TODO: it may turn out to make sense to move this to the parent App component
    let { path, url } = useRouteMatch();
    console.log('ModuleList RouteMatch', path, url);
    
    const children = modules ? modules.map((container, i) => (
	<ItemStatus key={i} {...container} doLoad={doLoad} url={url.replace(/\/+$/, "")} />
    )) : [];
    
    return (
	    <div>
	    <h1>The App</h1>
	    <ul>
	    { children }
	</ul>
		</div>
    );
}

const mapStateToProps = (state) => {
    return {
	modules: state.items.items.filter(item => item.item.morea_type === 'module')
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
	doLoad: (item) => dispatch(fetchItems(item))	
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModuleList);
