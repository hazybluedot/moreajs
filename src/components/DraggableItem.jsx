import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

import icons from "../lib/icons";

const Container = styled.div`
    width: 50rem;
    border: 2px solid grey;
    padding: 8px;
    background-color: white;
`;

const Handle = styled.span`
    padding: 4px;
`;

const Controls = styled.span`
    padding: 4px;
`;

const DraggableItem = ({ id, index, children }) => (
    <Draggable draggableId={id} index={index}>
        {(provided) => (
            <Container
                {...provided.draggableProps}
                ref={provided.innerRef}
            ><Handle {...provided.dragHandleProps}>
                    <icons.Grip />
                </Handle>
                {children}
            </Container>
        )}
    </Draggable>
);


export default DraggableItem;