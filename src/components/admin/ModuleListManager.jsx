import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useSWR from "swr";
import logProps from "./logProps";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useAuth } from "../../hooks/use-auth";
import { moduleFetcher, itemFetcher, itemKey } from "../../lib/efapi";

import ItemLibrary from "./ItemLibrary";
import ModuleList from "./ModuleList";

const moreaTypes = [ { type: "module", title: "Modules", children_key: null},
                     { type: "outcome", title: "Outcomes", children_key: "morea_outcomes"}, 
                     { type: "reading", title: "Readings", children_key: "morea_readings"},
                     { type: "experience", title: "Experiences", children_key: "morea_experience"},
                     { type: "assessment", title: "Assessments", children_key: "morea_assessments"}];

const emptyLibrary = Object.keys(moreaTypes).reduce((acc, cur) => (
    {...acc, [moreaTypes[cur]]: {}}
    ), {});

const cleanKey = (type, id) => {
    const re = new RegExp('^' + type + '-');
    return type + '-' + id.replace(re, "");
};

function denormalizeModule(library, moduleId) {
    let module = library[moduleId];
    /*
    const childIds = moreaTypes
        .filter(mt => mt.children_key)
        .reduce((acc, mt) => {
            //console.log('concatinating key', key, module[key])
            //acc.concat(module[key]);
            const keys = module[mt.children_key] ? module[mt.children_key].map(childId => cleanKey(mt.type, childId)) : [];
            return [...acc, ...keys];
        }, []);*/
    module.children = module.components.map((key) => library[key]).filter(item => item);
    return module;
}

export default () => {
    const { user } = useAuth();
    const [showAddDialog, setShow] = useState(false);
    const { data: libraryItems, error: libraryError } = useSWR(user ? true : null, itemFetcher);
    const { data, error, isFetching, mutate } = useSWR(user ? ["all"] : null, moduleFetcher);
    const [moduleIds, setModules] = useState([]);
    const [itemsById, setLibrary] = useState(null);
    const [availableItems, setAvailableItems] = useState([]);

    useEffect(() => {
        if (data) {
            setModules(data.modules.map(module => 'module-' + module.id));
        }
    }, [data]);

    useEffect(() => {
        if (libraryItems) {
            const library = libraryItems.reduce((acc, item) => {
                acc[itemKey(item)] = item;
                return acc;
            }, {});
            setLibrary(library);    
        }
    }, [libraryItems]);

    useEffect(() => {
        /*if (availableItems.modules.length === 0 && itemsById && moduleIds.length > 0) {*/
        if (libraryItems && moduleIds) {
            setAvailableItems(libraryItems
                                    .filter(item => !moduleIds.includes('module-' + item.morea_id))
                                    .map(item => item.morea_type + '-' + item.morea_id));
        }
        //look for any duplicate ids in modules
    }, [libraryItems, moduleIds]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        console.log('onDragEnd', result);
        if (!destination) {
            return;
        }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            //Item was dropped in original location, no need to do anything
            return;
        };

        if (destination.droppableId === source.droppableId) {
            console.log('reordering', moduleIds[source.index], `from ${source.index} to ${destination.index}`);
            if (source.droppableId === "module-list") {
                const remainingModules = [...moduleIds.slice(0, source.index), ...moduleIds.slice(source.index + 1)]; //modules.filter((item, index) => index != source.index);
                const newModules = [...remainingModules.slice(0, destination.index), moduleIds[source.index], ...remainingModules.slice(destination.index)];
                setModules(newModules);    
            } else {
                // we are reordering items within a module
                const moduleId = source.droppableId;
                const module = itemsById[moduleId];
                console.log('reordering items in module', module);
            }
        } else {
            /*
            const item = availableItems.map(itemId => itemsById[itemId]).filter(item => item.morea_type === "module")[source.index];
            console.log(`inserting new module at position ${destination.index}`, item.morea_id);
            setModules([...moduleIds.slice(0, destination.index), 'module-' + item.morea_id, ...moduleIds.slice(destination.index)]);
            //remove from available modules
            setAvailableItems(availableItems.filter(id => id !== 'module-' + item.morea_id));
            //setAvailableItems([...availableItems.slice(0, source.index), ...availableItems.slice(source.index + 1)])
            */
        }

    };

    const handleClose = (item) => {
        console.log('adding item', item);
        setShow(false);
    };

    const AddItemDialog = (props) => (
        <Modal {...props}
            size="lg" centered>
            <Modal.Header closeButton>
                Add Item
            </Modal.Header>
            <Modal.Body>
                <ItemLibrary items={props.items} types={moreaTypes} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Cancel</Button>
                <Button onClick={props.onHide}>Add</Button>
            </Modal.Footer>
        </Modal>
    );

    //const _ModuleList = logProps(ModuleList);
    return (
        <div>
            <Button onClick={() => setShow(true)}>Add Module</Button>
            <DragDropContext onDragEnd={onDragEnd}>
                <ModuleList modules={moduleIds.map(id => denormalizeModule(itemsById, id))} />
            </DragDropContext>
            <AddItemDialog show={showAddDialog} items={libraryItems || []} onHide={handleClose} />
        </div>
    );
};