import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

const MoreaItemControls = ({state, setState, access, setAccess}) => {
    return (
	    <div>
	      <ButtonGroup aria-label="visibility">
		<Button variant="secondary">Public</Button>
		<Button variant="secondary">Registered</Button>
		<Button variant="secondary">GTAs</Button>
		<Button variant="secondary">Admin</Button>
	      </ButtonGroup>
	      <ButtonGroup aria-label="view">
		<Button variant="secondary">Published</Button>
		<Button variant="secondary">Working Preview</Button>
		<Button variant="secondary">Edit</Button>
	      </ButtonGroup>
	    </div>
    );
};

export default MoreaItemControls;
