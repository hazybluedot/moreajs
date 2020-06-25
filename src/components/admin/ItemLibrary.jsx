import React, { useState } from "react";
/*
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Row";
*/
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

import { useEffect } from "react";
import { itemKey } from "../../lib/efapi";

const Container = styled.div`
    overflow-y: auto;
    height: 300px;
`;

const Item = ({ item: {title, summary} }) => (
    <ListGroup.Item as="li">
        {item.title}
        {item.summary ? item.summary : ""}
    </ListGroup.Item>
);

/*TODO: droppable type={itemType.toUpperCase()} */
const ItemLibrary = ({ items, types, filter }) => {
    const [filterType, setFilterType] = useState("module");
    const [filterKeywords, setFilterKeywords] = useState([]);
    const [selected, setSelected] = useState(null);

    return (
        <>
        <Form>
            <Form.Group controlId="fitlerByType">
                <Form.Label>Type</Form.Label>
                <Form.Control as="select" onChange={(e) => console.log('dropdown change', e)}>
                    {types.map(moreaType => <option key={moreaType.type}>{moreaType.title}</option>)}
                </Form.Control>
            </Form.Group>
        </Form>
        <ListGroup>
            {items.filter(item => item.morea_type === filterType).map((item) => (
                <ListGroup.Item key={itemKey(item)} 
                    active={selected===itemKey(item)}
                    onClick={()=>setSelected(itemKey(item))}
                    item={item} />
                ))}
        </ListGroup>
        </>
    );
};

export default ItemLibrary;