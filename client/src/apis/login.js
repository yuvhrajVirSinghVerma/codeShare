import axios from "axios";
// const host = "http://localhost:3000";
const host="https://codeshare-aio7.onrender.com"

const Login = (token) => {
  return axios.post(`${host}/login`, token);
};

export default Login;
