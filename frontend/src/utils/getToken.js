import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getToken = async (email) => {
    const response = await axios.get(`${BASE_URL}${email}`);
    const { data } = response;
    return data.token;
}

export const logout  = async () =>  {
    this.props.history.replace("/");
    window.location.reload(true);
}