import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components';
import Messages from "../components/Messages";
import AllMembers from "../components/allMembers"
import { BiHappy } from "react-icons/bi";
import { RiSendPlane2Fill, RiUserAddLine } from "react-icons/ri";
import { AppContext } from "../App";

function ChatScreen() {
    const {  client, setClient, messages, setMessages,
    members, setMembers, loading, setLoading,
    channel, setChannel, typing, setTyping,
    userInfo, setUserInfo, room, email, getClient} = useContext(AppContext);
    const [text, setText] = useState("");
    const scrollDiv = React.createRef();

    useEffect(() => {
          getClient()
          console.log('emai chat screen', email)
    }, []);

    function sendMessage() {
        if (text) {
            setLoading(true);
            channel.sendMessage(String(text).trim());
            setText("");
            setLoading(false)
        }
    };
    
    function handleKeyPress(event){
        if (event.key === 'Enter') {
            sendMessage()
        } else {
            setTyping(true)
            setTimeout(() => setTyping({ typing: false }), 5000);
        }
    }
    
    function inviteUser(event) {
        console.log('inviteUser')
    }
    function showIcons(event){
        console.log('showIcons')
    }
    
    async function logout() {
        this.props.history.replace("/");
        window.location.reload(true);
    }
    
    return (
        
        loading ?
            <div className="content-loader">
                <span className="loader"></span>
                <p>Loading</p>
            </div>
            :
            <Container>
                <AllMembers
                    members={members}
                    room={room}
                    email={email}
                    typing={typing} 
                    userInfo={userInfo}/>
                <Block>
                    <ChatBlock className='scroll' ref={scrollDiv}>

                    </ChatBlock>
                    <BlockAddMessage>
                        <Button
                            onClick={logout}
                            disabled={!channel}
                            className="invite-button"
                        >
                            <RiUserAddLine className="icon-invite" />
                        </Button>

                        <Input
                            required
                            onKeyPress={handleKeyPress}
                            placeholder="Enter message"
                            minRows={2}
                            value={text}
                            disabled={!channel}
                            onChange={(event) =>
                                setText(event.target.value)
                            } />
                        <Button
                            onClick={() => showIcons()}
                            disabled={!channel}
                            className="invite-button"
                        >
                            <BiHappy className="icon-button" />
                        </Button>
                        <Button
                            onClick={() => sendMessage()}
                            disabled={!channel}>
                            <Text>ENVIAR</Text>
                            <RiSendPlane2Fill className="icon-send" />
                        </Button>
                    </BlockAddMessage>
                </Block>
            </Container >
    )
}


const Container = styled.div`
    display: flex;
    align-items: flex-start;
    height: 97vh;
    .icon-default {
        width: 23px;
        height: 37px;
    }
`
const ChatBlock = styled.div`
    display: inline-block;
    position: relative;
    overflow: auto;
    width: 100%;
    height: 90%;
    background-color: #F2F6FC;
    border-radius: 15px;
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
    @media (max-width: 1600px) {
        height: 88%;
    }
`
const Input = styled.input`
    position: relative;
    border: 1px solid #F1F4FD;
    margin: 0 auto;
    overflow: auto;
    width: 92%;
    height: 45px;
    border-radius: 10px;
    font-size: 15px;
    align-content: center;
    margin: 9px;
`
const Button = styled.button`
    display: flex;
    align-items: center;
    border: none;
    height: 40px;
    margin: 11px;
    width: 125px;
    background-color: #044BF5;
    color: white;
    border-radius: 10px;
    &.invite-button {
        background-color: #fbfcff;
        border: none;
        width: 50px;

    }
    .icon-invite {
        width: 25px;
        height: 25px;
        fill: black;
    }
    .icon-button {
        width: 25px;
        height: 25px;
        fill: black;
    }
`
const Block = styled.div`
    background-color: #F2F6FC;
    height: 100%;
    width: 80%;
    border-radius: 15px;
`
const Text = styled.div`
    padding: 15px;
`
const BlockAddMessage = styled.div`
    height: 70px;
    width: 92%;
    background-color: #fbfcff;
    display: flex;
    margin: 0 auto;
    align-content: center;
    padding: 0px 20px;
`

export default ChatScreen;