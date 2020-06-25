import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import StateButton from "../StateButton";

const ViewControl = ({view, setView}) => (
    <ButtonGroup aria-label="view">
        <StateButton text="Student" currentState={view} state="student" setState={setView} />
        <StateButton text="Admin" currentState={view} state="admin" setState={setView} />
    </ButtonGroup>
);

export default ViewControl;