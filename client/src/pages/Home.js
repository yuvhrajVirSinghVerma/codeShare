import React from "react";
import Button from "@material-ui/core/Button";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

import code from "./code.svg";
import Lottie from "react-lottie";
import Programming from "../animations/pr2.json";
import Coding from "../animations/coding.json";

const useStyles = makeStyles({
  button: {
    color: "#9900cc",
  },
});

function Home() {
  const styles = useStyles();
  return (
    <>
      <div
        className="row  w-100 justify-content-center mt-lg-5"
        style={{ fontFamily: "sans-serif", fontWeight: "bold" }}
      >
        

        <div className="col ms-auto h-50 mr-auto">
          <Lottie
            options={{
              animationData: Programming,
              loop: true,
              autoplay: true,
            }}
            height={500}
            width={500}
          />
        </div>
        <div className="col mx-auto mt-5 text-center d-flex flex-column">
          <h1
            style={{
              fontFamily: "sans-serif",
              fontWeight: "bold",
            }}
          >
            Welcome To CodeShare
          </h1>
          <br />
          <h2
            style={{
              fontFamily: "sans-serif",
              fontWeight: "bold",
            }}
          >
            Create your code room now!!
          </h2>

          <br />
          <NavLink to="/create" style={{ textDecoration: "none" }}>
            <Button
              className="text-center mainbtn"
              variant="contained"
              style={{
                backgroundColor: "#0d6efd",
                color: "white",
              }}
            >
              Create New
            </Button>
          </NavLink>
          <br />
          <NavLink to="/join" style={{ textDecoration: "none" }}>
            <Button
              className="text-center mainbtn font-weight-bold"
              variant="contained"
              style={{
                backgroundColor: "#0d6efd",
                color: "white",
              }}
            >
              Join existing
            </Button>
          </NavLink>
        </div>
      </div>
      <div
        className="d-flex justify-content-center mt-5"
        style={{
          fontWeight: "bold",
          fontFamily: "sans-serif",
        }}
      >
        <h2
          style={{
            fontFamily: "sans-serif",
            fontWeight: "bold",
            marginTop: 40,
          }}
        >
          What is CodeShare rooms ??
        </h2>
      </div>
      <div className="row">
        <div style={{ width: "50%" }}>
          <Lottie
            options={{
              animationData: Coding,
              loop: true,
              autoplay: true,
            }}
          />
        </div>
        <div
          style={{
            width: "40%",
            marginTop: "5%",
            fontSize: 20,
            fontFamily: "sans-serif",
            textAlign: "justify",
          }}
        >
          CodeShare rooms is a code collaboration tool that helps you to
          create code rooms and invite your friends/guests for discussing and
          solving intesting problems. Supports live code sharing, Audio Chat,
          choosing 4 different langauges, Saving the code for future use,
          Running the code and providing custom Input/Output. Head over to Login
          and enjoys you coding now!!!
        </div>
      </div>
    </>
  );
}

export default Home;
