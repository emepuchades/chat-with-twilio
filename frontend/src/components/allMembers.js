import React from 'react'
import styled from 'styled-components'
import { BiGroup } from "react-icons/bi";
import { FcSms } from "react-icons/fc";
import User from "./User"

class AllMembers extends React.Component {
    render() {
        const { members, room } = this.props;
        return (
            <Members className='scroll'>
                <Block>
                    <Room>
                        <FcSms className='icon' />
                        <p>{room}</p>
                    </Room>
                    <User />
                    <Title>
                        <BiGroup className="icon-default" />
                        <Text>Participantes</Text>
                    </Title>
                    <List>
                        {members &&
                            members.map((members) =>
                                <Member key={members.state.identity}>
                                    {members.state.identity}
                                </Member>
                            )}
                    </List>
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
    margin: 30px 0px;
    display: inline-flex;
    align-content: center;
    align-items: center;
    .icon {
        margin-right: 30px;
    }
`
const Text = styled.div`

`
const List = styled.div`

`
const Member = styled.div`
    margin: 20px 0px;
    border-bottom: 1px solid #F2F6FC;
    padding-bottom: 16px;
    width: 80%;
`
const Title = styled.div`
    align-items: center;
    display: flex;
    width: 80%;
    border-bottom: 1px black solid;
    margin: 40px 0px;
`
export default AllMembers