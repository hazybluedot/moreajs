import React, { Component, useState } from "react";
import MoreaModule from "./MoreaModule.js"
import ErrorBoundary from "./ErrorBoundary.js"
import {Tabs, Tab} from 'react-bootstrap';

function renderModule(module, idx, options, resources, env) {    
    let ordered_ids = ['outcomes', 'readings', 'experiences', 'assessments'].reduce((ids, type) => {
      let key = 'morea_' + type
      if (key in module ) {
	ids = ids.concat(module[key]);
      }
      return ids;
    }, []);

    let items = ordered_ids.map((id) => {
      let item = module.items.filter( i => i.morea_id == id );
      return (item.length > 0) ? item[0] : null;
    }).filter((i) => i !== null);
    
    const active = idx == 0 ? true : false;
    return (<ErrorBoundary key={module.morea_id}>
	    <MoreaModule key={module.morea_id} id={module.morea_id} module={module} items={items} active={active} options={options} resources={resources} env={env} />
	    </ErrorBoundary>);
}

const MoreaSequence = ({modules, options, location, env, resources}) => {
  const state = location.hash ? location.hash.replace("#", "") : modules[0].morea_id;
  const [key, setKey] = useState(state);
  if (options.includes('tabs')) {
    return (
        <Tabs onSelect={key => {
          history.pushState({}, '', '#' + key);
          setKey(key);
        }} activeKey={key}>
        {modules.map((module,idx) => <Tab key={module.morea_id}
                     eventKey={module.morea_id}
                     title={module.title}>{renderModule(module, idx, ['notitle'], resources, env)}</Tab>
                    )}
      </Tabs>
    );
  } else {
      return(
          modules.map(module => renderModule(module, 0, options, resources, env))
      );
  }
};

export default MoreaSequence;
