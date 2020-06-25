import React from "react";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DraggableItem from "../DraggableItem";
import icons from "../../lib/icons";
import ListGroup from "react-bootstrap/ListGroup";
import { itemKey } from "../../lib/efapi";

const Handle = styled.span`
    padding: 4px;
`;

const Controls = styled.span`
    padding: 4px;
`;

const ModuleItem = ({index, ...item}) => (
    <Draggable draggableId={itemKey(item)} index={index}> 
        {(provided) => (
            <ListGroup.Item
                {...provided.draggableProps}
                ref={provided.innerRef}>
                <Handle {...provided.dragHandleProps}>
                    <icons.Grip />
                </Handle>
                ({item.morea_type}) {item.title}
            </ListGroup.Item>
        )
        }
    </Draggable>
);

const Module = ({morea_id, title, index, children}) => (
    <DraggableItem id={morea_id} index={index} style="padding-bottom: 10px;">
            {title}
            <Controls>
                <icons.Add />
                <icons.Options />
            </Controls>
            <Droppable droppableId={`module-${morea_id}`} type="MODULE_ITEM">
                {(provided, snapshot) =>(
                    <ListGroup  ref={provided.innerRef}
                    {...provided.droppableProps}>
                        {children && children.map((item, index) => <ModuleItem key={itemKey(item)} index={index} {...item} />)}
                        {provided.placeholder}
                    </ListGroup>
                )}                
            </Droppable>
    </DraggableItem>
);

export default Module;