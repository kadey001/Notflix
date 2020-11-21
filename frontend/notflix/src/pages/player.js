import React, { useState, useEffect } from "react";
import Footer from "../components/footer/footer";
import PlayerHeader from "../components/playerHeader/playerHeader";
import { Global, css } from "@emotion/react";
//import VideoPlayer from "../components/player/player";
import HeaderJumbotron from "../components/headerJumbotron/headerJumbotron";
import { Player } from "video-react";
import "video-react/dist/video-react.css";

export default function VideoPlayer() {
  return (
    <>
      <Global styles={GlobalCSS} />
      <PlayerHeader />
      <div style={divStyle}></div>

      <Player src="/videos/shrek.mp4" />
    </>
  );
}
const GlobalCSS = css`
  * {
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
  }
  html,
  body,
  .app {
    margin: 0;
    min-height: 100%;
    width: 100%;
  }
  body {
    background: #151515;
  }
  a {
    text-decoration: none;
    color: white;
  }
  p {
    font-size: 20px;
  }
  ul {
    margin: 0;
    list-style: none;
    padding: 0;
  }
  button {
    background-color: rgba(51, 51, 51, 0.8);
    border: 1px solid white;
    padding: 0.75em 2.3em;
    border-radius: 0.2vw;
    box-shadow: none;
    font-size: 1.1vw;
    color: white;
    margin-right: 15px;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.4px;
  }
  .Icon {
    font-size: 18.5px;
    cursor: pointer;
    color: white;
  }
`;
const divStyle = {
  color: "black",
  height: 300,
};
