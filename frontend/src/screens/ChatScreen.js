import React from "react";
import styled from 'styled-components'
import Messages from "../components/Messages";
import { getToken, logout } from '../utils/getToken';
import { BiNavigation } from "react-icons/bi";
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
            this.scrollToBottom();
        });

        try {
            const channel = await client.getChannelByUniqueName(room);
            this.joinChannel(channel);
        } catch (err) {
            try {
                const channel = await client.createChannel({
                    uniqueName: room,
                    friendlyName: room,
                });

                this.joinChannel(channel);
            } catch {
                alert("tienes que ingresar con email y sala")
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
            console.log('typiiing')
        }
    }

    render() {
        const { loading, text, messages, channel, members } = this.state;
        const { location } = this.props;
        const { state } = location || {};
        const { email, room } = state || {};

        return (
            loading ?
                <p>Loading</p>
                :
                <Container>
                    <Members>
                        <Title> Participantes
                            {members &&
                                members.map((members) =>
                                    <p key={members.state.identity}>{members.state.identity}</p>
                                )}
                        </Title>
                    </Members>
                    <Block>
                        <Room>
                            <Title>{room}</Title>
                        </Room>
                        <ChatBlock ref={this.scrollDiv}>
                            {messages &&
                                messages.map((message) =>
                                    <Messages
                                        key={message.index}
                                        message={message}
                                        email={email} />
                                )}
                        </ChatBlock>
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
                            onClick={this.sendMessage}
                            disabled={!channel}>
                            <BiNavigation className="icon-send" />
                        </Button>
                    </Block>
                </Container>
        )
    }

}

const Container = styled.div`
    display: flex;
    align-items: flex-start;
    height: 98vh;
`
const Members = styled.div`
    display: inline-block;
    position: relative;
    background-color: #FAFBFD;
    width: 20%;
    height: 100%;
`
const ChatBlock = styled.div`
    display: inline-block;
    position: relative;
    overflow: auto;
    width: 100%;
    height: 92%;
    background-color: #FFFFFF;
`
const Input = styled.input`
    position: relative;
    border: 1px solid #F1F4FD;
    overflow: auto;
    width: 100%;
    height: 7.3%;
    border-radius: 20px;
`
const Button = styled.button`
    position: absolute;
    bottom: 40px;
    right: 40px;
    .icon-send{
        width: 23px;
        height: 37px;
    }
    width: 38px;
    height: 40px;
    border-radius: 50%;
    background: #7B67F7;
`
const Block = styled.div`
    height: 100%;
    width: 79.6%;
`
const Title = styled.div`
    margin: 25px;
`
const Room = styled.div`
    position: fixed;
    top: 0px;
    z-index: 2;
    background-color: white;
    width: 92%;
    height: 70px;
    border-bottom: 1px solid #F1F4FD;
`
export default ChatScreen;