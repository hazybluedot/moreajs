import React from "react";
import Button from "react-bootstrap/Button";

const StateButton = ({text, currentState, state, setState}) => (
    <Button onClick={() => setState(state)}
            variant={currentState === state ? "primary" : "secondary"}>{text}</Button>
);

export default StateButton;