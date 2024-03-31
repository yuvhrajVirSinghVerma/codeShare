import React from "react";
import GoogleButton from "react-google-button";
// import { GoogleLogin } from "react-google-login";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import loginApi from "../apis/login";
import Cookies from "js-cookie";
import useAuth from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";

const Login = () => {
  const { user, logIn } = useAuth();
  console.log("user", user);
  const navigate = useNavigate();
  const onSignIn = async (response) => {
    console.log("login res ", response);
    const id_token =  response.credential;
    console.log("login id_token ", id_token);
    Cookies.set("authtoken", id_token, { expires: 7 });
    const result = await loginApi(id_token);
    console.log("res after api", result);
    if (result.data.status === "success") {
      logIn(id_token);
      console.log("navigate");
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        marginTop: "15%",
      }}
    >
      {/* //this id should be same as in backend id  */}
      <GoogleOAuthProvider 
      clientId={"659897329083-2p6sep3i6ie0quu35olvfrt7lfhccbu2.apps.googleusercontent.com"}>
        <GoogleLogin
          render={(props) => (
            <GoogleButton type="dark" onClick={props.onClick} />
          )}
          onSuccess={onSignIn}
          onFailure={onSignIn}
          cookiePolicy={"single_host_origin"}
          buttonText="Login"
        />
      </GoogleOAuthProvider>
      ;
      {/* <Button onClick={()=>{
        onSignIn()
      }}>Login</Button> */}
    </div>
  );
};

export default Login;
