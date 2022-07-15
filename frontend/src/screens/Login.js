import React from "react";
import styled from 'styled-components'
import imageLogo from '../assets/background-logo.jpg';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            room: "",
        };
    }

    login = () => {
        const { email, room } = this.state;
        if (email && room) {
            this.props.history.push("chat", { room, email });
            window.location.reload(true);
        }
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, room } = this.state;
        return (
            <Container>
                <Logger>
                    <CardLeft elevation={10}>
                        Accede al chat
                        <Block>
                            <Text>Email/ usuario:</Text>
                            <Input
                                name="email"
                                required
                                label="Email address"
                                placeholder="Enter email address"
                                variant="outlined"
                                type="email"
                                value={email}
                                onChange={this.handleChange} />
                        </Block>
                        <Block>
                            <Text>Seleccione la sala:</Text>
                            <Input
                                name="room"
                                required
                                label="Room"
                                placeholder="Enter room name"
                                variant="outlined"
                                value={room}
                                onChange={this.handleChange} />
                        </Block>
                        <Block>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={this.login}>
                                Login
                            </Button>
                        </Block>
                    </CardLeft>
                    <CardRight>
                    </CardRight>
                </Logger>
            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
    text-align: center;
    align-items: center;
    align-content: center;
    position: relative;
    height: 98vh;  
`

const CardLeft = styled.div`
    position: relative;
    padding: 40px;
    width: 400px;
    height: 400px;
    float: left;
    background-color: white;
`

const CardRight = styled.div`
    position: relative;
    display: flex;
    align-content: center;
    padding: 40px;
    width: 400px;
    height: 400px;
    background-image: url(${imageLogo});
    border-radius: 20px;
`
const Block = styled.div`
    padding-top: 12px;
    padding-bottom: 12px;
`
const Text = styled.div`
    display: flex;
    font-size: 16px;
    font-weight: bold;
`

const Button = styled.button`
    display: flex;
    font-size: 18px;
    cursor: pointer;
    border: 0;
    padding: 10px 40px;
    background: #7297BF;
    box-shadow: 0 10px 40px rgb(0 0 0 / 16%);
    color: white;
`
const Logger = styled.div`
    margin: auto;
    box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
    border-radius: 20px;
`
const Input = styled.input`
    display: flex;
    flex-direction: column;
    padding: 10px 10px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 20px;
    width: 300px;
    font-size: 16px;
`
export default Login;
