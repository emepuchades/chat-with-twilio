import React from "react";
import styled from 'styled-components';
import Messages from "../components/Messages";
import AllMembers from "../components/allMembers"
import { getToken } from '../utils/getToken';
import { BiHappy } from "react-icons/bi";
import { RiSendPlane2Fill, RiUserAddLine } from "react-icons/ri";

const Chat = require("twilio-chat");

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
            messages: [],
            members: [],
            loading: false,
            channel: null,
            typing: false,
            client: {},
            userInfo: [],
        };

        this.scrollDiv = React.createRef();
    }

    componentDidMount = async () => {
        const { location } = this.props;
        const { state } = location || {};
        const { email, room } = state || {};
        let token = "";

        if (!email || !room) {
            this.props.history.replace("/");
            window.location.reload(true);
        }

        this.setState({ loading: true });

        try {
            token = await getToken(email);
        } catch {
            throw new Error("No se pudo obtener el token, vuelva a cargar esta página");
        }
        const client = await Chat.Client.create(token);
        this.setState({ client: client });

        client.on("tokenAboutToExpire", async () => {
            const token = await getToken(email);
            client.updateToken(token);
        });

        client.on("tokenExpired", async () => {
            const token = await getToken(email);
            client.updateToken(token);
        });
        client.on("channelJoined", async (channel) => {
            const messages = await channel.getMessages();
            this.setState({ messages: messages.items || [] });

            const membersChannel = await channel.getMembers()
            this.setState({ members: membersChannel });

            const user = await client.getUser(email)

            membersChannel.map((member) => (
                member.state.identity === user.state.identity ?
                this.setState({ userInfo: member }) : null
            ))
            this.scrollToBottom();
    });

        try {
    const channel = await client.getChannelByUniqueName(room);
    this.joinChannel(channel);
    console.log('chat creado2', await client.getUser(email))
} catch (err) {
    try {
        const channel = await client.createChannel({
            uniqueName: room,
            friendlyName: room,
        });

        this.joinChannel(channel);
        console.log('chat cuando no esta creado3ghb')
    } catch {
        alert("Tienes que ingresar con email y sala")
        throw new Error("No se puede cargar el canal");
    }
}
    }

scrollToBottom = () => {
    const scrollHeight = this.scrollDiv.current.scrollHeight;
    const height = this.scrollDiv.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
};

joinChannel = async (channel) => {
    if (channel.channelState.status !== "joined") {
        await channel.join();
    }
    this.setState({
        channel: channel,
        loading: false
    });
    channel.on("messageAdded", this.handleMessageAdded);
    this.scrollToBottom();
};

sendMessage = () => {
    const { text, channel } = this.state;
    if (text) {
        this.setState({ loading: true });
        channel.sendMessage(String(text).trim());
        this.setState({ text: "", loading: false });
    }
};

handleMessageAdded = (message) => {
    const { messages } = this.state;
    this.setState({
        messages: [...messages, message],
    },
        this.scrollToBottom
    );
};

handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        this.sendMessage()
    } else {
        this.setState({ typing: true })
        setTimeout(() => this.setState({ typing: false }), 5000);
    }
}

inviteUser = (event) => {
    console.log('inviteUser')
}
showIcons = (event) => {
    console.log('showIcons')
}

render() {
    const { loading, text, messages, channel, members, typing, userInfo } = this.state;
    const { location } = this.props;
    const { state } = location || {};
    const { email, room } = state || {};

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
                    <ChatBlock className='scroll' ref={this.scrollDiv}>
                        {messages &&
                            messages.map((message) =>
                                <Messages
                                    key={message.index}
                                    message={message}
                                    email={email} />
                            )}
                    </ChatBlock>
                    <BlockAddMessage>
                        <Button
                            onClick={this.logout}
                            disabled={!channel}
                            className="invite-button"
                        >
                            <RiUserAddLine className="icon-invite" />
                        </Button>

                        <Input
                            required
                            onKeyPress={this.handleKeyPress}
                            placeholder="Enter message"
                            minRows={2}
                            value={text}
                            disabled={!channel}
                            onChange={(event) =>
                                this.setState({ text: event.target.value })
                            } />
                        <Button
                            onClick={this.showIcons}
                            disabled={!channel}
                            className="invite-button"
                        >
                            <BiHappy className="icon-button" />
                        </Button>
                        <Button
                            onClick={this.sendMessage}
                            disabled={!channel}>
                            <Text>ENVIAR</Text>
                            <RiSendPlane2Fill className="icon-send" />
                        </Button>
                    </BlockAddMessage>
                </Block>
            </Container >
    )
}

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