import React, { createContext, useState } from 'react'
import RoutesApp from './RoutesApp';
import './App.css';
import { getToken } from './utils/getToken';
import { useHistory } from "react-router-dom"
const Chat = require("twilio-chat");

export const AppContext = createContext()

function App() {
  const history = useHistory()
  const [clientInfo, setClientInfo] = useState({})
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [channel, setChannel] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [email, setEmail] = useState("")
  const [room, setRoom] = useState("")

  const scrollDiv = React.createRef();

  const getClient = async () => {
    const email = 'ewqeqw';
    const room = 'sala 1';

    if (!email || !room) {
        //history.replace("/");
        //window.location.reload(true);
        console.log('no hay email')
    }
    let token = "";
    setLoading(true);

    console.log('email app', email)

    try {
        token = await getToken(email);

    } catch {
        throw new Error("No se pudo obtener el token, vuelva a cargar esta página");
    }
    const client = await Chat.Client.create(token);
    console.log(client);
    setClientInfo(client);

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
        console.log('messages app', messages)
        setMessages(messages.items || []);

        const membersChannel = await channel.getMembers()
        setMembers(membersChannel);

        const user = await client.getUser(email)

        membersChannel.map((member) => (
            member.state.identity === user.state.identity ?
            setUserInfo(member) : null
        ))
        this.scrollToBottom();
    });

    try {
        const channel = await client.getChannelByUniqueName(room);
        joinChannel(channel);
        console.log('chat creado2', await client.getUser(email))
    } catch (err) {
        try {
            const channel = await client.createChannel({
                uniqueName: room,
                friendlyName: room,
            });

            joinChannel(channel);
            console.log('chat cuando no esta creado3ghb')
        } catch {
            alert("Tienes que ingresar con email y sala")
            throw new Error("No se puede cargar el canal");
        }
    }
}

function scrollToBottom() {
    const scrollHeight = scrollDiv.current.scrollHeight;
    const height = scrollDiv.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
};

async function joinChannel(channel) {
    if (channel.channelState.status !== "joined") {
        await channel.join();
    }
    setChannel(channel)
    setLoading(false)

    channel.on("messageAdded", handleMessageAdded());
    scrollToBottom();
};

function handleMessageAdded(message) {
    setMessages( [...messages, message])
    scrollToBottom();
};

  return (
    <AppContext.Provider
      value={{ 
        clientInfo, setClientInfo, messages, setMessages,
        members, setMembers, loading, setLoading,
        channel, setChannel, 
        userInfo, setUserInfo, email, setEmail,
        room, setRoom, getClient, history
         }}>
      <RoutesApp />
    </AppContext.Provider>

  );
}

export default App;