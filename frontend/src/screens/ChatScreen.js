import React from "react";
import styled from 'styled-components'
import Messages from "../components/Messages";
import AllMembers from "../components/allMembers"
import { getToken } from '../utils/getToken';
import { BiNavigation, BiGroup } from "react-icons/bi";
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
                <div className="content-loader">
                    <span className="loader"></span>
                    <p>Loading</p>
                </div>
                :
                <Container>
                    <AllMembers members={members} room={room} />
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
                                onClick={this.sendMessage}
                                disabled={!channel}>
                                <BiGroup className="icon-send" />
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
                                onClick={this.sendMessage}
                                disabled={!channel}>
                                <BiNavigation className="icon-send" />
                            </Button>
                        </BlockAddMessage>
                    </Block>
                </Container>
        )
    }

}

const Container = styled.div`
    display: flex;
    align-items: flex-start;
    height: 97vh;
    .icon-default {
        margin-left: 30px;
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
    height: 40px;
    margin: 11px;
    width: 69px;

`
const Block = styled.div`
    background-color: #F2F6FC;
    height: 100%;
    width: 80%;
    border-radius: 15px;
`
const Title = styled.div`
    margin-left: 20px;
`

const BlockAddMessage = styled.div`
    height: 70px;
    width: 92%;
    background-color: #fbfcff;;
    display: flex;
    margin: 0 auto;
    align-content: center;
    padding: 0px 20px;
}
`

export default ChatScreen;