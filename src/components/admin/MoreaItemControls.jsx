import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import StateButton from "../StateButton";

const MoreaItemControls = ({ view, setState, access, setAccess, isStale }) => {
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
                    <StateButton text="Published" currentState={view} state="published" setState={setState} disabled={isStale} />
                    <StateButton text="Working Preview" currentState={view} state="working" setState={setState} disabled={isStale} />
                    <StateButton text="Edit" currentState={view} state="edit" setState={setState} disabled={isStale} />
                </ButtonGroup>
            </div>
        </div>
    );
};

export default MoreaItemControls;
