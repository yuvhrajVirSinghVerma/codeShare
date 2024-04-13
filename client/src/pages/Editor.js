import React, { useEffect } from "react";
import AceEditor from "react-ace";
// Themes
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-dracula";

// Languages
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-min-noconflict/mode-javascript";

// Language Tools
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";

import Button from "@material-ui/core/Button";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import MicIcon from "@material-ui/icons/Mic";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MicOffIcon from "@material-ui/icons/MicOff";
import { useState } from "react";
import "../index.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { rtc, startBasicCall } from "./JoinAudio";
import { socket } from "./socketConnection";
import SaveIcon from "@material-ui/icons/Save";
import useAuth from "../auth/useAuth";
import roomApi from "../apis/rooms";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageSelector from "../components/LanguageSelector";
import FontSizeSelector from "../components/FontSizeSelector";
import ThemeSelector from "../components/ThemeSelector";
import io from "socket.io-client";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import Board from "../components/Board";

toast.configure();

function Editor({ roomid }) {
  // usestate Hooks

  const { user } = useAuth();

  // useEffect(() => {
  //   socket.emit("join", {roomid,user});
  //   startBasicCall(roomid);
  // }, []);
  const [language, changeLanguage] = useState("c_cpp");
  const [fontsize, changeSize] = useState(12);
  const [theme, changeTheme] = useState("monokai");
  const [mic, changeMic] = useState(true);
  const [code, setCode] = useState("");
  const [stdin, changeInput] = useState("");
  const [stdout, changeOutput] = useState("");
  const [socketins, setsocketins] = useState("");
  const [typing, setTyping] = useState("");
  const [board, setBoard] = useState(false);
  const handleSave = async () => {
    const result = await roomApi.saveCode(roomid, code);
    if (result.data.status === "ok") {
      toast.success(`Saved!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(`Error while saving the code`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };
  // socket.on("userDisconnect",(e)=>{
  //   console.log("userDisconnect ",e)
  //   toast.error(`${e.given_name} is disconnected from the room`, {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: false,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // })
  // socket.on("newUser",(e)=>{
  //   console.log("user joined ",e)
  //   toast.success(`${e.given_name} joined the room`, {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: false,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // })

  useEffect(() => {
    // Subscribe to socket events when the component mounts
    let socketc = io.connect('http://localhost:3000/');
    setsocketins(socketc);

    socketc.emit("join", { roomid, user });
    startBasicCall(roomid);

    const handleUserDisconnect = (e) => {
      console.log("userDisconnect ", e);
      toast.error(`${e.given_name} is disconnected from the room`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    };

    const handleNewUser = (e) => {
      console.log("user joined ", e);
      toast.success(`${e.given_name} joined the room`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    };

    // Add event listeners for socket events
    socketc.on("userDisconnect", handleUserDisconnect);
    socketc.on("newUser", handleNewUser);
    // Socket Client
    socketc.on("codeChange", (res) => {
      console.log("code changed useffect ",res)
      setCode(res.data);
      setTyping(res.user);
    });

    socketc.on("changeLanguage", (data) => {
      changeLanguage(data);
    });

    socketc.on("changeInput", (data) => {
      changeInput(data);
    });
    socketc.on("changeOutput", (data) => {
      changeOutput(data);
    });

    // Add event listener for beforeunload to disconnect socket when the user leaves the page

    // Clear the event listeners when the component unmounts
    return () => {
      socketc.off("userDisconnect", handleUserDisconnect);
      socketc.off("newUser", handleNewUser);
      socketc.close();
    };
  }, []);
  // code runners
  const runner = async () => {
    var runnerid = "";
    await fetch(
      "https://api.paiza.io/runners/create?" +
        new URLSearchParams({
          source_code: code,
          language: language === "c_cpp" ? "cpp" : language,
          input: stdin,
          longpoll: "true",
          api_key: "guest",
        }),
      { method: "POST" }
    )
      .then((response) => response.json())
      .then((json) => {
        runnerid = json.id;
      });
    var flag = true;
    while (flag) {
      await fetch(
        "https://api.paiza.io/runners/get_status?" +
          new URLSearchParams({
            id: runnerid,
            api_key: "guest",
          }),
        { method: "GET" }
      )
        .then((response) => response.json())
        .then((json) => {
          flag = json.status !== "completed";
        });
    }

    await fetch(
      "https://api.paiza.io/runners/get_details?" +
        new URLSearchParams({
          id: runnerid,
          api_key: "guest",
        }),
      { method: "GET" }
    )
      .then((response) => response.json())
      .then((json) => {
        var output = "";
        if (json.stdout !== null && json.stdout !== "") {
          output += json.stdout;
        }
        if (json.stderr !== null && json.stderr !== "") {
          output += json.stderr;
        }
        if (json.build_stderr !== null && json.build_stderr !== "") {
          output += json.build_stderr;
        }
        toast.success(`Compilation Successful!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        socketins.emit("changeOutput", { data: output, roomid: roomid });
        changeOutput(output);
      });
  };
  let id;
  useEffect(() => {
    if (typing) {
      if (id) clearTimeout(id);

      id = setTimeout(() => {
        setTyping(null);
      }, 2500);
    }
  }, [typing]);
  useEffect(() => {
    roomApi.getRoomValue(roomid, user.email).then((res) => {
      setCode(res.data.data);
    });
  }, []);

  return (
    <div>
      <Button
            variant="outlined"
            color={board ? "primary" : "secondary"}
            onClick={() => {
              setBoard((prev)=>!prev);
            }}
            size="small"
            style={{ marginLeft: 10, marginTop: 5 }}
          >
            <BorderColorIcon />
          </Button>
          {board && (<div style={{zIndex:1,marginBottom:20,position:'relative'}}>
            <Board roomid={roomid} socketc={socketins} />
          </div>)}
      {typing != "" &&typing && <div>{typing} typing...</div>}
      <div className="row mt-1 w-100">
        <div className="col resizable">
          <AceEditor
            className="texteditor m-3"
            mode={language}
            width="auto"
            height="80vh"
            value={code}
            fontSize={fontsize}
            theme={theme}
            enableLiveAutocompletion="true"
            name="sourcecode"
            editorProps={{ $blockScrolling: true, $onScrollLeftChange: true }}
            onChange={(e) => {
              setCode(e);
              socketins.emit("codeChange", { data: e, roomid: roomid, user });
            }}
          />
        </div>
        <div className="col-2 mt-3 options">
          <div className="row">
            <div className="mr-5">
              <LanguageSelector
                language={language}
                handleChange={(data) => {
                  changeLanguage(data);

                  socketins.emit("changeLanguage", {
                    data: data,
                    roomid: roomid,
                  });
                }}
              />
              <br />
              <br />
              <br />
              <FontSizeSelector handleChange={(val) => changeSize(val)} />
              <br />
              <br />
              <br />
              <h5>Theme</h5>
              <ThemeSelector handleChange={(val) => changeTheme(val)} />
              <CopyToClipboard text={window.location.href.toString()}>
                <Tooltip title="Copy Room Link" aria-label="share">
                  <Button
                    className="mx-auto d-flex"
                    id="icons"
                    variant="contained"
                    color="primary"
                  >
                    {" "}
                    <FileCopyOutlinedIcon />
                  </Button>
                </Tooltip>
              </CopyToClipboard>
              <Tooltip title="mic" aria-label="mic">
                {mic ? (
                  <Button
                    className="mx-auto d-flex"
                    id="icons"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      rtc.localAudioTrack.setEnabled(false);

                      changeMic(!mic);
                    }}
                  >
                    {" "}
                    <MicIcon />
                  </Button>
                ) : (
                  <Button
                    className="mx-auto d-flex"
                    id="icons"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      rtc.localAudioTrack.setEnabled(true);
                      changeMic(!mic);
                    }}
                  >
                    {" "}
                    <MicOffIcon></MicOffIcon>
                  </Button>
                )}
              </Tooltip>

              <Tooltip title="Run Code" aria-label="run">
                <Button
                  className="mx-auto d-flex"
                  id="icons"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    runner();
                  }}
                  endIcon={<PlayArrowIcon />}
                >
                  RUN
                </Button>
              </Tooltip>
              <Tooltip title="Save Code" aria-label="save">
                <Button
                  className="mx-auto d-flex"
                  id="icons"
                  variant="contained"
                  color="primary"
                  endIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  SAVE
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3 w-100">
        <div className="col">
          <h3 className="text-center">Input</h3>
          <AceEditor
            className="texteditor m-3"
            width="auto"
            height="40vh"
            fontSize={fontsize}
            theme={theme}
            value={stdin}
            name="stdin"
            editorProps={{ $blockScrolling: true, $onScrollLeftChange: true }}
            onChange={(e) => {
              changeInput(e);
              socketins.emit("changeInput", { data: e, roomid: roomid });
            }}
          />
        </div>
        <div className="col">
          <h3 className="text-center">Output</h3>
          <AceEditor
            className="texteditor m-3"
            width="auto"
            height="40vh"
            value={stdout}
            fontSize={fontsize}
            theme={theme}
            name="stdout"
            editorProps={{ $blockScrolling: true, $onScrollLeftChange: true }}
            onChange={(e) => {
              changeOutput(e);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Editor;
