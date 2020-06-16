import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

const StateButton = ({text, currentState, state, setState}) => <Button onClick={() => setState(state)}
                                                         variant={currentState === state ? "primary" : "secondary"}>{text}</Button>;

const MoreaItemControls = ({view, setState, access, setAccess, isLoading}) => {
    return (
	<div>
          <div>
	    <ButtonGroup aria-label="visibility">
	      <Button variant="secondary">Public</Button>
	      <Button variant="secondary">Registered</Button>
	      <Button variant="secondary">GTAs</Button>
	      <Button variant="secondary">Admin</Button>
	    </ButtonGroup>
          </div>
          <div>
	    <ButtonGroup aria-label="view">
              <StateButton text="Published" currentState={view} state="published" setState={setState} disabled={isLoading} />
              <StateButton text="Working Preview" currentState={view} state="working" setState={setState} disabled={isLoading} />
              <StateButton text="Edit" currentState={view} state="edit" setState={setState} disabled={isLoading} />
	    </ButtonGroup>
          </div>
	</div>
    );
};

export default MoreaItemControls;
