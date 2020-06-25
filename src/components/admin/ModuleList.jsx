import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Module from "./Module";

const Container = styled.div`
    margin: 8px;
    padding-top: 8px;
`;

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightgrey" : "white",
    padding: "8px",
    width: "55rem"
});

export default ({ modules }) => (
    <Container>
        <h1>Modules</h1>
        <Droppable droppableId="module-list">
            {(provided, snapshot) => (
                <Container
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={getListStyle(snapshot.isDraggingOver)}
                >
                    {modules.map((module, index) => <Module key={module.morea_id} index={index} {...module} />)}
                    {provided.placeholder}
                </Container>
            )}
        </Droppable>
    </Container>
);