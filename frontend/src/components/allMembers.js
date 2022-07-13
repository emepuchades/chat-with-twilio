import React from 'react'
import styled from 'styled-components'
import { BiNavigation, BiMessageSquareDetail, BiGroup } from "react-icons/bi";

class AllMembers extends React.Component {
    render() {
        const { members, room  } = this.props;

        return (
            <Members className='scroll'>
                <Block>
                    <Room>
                        {room}
                    </Room>

                    <Title>
                        <BiGroup className="icon-default" />
                        <h3>Participantes</h3>
                    </Title>
                    {members &&
                        members.map((members) =>
                            <p key={members.state.identity}>{members.state.identity}</p>
                        )}
                </Block>
            </Members>
        )
    }
}

const Members = styled.div`
    display: inline-block;
    position: relative;
    background-color: #FFFFFF;
    width: 20%;
    height: 100%;
    overflow: auto;
    &.scroll::-webkit-scrollbar-track {
        padding: 2px 0;
        background-color: #FAFBFD;
      }
    
    &.scroll::-webkit-scrollbar {
        width: 4px;
    }
      
    &.scroll::-webkit-scrollbar-thumb {
        border-radius: 20px;
        box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
        background-color: #C1C3C6;
    }
`
const Block = styled.div`
    width: 85%;
    margin-left: 50px;
`
const Room = styled.div`
    width: 85%;
    margin-left: 50px;
`

const Title = styled.div`
    align-items: center;
    display: flex;
    width: 70%;
    border-bottom: 1px black solid;
`
export default AllMembers