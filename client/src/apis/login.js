import axios from "axios";
const host = "https://codeshare-4.onrender.com";

const Login = (token) => {
  return axios.post(`${host}/login`, token);
};

export default Login;
