import React from "react";
import PropTypes from "prop-types";

import Tabs from "react-boost/Tabs";
import Tab from "react-boost/Tab";

import MoreaModule from "./MoreaModule";

function Session({title, modules, isEditing}) {
    return (<div>
        <h1>{title}</h1>
        <Tabs>
            <Tab eventKey="start" title="Start">
                <p>Getting started...</p>
                <div>List of what is due before starting</div>
            </Tab>
            { modules.map( (module, idx) => 
                <Tab eventKey={module.morea_id} title={module.title}>
                    <MoreaModule key={idx} {...module} />
                </Tab>
            )}
            <Tab eventKey="summary" title="Summary">
                <p>Summary of the key points.  
                    This could be a list of collected "highlights" associated with each module.</p>
            </Tab>
        </Tabs>
    </div>);
}

List.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    modules: PropTypes.array.isRequired
}

export default Session;