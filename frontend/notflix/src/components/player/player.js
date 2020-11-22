import React, { Component } from "react";
import ReactPlayer from "react-player";
import "./player.css";
import { css, jsx } from "@emotion/react";

const Player = () => {
  return (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
        width="100%"
        height="100%"
      />
    </div>
  );
};
export default Player;
