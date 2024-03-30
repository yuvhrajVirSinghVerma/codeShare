import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { Button } from "@material-ui/core";
import io from "socket.io-client";

const Board = ({ roomid,socketc }) => {
  const [socketins, setsocketins] = useState("");
  let canvas;
  let p;
  let [tp,setp]=useState("");
  useEffect(() => {
    // let socketc = io.connect();
    setsocketins(socketc);

    socketc.on("draw", (data) => {
      let { px, py, x, y } = data;

      p.noStroke();
      p.stroke(0, 0, 0);
      p.strokeWeight(3);
      p.fill(51);
      p.line(px, py, x, y);
    });
    
  }, []);

  useEffect(()=>{
    // console.log("useeff ",tp)
  },[tp])
  const clearCanvas = () => {
    console.log("tppp ",tp)
    tp.clear();
    tp.background(220);
  };

  

  const setup = (p5, canvasParentRef) => {
    setp(p5)
    p = p5;
    canvas = p5
      .createCanvas(window.innerWidth * 0.9, window.innerHeight * 0.8)
      .parent(canvasParentRef);
    canvas.position(60, 90);
    p5.background(220);
  };

  const draw = (p5) => {};

  const mouseDragged = (p5) => {
    p5.noStroke();
    p5.stroke(0, 0, 0);
    p5.strokeWeight(3);
    p5.fill(51);

    let px = p5.pmouseX;
    let py = p5.pmouseY;

    let x = p5.mouseX;
    let y = p5.mouseY;

    socketins.emit("draw", { px, py, x, y, roomid });
    p5.line(px, py, x, y);
  };

  return (
    <div style={{zIndex:1}}>
      <Sketch style={{zIndex:1}}
      setup={setup} draw={draw} mouseDragged={mouseDragged} />
      <Button
      data-testid="clearCanvas"
        style={{
          position: "absolute",
          top: 80,
          right: 20,
        }}
        color="secondary"
        variant="contained"
        onClick={() => {
          clearCanvas()
        }
        }
      >
        <DeleteOutlineOutlinedIcon />
      </Button>
    </div>
  );
};

export default Board;
