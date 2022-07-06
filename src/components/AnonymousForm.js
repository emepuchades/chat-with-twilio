import React, { useState, useContext } from 'react'
import styled from "styled-components";
import { AppContext } from "../App";
import RoomSelect from './RoomSelect';

function AnonymousForm() {
    const { user, setUser } = useContext(AppContext);

    let [anonymousName, setAnonymousName] = useState(false)
    let [showAnonymousInput, setShowAnonymousInput] = useState(false)

    function anonymousSubmit() {
        setUser({
            name: anonymousName,
            userName: anonymousName,
            avatar: '',
            email: 'anonymousName@gmail.com',
            token: `anonymous_${anonymousName}`,
        })
        console.log('anonymousName', anonymousName)
        console.log('user', user)

    }

    return (
        <Block>
            <h1>AnonymousForm</h1>
            {Object.keys(user).length === 0 ?
                <RoomSelect />
                :
                showAnonymousInput ?
                    <>
                        <input type="search"
                            id="search"
                            onChange={(e) => setAnonymousName(e.target.value)}
                            value={anonymousName}
                            placeholder='Indica tu nombre anonimo'></input>
                        <button
                            onClick={() => anonymousSubmit()}
                        >
                            Acceder
                        </button>
                    </>
                    :
                    <button
                        onClick={() => setShowAnonymousInput(!showAnonymousInput)}
                    >
                        Ver formulario anonimo
                    </button>}
        </Block>
    )
}

const Block = styled.div`
`;

export default AnonymousForm