import React, { useState, useContext } from 'react'
import styled from "styled-components";

function RoomSelect() {
    let [roomSelect, setRoomSelect] = useState('')

    return (
        <>
            <Block>Introducce la clave de la sala a la que quieras acceder</Block>
            <input type="search"
                id="search"
                onChange={(e) => setRoomSelect(e.target.value)}
                value={roomSelect}
                placeholder='Indica tu nombre anonimo'></input>
                 <button
                    onClick={() => console.log(!'roomSelect', roomSelect)}
                >
                    Acceder
                </button>

        </>
    )
}
const Block = styled.div`
`;

export default RoomSelect