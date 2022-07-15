import React from 'react'
import styled from 'styled-components';


function User() {
  return (
    <Block>
        <Name> Rubius</Name>
        <Rol> Admin</Rol>
    </Block>
  )
}

export default User

const Block = styled.div`
    background-color: #F5F9FC;
    width: 70%;
    padding: 30px;
    border: 1px solid #F1F1F1;
    border-radius: 20px;
`
const Name = styled.div`
    margin-left: 20px;
`
const Rol = styled.div`
    margin-left: 20px;
`